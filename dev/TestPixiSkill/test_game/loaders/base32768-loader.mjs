
import fs from 'fs'
import mime from 'mime'
import BaseX from './baseX.mjs'

export default function (source) {
  const filepath = this.resourcePath
  const mimeType = mime.getType(filepath) || 'application/octet-stream'
  const buffer = fs.readFileSync(filepath)
  const bytes = new Uint8Array(buffer)
  const payload = BaseX.e32768(bytes)
  return `export default "data:${mimeType};base32768,${payload}"`
};