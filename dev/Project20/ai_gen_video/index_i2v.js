const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

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

function createPNG(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  function makeChunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const typeB = Buffer.from(type)
    const crcData = Buffer.concat([typeB, data])
    let crc = 0xffffffff
    for (const byte of crcData) {
      crc ^= byte
      for (let i = 0; i < 8; i++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
      }
    }
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE((crc ^ 0xffffffff) >>> 0)
    return Buffer.concat([len, typeB, data, crcBuf])
  }

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8  // bit depth
  ihdrData[9] = 2  // color type: RGB
  ihdrData[10] = 0 // compression
  ihdrData[11] = 0 // filter
  ihdrData[12] = 0 // interlace

  const raw = []
  for (let y = 0; y < height; y++) {
    raw.push(0) // filter: none
    for (let x = 0; x < width; x++) {
      const ratio = x / width
      raw.push(
        Math.round(r * (1 - ratio) + 30 * ratio),
        Math.round(g * (1 - ratio) + 30 * ratio),
        Math.round(b * (1 - ratio) + 30 * ratio)
      )
    }
  }
  const rawData = Buffer.from(raw)
  const compressed = zlib.deflateSync(rawData)

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ])
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
  try { json = JSON.parse(text) } catch { json = text }
  if (!res.ok) throw new Error(`POST ${url} -> ${res.status}: ${JSON.stringify(json)}`)
  return json
}

async function getJSON(url) {
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}: ${text}`)
  return JSON.parse(text)
}

async function uploadImage(server, filename, buf) {
  const form = new FormData()
  form.append('image', new Blob([buf], { type: 'image/png' }), filename)
  form.append('overwrite', 'true')
  const res = await fetch(`${server}/upload/image`, { method: 'POST', body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(`upload failed: ${res.status} ${JSON.stringify(json)}`)
  return json
}

async function download(server, outDir, item) {
  const params = new URLSearchParams({
    filename: item.filename,
    type: item.type || 'output',
    subfolder: item.subfolder || ''
  })
  const res = await fetch(`${server}/view?${params.toString()}`)
  if (!res.ok) throw new Error(`download failed ${item.filename}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const destDir = path.join(outDir, item.subfolder || '')
  fs.mkdirSync(destDir, { recursive: true })
  const dest = path.join(destDir, path.basename(item.filename))
  fs.writeFileSync(dest, buf)
  return dest
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

  // --- Generate and upload test images if --first and --last not provided ---
  let firstFile = args.first
  let lastFile = args.last

  if (!firstFile || !lastFile) {
    console.log('[client] no --first/--last provided, generating test gradient images...')
    const firstPNG = createPNG(1024, 1024, 40, 80, 180)   // blue gradient
    const lastPNG  = createPNG(1024, 1024, 180, 50, 50)    // red gradient

    const firstName = `test_first_${Date.now()}.png`
    const lastName  = `test_last_${Date.now()}.png`

    console.log(`[client] uploading ${firstName} (1024x1024, blue gradient)...`)
    await uploadImage(server, firstName, firstPNG)
    console.log(`[client] uploading ${lastName} (1024x1024, red gradient)...`)
    await uploadImage(server, lastName, lastPNG)

    firstFile = firstName
    lastFile = lastName
  }

  // Upload any local files to the server's input folder
  async function resolve(file, label) {
    if (fs.existsSync(file)) {
      const name = path.basename(file)
      console.log(`[client] uploading local ${label} image ${file} -> input/${name}`)
      await uploadImage(server, name, fs.readFileSync(file))
      return name
    }
    return file
  }
  firstFile = await resolve(firstFile, 'first')
  lastFile  = await resolve(lastFile, 'last')

  // Point the embedded LoadImage nodes (workflow) at the chosen images
  workflow.load_first.inputs.image = firstFile
  workflow.load_last.inputs.image  = lastFile

  console.log(`[client] server   : ${server}`)
  console.log(`[client] workflow : ${workflowFile}`)
  console.log(`[client] duration : ${duration}s`)
  console.log(`[client] first    : ${firstFile}`)
  console.log(`[client] last     : ${lastFile}`)
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
    if (history[promptId]) { entry = history[promptId]; break }
    await sleep(poll)
  }

  if (!entry) throw new Error(`timeout after ${timeout}ms waiting for ${promptId}`)

  const status = entry.status || {}
  if (status.status_str === 'error' || status.completed === false) {
    console.error('[client] execution failed:')
    for (const m of status.messages || []) console.error('  ', JSON.stringify(m))
    process.exitCode = 1
    return
  }

  const files = []
  for (const nodeOutput of Object.values(entry.outputs || {})) {
    for (const value of Object.values(nodeOutput)) {
      if (!Array.isArray(value)) continue
      for (const item of value) {
        if (item && typeof item === 'object' && item.filename) {
          files.push(await download(server, outDir, item))
        }
      }
    }
  }

  console.log(`[client] done. outputs:`)
  for (const f of files) console.log(`  - ${f}`)
  console.log(`[result] ${JSON.stringify(files)}`)
}

main().catch((err) => {
  console.error('[client] error:', err.message)
  process.exitCode = 1
})
