// Loads one generated chapter into a running Ave Caesar backend through the admin API:
// section -> topic -> chapter (reading card as its text) -> questions -> batches.
//
//   node load.mjs --chapter kingdom --section "Ancient Rome" --topic "The Roman Kingdom"
//
// Env: API_URL (default http://localhost:8081), ADMIN_EMAIL, ADMIN_PASSWORD.
// Existing sections/topics are reused by title; the chapter must not exist yet.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CONFIG = JSON.parse(fs.readFileSync(path.join(HERE, 'chapters.json'), 'utf8'))
const API = (process.env.API_URL ?? 'http://localhost:8081') + '/api'

const arg = name => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : null }
const chapterId = arg('chapter'), sectionTitle = arg('section'), topicTitle = arg('topic')
if (!chapterId || !sectionTitle || !topicTitle) throw new Error('Usage: node load.mjs --chapter <id> --section "<title>" --topic "<title>"')
const chapter = CONFIG.chapters.find(c => c.id === chapterId)
if (!chapter) throw new Error(`No chapter "${chapterId}" in chapters.json`)
const dir = path.resolve(HERE, CONFIG.outputRoot, chapter.folder)

let token
async function api(method, url, body) {
  const res = await fetch(API + url, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${await res.text()}`)
  return res.status === 204 ? null : res.json()
}

token = (await api('POST', '/auth/login', { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })).token

const section = (await api('GET', '/sections')).find(s => s.title === sectionTitle)
  ?? await api('POST', '/sections', { title: sectionTitle, description: 'Ancient history', discipline: 'history' })
const topic = (await api('GET', `/sections/${section.id}/topics`)).find(t => t.title === topicTitle)
  ?? await api('POST', `/sections/${section.id}/topics`, { title: topicTitle, description: chapter.period })
if ((await api('GET', `/topics/${topic.id}/chapters`)).some(c => c.title === chapter.chapterName)) {
  throw new Error(`Chapter "${chapter.chapterName}" already exists in topic "${topicTitle}"`)
}

const chapterText = fs.readFileSync(path.join(dir, 'chapter.md'), 'utf8').replace(/^# .*\n+/, '')
const ch = await api('POST', `/topics/${topic.id}/chapters`, { title: chapter.chapterName, content: chapterText })
console.log(`chapter ${ch.id}: ${chapter.chapterName}`)

// The app orders a chapter's batches by batchOrder alone, so number them across the
// chapter: all easy batches first, then medium, then hard.
const batches = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
  .map(file => ({ file, ...JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) }))
  .sort((a, b) => a.difficulty - b.difficulty || a.batchOrder - b.batchOrder)
for (const [i, { file, ...batch }] of batches.entries()) {
  batch.batchOrder = i + 1
  const before = new Set((await api('GET', `/chapters/${ch.id}/questions`)).map(q => q.id))
  await api('POST', '/questions/bulk-import', { chapterId: ch.id, questions: batch.questions })
  const newIds = (await api('GET', `/chapters/${ch.id}/questions`)).map(q => q.id).filter(id => !before.has(id))
  const created = await api('POST', '/batches', {
    chapterId: ch.id, difficulty: batch.difficulty, batchOrder: batch.batchOrder, description: batch.batchName,
  })
  await api('POST', `/batches/${created.id}/questions`, { questionIds: newIds })
  console.log(`  ${file}: ${newIds.length} questions -> batch ${created.id}`)
}
