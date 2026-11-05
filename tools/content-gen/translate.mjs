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
