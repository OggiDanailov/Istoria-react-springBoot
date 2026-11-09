// Scripted players for Pantheon Siege, played in simulated time (fast). Each watches the three lanes and drops a Roman
// god on the Greek god nearest the gate once it has walked a little way down (its reaction time), a move taking ~1 s. 'knows' always picks
// the twin; 'learner' picks a wrong god some of the time (more often for the gods of the later levels); 'weak' guesses
// wrong 40% of the time and is slower.
// PLAN='[["knows",80,0],["learner",80,0]]' PAGE=/path/to/index.html node pantheon.test.mjs   (strategy, test score, level 0-2)
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
const errors = []; page.on('pageerror', e => errors.push(e.message))
await page.goto('file://' + process.env.PAGE); await page.waitForTimeout(600)
for (const [strategy, score, level] of JSON.parse(process.env.PLAN)) {
  const r = await page.evaluate(([strategy, score, level]) => {
    const H = window.__hold
    H.openPantheon(); H.panStart(level, score)
    const P0 = H.P, rnd = Math.random
    const react = { knows: 0.16, learner: 0.3, weak: 0.35 }[strategy], move = { knows: 0.9, learner: 1.3, weak: 1.6 }[strategy], wrongP = { knows: 0, learner: [0.1, 0.18, 0.25][level], weak: 0.4 }[strategy]
    const tried = {}
    let next = 0
    for (let step = 0; step < 20000 && H.P.phase === 'play'; step++) {
      H.panUpdate(0.05)
      const P = H.P
      if (P.t < next) continue
      next = P.t + 0.25
      for (let lane = 0; lane < 3; lane++) {
        const g = P.gods.filter(g => g.lane === lane && g.state === 'walk').sort((a, b) => b.y - a.y)[0]
        if (!g || g.y < react) continue
        let k = g.k
        if (!tried[g.id] && rnd() < wrongP * (g.boss ? 2 : 1)) { const w = P.hand.filter(c => c !== g.k && !((P.cool[c] ?? 0) > P.t)); if (w.length) k = w[Math.floor(rnd() * w.length)] }
        tried[g.id] = true
        const i = P.hand.indexOf(k)
        if (i >= 0 && !((P.cool[k] ?? 0) > P.t)) { H.panDrop(i, lane); next = P.t + move; break }   // dragging a card takes a person about a second
      }
    }
    const P = H.P
    return { phase: P.phase, t: Math.round(P.t), score: P.score, mistakes: P.mistakes, gate: `${P.gate}/${P.gateMax}`, hand: P.hand.length }
  }, [strategy, score, level])
  console.log(`level ${level + 1}`, strategy.padEnd(8), score + '%', r.phase.padEnd(5), `t=${r.t}s`, `score ${r.score}`, `mistakes ${r.mistakes}`, `gate ${r.gate}`, `hand ${r.hand}`)
}
console.log('errors:', [...new Set(errors)]); await browser.close()
