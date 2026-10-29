// Scripted players for any battle: they pick units by role (grain, shooter, blocker, fighter, trap), not by name.
// strategy: full (strong), normal (average), casual. PLAN='[["actium","normal",80], ...]' (battle id or index)
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })).newPage()
const errors = []; page.on('pageerror', e => errors.push(e.message))
await page.goto('file://' + process.env.PAGE); await page.waitForTimeout(600)
async function run(level, strategy, score) {
  const name = await page.evaluate(([level, strategy, score]) => {
    const H = window.__hold, idx = typeof level === 'number' ? level : H.LEVELS.findIndex(L => L.id === level)
    H.startLevel(idx, score)
    const G0 = H.G, LV = H.LEVELS[idx], C = G0.equites.length, R = LV.rows ?? 7, U = H.UNITS
    const L = [...Array(C).keys()].sort((a, b) => Math.abs(a - (C - 1) / 2) - Math.abs(b - (C - 1) / 2))
    const has = t => LV.units.includes(t)
    const role = {
      grain: LV.units.find(t => U[t].grain),
      shooter: LV.units.find(t => U[t].reload && U[t].range >= 99 && !U[t].pierce && !U[t].grapple && !U[t].spread) ?? LV.units.find(t => t === 'velites'),
      cheap: LV.units.find(t => t === 'velites'),
      pierce: LV.units.find(t => U[t].pierce), spread: LV.units.find(t => U[t].spread), hook: LV.units.find(t => U[t].grapple),
      blocker: LV.units.find(t => U[t].hp >= 1500 && !U[t].melee),
      shield: LV.units.find(t => U[t].arrowMul),
      fighter: LV.units.find(t => t === 'legionary') ?? LV.units.find(t => t === 'princeps') ?? LV.units.find(t => t === 'rammer') ?? LV.units.find(t => t === 'maniple'),
      anticav: LV.units.find(t => U[t].antiCav), flank: LV.units.find(t => U[t].flank), aura: LV.units.find(t => U[t].aura),
      trap: LV.units.find(t => U[t].trap), pit: LV.units.find(t => U[t].pit), horn: LV.units.find(t => U[t].horn), torch: LV.units.find(t => t === 'torch'),
    }
    for (const [t, n] of Object.entries(G0.vets)) for (let k = 0; k < n; k++) {
      const rows = t === 'slinger' ? [R - 2, R - 3] : [R - 4, R - 3]
      outer: for (const r of rows) for (const l of L) if (H.place(t, l, r)) break outer
    }
    H.beginBattle(); H.G.speed = 6
    clearInterval(window.__bot)
    window.__bot = setInterval(() => {
      const G = H.G; if (G.phase !== 'play') return
      for (const d of [...G.drops]) if (!d.falling && (strategy !== 'casual' || d.life < 6)) H.collect(d)
      const at = (l, r) => G.units.some(u => u.lane === l && u.row === r)
      const put = (t, l, r) => t && G.rations >= U[t].cost && G.cool[t] <= 0 && H.place(t, l, r)
      const foes = (l, below) => G.foes.filter(f => f.lane === l && f.hp > 0 && (below ? f.dir < 0 : f.dir > 0))
      const shooters = l => G.units.filter(u => u.lane === l && U[u.type].reload).length
      const front = R - 4, back = R - 2, grains = G.units.filter(u => U[u.type].grain).length
      if (role.torch && G.t > 40 && G.rations >= 200) for (let r = R - 1; r >= 2; r--) for (const l of L) if (put(role.torch, l, r)) return
      for (const l of L) if (G.foes.some(f => f.lane === l && H.FOES[f.type].elephant && !f.fleeing && f.y < front - 0.5)) { if (role.horn && !G.units.some(u => Math.abs(u.lane - l) <= 1 && u.type === role.horn) && (put(role.horn, l, front) || put(role.horn, l, front + 1))) return; if (!at(l, front) && put(role.trap, l, front)) return }
      // enemies from below (two fronts): a blocker at the back
      for (const l of L) if (foes(l, true).length && !at(l, R - 1)) { if (put(role.blocker, l, R - 1) || put(role.fighter, l, R - 1)) return }
      for (const l of L) if (foes(l).length && !shooters(l)) { if (put(role.shooter, l, back) || put(role.cheap, l, back)) return }
      for (const l of L) if (G.foes.some(f => f.lane === l && H.FOES[f.type].mounted && f.y < front - 1) && !at(l, front)) { if (put(role.anticav, l, front) || put(role.trap, l, front) || put(role.blocker, l, front)) return }
      for (const l of L) if (G.foes.some(f => f.lane === l && H.FOES[f.type].bow) && !G.units.some(u => u.lane === l && u.type === role.shield)) { if (put(role.shield, l, front)) return }
      for (const l of L) if (G.foes.some(f => f.lane === l && H.FOES[f.type].ship && f.max > 600) && !G.units.some(u => u.lane === l && u.type === role.hook)) { if (put(role.hook, l, back - 1)) return }
      for (const l of L) if (shooters(l) && (foes(l).length > 1 || foes(l).some(f => f.max > 300)) && !at(l, front)) {
        if (G.foes.some(f => f.lane === l && f.type === 'pikeman') && (put(role.flank, l + 1, front) || put(role.flank, l - 1, front))) return
        if (put(role.blocker, l, front) || (G.rations >= 200 && (put(role.fighter, l, front) || put(role.flank, l, front)))) return
      }
      if (grains < 3) { for (const l of [L[0], L[1], L[2]]) if (put(role.grain, l, R - 1)) return }
      for (const l of L) if (!shooters(l)) { if (put(role.shooter, l, back)) return }
      if (grains < 5 && strategy !== 'casual') { for (const l of L) if (put(role.grain, l, R - 1)) return }
      if (strategy !== 'casual' && G.rations >= 250) {
        if (role.aura && G.units.filter(u => u.type === role.aura).length < 2) for (const l of L.slice(0, 2)) if (put(role.aura, l, back - 1)) return
        if (role.pierce) for (const l of L.slice(0, 2)) if (!G.units.some(u => u.lane === l && u.type === role.pierce) && put(role.pierce, l, back - 1)) return
        if (role.pit) for (const l of L) if (put(role.pit, l, front - 1)) return
        for (const l of L) if (shooters(l) < 2) { if (put(role.spread && l > 0 && l < C - 1 ? role.spread : role.shooter, l, back - 1)) return }
      }
      if (strategy === 'full') {
        for (const l of L) if (shooters(l) < 3 && put(role.shooter, l, back - 2)) return
        if (role.flank) for (const l of [1, C - 2]) if (put(role.flank, l, front)) return
        for (const l of L) if (G.t > 120 && put(role.fighter ?? role.blocker, l, front)) return
      }
    }, 50)
    return LV.name
  }, [level, strategy, score])
  const t0 = Date.now(); let st
  while (Date.now() - t0 < 200000) {
    st = await page.evaluate(() => { const G = window.__hold.G; return { phase: G.phase, t: Math.round(G.t), killed: G.killed, total: G.total, charges: G.charges } })
    if (st.phase !== 'play') break
    await page.waitForTimeout(300)
  }
  console.log(name.padEnd(22), strategy.padEnd(7), score + '%', st.phase.padEnd(5), `t=${st.t}`, `killed ${st.killed}/${st.total}`, `charges ${st.charges}`)
}
for (const [lvl, strat, score] of JSON.parse(process.env.PLAN)) await run(lvl, strat, score)
console.log('errors:', [...new Set(errors)]); await browser.close()
