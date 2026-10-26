// Builds the standalone page (index.html) from shell.html, game.css and game.js.
//   node build.mjs
// The Ave Caesar prototype (../age-of-kings/build.mjs) embeds the same game.css and game.js.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const read = f => fs.readFileSync(path.join(HERE, f), 'utf8')
const css = JSON.stringify(read('game.css')).replace(/</g, '\\u003c')
const html = read('shell.html').replace('__HTL_CSS__', () => css).replace('__HTL_JS__', () => read('game.js'))
fs.writeFileSync(path.join(HERE, 'index.html'), html)
console.log(`index.html: ${Math.round(html.length / 1024)} KB`)
