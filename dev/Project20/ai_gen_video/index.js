const fs = require('fs')
const path = require('path')

const DEFAULTS = {
  server: process.env.COMFY_SERVER || 'http://192.168.0.193:8000',
  workflow: path.join(__dirname, 'video_minimax_h3_t2v.json'),
  duration: 5,
  out: path.join(__dirname, 'output'),
  timeout: 30 * 60 * 1000,
  poll: 3000
}

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const item = argv[i]
    if (!item.startsWith('--')) continue
    const eq = item.indexOf('=')
    if (eq !== -1) {
      args[item.slice(2, eq)] = item.slice(eq + 1)
    } else {
      const next = argv[i + 1]
      args[item.slice(2)] = next && !next.startsWith('--') ? next : true
    }
  }
  return args
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = text
  }
  if (!res.ok) {
    throw new Error(`POST ${url} -> ${res.status}: ${JSON.stringify(json)}`)
  }
  return json
}

async function getJSON(url) {
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}: ${text}`)
  return JSON.parse(text)
}

async function download(base, baseUrl, item, outDir) {
  const params = new URLSearchParams({
    filename: item.filename,
    type: item.type || 'output',
    subfolder: item.subfolder || ''
  })
  const res = await fetch(`${base}/view?${params.toString()}`)
  if (!res.ok) throw new Error(`download failed ${item.filename}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const destDir = path.join(outDir, item.subfolder || '')
  fs.mkdirSync(destDir, { recursive: true })
  const dest = path.join(destDir, path.basename(item.filename))
  fs.writeFileSync(dest, buf)
  return path.relative(baseUrl, dest)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const server = String(args.server || DEFAULTS.server).replace(/\/$/, '')
  const workflowFile = String(args.workflow || DEFAULTS.workflow)
  const outDir = String(args.out || DEFAULTS.out)
  const duration = Number(args.duration || DEFAULTS.duration)
  const timeout = Number(args.timeout || DEFAULTS.timeout)
  const poll = Number(args.poll || DEFAULTS.poll)

  const workflow = JSON.parse(fs.readFileSync(workflowFile, 'utf8'))

  workflow['140:133'].inputs.value = duration

  if (args.seed !== undefined) {
    workflow['140:129'].inputs.noise_seed = Number(args.seed)
  }

  let prompt = args.prompt
  if (args['prompt-file']) {
    prompt = fs.readFileSync(String(args['prompt-file']), 'utf8')
  }
  if (prompt) {
    workflow['140:131'].inputs.prompt = String(prompt)
  }

  // Strip the i2v-only input nodes so pure text-to-video still validates
  delete workflow.load_first
  delete workflow.load_last
  delete workflow.scale_first
  delete workflow.scale_last
  delete workflow['140:131'].inputs.first_frame
  delete workflow['140:131'].inputs.last_frame

  const frames = workflow['140:132'].inputs.expression
  console.log(`[client] server   : ${server}`)
  console.log(`[client] workflow : ${workflowFile}`)
  console.log(`[client] duration : ${duration}s (frames via: ${frames})`)
  console.log(`[client] seed     : ${workflow['140:129'].inputs.noise_seed}`)

  const clientId = `comfy-client-${Date.now()}`
  const submitted = await postJSON(`${server}/prompt`, {
    prompt: workflow,
    client_id: clientId
  })
  const promptId = submitted.prompt_id
  console.log(`[client] queued   : ${promptId}`)

  const deadline = Date.now() + timeout
  let entry = null
  while (Date.now() < deadline) {
    const history = await getJSON(`${server}/api/history/${promptId}`)
    if (history[promptId]) {
      entry = history[promptId]
      break
    }
    await sleep(poll)
  }

  if (!entry) {
    throw new Error(`timeout after ${timeout}ms waiting for ${promptId}`)
  }

  const status = entry.status || {}
  if (status.status_str === 'error' || status.completed === false) {
    console.error('[client] execution failed:')
    for (const m of status.messages || []) {
      console.error('  ', JSON.stringify(m))
    }
    process.exitCode = 1
    return
  }

  const files = []
  for (const nodeOutput of Object.values(entry.outputs || {})) {
    for (const value of Object.values(nodeOutput)) {
      if (!Array.isArray(value)) continue
      for (const item of value) {
        if (item && typeof item === 'object' && item.filename) {
          files.push(await download(server, outDir, item, outDir))
        }
      }
    }
  }

  console.log(`[client] done. outputs saved under ${outDir}:`)
  for (const f of files) console.log(`  - ${f}`)
  if (files.length === 0) console.log('  (no downloadable outputs found)')
}

main().catch((err) => {
  console.error('[client] error:', err.message)
  process.exitCode = 1
})
