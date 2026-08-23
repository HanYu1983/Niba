/**
 * 官方劇本章節導出工具：將 campaignScenarioCatalog 的章節導出為
 * public/data/scenarios/*.json，並驗證 round-trip 一致。
 *
 * 用法（Docker 內）：
 *   docker compose run --rm node node --experimental-strip-types scripts/exportOfficialScenario.mts [scenarioId ...]
 * 未指定 id 時導出全部章節。
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { campaignScenarioCatalog } from '../src/game/catalogs/campaignScenarioCatalog.ts'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(scriptDir, '../public/data/scenarios')

const args = process.argv.slice(2)
const ids = args.length > 0 ? args : Object.keys(campaignScenarioCatalog)

let failed = false
for (const id of ids) {
  const scenario = campaignScenarioCatalog[id]
  if (!scenario) {
    console.error(`[FAIL] 找不到章節：${id}`)
    failed = true
    continue
  }
  const outPath = resolve(outDir, `${id}.json`)
  writeFileSync(outPath, `${JSON.stringify(scenario, null, 2)}\n`, 'utf8')
  // Round-trip 驗證：讀回並深度比對。
  const parsed = JSON.parse(readFileSync(outPath, 'utf8'))
  const identical = JSON.stringify(parsed) === JSON.stringify(scenario)
  if (!identical) {
    console.error(`[FAIL] round-trip 不一致：${outPath}`)
    failed = true
    continue
  }
  console.log(`[OK] ${id} → public/data/scenarios/${id}.json (v${scenario.version}, entities=${scenario.entities.length})`)
}

if (failed) process.exit(1)
