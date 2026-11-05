// Ave Caesar: translate chapter texts into Bulgarian.
//
//   node --env-file=.env translate.mjs                 every chapter without a chapter.bg.md yet
//   node --env-file=.env translate.mjs --only augustus one chapter (id from chapters.json)
//   node translate.mjs --check                         only re-check the existing translations
//
// Chapters are translated one after another, never in parallel: each one gets the glossary
// (glossary.bg.json), which grows with the new names every chapter introduces, so a name is
// written the same way everywhere. The reviewed Kingdom translation is the style example.
// Checks: the same sections in the same order, every Latin term (*...*) unchanged, no English left.
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const MODEL = 'claude-opus-5-5'
const RESPONSES_DIR = path.join(HERE, '.cache', 'translations')
const GLOSSARY = path.join(HERE, 'glossary.bg.json')
const args = process.argv.slice(2)
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null
const CHECK = args.includes('--check')
const EXTRAS = args.includes('--extras')
const GAMES = args.includes('--games')   // the quiz questions and the mini-games   // Key facts and the chronicle maps, instead of the chapter text
const usage = { input: 0, output: 0 }
const sleep = ms => new Promise(r => setTimeout(r, ms))

const chapters = JSON.parse(fs.readFileSync(path.join(HERE, 'chapters.json'), 'utf8')).chapters
const dirOf = c => path.join(ROOT, 'content/generated', c.folder)
const body = md => md.split('\n---\n')[0].trim()
const footer = md => md.includes('\n---\n') ? md.slice(md.indexOf('\n---\n') + 5).trim() : ''

// the reviewed Kingdom: its first three sections, English and Bulgarian, as the example of style
const kingdom = chapters.find(c => c.id === 'kingdom')
const sectionsOf = md => body(md).split(/\n(?=## )/)
const exampleEn = sectionsOf(fs.readFileSync(path.join(dirOf(kingdom), 'chapter.md'), 'utf8')).slice(0, 4).join('\n')
const exampleBg = sectionsOf(fs.readFileSync(path.join(dirOf(kingdom), 'chapter.bg.md'), 'utf8')).slice(0, 4).join('\n')

const SYSTEM = glossary => `You translate chapters of Ave Caesar, a history learning game, from English into Bulgarian. The readers are Bulgarian adults and older children who play for fun and want to learn real history.

Rules:
- Translate everything: the title line, every section heading and every paragraph. Keep the Markdown exactly: "# " for the title, "## Heading {#id}" for sections with the {#id} copied unchanged, a blank line between paragraphs.
- Latin stays Latin: every word or phrase in *asterisks* is copied character for character, asterisks included, in the same place in the sentence. Never translate, transliterate or drop it.
- Use the usual Bulgarian forms of names, as Bulgarian school books and encyclopaedias write them (Юлий Цезар, Ханибал, Сципион Африкански, Помпей, Картаген), not a letter-by-letter transliteration of the English.
- Use the glossary below for every name and term it lists, exactly as written. Report every NEW name of a person, people, place or institution you had to decide on, so later chapters write it the same way.
- Dates: "753 г. пр.н.е.", "69 г. сл.н.е.", "през 31 г. пр.н.е.", centuries in Roman numerals ("III в. сл.н.е."). Numbers with spaces for thousands ("10 000"). Measurements as in the English, metric first.
- Quotation marks „…“; the dash with spaces " – ".
- Natural, lively Bulgarian, not a word-for-word copy of English sentence structure. Past tense for the story; present tense for what historians think today. Keep every fact, number and name; add nothing.

Style example: the reviewed opening of the first chapter.
ENGLISH:
${exampleEn}

BULGARIAN:
${exampleBg}

Glossary (style rules, then English → Bulgarian):
${glossary.style.join('\n')}
${Object.entries({ ...glossary.terms, ...glossary.names }).map(([en, bg]) => `${en} → ${bg}`).join('\n')}`

const SCHEMA = {
  type: 'object', additionalProperties: false, required: ['markdown', 'short', 'newNames'],
  properties: {
    markdown: { type: 'string', description: 'The whole chapter in Bulgarian, same Markdown structure' },
    short: { type: 'string', description: 'A Bulgarian version of the chapter\'s short name (given below), at most 30 characters' },
    newNames: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['english', 'bulgarian'], properties: { english: { type: 'string' }, bulgarian: { type: 'string' } } } },
  },
}

// What is wrong with a translation, if anything
function problems(en, bg) {
  const out = []
  const ids = s => [...s.matchAll(/\{#([\w-]+)\}/g)].map(m => m[1])
  if (ids(en).join() !== ids(bg).join()) out.push(`sections differ: expected ${ids(en).join(', ')}; got ${ids(bg).join(', ')}`)
  const latin = s => [...s.matchAll(/\*([^*\n]+)\*/g)].map(m => m[1]).sort()
  const le = latin(en), lb = latin(bg)
  const missing = le.filter(t => { const i = lb.indexOf(t); if (i < 0) return true; lb.splice(i, 1); return false })
  if (missing.length) out.push(`Latin terms changed or missing: ${missing.slice(0, 12).map(t => `*${t}*`).join(', ')}`)
  const plain = bg.replace(/\*[^*\n]+\*/g, '').replace(/\{#[\w-]+\}/g, '')
  const english = (plain.match(/\b[A-Za-z]{4,}\b/g) ?? []).filter(w => !/^(AUC|BC|AD)$/.test(w))
  if (english.length > 6) out.push(`English words left outside the Latin: ${[...new Set(english)].slice(0, 12).join(', ')}`)
  return out
}

async function ask(client, system, text, note) {
  const request = { system, text, note }
  const key = createHash('sha256').update(JSON.stringify({ MODEL, ...request })).digest('hex').slice(0, 32)
  const file = path.join(RESPONSES_DIR, `${key}.json`)
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  for (let attempt = 1; ; attempt++) {
    try {
      const message = await client.beta.messages.stream({
        model: MODEL, max_tokens: 64000, system,
        messages: [{ role: 'user', content: [{ type: 'text', text: `${note}\n\nTranslate this chapter:\n\n${text}` }] }],
        output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
        betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
      }).finalMessage()
      usage.input += message.usage.input_tokens; usage.output += message.usage.output_tokens
      const block = message.content.find(b => b.type === 'text')
      if (message.stop_reason === 'max_tokens' || !block) throw new Error(`no complete answer (${message.stop_reason})`)
      const result = JSON.parse(block.text)
      fs.mkdirSync(RESPONSES_DIR, { recursive: true }); fs.writeFileSync(file, JSON.stringify(result))
      return result
    } catch (err) {
      const retryable = err instanceof Anthropic.APIConnectionError || err instanceof Anthropic.APIConnectionTimeoutError || /terminated|ECONNRESET|socket|timed out/i.test(err.message)
      if (!retryable || attempt === 3) throw err
      console.log(`    connection problem (${err.message}), retrying (${attempt}/2)...`)
      await sleep(5000 * attempt)
    }
  }
}

const cost = () => (usage.input * 5 + usage.output * 25) / 1e6

// ---------- Key facts and maps: every short text, translated together in one request per chapter
// the strings to translate, as [path, text] pairs (paths like "maps.0.places.2.name")
function strings(obj, pathTo = '', out = []) {
  if (typeof obj === 'string') { if (/[A-Za-z]/.test(obj)) out.push([pathTo, obj]); return out }
  if (Array.isArray(obj)) obj.forEach((x, i) => strings(x, `${pathTo}.${i}`, out))
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) {
    if (['sec', 'id', 'kind', 'side', 'dir', 'latin', 'd', 'description', 'wikipediaTitle', 'anchor', 'type', 'theme'].includes(k)) continue   // ids, Latin and drawing data stay as they are
    strings(v, `${pathTo}.${k}`, out)
  }
  return out
}
function put(obj, p, value) { const keys = p.split('.').filter(Boolean); let o = obj; for (const k of keys.slice(0, -1)) o = o[k]; o[keys.at(-1)] = value }
const EXTRA_SCHEMA = { type: 'object', additionalProperties: false, required: ['texts'], properties: { texts: { type: 'array', items: { type: 'string' } } } }
async function askExtras(client, system, list) {
  const request = { system, list }
  const key = createHash('sha256').update(JSON.stringify({ MODEL, extras: 1, ...request })).digest('hex').slice(0, 32)
  const file = path.join(RESPONSES_DIR, `${key}.json`)
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  let message
  for (let attempt = 1; ; attempt++) {   // dropped connections are retried
    try { message = await client.beta.messages.stream({
    model: MODEL, max_tokens: 32000, system,
    messages: [{ role: 'user', content: [{ type: 'text', text: `Translate each of these ${list.length} short texts (labels for the "Key facts" sheet and the maps of one chapter). Return exactly ${list.length} translations, in the same order. Place names and peoples on maps: their usual Bulgarian names. Keep *Latin* exactly as it is.\n\n${JSON.stringify(list, null, 1)}` }] }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: EXTRA_SCHEMA } },
    betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
    }).finalMessage(); break }
    catch (err) {
      const retryable = err instanceof Anthropic.APIConnectionError || err instanceof Anthropic.APIConnectionTimeoutError || /terminated|ECONNRESET|socket|timed out/i.test(err.message + (err.cause?.code ?? ''))
      if (!retryable || attempt === 4) throw err
      console.log(`    connection problem (${err.message}), retrying (${attempt}/3)...`); await sleep(8000 * attempt)
    }
  }
  usage.input += message.usage.input_tokens; usage.output += message.usage.output_tokens
  const result = JSON.parse(message.content.find(b => b.type === 'text').text)
  fs.mkdirSync(RESPONSES_DIR, { recursive: true }); fs.writeFileSync(file, JSON.stringify(result))
  return result
}
if (GAMES) {
  // questions (*_batchN.json) and games.json, as *.bg.json beside them. Identical English strings are translated once,
  // so a Who Am I answer still matches its option. The Latin side of "Latin Words" pairs stays Latin.
  const client = new Anthropic({ timeout: 10 * 60 * 1000, maxRetries: 2 })
  const SKIP = ['sectionId', 'textReference', 'sourceQuote', 'reviewFlags', 'wikipediaTitle', 'chapterName', 'batchName', 'description', 'difficulty', 'batchOrder']
  function collect(obj, p = '', out = [], latinSet = false) {
    if (typeof obj === 'string') { if (/[A-Za-z]/.test(obj)) out.push([p, obj]); return out }
    if (Array.isArray(obj)) obj.forEach((x, i) => collect(x, `${p}.${i}`, out, latinSet))
    else if (obj && typeof obj === 'object') {
      const isLatinSet = latinSet || (typeof obj.name === 'string' && /latin/i.test(obj.name) && Array.isArray(obj.pairs))
      for (const [k, v] of Object.entries(obj)) {
        if (SKIP.includes(k)) continue
        if (isLatinSet && /\.pairs\.\d+$/.test(p) && k === 'name') continue   // the Latin word itself
        collect(v, `${p}.${k}`, out, isLatinSet)
      }
    }
    return out
  }
  for (const c of chapters.filter(c => !ONLY || c.id === ONLY)) {
    const dir = dirOf(c), glossary = JSON.parse(fs.readFileSync(GLOSSARY, 'utf8'))
    const files = fs.readdirSync(dir).filter(f => /(_batch\d+|^games)\.json$/.test(f) && !fs.existsSync(path.join(dir, f.replace(/\.json$/, '.bg.json')))).sort()
    if (!files.length) continue
    const t0 = Date.now(), data = Object.fromEntries(files.map(f => [f, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))]))
    const list = files.flatMap(f => collect(data[f], f.replace(/\./g, '~')))
    const unique = [...new Set(list.map(([, t]) => t))]
    const system = SYSTEM(glossary).split('Style example:')[0] + `The texts are quiz questions, answer options, explanations and mini-game items of one chapter ("${c.short}"). Latin words and phrases stay Latin even when they are not in asterisks (for example "Princeps", "Res Gestae", "Pax Romana"). Keep each answer option short, like the English.\n\nGlossary (English → Bulgarian):\n` + Object.entries({ ...glossary.terms, ...glossary.names }).map(([en, bg]) => `${en} → ${bg}`).join('\n')
    const out = new Map()
    // a part whose answer has the wrong number of texts (one dropped or merged) is split in two and asked again
    const translatePart = async part => {
      const r = await askExtras(client, system, part)
      if (r.texts.length === part.length) return part.forEach((t, j) => out.set(t, r.texts[j]))
      if (part.length === 1) throw new Error(`${c.id}: no translation for "${part[0].slice(0, 60)}"`)
      console.log(`    ${c.id}: ${r.texts.length} texts back for ${part.length}; splitting`)
      await translatePart(part.slice(0, part.length >> 1)); await translatePart(part.slice(part.length >> 1))
    }
    for (let i = 0; i < unique.length; i += 220) await translatePart(unique.slice(i, i + 220))   // in parts, so each answer stays well within the limits
    for (const [p, t] of list) { const [f, ...rest] = p.split('.'); put(data[f.replace(/~/g, '.')], '.' + rest.join('.'), out.get(t)) }
    for (const f of files) fs.writeFileSync(path.join(dir, f.replace(/\.json$/, '.bg.json')), JSON.stringify(data[f], null, 2) + '\n')
    console.log(`${c.id}: ${files.length} files, ${unique.length} texts, ${Math.round((Date.now() - t0) / 1000)}s   (so far ~$${cost().toFixed(2)})`)
  }
  console.log(`\nTokens: ${usage.input} in, ${usage.output} out. Approximate cost: $${cost().toFixed(2)}`)
  process.exit(0)
}
if (EXTRAS) {
  const client = new Anthropic({ timeout: 10 * 60 * 1000, maxRetries: 2 })
  for (const c of chapters.filter(c => !ONLY || c.id === ONLY)) {
    const dir = dirOf(c), glossary = JSON.parse(fs.readFileSync(GLOSSARY, 'utf8'))
    const kfFile = path.join(dir, 'keyfacts.json'), mapsFile = path.join(dir, 'maps.json')
    const doKf = fs.existsSync(kfFile) && !fs.existsSync(path.join(dir, 'keyfacts.bg.json')), doMaps = fs.existsSync(mapsFile) && !fs.existsSync(path.join(dir, 'maps.bg.json'))
    if (!doKf && !doMaps) continue
    const data = { keyfacts: doKf ? JSON.parse(fs.readFileSync(kfFile, 'utf8')) : null, maps: doMaps ? JSON.parse(fs.readFileSync(mapsFile, 'utf8')).maps : null }
    const list = strings(data)
    const system = SYSTEM(glossary).split('Style example:')[0] + 'Glossary (English → Bulgarian):\n' + Object.entries({ ...glossary.terms, ...glossary.names }).map(([en, bg]) => `${en} → ${bg}`).join('\n')
    let r = await askExtras(client, system, list.map(([, t]) => t))
    if (r.texts.length !== list.length) throw new Error(`${c.id}: got ${r.texts.length} texts back for ${list.length}`)
    const latin = t => [...t.matchAll(/\*([^*\n]+)\*/g)].map(m => m[1]).join('|')
    const lost = list.filter(([, t], i) => latin(t) !== latin(r.texts[i])).length
    list.forEach(([p], i) => put(data, p, r.texts[i]))
    if (data.keyfacts) {   // the Bulgarian Key facts keep their Latin words; the explanation goes in "bulgarian"
      data.keyfacts.terms = data.keyfacts.terms.map(t => ({ latin: t.latin, bulgarian: t.english, sec: t.sec }))
      fs.writeFileSync(path.join(dir, 'keyfacts.bg.json'), JSON.stringify({ description: 'Ключови факти (превод на keyfacts.json).', ...data.keyfacts }, null, 2) + '\n')
    }
    if (data.maps) fs.writeFileSync(path.join(dir, 'maps.bg.json'), JSON.stringify({ description: 'Картите в хрониката (превод на maps.json).', maps: data.maps }, null, 2) + '\n')
    console.log(`${c.id}: ${list.length} texts${lost ? `, ${lost} with changed Latin` : ''}   (so far ~$${cost().toFixed(2)})`)
  }
  console.log(`\nTokens: ${usage.input} in, ${usage.output} out. Approximate cost: $${cost().toFixed(2)}`)
  process.exit(0)
}
const todo = chapters.filter(c => c.id !== 'kingdom' && (ONLY ? c.id === ONLY : CHECK || !fs.existsSync(path.join(dirOf(c), 'chapter.bg.md'))))
if (CHECK) {
  for (const c of chapters) {
    const f = path.join(dirOf(c), 'chapter.bg.md'); if (!fs.existsSync(f)) continue
    const p = problems(body(fs.readFileSync(path.join(dirOf(c), 'chapter.md'), 'utf8')), body(fs.readFileSync(f, 'utf8')))
    console.log(`${c.id}: ${p.length ? p.join(' | ') : 'ok'}`)
  }
  process.exit(0)
}
const client = new Anthropic({ timeout: 10 * 60 * 1000, maxRetries: 2 })   // a hung request fails after 10 minutes and is retried
for (const c of todo) {
  const glossary = JSON.parse(fs.readFileSync(GLOSSARY, 'utf8'))
  const enMd = fs.readFileSync(path.join(dirOf(c), 'chapter.md'), 'utf8'), en = body(enMd)
  const t0 = Date.now()
  let note = `Short name of this chapter: "${c.short}". Period: ${c.period}.`
  let r = await ask(client, SYSTEM(glossary), en, note), p = problems(en, r.markdown)
  if (p.length) {   // one more try, saying what to fix
    console.log(`  ${c.id}: ${p.join(' | ')}; asking again`)
    note += `\n\nA previous translation had these problems; avoid them: ${p.join('; ')}`
    r = await ask(client, SYSTEM(glossary), en, note); p = problems(en, r.markdown)
  }
  const foot = footer(enMd).replace(/^Based on Wikipedia:/m, 'Въз основа на Уикипедия (английската версия):')
  fs.writeFileSync(path.join(dirOf(c), 'chapter.bg.md'), r.markdown.trim() + '\n\n---\n' + foot + '\n')
  // new names join the glossary, so the next chapters write them the same way
  let added = 0
  for (const { english, bulgarian } of r.newNames) if (english && bulgarian && !glossary.names[english] && !glossary.terms[english]) { glossary.names[english] = bulgarian; added++ }
  glossary.shorts = { ...(glossary.shorts ?? {}), [c.id]: r.short }
  fs.writeFileSync(GLOSSARY, JSON.stringify(glossary, null, 2) + '\n')
  console.log(`${c.id}: ${body(r.markdown).split(/\s+/).length} words, ${added} new names, ${Math.round((Date.now() - t0) / 1000)}s${p.length ? '  STILL: ' + p.join(' | ') : ''}   (so far ~$${cost().toFixed(2)})`)
}
console.log(`\nTokens: ${usage.input} in, ${usage.output} out. Approximate cost: $${cost().toFixed(2)}`)
