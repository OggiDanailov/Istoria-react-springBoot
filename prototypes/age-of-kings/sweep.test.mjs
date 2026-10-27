// Smoke test: visits every screen of every chapter and reports blank screens or script errors.
//   PAGE=/path/to/a/page-wrapping-index.html node sweep.test.mjs   (needs playwright and Chrome)
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
const errors = []; page.on('pageerror', e => errors.push(e.message))
await page.goto('file://' + process.env.PAGE); await page.waitForTimeout(400)
const visited = await page.evaluate(async () => {
  const log = [], wait = ms => new Promise(r => setTimeout(r, ms))
  const check = label => { if (!document.getElementById('app').innerHTML.trim()) log.push('EMPTY: ' + label) }
  localStorage.clear(); tests = {}; stars = {}
  for (let i = 0; i < CHAPTERS.length; i++) { const t = testOf(CHAPTERS[i]); t.won = i < CHAPTERS.length - 1 }
  go({ screen: 'rome' }); check('rome')
  for (const era of ERAS) { if (eraChapters(era).length > 1) { go({ screen: 'era', era: era.id }); check('era ' + era.id) } }
  for (let i = 0; i < CHAPTERS.length; i++) {
    loadChapter(i); go({ screen: 'home' }); check('home ' + i)
    openChronicle(); openKeyFacts?.(); openProgress(); closeSheet()
    for (const [type] of SECTIONS) for (let s = 0; s < GAMES[type].sets.length; s++) { startGame(type, s); check(`${i} ${type} ${s}`); stopLoop() }
    go({ screen: 'briefing' }); check('briefing ' + i)
    // a finished test and its screens
    const t = testOf(CH); for (const r of testRounds()) t.done[`${r.type}:${r.set}`] = 1; t.answers['tf:0:0'] = 1; t.score = testScore(t)
    go({ screen: 'home' }); check('home complete ' + i)
    go({ screen: 'runDone' }); check('runDone ' + i)
    go({ screen: 'result', type: 'tf', set: 0, mistakes: 1, earned: 2, recapHtml: '', note: null, reviewSecs: [CHAPTER[0].id], feedbackSent: false, completed: true }); check('result ' + i)
    go({ screen: 'battle' }); await wait(150); if (!document.querySelector('#battle-host')?.shadowRoot?.innerHTML) log.push('NO BATTLE ' + i)
    go({ screen: 'home' })
  }
  return log
})
console.log('problems:', visited.length ? visited : 'none')
console.log('errors:', [...new Set(errors)])
await browser.close()
