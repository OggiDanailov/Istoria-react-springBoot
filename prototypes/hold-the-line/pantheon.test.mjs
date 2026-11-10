// Scripted players for Pantheon Siege, played in simulated time (fast). Each watches the three lanes and drops a Roman
// god on the Greek god nearest the gate once it has walked a little way down (its reaction time), a move (reading the names, then dragging) taking 1.5–3 s. 'knows' always picks
// the twin; 'learner' picks a wrong god some of the time (more often for the gods of the later levels); 'weak' guesses
// wrong 40% of the time and is slower.
// The Falling Gods ('fall' as the fourth item): the player reads the falling god's name (its reading time), then taps the
// column of its twin (a wrong one some of the time) and drops it.
// PLAN='[["knows",80,0],["learner",80,0,"fall"]]' PAGE=/path/to/index.html node pantheon.test.mjs   (strategy, test score, level 0-2, game)
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
const errors = []; page.on('pageerror', e => errors.push(e.message))
await page.goto('file://' + process.env.PAGE); await page.waitForTimeout(600)
for (const [strategy, score, level, game = 'siege'] of JSON.parse(process.env.PLAN)) {
  const r = await page.evaluate(([strategy, score, level, game]) => {
    const H = window.__hold
    if (game === 'fall') {
      H.openPantheon(); H.fallStart(level, score)
      const read = { knows: 1, learner: 1.8, weak: 2.5 }[strategy], wrongP = { knows: 0, learner: [0.1, 0.18, 0.25][level], weak: 0.4 }[strategy]
      let seen = null, at = 0
      for (let step = 0; step < 40000 && H.P.phase === 'play'; step++) {
        H.fallUpdate(0.05)
        const P = H.P, c = P.cur
        if (!c) continue
        if (seen !== c.id + ':' + !!c.missed) { seen = c.id + ':' + !!c.missed; at = P.t + (c.missed ? read * 0.6 : read) }   // after a miss, the right pair has just flashed
        if (P.t >= at && !c.fast) {
          let col = P.row.indexOf(c.k)
          if (!c.missed && Math.random() < wrongP * (c.boss ? 2 : 1)) col = (col + 1 + Math.floor(Math.random() * (P.F.cols - 1))) % P.F.cols
          H.fallTo(col); H.fallDrop()
        }
      }
      const P = H.P
      return { phase: P.phase, t: Math.round(P.t), score: P.score, mistakes: P.mistakes, gate: `${P.gate}/${P.gateMax}`, hand: '-' }
    }
    H.openPantheon(); H.panStart(level, score)
    const P0 = H.P, rnd = Math.random
    const react = { knows: 0.16, learner: 0.3, weak: 0.35 }[strategy], move = { knows: 1.5, learner: 2.2, weak: 2.8 }[strategy], wrongP = { knows: 0, learner: [0.1, 0.18, 0.25][level], weak: 0.4 }[strategy]
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
        if (i >= 0 && !((P.cool[k] ?? 0) > P.t)) { H.panDrop(i, lane); next = P.t + move; break }
      }
    }
    const P = H.P
    return { phase: P.phase, t: Math.round(P.t), score: P.score, mistakes: P.mistakes, gate: `${P.gate}/${P.gateMax}`, hand: P.hand.length }
  }, [strategy, score, level, game])
  console.log(game.padEnd(5), `level ${level + 1}`, strategy.padEnd(8), score + '%', r.phase.padEnd(5), `t=${r.t}s`, `score ${r.score}`, `mistakes ${r.mistakes}`, `gate ${r.gate}`, `hand ${r.hand}`)
}
console.log('errors:', [...new Set(errors)]); await browser.close()
