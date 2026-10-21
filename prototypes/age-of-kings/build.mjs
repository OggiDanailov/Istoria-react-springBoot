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
  return [...body.matchAll(/^## (.*?) \{#([\w-]+)\}\n\n([\s\S]*?)(?=\n## |$)/gm)]
    .map(([, title, id, text]) => ({ id, title, body: text.trim() }))
}

// Two quiz sets of 10 single-answer questions each (4 easy, 3 medium, 3 hard)
function quizSets(dir) {
  const byLevel = { 1: [], 2: [], 3: [] }
  for (const file of fs.readdirSync(dir).filter(f => /_batch\d+\.json$/.test(f)).sort()) {
    for (const q of JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')).questions) {
      if (ok(q) && q.correctAnswers.length === 1 && q.options.every(o => o.length <= 80)) byLevel[q.difficulty].push(q)
    }
  }
  const take = (lvl, n, skip) => byLevel[lvl].slice(skip, skip + n)
  return [0, 1].map(i => [...take(1, 4, i * 4), ...take(2, 3, i * 3), ...take(3, 3, i * 3)])
    .filter(set => set.length >= 8)
    .map((qs, i) => ({
      name: ['Raise a Legion', 'Reinforcements'][i], blurb: `${qs.length} questions, ${qs.length} soldiers`,
      questions: qs.map(q => ({ q: q.question, options: q.options, a: q.correctAnswers[0], level: q.difficulty, why: q.explanation, sec: q.textReference.replace(/^#/, '') })),
    }))
}

const chapters = []
for (const c of CONFIG.chapters) {
  const dir = path.join(GENERATED, c.folder)
  if (!fs.existsSync(path.join(dir, 'games.json'))) { console.log(`- ${c.id}: no games.json yet, skipped`); continue }
  const g = JSON.parse(fs.readFileSync(path.join(dir, 'games.json'), 'utf8'))
  const sections = sectionsFrom(fs.readFileSync(path.join(dir, 'chapter.md'), 'utf8'))
  const ch = {
    id: c.id, era: c.era, short: c.short, title: c.chapterName.replace(/\s*\([^)]*\)\s*$/, '').replace(/^Early Republic:\s*/, '').replace(/ - /g, ': '), period: c.period.replace('BCE', 'BC'),
    sources: c.sources, briefing: g.briefing, sections,
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
    quizzes: quizSets(dir),
  }
  // Every link must point at a real section
  const ids = new Set(sections.map(s => s.id))
  const links = [...ch.timelines.flatMap(t => t.events.map(e => e.sec)), ...ch.matches.flatMap(m => m.secs), ...ch.decks.flatMap(d => d.cards.map(x => x.sec)),
    ...ch.odds.flatMap(o => o.rounds.map(r => r.sec)), ...ch.whos.flatMap(w => w.people.map(p => p.sec)), ...ch.maps.flatMap(m => m.places.map(p => p.sec)),
    ...ch.quizzes.flatMap(q => q.questions.map(x => x.sec))]
  const broken = links.filter(l => !ids.has(l))
  if (broken.length) throw new Error(`${c.id}: links to unknown sections: ${[...new Set(broken)].join(', ')}`)
  chapters.push(ch)
  const count = k => ch[k].reduce((n, s) => n + (s.events ?? s.pairs ?? s.cards ?? s.rounds ?? s.people ?? s.places ?? s.questions).length, 0)
  console.log(`- ${c.id}: ${['timelines', 'matches', 'decks', 'odds', 'whos', 'maps', 'quizzes'].map(k => `${k} ${ch[k].length}/${count(k)}`).join(', ')}`)
}
if (!chapters.length) throw new Error('No chapters with game data')

const template = fs.readFileSync(path.join(HERE, 'template.html'), 'utf8')
const land = fs.readFileSync(path.join(HERE, 'land.json'), 'utf8').trim()
// Embedded JSON must not close the <script> tag
const json = v => JSON.stringify(v).replace(/</g, '\\u003c')
const html = template.replace('__ERAS__', () => json(CONFIG.eras)).replace('__CHAPTERS__', () => json(chapters)).replace('__LAND__', () => land)
fs.writeFileSync(path.join(HERE, 'index.html'), html)
console.log(`index.html: ${chapters.length} chapters, ${Math.round(html.length / 1024)} KB`)
