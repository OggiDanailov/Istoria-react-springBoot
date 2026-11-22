// Reads the data the printed documents need out of the built app or game, as JSON.
//   MODE=book    PAGE=app.html  LANG=en|bg  OUT=book.json     every chapter's chronicle, as the app shows it
//   MODE=battles PAGE=app.html             OUT=battles.json  each chapter and its battle, from the game's own data
//   MODE=pieces  PAGE=game.html            OUT=pieces.json   every unit and enemy, with its icon, per battle
import { chromium } from 'playwright'
import fs from 'fs'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []; page.on('pageerror', e => errors.push(e.message))
await page.goto('file://' + process.env.PAGE); await page.waitForTimeout(600)
const MODE = process.env.MODE
const data = await page.evaluate(([MODE, lang]) => {
  if (MODE === 'book') {
    setLang(lang)
    return CHAPTERS.map((c, i) => {
      loadChapter(i)
      const era = ERAS.find(e => e.id === CH.era)
      return { era: era.name, eraPeriod: era.period, title: CH.title, period: CH.period, battle: CH.battle?.name ?? null,
        html: CHAPTER.map(s => `<section><h3>${esc(s.title)}</h3>${(CH.chronicleMaps ?? []).filter(m => m.sec === s.id).map(chronicleMap).join('')}${s.body.split(/\n\s*\n/).map(paragraphHtml).join('')}</section>`).join('') + empireEnd().replace(/<p><button[^]*?<\/p>/, ''),
        sources: CH.sources, words: CHAPTER.reduce((n, s) => n + s.body.split(/\s+/).length, 0) }
    })
  }
  if (MODE === 'battles') {
    const H = HoldTheLine, U = H.debug.UNITS
    return CHAPTERS.map((c, i) => {
      const L = c.battle?.level && H.LEVELS.find(l => l.id === c.battle.level)
      return { n: i + 1, era: ERAS.find(e => e.id === c.era).name, eraPeriod: ERAS.find(e => e.id === c.era).period, title: c.title, period: c.period,
        battle: c.battle ? { name: c.battle.name, year: c.battle.year, enemy: c.battle.enemy } : null,
        game: L ? { twist: L.twist ?? '', newUnit: L.newUnit ? U[L.newUnit]?.name : null, field: `${L.cols ?? 5} × ${L.rows ?? 7}`, cards: L.units.map(t => U[t]?.name ?? t) } : null }
    })
  }
  const H = window.__hold, out = { levels: [], units: {}, foes: {} }
  const pic = (attr, t) => { const d = document.createElement('div'); d.innerHTML = `<canvas class="ic" data-${attr}="${t}" width="264" height="264"></canvas>`; H.paintIcons(d); return d.firstChild.toDataURL('image/png') }
  H.LEVELS.forEach((L, i) => {
    const foes = H.foeTypes(L)
    out.levels.push({ n: i + 1, name: L.name, year: L.year, units: L.units, foes })
    for (const t of L.units) (out.units[t] ??= { name: H.UNITS[t].name, img: pic('unit', t), in: [] }).in.push(i)
    for (const t of foes) (out.foes[t] ??= { name: H.FOES[t].name, img: pic('foe', t), in: [] }).in.push(i)
  })
  return out
}, [MODE, process.env.LANG_ ?? 'en'])
fs.writeFileSync(process.env.OUT, JSON.stringify(data))
console.log(MODE, process.env.LANG_ ?? '', 'collected', errors.length ? 'ERRORS ' + JSON.stringify(errors) : 'with no errors')
await browser.close()
