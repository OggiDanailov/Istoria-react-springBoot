// Generates a chapter from Wikipedia in three steps:
//   1. chapter text (~1,500 words) split into sections with anchors
//   2. quiz questions written from that text, each linked to the section that explains it
//   3. one fact-check pass: sections against Wikipedia, questions against the chapter text
//
//   node generate.mjs --dry-run            fetch/cache sources, show sizes, no API calls
//   node generate.mjs                      generate every chapter that has no output yet
//   node generate.mjs --only kingdom       one chapter (id from chapters.json)
//   node generate.mjs --force              regenerate even if output exists
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
- Keep a specialist term (Latin titles, objects, offices, rituals) only if it is iconic or important to understanding the period, and then explain it. Otherwise describe in plain words what the thing was or did. E.g. instead of "insignia were twelve lictors carrying the fasces, a curule seat, red shoes, a white diadem and the toga picta", write that twelve attendants walked ahead of the king carrying the fasces, a bundle of rods around an axe that symbolised his power to punish, and that he sat on a special ivory chair and wore a purple robe embroidered with gold.
- Explain every name a newcomer wouldn't know the first time it appears in the chapter: places, peoples and tribes, institutions, offices, Latin or Greek terms. Use 3-10 words woven into the sentence, not brackets or footnotes (e.g. "Alba Longa, a Latin town in the hills south-east of Rome"; "the Sabines, a hill people living north-east of Rome"). Such basic, uncontroversial identifications may go slightly beyond the sources, but must be accurate. Don't re-explain a term later in the chapter, and don't explain everyday words like "king" or "Rome".
- When you mention a group with a known size (e.g. "seven kings"), cover every member of it in the chapter.
- Clearly mark legend, tradition and disputed claims as such ("According to tradition...", "Ancient writers claimed...", "Modern historians doubt...").
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

// ---------------------------------------------------------------- Main

async function processChapter(client, chapter) {
  const outDir = path.join(OUT_ROOT, chapter.folder)
  if (fs.existsSync(path.join(outDir, 'review.md')) && !FORCE) {
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
  const questionVerdicts = new Map(verification.questions.map(v => [v.id, v]))

  // 4. Write files
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })
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
    '## Sources', attribution, '',
  ].join('\n'))

  console.log(`    ${words} words / ${sections.length} sections, ${all.length} questions; flagged: ${flaggedSections.length} sections, ${flaggedQuestions.length} questions -> ${path.relative(process.cwd(), outDir)}`)
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
