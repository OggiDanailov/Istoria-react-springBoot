// Builds index.html from template.html and every generated chapter that has game data.
//
//   node build.mjs
//
// Reads tools/content-gen/chapters.json for the chapter order and names, and for each chapter
// content/generated/<folder>/{games.json, chapter.md, *_batch*.json}. Items the fact-check
// flagged (reviewFlags) are left out.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/content-gen/chapters.json'), 'utf8'))
const GENERATED = path.resolve(ROOT, 'tools/content-gen', CONFIG.outputRoot)

const ok = item => !item.reviewFlags?.length

function sectionsFrom(markdown) {
  const body = markdown.split('\n---\n')[0]
  // Split on the section headings ("## Title {#id}"); everything up to the next heading is the section
  return body.split(/^## /m).slice(1).map(part => {
    const [heading, ...rest] = part.split('\n')
    const [, title, id] = heading.match(/^(.*?) \{#([\w-]+)\}\s*$/)
    return { id, title, body: rest.join('\n').trim() }
  })
}

// Every usable single-answer quiz question, by difficulty: the page draws two rounds of ten (4 easy, 3 medium,
// 3 hard) from it for each attempt of the chapter test, so a retake gets new questions
function quizPool(dir) {
  const byLevel = { 1: [], 2: [], 3: [] }
  for (const file of fs.readdirSync(dir).filter(f => /_batch\d+\.json$/.test(f)).sort()) {
    for (const q of JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')).questions) {
      if (ok(q) && q.correctAnswers.length === 1 && q.options.every(o => o.length <= 80)) byLevel[q.difficulty].push(q)
    }
  }
  return Object.fromEntries(Object.entries(byLevel).map(([lvl, qs]) => [lvl,
    qs.map(q => ({ q: q.question, options: q.options, a: q.correctAnswers[0], level: q.difficulty, why: q.explanation, sec: q.textReference.replace(/^#/, '') }))]))
}

const chapters = []
for (const c of CONFIG.chapters) {
  const dir = path.join(GENERATED, c.folder)
  if (!fs.existsSync(path.join(dir, 'games.json'))) { console.log(`- ${c.id}: no games.json yet, skipped`); continue }
  const g = JSON.parse(fs.readFileSync(path.join(dir, 'games.json'), 'utf8'))
  const markdown = fs.readFileSync(path.join(dir, 'chapter.md'), 'utf8')
  const sections = sectionsFrom(markdown)
  // The chronicle must show the whole chapter: compare word counts with the file
  const words = t => t.split(/\s+/).filter(Boolean).length
  const expected = words(markdown.split('\n---\n')[0].split(/^## .*$/m).slice(1).join(' '))
  const got = sections.reduce((n, x) => n + words(x.body), 0)
  if (got !== expected) throw new Error(`${c.id}: chronicle has ${got} words but chapter.md has ${expected}`)
  const ch = {
    id: c.id, era: c.era, short: c.short, title: c.chapterName.replace(/\s*\([^)]*\)\s*$/, '').replace(/^Early Republic:\s*/, '').replace(/ - /g, ': '), period: c.period.replace('BCE', 'BC'),
    sources: c.sources, briefing: g.briefing, sections, battle: c.battle,
    timelines: g.timelines.map(t => ({ name: t.name, blurb: t.blurb, events: t.events.filter(ok).map(e => ({ label: e.label, when: e.when, y: e.year, fact: e.fact, sec: e.sectionId })) }))
      .filter(t => t.events.length >= 3),
    matches: g.matchSets.map(m => { const pairs = m.pairs.filter(ok); return { name: m.name, blurb: m.blurb, pairs: pairs.map(p => [p.name, p.match]), secs: pairs.map(p => p.sectionId) } })
      .filter(m => m.pairs.length >= 3),
    decks: g.trueFalseDecks.map(d => ({ name: d.name, blurb: d.blurb, cards: d.cards.filter(ok).map(x => ({ claim: x.claim, answer: x.answer, why: x.why, sec: x.sectionId })) }))
      .filter(d => d.cards.length >= 4),
    odds: [{ name: 'Who Doesn’t Belong?', blurb: 'Spot the odd one out', rounds: g.oddOneOut.filter(ok).map(o => ({ items: o.items, odd: o.oddIndex, why: o.why, sec: o.sectionId })) }]
      .filter(o => o.rounds.length >= 3),
    whos: g.whoAmI.map(w => ({ name: w.name, blurb: w.blurb, people: w.people.filter(ok).map(p => ({ name: p.name, options: p.options, clues: p.clues, sec: p.sectionId })) }))
      .filter(w => w.people.length >= 2),
    maps: [{ name: 'Where It Happened', blurb: 'Place the towns on the map', places: g.places.filter(p => ok(p) && p.lat > 36 && p.lat < 47.5 && p.lon > 6 && p.lon < 19.5).map(p => ({ name: p.name, lat: p.lat, lon: p.lon, why: p.why, sec: p.sectionId })) }]
      .filter(m => m.places.length >= 3),
    quizPool: quizPool(dir),
    // optional, written by hand: people, dates and Latin words, each linked to its section
    // optional, written by hand: small maps shown at the start of chronicle sections
    chronicleMaps: fs.existsSync(path.join(dir, 'maps.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'maps.json'), 'utf8')).maps : [],
    keyFacts: fs.existsSync(path.join(dir, 'keyfacts.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'keyfacts.json'), 'utf8')) : null,
  }
  // Every link must point at a real section
  const ids = new Set(sections.map(s => s.id))
  const links = [...ch.timelines.flatMap(t => t.events.map(e => e.sec)), ...ch.matches.flatMap(m => m.secs), ...ch.decks.flatMap(d => d.cards.map(x => x.sec)),
    ...ch.odds.flatMap(o => o.rounds.map(r => r.sec)), ...ch.whos.flatMap(w => w.people.map(p => p.sec)), ...ch.maps.flatMap(m => m.places.map(p => p.sec)),
    ...Object.values(ch.quizPool).flat().map(x => x.sec),
    ...(ch.keyFacts ? [...ch.keyFacts.people, ...ch.keyFacts.dates, ...ch.keyFacts.terms].map(x => x.sec) : []),
    ...ch.chronicleMaps.map(m => m.sec)]
  if (ch.battle && !ids.has(ch.battle.sec)) links.push(ch.battle.sec)
  const broken = links.filter(l => !ids.has(l))
  if (broken.length) throw new Error(`${c.id}: links to unknown sections: ${[...new Set(broken)].join(', ')}`)
  chapters.push(ch)
  const count = k => ch[k].reduce((n, s) => n + (s.events ?? s.pairs ?? s.cards ?? s.rounds ?? s.people ?? s.places ?? s.questions).length, 0)
  const pool = ch.quizPool, sizes = [1, 2, 3].map(l => pool[l].length)
  if (sizes[0] < 8 || sizes[1] < 6 || sizes[2] < 6) console.log(`  ! ${c.id}: small quiz pool (easy/medium/hard ${sizes.join('/')}), fewer questions per round`)
  console.log(`- ${c.id}: ${['timelines', 'matches', 'decks', 'odds', 'whos', 'maps'].map(k => `${k} ${ch[k].length}/${count(k)}`).join(', ')}, quiz pool ${sizes.join('/')}`)
}
if (!chapters.length) throw new Error('No chapters with game data')

const template = fs.readFileSync(path.join(HERE, 'template.html'), 'utf8')
const land = fs.readFileSync(path.join(HERE, 'land.json'), 'utf8').trim()
// Embedded JSON must not close the <script> tag
const json = v => JSON.stringify(v).replace(/</g, '\\u003c')
// Hold the Line, the chapter battles, from ../hold-the-line (game.css and game.js)
const HTL = path.resolve(HERE, '../hold-the-line')
const htl = `<script>const HTL_CSS = ${json(fs.readFileSync(path.join(HTL, 'game.css'), 'utf8'))}</script>\n<script>\n${fs.readFileSync(path.join(HTL, 'game.js'), 'utf8')}\n</script>`
const html = template.replace('__HTL__', () => htl).replace('__ERAS__', () => json(CONFIG.eras)).replace('__CHAPTERS__', () => json(chapters)).replace('__LAND__', () => land)
fs.writeFileSync(path.join(HERE, 'index.html'), html)
console.log(`index.html: ${chapters.length} chapters, ${Math.round(html.length / 1024)} KB`)
