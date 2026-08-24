import { mkdir, writeFile } from 'node:fs/promises'

const CONFIG = {
  simulations: 10000,
  rounds: 100,
  attackPower: { min: 1, max: 80 },
  defensePower: { min: 1, max: 80 },
  accuracyRate: { min: 50, max: 100 },
  evasionRate: { min: 0, max: 50 },
  criticalRate: { min: 0, max: 40 },
  health: { min: 10, max: 150 },
}

const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length
const percentile = (values, ratio) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))]
}

function simulateBattle() {
  const player = {
    health: 80,
    maxHealth: 80,
    attackPower: 25,
    defensePower: 18,
    accuracyRate: 88,
    evasionRate: 18,
    criticalRate: 12,
  }
  const creature = {
    health: 100,
    maxHealth: 100,
    attackPower: 22,
    defensePower: 16,
    accuracyRate: 82,
    evasionRate: 12,
    criticalRate: 8,
  }

  let playerHealth = player.health
  let creatureHealth = creature.health
  let playerHits = 0
  let playerCriticals = 0
  let playerDamage = 0
  let rounds = 0

  while (playerHealth > 0 && creatureHealth > 0 && rounds < CONFIG.rounds) {
    rounds += 1

    const playerHitRate = Math.min(100, Math.max(0, player.accuracyRate - creature.evasionRate))
    if (Math.random() * 100 < playerHitRate) {
      playerHits += 1
      const critical = Math.random() * 100 < player.criticalRate
      const rawDamage = Math.max(1, player.attackPower - creature.defensePower)
      const damage = critical ? rawDamage * 2 : rawDamage
      playerCriticals += critical ? 1 : 0
      playerDamage += damage
      creatureHealth -= damage
    }

    if (creatureHealth <= 0) break

    const creatureHitRate = Math.min(100, Math.max(0, creature.accuracyRate - player.evasionRate))
    if (Math.random() * 100 < creatureHitRate) {
      const critical = Math.random() * 100 < creature.criticalRate
      const rawDamage = Math.max(1, creature.attackPower - player.defensePower)
      playerHealth -= critical ? rawDamage * 2 : rawDamage
    }
  }

  return {
    winner: creatureHealth <= 0 ? '玩家' : playerHealth <= 0 ? 'Creature' : '平手',
    rounds,
    playerDamage,
    playerHits,
    playerCriticals,
    playerHealthRemaining: Math.max(0, playerHealth),
  }
}

function createReport(results) {
  const playerWins = results.filter((result) => result.winner === '玩家').length
  const creatureWins = results.filter((result) => result.winner === 'Creature').length
  const draws = results.length - playerWins - creatureWins
  const winRate = (playerWins / results.length) * 100
  const hitRates = results.map((result) => result.playerHits / Math.max(1, result.rounds))
  const damageValues = results.map((result) => result.playerDamage)
  const averageRounds = average(results.map((result) => result.rounds))
  const averageDamage = average(damageValues)
  const averageHitRate = average(hitRates) * 100
  const averageCriticals = average(results.map((result) => result.playerCriticals))

  const recommendations = []
  if (winRate > 65) recommendations.push('玩家勝率偏高：提高 Creature 防禦力、血量或攻擊力，或降低玩家攻擊力。')
  if (winRate < 35) recommendations.push('玩家勝率偏低：降低 Creature 防禦力、血量或命中率，或提高玩家攻擊力。')
  if (averageRounds < 3) recommendations.push('戰鬥過短：提高雙方血量，或降低攻擊力與暴擊倍率。')
  if (averageRounds > 12) recommendations.push('戰鬥過長：提高攻擊力、降低防禦力，或降低雙方血量。')
  if (averageHitRate < 60) recommendations.push('玩家命中率偏低：提高玩家命中率或降低 Creature 回避率。')
  if (averageHitRate > 90) recommendations.push('玩家命中率過高：降低命中率或提高 Creature 回避率。')
  if (averageCriticals > averageRounds * 0.25) recommendations.push('暴擊觸發偏頻繁：降低悟性/身法帶來的暴擊率或調低暴擊倍率。')
  if (recommendations.length === 0) recommendations.push('目前指標落在建議範圍內，可進一步測試不同基本屬性組合。')

  return `# 戰鬥平衡分析報告

- 模擬次數：${results.length}
- 玩家勝率：${winRate.toFixed(2)}%
- Creature 勝率：${((creatureWins / results.length) * 100).toFixed(2)}%
- 平手率：${((draws / results.length) * 100).toFixed(2)}%
- 平均回合數：${averageRounds.toFixed(2)}
- 平均玩家總傷害：${averageDamage.toFixed(2)}
- 玩家平均命中率：${averageHitRate.toFixed(2)}%
- 玩家平均暴擊次數：${averageCriticals.toFixed(2)}
- 傷害 P50：${percentile(damageValues, 0.5).toFixed(2)}
- 傷害 P90：${percentile(damageValues, 0.9).toFixed(2)}

## 調整建議

${recommendations.map((recommendation) => `- ${recommendation}`).join('\n')}

## 判讀基準

- 理想玩家勝率：45%～65%
- 理想平均戰鬥長度：3～12 回合
- 命中率過低會讓戰鬥產生挫折感；命中率過高則會降低身法與回避的價值。
- 建議每次只調整一至兩個參數，再重新執行模擬比較結果。
`
}

const results = Array.from({ length: CONFIG.simulations }, simulateBattle)
const report = createReport(results)
await mkdir('reports', { recursive: true })
await writeFile('reports/combat-balance-report.md', report, 'utf8')
console.log(report)
console.log('報告已寫入 reports/combat-balance-report.md')
