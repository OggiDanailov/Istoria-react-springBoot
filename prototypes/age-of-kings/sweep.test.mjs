// Opens every chapter of the built app and everything in it: the home screen, the chronicle, Key facts,
// every round of the test, and the chapter's battle (in review mode). Reports page errors and empty screens.
// PAGE=/path/to/a/page/with/index.html node sweep.test.mjs   (the page needs a <body>, see README notes)
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
const errors = []; page.on('pageerror', e => errors.push(e.message))
await page.goto('file://' + process.env.PAGE); await page.waitForTimeout(500)
const n = await page.evaluate(() => { localStorage.clear(); return CHAPTERS.length })
const problems = []
for (let i = 0; i < n; i++) {
  const r = await page.evaluate(async i => {
    const out = { name: CHAPTERS[i].short, rounds: 0, empty: [], battle: null }
    const app = document.getElementById('app'), filled = () => app.innerHTML.trim().length > 50
    loadChapter(i); go({ screen: 'home' }); if (!filled()) out.empty.push('home')
    if (!chronicleHtml().includes('<section')) out.empty.push('chronicle')
    openKeyFacts(); openAnswers()
    for (const rd of testRounds()) { startGame(rd.type, rd.set); out.rounds++; if (!filled()) out.empty.push(`${rd.type}:${rd.set}`) }
    if (levelOf(i)) {
      openAll = true; go({ screen: 'battle', reviewScore: 80 })
      await new Promise(res => setTimeout(res, 400))
      const host = document.querySelector('#battle-host')   // the battle draws inside its own shadow root
      out.battle = levelOf(i).name + (host?.shadowRoot?.querySelector('canvas') ? '' : ' (did not mount)')
      openAll = false; go({ screen: 'home' })
    }
    return out
  }, i)
  if (r.empty.length || r.battle?.includes('did not')) problems.push(r)
  console.log(`${i + 1}. ${r.name}: ${r.rounds} rounds${r.battle ? ', battle ' + r.battle : ''}${r.empty.length ? ', EMPTY: ' + r.empty.join(' ') : ''}`)
}
console.log('problems:', problems.length ? JSON.stringify(problems) : 'none')
console.log('errors:', JSON.stringify([...new Set(errors)]))
await browser.close()
