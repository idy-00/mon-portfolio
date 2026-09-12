import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGS_DIR = path.join(__dirname, '..', 'logs')

if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true })

function timestamp() {
  return new Date().toISOString()
}

function write(file, level, msg) {
  const line = `[${timestamp()}] [${level}] ${msg}\n`
  fs.appendFileSync(path.join(LOGS_DIR, file), line)
  const colors = { INFO: '\x1b[36m', OK: '\x1b[32m', WARN: '\x1b[33m', ERROR: '\x1b[31m', RESET: '\x1b[0m' }
  const c = colors[level] || ''
  console.log(`${c}[${level}]\x1b[0m ${msg}`)
}

export const log = {
  info:  (msg) => write('analysis.log',   'INFO',  msg),
  ok:    (msg) => write('analysis.log',   'OK',    msg),
  warn:  (msg) => write('analysis.log',   'WARN',  msg),
  error: (msg) => write('errors.log',     'ERROR', msg),
  shot:  (msg) => write('screenshot.log', 'INFO',  msg),
  shotOk:(msg) => write('screenshot.log', 'OK',    msg),
  shotErr:(msg)=> write('screenshot.log', 'ERROR', msg),
}
