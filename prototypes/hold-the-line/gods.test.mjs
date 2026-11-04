// Scripted players for the Clash of the Gods: they watch each lane and send the Roman twin of the Greek god coming
// down it. 'normal' always knows the pairs; 'casual' sends the wrong god a quarter of the time, like a player still
// learning them. PLAN='[["normal",80],["casual",80]]' PAGE=/path/to/page node gods.test.mjs
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
const errors = []; page.on('pageerror', e => errors.push(e.message))
await page.goto('file://' + process.env.PAGE); await page.waitForTimeout(600)
async function run(strategy, score) {
  await page.evaluate(([strategy, score]) => {
    const H = window.__hold, idx = H.LEVELS.findIndex(L => L.id === 'gods')
    H.startLevel(idx, score)
    const G0 = H.G, LV = H.LEVELS[idx], C = G0.equites.length, R = LV.rows ?? 7, U = H.UNITS, F = H.FOES
    for (const [t, n] of Object.entries(G0.vets)) for (let k = 0, l = 0; k < n && l < C; l++) if (H.place(t, l, R - 1)) k++
    H.beginBattle(); H.G.speed = 6
    const gods = LV.units.filter(t => !U[t].grain), wrong = {}
    clearInterval(window.__bot)
    window.__bot = setInterval(() => {
      const G = H.G; if (G.phase !== 'play') return
      for (const d of [...G.drops]) if (!d.falling) H.collect(d)
      const put = (t, l) => { if (G.rations < U[t].cost || G.cool[t] > 0) return false; for (const r of [R - 2, R - 3, R - 1, R - 4]) if (H.place(t, l, r)) return true; return false }
      for (const f of G.foes.filter(f => f.hp > 0 && f.dir > 0 && f.y > -0.3).sort((a, b) => b.y - a.y)) {
        let twin = F[f.type].twin
        if (strategy === 'casual') { wrong[f.id ?? f] ??= Math.random() < 0.25 ? gods[Math.floor(Math.random() * gods.length)] : null; if (wrong[f.id ?? f] && f.y < 2.5) twin = wrong[f.id ?? f] }
        if (!G.units.some(u => u.lane === f.lane && u.type === twin) && put(twin, f.lane)) return
      }
      const ceres = G.units.filter(u => U[u.type].grain).length
      if (ceres < 4) for (let l = 0; l < C; l++) if (put('ceres', l)) return
    }, 60)
  }, [strategy, score])
  const t0 = Date.now(); let st
  while (Date.now() - t0 < 200000) {
    st = await page.evaluate(() => { const G = window.__hold.G; return { phase: G.phase, t: Math.round(G.t), killed: G.killed, total: G.total, charges: G.charges } })
    if (st.phase !== 'play') break
    await page.waitForTimeout(300)
  }
  console.log('Clash of the Gods'.padEnd(22), strategy.padEnd(7), score + '%', st.phase.padEnd(5), `t=${st.t}`, `killed ${st.killed}/${st.total}`, `charges ${st.charges}`)
}
for (const [strat, score] of JSON.parse(process.env.PLAN)) await run(strat, score)
console.log('errors:', [...new Set(errors)]); await browser.close()
