// Scripted players for any field size. strategy: full (strong), normal (average), casual
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })).newPage()
const errors = []; page.on('pageerror', e => errors.push(e.message))
await page.goto('file://' + process.env.PAGE); await page.waitForTimeout(600)
async function run(level, strategy, score) {
  await page.evaluate(([level, strategy, score]) => {
    const H = window.__hold
    H.startLevel(level, score)
    const G0 = H.G, C = G0.equites.length, R = H.LEVELS[level].rows ?? 7
    const L = [...Array(C).keys()].sort((a, b) => Math.abs(a - (C - 1) / 2) - Math.abs(b - (C - 1) / 2))
    // veterans: shooters at the back, the rest in front
    for (const [t, n] of Object.entries(G0.vets)) for (let k = 0; k < n; k++) {
      const rows = t === 'slinger' ? [R - 2, R - 3] : [R - 4, R - 3]
      outer: for (const r of rows) for (const l of L) if (H.place(t, l, r)) break outer
    }
    H.beginBattle(); H.G.speed = 6
    clearInterval(window.__bot)
    window.__bot = setInterval(() => {
      const G = H.G; if (G.phase !== 'play') return
      const lvl = H.LEVELS[level], U = H.UNITS
      for (const d of [...G.drops]) if (!d.falling && (strategy !== 'casual' || d.life < 6)) H.collect(d)
      const has = (l, r) => G.units.some(u => u.lane === l && u.row === r)
      const can = t => lvl.units.includes(t)
      const tryPlace = (t, l, r) => can(t) && G.rations >= U[t].cost && G.cool[t] <= 0 && H.place(t, l, r)
      const foesIn = l => G.foes.filter(f => f.lane === l && f.hp > 0)
      const shooters = l => G.units.filter(u => u.lane === l && ['slinger', 'rorarii', 'scorpio', 'velites'].includes(u.type)).length
      const front = R - 4, back = R - 2, carts = G.units.filter(u => u.type === 'cart').length
      // torches on houses defenders burst out of
      if (can('torch') && G.t > 40 && G.rations >= 200) for (let r = R - 1; r >= 2; r--) for (const l of L) if (tryPlace('torch', l, r)) return   // only the houses nearest the line
      // elephants: trumpeter or caltrops in front
      for (const l of L) if (G.foes.some(f => f.lane === l && H.FOES[f.type].elephant && !f.fleeing && f.y < front - 0.5)) {
        if (!G.units.some(u => Math.abs(u.lane - l) <= 1 && u.type === 'cornicen') && (tryPlace('cornicen', l, front) || tryPlace('cornicen', l, front + 1))) return
        if (!has(l, front) && tryPlace('caltrops', l, front)) return
      }
      for (const l of L) if (foesIn(l).length && !shooters(l)) { if (tryPlace('slinger', l, back) || tryPlace('velites', l, back)) return }
      for (const l of L) if (G.foes.some(f => f.lane === l && (f.type === 'cavalry' || f.type === 'numidian') && f.y < front - 1) && !has(l, front)) { if (tryPlace('caltrops', l, front) || tryPlace('triarius', l, front)) return }
      for (const l of L) if (G.foes.some(f => f.lane === l && H.FOES[f.type].bow && !H.FOES[f.type].bow.sling) && !G.units.some(u => u.lane === l && u.type === 'shed')) { if (tryPlace('shed', l, front)) return }
      for (const l of L) if (shooters(l) && (foesIn(l).length > 1 || foesIn(l).some(f => f.max > 300)) && !has(l, front)) {
        if (G.foes.some(f => f.lane === l && f.type === 'pikeman') && (tryPlace('maniple', l + 1, front) || tryPlace('maniple', l - 1, front))) return
        if (tryPlace('triarius', l, front) || (G.rations >= 200 && (tryPlace('princeps', l, front) || tryPlace('maniple', l, front)))) return
      }
      if (carts < 3) { for (const l of [L[0], L[1], L[2]]) if (tryPlace('cart', l, R - 1)) return }
      for (const l of L) if (!shooters(l)) { if (tryPlace('slinger', l, back)) return }
      if (carts < 5 && strategy !== 'casual') { for (const l of L) if (tryPlace('cart', l, R - 1)) return }
      if (strategy !== 'casual' && G.rations >= 250) {
        if (can('scorpio')) for (const l of L.slice(0, 2)) if (!G.units.some(u => u.lane === l && u.type === 'scorpio') && tryPlace('scorpio', l, back - 1)) return
        for (const l of L) if (shooters(l) < 2) { if (tryPlace(can('rorarii') && l > 0 && l < C - 1 ? 'rorarii' : 'slinger', l, back - 1)) return }
      }
      if (strategy === 'full') {
        for (const l of L) if (shooters(l) < 3 && tryPlace('slinger', l, back - 2)) return
        if (can('maniple')) for (const l of [1, C - 2]) if (tryPlace('maniple', l, front)) return
        for (const l of L) if (G.t > 120 && tryPlace(can('princeps') ? 'princeps' : 'triarius', l, front)) return
      }
    }, 50)
  }, [level, strategy, score])
  const t0 = Date.now(); let st
  while (Date.now() - t0 < 200000) {
    const ev = await page.evaluate(() => { const G = window.__hold.G; G.__seen ??= {}; const out = []; G.equites.forEach((e, l) => { if (e.state === 'charge' && !G.__seen[l + ':' + G.charges]) { G.__seen[l + ':' + G.charges] = 1; out.push(`t=${Math.round(G.t)} lane ${l} broke: units ${G.units.filter(u => u.lane === l).map(u => u.type + '@' + u.row + ':' + Math.round(u.hp)).join(' ') || 'none'} | foes ${G.foes.filter(f => f.lane === l).map(f => f.type + '@' + f.y.toFixed(1)).join(' ')} | rations ${G.rations} units ${G.units.length}`) } }); if (G.phase === 'lost') out.push(`LOST t=${Math.round(G.t)}: foes ${G.foes.filter(f => f.y > (G.equites.length ? 6.5 : 5)).map(f => f.type + '@' + f.lane + ',' + f.y.toFixed(1)).join(' ')}`); return out })
    if (process.env.VERBOSE) ev.forEach(e => console.log('     ', e))
    st = await page.evaluate(() => { const G = window.__hold.G; return { phase: G.phase, t: Math.round(G.t), killed: G.killed, total: G.total, spawned: G.spawned, charges: G.charges, lostEq: G.equites.filter(e => e.state !== 'ready').length } })
    if (st.phase !== 'play') break
    await page.waitForTimeout(250)
  }
  console.log(`L${level + 1}`, strategy.padEnd(7), score + '%', st.phase.padEnd(5), `t=${st.t}`, `killed ${st.killed}/${st.total}`, `charges ${st.charges}`)
}
for (const [lvl, strat, score] of JSON.parse(process.env.PLAN)) await run(lvl, strat, score)
console.log('errors:', [...new Set(errors)]); await browser.close()
