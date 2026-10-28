// Generates a chapter from Wikipedia in three steps:
//   1. chapter text (~1,500 words) split into sections with anchors
//   2. quiz questions written from that text, each linked to the section that explains it
//   3. one fact-check pass: sections against Wikipedia, questions against the chapter text
//   4. data for the seven mini-games, written from the chapter and fact-checked against it
//      (map coordinates come from Wikipedia, not the model)
//
//   node generate.mjs --dry-run            fetch/cache sources, show sizes, no API calls
//   node generate.mjs                      generate every chapter that has no output yet
//   node generate.mjs --only kingdom       one chapter (id from chapters.json)
//   node generate.mjs --force              regenerate even if output exists (not chapters marked "locked")
//   node generate.mjs --force --unlock     regenerate locked chapters too (overwrites hand edits)
//
// Needs ANTHROPIC_API_KEY (except for --dry-run): put ANTHROPIC_API_KEY=... in tools/content-gen/.env
// (git-ignored) and run via `npm run generate -- [flags]`.

import fs from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CONFIG = JSON.parse(fs.readFileSync(path.join(HERE, 'chapters.json'), 'utf8'))
const OUT_ROOT = path.resolve(HERE, CONFIG.outputRoot)
const CACHE_DIR = path.join(HERE, '.cache', 'wiki')

const MODEL = 'claude-opus-5-5'
const PRICE = { input: 4, output: 20, cacheWrite: 5, cacheRead: 0.2 } // $ per 1M tokens
const LEVELS = ['easy', 'medium', 'hard']
const OPTIONS_PER_LEVEL = { easy: 4, medium: 5, hard: 6 }
const LEVEL_NUMBER = { easy: 1, medium: 2, hard: 3 }
const BATCH_SIZE = 10
const TARGET_WORDS = 1500

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const FORCE = args.includes('--force')
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null

// ---------------------------------------------------------------- Wikipedia

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchWikipedia(title) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  const file = path.join(CACHE_DIR, title.replace(/[^\w-]+/g, '_') + '.json')
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))

  const params = new URLSearchParams({
    action: 'query', format: 'json', prop: 'extracts|info', inprop: 'url',
    explaintext: '1', redirects: '1', titles: title,
  })
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      headers: { 'User-Agent': 'AveCaesarContentPilot/0.1 (https://avecaesar.org)' },
    })
    if (res.status === 429) { await sleep(5000 * attempt); continue }
    if (!res.ok) throw new Error(`Wikipedia ${res.status} for "${title}"`)
    const page = Object.values((await res.json()).query.pages)[0]
    if (page.missing !== undefined) throw new Error(`Wikipedia article not found: "${title}"`)
    const doc = {
      title: page.title,
      url: page.fullurl,
      revision: page.lastrevid,
      // Drop reference/bibliography sections, which only add noise
      text: page.extract.split(/\n==+ (?:See also|Notes|References|Sources|Bibliography|Further reading|External links|Citations) ==+\n/)[0].trim(),
    }
    fs.writeFileSync(file, JSON.stringify(doc, null, 1))
    await sleep(1500) // be polite to Wikipedia
    return doc
  }
  throw new Error(`Wikipedia kept rate-limiting "${title}"`)
}

// ---------------------------------------------------------------- Schemas
// Zod validates what comes back; the JSON Schemas (no min/max: unsupported by
// structured outputs) constrain what the model produces. Counts are checked in code.

const ChapterText = z.object({
  sections: z.array(z.object({ id: z.string(), title: z.string(), body: z.string() })),
})
const chapterTextSchema = {
  type: 'object', additionalProperties: false, required: ['sections'],
  properties: {
    sections: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['id', 'title', 'body'],
        properties: {
          id: { type: 'string', description: 'kebab-case anchor, e.g. "numa-pompilius"' },
          title: { type: 'string' },
          body: { type: 'string', description: 'Markdown paragraphs, no headings' },
        },
      },
    },
  },
}

const Question = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswers: z.array(z.number().int()),
  explanation: z.string(),
  sectionId: z.string(),
  sourceQuote: z.string(),
})
const Questions = z.object({ easy: z.array(Question), medium: z.array(Question), hard: z.array(Question) })
const questionSchema = {
  type: 'object', additionalProperties: false,
  required: ['question', 'options', 'correctAnswers', 'explanation', 'sectionId', 'sourceQuote'],
  properties: {
    question: { type: 'string' },
    options: { type: 'array', items: { type: 'string' } },
    correctAnswers: { type: 'array', items: { type: 'integer' }, description: '0-based indexes into options' },
    explanation: { type: 'string' },
    sectionId: { type: 'string', description: 'id of the chapter section that explains the answer' },
    sourceQuote: { type: 'string', description: 'Sentence copied verbatim from that section' },
  },
}
const questionsSchema = {
  type: 'object', additionalProperties: false, required: LEVELS,
  properties: Object.fromEntries(LEVELS.map(l => [l, { type: 'array', items: questionSchema }])),
}

const Verdict = z.object({ id: z.string(), verdict: z.enum(['ok', 'problem']), issue: z.string() })
const Verification = z.object({ sections: z.array(Verdict), questions: z.array(Verdict) })
const verdictSchema = {
  type: 'object', additionalProperties: false, required: ['id', 'verdict', 'issue'],
  properties: {
    id: { type: 'string' },
    verdict: { type: 'string', enum: ['ok', 'problem'] },
    issue: { type: 'string', description: 'Empty string when verdict is ok' },
  },
}
const verificationSchema = {
  type: 'object', additionalProperties: false, required: ['sections', 'questions'],
  properties: {
    sections: { type: 'array', items: verdictSchema },
    questions: { type: 'array', items: verdictSchema },
  },
}

// ---------------------------------------------------------------- Prompts

const TEXT_SYSTEM = `You write chapters for Ave Caesar, a history quiz app. Players start with the quiz; when they miss a question, the app opens this chapter at the section that explains the answer. So the chapter is read in pieces, not front to back.

Write about ${TARGET_WORDS} words (between 1,300 and 1,700) for one chapter of history, using only the source articles you are given as ground truth. Leave out anything they don't support.

Structure:
- 6 to 10 sections, each 120-250 words, each about one clear topic (a person, an event, an institution, a debate) so a player sent there finds the answer quickly.
- Each section must make sense on its own: briefly re-introduce people or terms rather than relying on earlier sections.
- Order the sections so the chapter also reads well start to finish (usually chronological, with "what historians think" style sections where the sources discuss reliability).
- Section ids are short kebab-case anchors (e.g. "servius-tullius"); titles are plain text.

Style:
- Write for the general public, in the style of good popular history (a well-written magazine feature or popular history book), not academic writing. Clear, vivid, concrete prose for curious adults with no background in the period. Short paragraphs. No bullet lists, no headings inside sections.
- Use at most one or two unfamiliar terms per sentence, and never pack lists of technical items into one sentence.
- Name at most 5 people in the whole chapter: only those a reader should remember. Describe everyone else by role ("a tribune", "a senator", "the consuls of that year"), never by name.
- Use the short form of Roman names that a reader can hold on to ("Appius Claudius", "Menenius Agrippa", "Camillus"), not the full three-part name. Introduce each named person with what makes them memorable ("Menenius Agrippa, the senator who ended the strike with a fable"), and mention them again where they matter rather than only once.
- Keep a specialist term (Latin titles, objects, offices, rituals) only if it is iconic or important to understanding the period, and then explain it. Otherwise describe in plain words what the thing was or did. E.g. instead of "insignia were twelve lictors carrying the fasces, a curule seat, red shoes, a white diadem and the toga picta", write that twelve attendants walked ahead of the king carrying the fasces, a bundle of rods around an axe that symbolised his power to punish, and that he sat on a special ivory chair and wore a purple robe embroidered with gold.
- Explain every name a newcomer wouldn't know the first time it appears in the chapter: places, peoples and tribes, institutions, offices, Latin or Greek terms. Use 3-10 words woven into the sentence, not brackets or footnotes (e.g. "Alba Longa, a Latin town in the hills south-east of Rome"; "the Sabines, a hill people living north-east of Rome"). Such basic, uncontroversial identifications may go slightly beyond the sources, but must be accurate. Don't re-explain a term later in the chapter, and don't explain everyday words like "king" or "Rome".
- When you mention a group with a known size (e.g. "seven kings"), cover every member of it in the chapter.
- Clearly mark legend, tradition and disputed claims as such ("According to tradition...", "Ancient writers claimed...", "Modern historians doubt...").
- Give measurements in metric units first, with the source's unit in parentheses: "about 5 km (three miles)", "about 330 kg (a thousand pounds)", "about 120 hectares (300 acres)". Ancient miles and pounds are Roman ones (a Roman mile is about 1.5 km, a Roman pound about 330 g).
- Mention dates where they matter, written like "753 BC".`

const QUESTIONS_SYSTEM = `You write quiz questions for Ave Caesar, a history quiz app. People open it for fun, the way they'd open a trivia game, and learn something real along the way.

You get a chapter split into sections. Every question must be answerable from one section of that chapter, which is what the app shows a player who gets it wrong. The chapter is the only ground truth: don't test anything it doesn't say.

- Each question tests one fact or idea a curious person would enjoy knowing: people, turning points, causes and consequences, surprising details. No specialist trivia, no "according to the text" phrasing.
- Easy: key facts. Medium: connections, causes, lesser-known figures. Hard: nuance, chronology, consequences, specific details, still answerable from the section.
- Spread questions across all sections in proportion to their content, so every section is used.
- Exactly one correct answer, except that up to 20% of medium and 30% of hard questions may have several correct answers; those must end with "(select all that apply)".
- Wrong options are plausible for the period (real names, places, nearby dates) but clearly wrong according to the chapter. No "all of the above"/"none of the above". Keep option lengths similar so the correct one doesn't stand out.
- Every question in the chapter is about a different fact; no near-duplicates across difficulty levels.
- explanation: 1-3 sentences shown right after the player answers: why the answer is right, plus one related detail from the chapter.
- sectionId: the id of the section that explains the answer. sourceQuote: one sentence copied character-for-character from that section that supports the answer.
- Where the chapter calls something legendary, traditional or disputed, phrase the question that way.`

const VERIFIER_SYSTEM = `You fact-check content for a history quiz app. You get the source articles, a chapter written from them, and quiz questions written from the chapter.

1. Check each chapter section against the source articles. Mark "problem" if it states something the sources contradict or don't support, presents legend or disputed tradition as fact, or leaves out members of a group it names a count for ("seven kings" with fewer than seven covered), crams several unfamiliar terms into one sentence, or uses a place, people, institution or foreign term a newcomer wouldn't know without explaining it at its first mention in the chapter. Short identifying explanations of such terms ("Alba Longa, a Latin town south-east of Rome") don't need to be in the sources but must be accurate.
2. Check each question against the chapter. Mark "problem" if the marked correct answer(s) are not supported by the chapter or are wrong; a wrong option is also arguably correct; the question or explanation says something the chapter doesn't support; the referenced section does not actually explain the answer; or the question is ambiguous.

For "problem", explain in one sentence. For "ok", leave issue empty. Be strict but don't nitpick style.`

const sourceBlocks = docs => docs.map(d => ({
  type: 'text',
  text: `<article title="${d.title}" url="${d.url}">\n${d.text}\n</article>`,
}))
const chapterBlock = sections => ({
  type: 'text',
  text: `<chapter>\n${sections.map(s => `<section id="${s.id}" title="${s.title}">\n${s.body}\n</section>`).join('\n')}\n</chapter>`,
})

// ---------------------------------------------------------------- API

const usageTotals = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0 }

function cost(u) {
  return (u.input * PRICE.input + u.output * PRICE.output + u.cacheWrite * PRICE.cacheWrite + u.cacheRead * PRICE.cacheRead) / 1e6
}

// Every successful response is saved under .cache/responses, keyed by a hash of the
// full request. A rerun after a failure reuses the steps that already finished
// (for free) and only repeats the failed one. Changing a prompt changes the hash.
const RESPONSES_DIR = path.join(HERE, '.cache', 'responses')

async function callClaude(client, request) {
  const key = createHash('sha256').update(JSON.stringify({ MODEL, ...request })).digest('hex').slice(0, 32)
  const file = path.join(RESPONSES_DIR, `${key}.json`)
  if (fs.existsSync(file)) {
    console.log('    (reusing saved response)')
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  }
  for (let attempt = 1; ; attempt++) {
    try {
      const result = await requestClaude(client, request)
      fs.mkdirSync(RESPONSES_DIR, { recursive: true })
      fs.writeFileSync(file, JSON.stringify(result))
      return result
    } catch (err) {
      // Dropped connections ("terminated") and network errors are worth retrying;
      // refusals, truncation and API errors (4xx) are not.
      const retryable = err instanceof Anthropic.APIConnectionError || /terminated|ECONNRESET|socket/i.test(err.message)
      if (!retryable || attempt === 3) throw err
      console.log(`    connection dropped (${err.message}), retrying (${attempt}/2)...`)
      await sleep(5000 * attempt)
    }
  }
}

async function requestClaude(client, { system, content, schema, effort }) {
  const message = await client.beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    system,
    messages: [{ role: 'user', content }],
    output_config: { effort, format: { type: 'json_schema', schema } },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
  }).finalMessage()

  const u = message.usage
  usageTotals.input += u.input_tokens
  usageTotals.output += u.output_tokens
  usageTotals.cacheWrite += u.cache_creation_input_tokens ?? 0
  usageTotals.cacheRead += u.cache_read_input_tokens ?? 0

  if (message.stop_reason === 'refusal') throw new Error(`Model declined: ${message.stop_details?.explanation ?? 'no details'}`)
  if (message.stop_reason === 'max_tokens') throw new Error('Output hit max_tokens and is incomplete')
  const text = message.content.filter(b => b.type === 'text').map(b => b.text).join('')
  return JSON.parse(text)
}

async function timed(label, fn) {
  const t = Date.now()
  const result = await fn()
  console.log(`    ${label} in ${Math.round((Date.now() - t) / 1000)}s`)
  return result
}

// ---------------------------------------------------------------- Checks & helpers

const normalize = s => s.toLowerCase().replace(/[‘’“”"'`*_]/g, '').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim()
const wordCount = s => s.split(/\s+/).filter(Boolean).length

function textProblems(sections) {
  const problems = []
  const words = sections.reduce((n, s) => n + wordCount(s.body), 0)
  if (words < 1200 || words > 1800) problems.push(`chapter is ${words} words (target ~${TARGET_WORDS})`)
  if (sections.length < 6 || sections.length > 10) problems.push(`${sections.length} sections (target 6-10)`)
  const ids = sections.map(s => s.id)
  if (new Set(ids).size !== ids.length) problems.push('duplicate section ids')
  for (const id of ids) if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) problems.push(`section id "${id}" is not kebab-case`)
  return problems
}

function questionProblems(q, level, sections) {
  const problems = []
  const want = OPTIONS_PER_LEVEL[level]
  if (q.options.length !== want) problems.push(`has ${q.options.length} options, expected ${want}`)
  if (new Set(q.options.map(normalize)).size !== q.options.length) problems.push('duplicate options')
  if (!q.correctAnswers.length) problems.push('no correct answer')
  if (q.correctAnswers.some(i => i < 0 || i >= q.options.length)) problems.push('correct answer index out of range')
  const multi = q.correctAnswers.length > 1
  if (multi && level === 'easy') problems.push('easy question with several correct answers')
  if (multi !== /select all that apply/i.test(q.question)) problems.push('"select all that apply" label does not match the number of correct answers')
  const section = sections.find(s => s.id === q.sectionId)
  if (!section) problems.push(`links to unknown section "${q.sectionId}"`)
  else if (!normalize(section.body).includes(normalize(q.sourceQuote))) problems.push('source quote not found verbatim in the linked section')
  return problems
}

// Deterministic shuffle (seeded by the question text) so reruns of the same output
// give the same order, and the correct answer isn't biased towards any position.
function shuffleOptions(q) {
  let seed = [...q.question].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619)) >>> 0, 2166136261)
  const random = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const order = q.options.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]]
  }
  return {
    ...q,
    options: order.map(i => q.options[i]),
    correctAnswers: q.correctAnswers.map(c => order.indexOf(c)).sort((a, b) => a - b),
  }
}

// ---------------------------------------------------------------- Game data
// Data for the seven mini-games, written from the chapter text and linked to its sections.

const str = { type: 'string' }
const obj = (props, required = Object.keys(props)) => ({ type: 'object', additionalProperties: false, required, properties: props })
const arr = items => ({ type: 'array', items })
const gamesSchema = obj({
  briefing: obj({ title: str, paragraphs: arr(str) }),
  timelines: arr(obj({ name: str, blurb: str, events: arr(obj({ label: str, when: str, year: { type: 'integer', description: 'Year for sorting; negative = BC' }, fact: str, sectionId: str })) })),
  matchSets: arr(obj({ name: str, blurb: str, pairs: arr(obj({ name: str, match: str, sectionId: str })) })),
  trueFalseDecks: arr(obj({ name: str, blurb: str, cards: arr(obj({ claim: str, answer: { type: 'boolean' }, why: str, sectionId: str })) })),
  oddOneOut: arr(obj({ items: arr(str), oddIndex: { type: 'integer' }, why: str, sectionId: str })),
  whoAmI: arr(obj({ name: str, blurb: str, people: arr(obj({ name: str, options: arr(str), clues: arr(str), sectionId: str })) })),
  places: arr(obj({ name: str, wikipediaTitle: str, lat: { type: 'number' }, lon: { type: 'number' }, why: str, sectionId: str })),
})
const Games = z.object({
  briefing: z.object({ title: z.string(), paragraphs: z.array(z.string()) }),
  timelines: z.array(z.object({ name: z.string(), blurb: z.string(), events: z.array(z.object({ label: z.string(), when: z.string(), year: z.number().int(), fact: z.string(), sectionId: z.string() })) })),
  matchSets: z.array(z.object({ name: z.string(), blurb: z.string(), pairs: z.array(z.object({ name: z.string(), match: z.string(), sectionId: z.string() })) })),
  trueFalseDecks: z.array(z.object({ name: z.string(), blurb: z.string(), cards: z.array(z.object({ claim: z.string(), answer: z.boolean(), why: z.string(), sectionId: z.string() })) })),
  oddOneOut: z.array(z.object({ items: z.array(z.string()), oddIndex: z.number().int(), why: z.string(), sectionId: z.string() })),
  whoAmI: z.array(z.object({ name: z.string(), blurb: z.string(), people: z.array(z.object({ name: z.string(), options: z.array(z.string()), clues: z.array(z.string()), sectionId: z.string() })) })),
  places: z.array(z.object({ name: z.string(), wikipediaTitle: z.string(), lat: z.number(), lon: z.number(), why: z.string(), sectionId: z.string() })),
})

const GAMES_SYSTEM = `You write the content for the mini-games of Ave Caesar, a history learning game played on phones. People play for fun and should learn real history.

You get a chapter split into sections. Players have just read the chapter once, so only use people, places and terms the chapter makes memorable: ones it names at least twice or that a whole section is about. The games are about the history itself (the people of the period, events, places, institutions), not about the scholars who study it: never build an item around modern historians, and use ancient writers (Livy, Fabius Pictor…) in at most one item per game, only where the chapter is about how we know the story. Use names exactly as the chapter writes them. Everything you write must be supported by that chapter, which is the only ground truth; every item names the section (sectionId) that explains it, because that is where a player who gets it wrong is sent. Mark legend and disputed tradition as such. Write measurements as the chapter does: metric first, the old unit in parentheses. Spread items across all sections. Explain unfamiliar names in a few words where space allows (in facts, explanations and clues), never in short labels.

Write:
- briefing: a title like "Rome, 343 BC" and 2 short paragraphs (70-100 words in total) that set the scene for a newcomer: where, when, who, and what is at stake. Plain, vivid, no lists.
- timelines: 3 levels of events to put in chronological order, with 4, 6 and 8 events (easiest first). label: at most 40 characters, no dates in it. when: how a player would say the date ("343 BC", "Soon after 509 BC", "Under Servius Tullius, 6th king"). year: an integer for sorting (negative for BC); every event in a level needs a different year, and include an event only if the chapter makes its place in the order clear. fact: one sentence shown after placing it.
- matchSets: 2 sets of 5 pairs. name: a person, place or term (at most 30 characters). match: what they did or what it means (at most 70 characters). Each match must fit only its own name in the set.
- trueFalseDecks: 2 decks of 8 statements, about half true. A false statement changes one clear detail so it is plainly false according to the chapter (not a trick of wording). why: one or two sentences giving the real fact.
- oddOneOut: 7 rounds of 4 short items (at most 40 characters each) where three share a property the chapter clearly states and one does not, though it looks like it belongs. oddIndex is its position. why: names the shared property and why the odd one differs.
- whoAmI: 2 sets of 3 or 4 people. clues: exactly 4, written in the first person, ordered from hardest to easiest, never containing the person's name, each true only of that person among the options. options: exactly 4 names including the right one; the other three are real people of the same kind from this period (preferably from the chapter).
- places: 5 to 7 places from the chapter to put on a map of Italy and its surroundings (nothing outside Italy, Sicily, Sardinia and the neighbouring coasts): towns, cities, regions, rivers, lakes or battlefields, at least 15 km apart from each other and from Rome (so not hills, buildings or districts inside one city). name: as the chapter calls it. wikipediaTitle: the English Wikipedia article that has the place's coordinates (an ancient site or the modern town on the spot). lat/lon: your best estimate. why: one sentence on its role in the chapter.`

const GAMES_VERIFIER_SYSTEM = `You fact-check the mini-game content of a history learning game against the chapter it was written from. The chapter is the only ground truth.

Mark an item "problem" (one sentence why) if: it states something the chapter contradicts or does not support; it presents legend as fact; its sectionId does not explain it; a timeline level's order is not clearly supported by the chapter; a true/false card's answer is wrong or debatable; in odd-one-out the three do not clearly share a stated property or the odd one also has it, or a different grouping of the four gives a second defensible answer (e.g. three are Etruscans, but also three are kings of Rome); a Who Am I? clue is false, names the person, or fits another option equally; a match could fit another name in its set; the item relies on a person or term the chapter mentions only in passing; the item is about modern historians rather than the history itself; or the item is ambiguous. Otherwise "ok" with an empty issue. Be strict but don't nitpick style.`

const COORDS_DIR = path.join(HERE, '.cache', 'coords')
async function wikiCoordinates(title) {
  fs.mkdirSync(COORDS_DIR, { recursive: true })
  const file = path.join(COORDS_DIR, title.replace(/[^\w-]+/g, '_') + '.json')
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const params = new URLSearchParams({ action: 'query', format: 'json', prop: 'coordinates', redirects: '1', titles: title })
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, { headers: { 'User-Agent': 'AveCaesarContentPilot/0.1 (https://avecaesar.org)' } })
    if (res.status === 429) { await sleep(4000 * attempt); continue }
    if (!res.ok) return null
    const page = Object.values((await res.json()).query.pages)[0]
    const c = page?.coordinates?.[0]
    const result = c ? { lat: c.lat, lon: c.lon, title: page.title } : null
    fs.writeFileSync(file, JSON.stringify(result))
    await sleep(1000)
    return result
  }
  return null
}
const km = (a, b) => {
  const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

// Flatten every game item with a stable id, for checking and for the verifier
function gameItems(g) {
  const items = []
  g.timelines.forEach((t, i) => t.events.forEach((e, j) => items.push({ id: `timeline-${i + 1}-${j + 1}`, group: `timeline-${i + 1}`, sectionId: e.sectionId, show: { level: t.name, label: e.label, when: e.when, year: e.year, fact: e.fact } })))
  g.matchSets.forEach((m, i) => m.pairs.forEach((p, j) => items.push({ id: `match-${i + 1}-${j + 1}`, group: `match-${i + 1}`, sectionId: p.sectionId, show: { set: m.name, name: p.name, match: p.match } })))
  g.trueFalseDecks.forEach((d, i) => d.cards.forEach((c, j) => items.push({ id: `tf-${i + 1}-${j + 1}`, sectionId: c.sectionId, show: { claim: c.claim, answer: c.answer, why: c.why } })))
  g.oddOneOut.forEach((o, i) => items.push({ id: `odd-${i + 1}`, sectionId: o.sectionId, show: { items: o.items, odd: o.items[o.oddIndex], why: o.why } }))
  g.whoAmI.forEach((w, i) => w.people.forEach((p, j) => items.push({ id: `who-${i + 1}-${j + 1}`, sectionId: p.sectionId, show: { name: p.name, options: p.options, clues: p.clues } })))
  g.places.forEach((p, i) => items.push({ id: `place-${i + 1}`, sectionId: p.sectionId, show: { name: p.name, why: p.why } }))
  return items
}

// Checks that need no model: shapes, counts, lengths, duplicates
function gameProblems(g, sections) {
  const ids = new Set(sections.map(s => s.id))
  const out = new Map()
  const add = (id, msg) => out.set(id, [...(out.get(id) ?? []), msg])
  for (const it of gameItems(g)) if (!ids.has(it.sectionId)) add(it.id, `links to unknown section "${it.sectionId}"`)
  g.timelines.forEach((t, i) => {
    const years = t.events.map(e => e.year)
    if (new Set(years).size !== years.length) add(`timeline-${i + 1}-1`, `level "${t.name}" has events with the same year`)
    t.events.forEach((e, j) => { if (e.label.length > 42) add(`timeline-${i + 1}-${j + 1}`, `label longer than 40 characters`) })
  })
  g.matchSets.forEach((m, i) => {
    if (m.pairs.length !== 5) add(`match-${i + 1}-1`, `set "${m.name}" has ${m.pairs.length} pairs, expected 5`)
    if (new Set(m.pairs.map(p => normalize(p.name))).size !== m.pairs.length) add(`match-${i + 1}-1`, 'duplicate names in set')
  })
  g.oddOneOut.forEach((o, i) => {
    if (o.items.length !== 4) add(`odd-${i + 1}`, `${o.items.length} items, expected 4`)
    if (o.oddIndex < 0 || o.oddIndex >= o.items.length) add(`odd-${i + 1}`, 'oddIndex out of range')
  })
  g.whoAmI.forEach((w, i) => w.people.forEach((p, j) => {
    const id = `who-${i + 1}-${j + 1}`
    if (p.options.length !== 4 || !p.options.includes(p.name)) add(id, 'options must be 4 names including the answer')
    if (new Set(p.options).size !== p.options.length) add(id, 'duplicate options')
    if (p.clues.length !== 4) add(id, `${p.clues.length} clues, expected 4`)
    const parts = p.name.split(/\s+/).filter(w => w.length > 3 && !/^(the|king)$/i.test(w))
    if (p.clues.some(c => parts.some(w => normalize(c).includes(normalize(w))))) add(id, 'a clue contains the person’s name')
  }))
  return out
}

// How often a name appears in the chapter (case-insensitive, whole phrase)
const mentions = (name, sections) => {
  const text = normalize(sections.map(s => `${s.title}\n${s.body}`).join('\n'))
  return text.split(normalize(name)).length - 1
}

async function writeGames(client, chapter, sections, outDir) {
  const ask = `Chapter: ${chapter.chapterName}\nValid sectionId values: ${sections.map(s => `"${s.id}"`).join(', ')}.`
  const games = Games.parse(await timed('game data written', () => callClaude(client, {
    system: GAMES_SYSTEM,
    content: [chapterBlock(sections), { type: 'text', text: ask }],
    schema: gamesSchema,
    effort: 'high',
  })))
  const flags = gameProblems(games, sections)
  const addFlag = (id, msg) => flags.set(id, [...(flags.get(id) ?? []), msg])

  // People and terms must be memorable from one read: named at least twice in the chapter
  games.matchSets.forEach((m, i) => m.pairs.forEach((p, j) => {
    if (mentions(p.name, sections) < 2) addFlag(`match-${i + 1}-${j + 1}`, `"${p.name}" appears fewer than 2 times in the chapter`)
  }))
  games.whoAmI.forEach((w, i) => w.people.forEach((p, j) => {
    if (mentions(p.name, sections) < 2) addFlag(`who-${i + 1}-${j + 1}`, `"${p.name}" appears fewer than 2 times in the chapter`)
  }))
  // Odd One Out items that are just a name (2-3 capitalised words) must be named at least twice too
  const isName = t => /^(?:[A-Z][\w'’-]+)(?: (?:the |of |de )?[A-Z][\w'’-]+){1,2}$/.test(t.trim())
  games.oddOneOut.forEach((o, i) => o.items.forEach(item => {
    if (isName(item) && mentions(item, sections) < 2) addFlag(`odd-${i + 1}`, `"${item}" appears fewer than 2 times in the chapter`)
  }))

  // Real coordinates from Wikipedia; the model's estimate only as a flagged fallback
  for (const [i, p] of games.places.entries()) {
    const wiki = await wikiCoordinates(p.wikipediaTitle)
    if (wiki) {
      const off = km(wiki, p)
      if (off > 60) addFlag(`place-${i + 1}`, `model's position is ${Math.round(off)} km from Wikipedia's "${wiki.title}"; check the article is the right place`)
      Object.assign(p, { lat: wiki.lat, lon: wiki.lon, coordinates: `Wikipedia: ${wiki.title}` })
    } else {
      p.coordinates = 'model estimate'
      addFlag(`place-${i + 1}`, `no coordinates on Wikipedia "${p.wikipediaTitle}"; position is the model's estimate`)
    }
  }

  // Places must be far enough apart to tell them apart on a map (and from Rome, which is always shown)
  const ROME = { lat: 41.893, lon: 12.483 }
  games.places.forEach((p, i) => {
    if (km(p, ROME) < 12) addFlag(`place-${i + 1}`, 'less than 12 km from Rome: too close to show on the map')
    if (p.lat < 36 || p.lat > 47.5 || p.lon < 6 || p.lon > 19.5) addFlag(`place-${i + 1}`, 'outside the map area (Italy and its neighbours)')
    games.places.slice(0, i).forEach((q, j) => { if (km(p, q) < 12) addFlag(`place-${i + 1}`, `less than 12 km from ${q.name} (place ${j + 1}): too close to show on the map`) })
  })

  const items = gameItems(games)
  const verdicts = Verification.parse(await timed('game data fact-checked', () => callClaude(client, {
    system: GAMES_VERIFIER_SYSTEM,
    content: [chapterBlock(sections), { type: 'text', text: `Return your verdicts in "questions" (one per id) and leave "sections" empty.\n${JSON.stringify(items.map(({ id, sectionId, show }) => ({ id, sectionId, ...show })), null, 1)}` }],
    schema: verificationSchema,
    effort: 'medium',
  })))
  const byId = new Map(verdicts.questions.map(v => [v.id, v]))
  for (const it of items) {
    const v = byId.get(it.id)
    if (!v) addFlag(it.id, 'verifier returned no verdict')
    else if (v.verdict === 'problem') addFlag(it.id, `fact-check: ${v.issue}`)
  }

  // Attach flags to the items so a build can leave flagged ones out
  const flagged = id => flags.get(id) ?? []
  games.timelines.forEach((t, i) => t.events.forEach((e, j) => { e.reviewFlags = flagged(`timeline-${i + 1}-${j + 1}`) }))
  games.matchSets.forEach((m, i) => m.pairs.forEach((p, j) => { p.reviewFlags = flagged(`match-${i + 1}-${j + 1}`) }))
  games.trueFalseDecks.forEach((d, i) => d.cards.forEach((c, j) => { c.reviewFlags = flagged(`tf-${i + 1}-${j + 1}`) }))
  games.oddOneOut.forEach((o, i) => { o.reviewFlags = flagged(`odd-${i + 1}`) })
  games.whoAmI.forEach((w, i) => w.people.forEach((p, j) => { p.reviewFlags = flagged(`who-${i + 1}-${j + 1}`) }))
  games.places.forEach((p, i) => { p.reviewFlags = flagged(`place-${i + 1}`) })

  fs.writeFileSync(path.join(outDir, 'games.json'), JSON.stringify({ chapterName: chapter.chapterName, model: MODEL, ...games }, null, 2) + '\n')
  return { count: items.length, flagged: items.filter(it => flags.has(it.id)).map(it => ({ ...it, problems: flags.get(it.id) })) }
}

// ---------------------------------------------------------------- Main

async function processChapter(client, chapter) {
  const outDir = path.join(OUT_ROOT, chapter.folder)
  // A chapter marked "locked" in chapters.json has been reviewed or edited by hand: never overwrite it
  // unless --unlock is given as well.
  if (chapter.locked && !args.includes('--unlock')) {
    console.log(`- ${chapter.id}: locked (reviewed/edited by hand); use --force --unlock to regenerate and lose those edits`)
    return
  }
  if (fs.existsSync(path.join(outDir, 'games.json')) && !FORCE) {
    console.log(`- ${chapter.id}: already generated (use --force to redo)`)
    return
  }

  const docs = []
  for (const title of chapter.sources) docs.push(await fetchWikipedia(title))
  const sourceWords = docs.reduce((n, d) => n + wordCount(d.text), 0)
  const wanted = Object.values(chapter.counts).reduce((a, b) => a + b, 0)
  console.log(`- ${chapter.id}: ${docs.length} articles, ${sourceWords} words of source, ${wanted} questions wanted`)
  if (DRY_RUN) return

  // 1. Chapter text
  const { sections } = ChapterText.parse(await timed('chapter text written', () => callClaude(client, {
    system: TEXT_SYSTEM,
    content: [...sourceBlocks(docs), { type: 'text', text: `Chapter: ${chapter.chapterName}\nPeriod: ${chapter.period}` }],
    schema: chapterTextSchema,
    effort: 'high',
  })))

  // 2. Questions from the chapter text
  const ask = `Chapter: ${chapter.chapterName}

Write exactly ${chapter.counts.easy} easy, ${chapter.counts.medium} medium and ${chapter.counts.hard} hard questions.
Easy questions have ${OPTIONS_PER_LEVEL.easy} options, medium ${OPTIONS_PER_LEVEL.medium}, hard ${OPTIONS_PER_LEVEL.hard}.
Valid sectionId values: ${sections.map(s => `"${s.id}"`).join(', ')}.`
  const generated = Questions.parse(await timed('questions written', () => callClaude(client, {
    system: QUESTIONS_SYSTEM,
    content: [chapterBlock(sections), { type: 'text', text: ask }],
    schema: questionsSchema,
    effort: 'high',
  })))

  // 3. Fact-check: sections vs Wikipedia, questions vs chapter
  const all = LEVELS.flatMap(level => generated[level].map((q, i) => ({ id: `${level}-${i + 1}`, level, q })))
  const forReview = all.map(({ id, q }) => ({
    id, sectionId: q.sectionId, question: q.question, options: q.options,
    correctAnswers: q.correctAnswers.map(i => q.options[i]), explanation: q.explanation,
  }))
  const verification = Verification.parse(await timed('fact-checked', () => callClaude(client, {
    system: VERIFIER_SYSTEM,
    content: [
      ...sourceBlocks(docs),
      chapterBlock(sections),
      { type: 'text', text: `Check every section (ids: ${sections.map(s => s.id).join(', ')}) and these questions:\n${JSON.stringify(forReview, null, 1)}` },
    ],
    schema: verificationSchema,
    effort: 'medium',
  })))
  const sectionVerdicts = new Map(verification.sections.map(v => [v.id, v]))

  // 4. Game data for the mini-games, checked against the chapter
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })
  const gameResult = await writeGames(client, chapter, sections, outDir)
  const questionVerdicts = new Map(verification.questions.map(v => [v.id, v]))

  // 5. Write files
  const slug = path.basename(chapter.folder).replace(/^\d+\./, '')
  const attribution = docs.map(d => `- [${d.title}](${d.url}) (revision ${d.revision}), CC BY-SA 4.0`).join('\n')

  // Headings use the {#anchor} syntax the app's remarkAnchorPlugin turns into ids,
  // which is what question.textReference ("#section-id") scrolls to.
  fs.writeFileSync(path.join(outDir, 'chapter.md'), [
    `# ${chapter.chapterName}`, '',
    ...sections.flatMap(s => [`## ${s.title} {#${s.id}}`, '', s.body.trim(), '']),
    '---', 'Based on Wikipedia:', attribution, '',
  ].join('\n'))

  const flaggedSections = []
  for (const s of sections) {
    const v = sectionVerdicts.get(s.id)
    if (!v) flaggedSections.push({ s, problems: ['verifier returned no verdict'] })
    else if (v.verdict === 'problem') flaggedSections.push({ s, problems: [`fact-check: ${v.issue}`] })
  }

  const flaggedQuestions = []
  const used = new Map(sections.map(s => [s.id, 0]))
  let batchOrder = 0 // across the chapter: easy batches first, then medium, then hard
  for (const level of LEVELS) {
    // Questions come back roughly in section order; mix them (repeatably) so every
    // batch covers the whole chapter instead of a few sections.
    const hash = str => [...str].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261)
    const mixed = all.filter(x => x.level === level).sort((a, b) => hash(a.q.question) - hash(b.q.question))
    const questions = mixed.map(({ id, q }) => {
      const problems = questionProblems(q, level, sections)
      const v = questionVerdicts.get(id)
      if (!v) problems.push('verifier returned no verdict')
      else if (v.verdict === 'problem') problems.push(`fact-check: ${v.issue}`)
      if (problems.length) flaggedQuestions.push({ id, q, problems })
      if (used.has(q.sectionId)) used.set(q.sectionId, used.get(q.sectionId) + 1)
      const shuffled = shuffleOptions(q)
      return {
        question: shuffled.question,
        options: shuffled.options,
        correctAnswers: shuffled.correctAnswers,
        difficulty: LEVEL_NUMBER[level],
        textReference: `#${q.sectionId}`,
        explanation: q.explanation,
        sourceQuote: q.sourceQuote,
        reviewFlags: problems,
      }
    })
    for (let b = 0; b * BATCH_SIZE < questions.length; b++) {
      batchOrder++
      fs.writeFileSync(path.join(outDir, `${slug}_${level}_batch${b + 1}.json`), JSON.stringify({
        batchName: `${chapter.chapterName} - ${level[0].toUpperCase() + level.slice(1)} Batch ${b + 1}`,
        chapterName: chapter.chapterName,
        difficulty: LEVEL_NUMBER[level],
        batchOrder,
        description: `AI-generated from Wikipedia (${MODEL})`,
        questions: questions.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE),
      }, null, 2) + '\n')
    }
  }

  const structural = textProblems(sections)
  const unused = [...used].filter(([, n]) => n === 0).map(([id]) => id)
  if (unused.length) structural.push(`sections with no questions: ${unused.join(', ')}`)
  const words = sections.reduce((n, s) => n + wordCount(s.body), 0)
  const counts = LEVELS.map(l => `${generated[l].length} ${l}`).join(', ')

  fs.writeFileSync(path.join(outDir, 'review.md'), [
    `# Review: ${chapter.chapterName}`, '',
    `Generated ${new Date().toISOString().slice(0, 10)} with ${MODEL}.`,
    `Chapter: ${words} words in ${sections.length} sections (${sections.map(s => `${s.id} ${wordCount(s.body)}w/${used.get(s.id)}q`).join(', ')}).`,
    `Questions: ${counts} (${all.length} total).`,
    `**${flaggedSections.length} sections and ${flaggedQuestions.length} questions flagged** for human review.`, '',
    ...(structural.length ? ['## Structure', ...structural.map(p => `> ${p}`), ''] : []),
    ...flaggedSections.flatMap(({ s, problems }) => [`## Section ${s.id}: ${s.title}`, '', ...problems.map(p => `> ${p}`), '']),
    ...flaggedQuestions.flatMap(({ id, q, problems }) => [
      `## ${id} (#${q.sectionId}): ${q.question}`,
      ...q.options.map((o, i) => `- ${q.correctAnswers.includes(i) ? '**✓**' : '  '} ${o}`),
      '', ...problems.map(p => `> ${p}`), '',
    ]),
    `## Game data: ${gameResult.flagged.length} of ${gameResult.count} items flagged (games.json; flagged items are left out of game builds)`, '',
    ...gameResult.flagged.flatMap(it => [`### ${it.id} (#${it.sectionId})`, '```', JSON.stringify(it.show), '```', ...it.problems.map(p => `> ${p}`), '']),
    '## Sources', attribution, '',
  ].join('\n'))

  console.log(`    ${words} words / ${sections.length} sections, ${all.length} questions, ${gameResult.count} game items; flagged: ${flaggedSections.length} sections, ${flaggedQuestions.length} questions, ${gameResult.flagged.length} game items -> ${path.relative(process.cwd(), outDir)}`)
}

const chapters = CONFIG.chapters.filter(c => !ONLY || c.id === ONLY)
if (!chapters.length) throw new Error(`No chapter with id "${ONLY}"`)
if (!DRY_RUN && !process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set. Create a key at https://console.anthropic.com and put it in tools/content-gen/.env:\n  ANTHROPIC_API_KEY=sk-ant-...')
  process.exit(1)
}

const client = DRY_RUN ? null : new Anthropic()
for (const chapter of chapters) {
  try {
    await processChapter(client, chapter)
  } catch (err) {
    console.error(`    FAILED ${chapter.id}: ${err.message}`)
  }
}
if (!DRY_RUN) {
  console.log(`\nTokens: ${usageTotals.input} in, ${usageTotals.output} out, ${usageTotals.cacheWrite} cache write, ${usageTotals.cacheRead} cache read`)
  console.log(`Approximate cost: $${cost(usageTotals).toFixed(2)}`)
}
