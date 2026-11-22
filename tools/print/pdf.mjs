// Prints an HTML file to an A4 PDF with headless Chrome: SRC=page.html OUT=file.pdf node pdf.mjs
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
await page.goto('file://' + process.env.SRC)
await page.pdf({ path: process.env.OUT, format: 'A4', printBackground: true, preferCSSPageSize: true })
await browser.close()
