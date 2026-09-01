# AI 玩家簡單關卡通關改進文件

- 日期：2026-09-02
- 目標：讓 AI 玩家通過「簡單難度」測試案例（[aiBeginnerSandboxVictory.test.ts](../../src/game/aiBeginnerSandboxVictory.test.ts) 第二個 case）。
- 依據：
  - [ai-beginner-sandbox-test-report-2026-09-02.md](ai-beginner-sandbox-test-report-2026-09-02.md)（含 §4.5 聚合統計）
  - [ai-beginner-sandbox-simple-trace-2026-09-02.md](ai-beginner-sandbox-simple-trace-2026-09-02.md)（逐回合 trace）
  - 對應代碼逐點核對結果（見 §2）

## 1. 簡單關卡現況（量化）

| 指標 | 數值 | 說明 |
| --- | --- | --- |
| AI 回合數 | 200 | 上限耗盡 |
| 剩餘巢穴 | 1（血量 120→78） | 有進展但未摧毀 |
| Action 分佈 | `move=150, attack=95, end-turn=58, hold=34, allocate-attribute=2` | 有行動但效率低 |
| 擊殺生物 | **0**（生成 6 隻） | 攻擊 95 次全無擊殺 |
| 升級 | 1 次（Lv.2） | 經驗成長極慢 |
| 內功 | 吐納功 lv.1，damage 5 | 全程未換功法 |
| 門派使用 | `learn-skill=0, practice-skill=0` | 門派就在起點旁，從未使用 |

**核心矛盾**：AI 有 95 次攻擊卻 0 擊殺、200 回合只把 120 血巢穴打到 78。攻擊力（damage 5）與攻擊頻率不足以在回合上限內摧毀巢穴。

## 2. 根因 → 代碼定位

### 根因 A：門派學習 goal 從未觸發（最關鍵）

代碼：[goals.ts](../../src/game/ai/fuzzy/goals.ts) `evaluateLearnMartialSkill`（約 L820）

```ts
if (learnableSkillAtGate && feasibility.canReachNearestGate && feasibility.canAffordGateLearn && staminaRatio > 0.3) {
  const result: GoalResult = { score: 0.7, ... }
```

問題鏈：

1. 分數固定 `0.7`，低於 `attackNest` 滿分 1.0 與 `selfPreservation` 緊急分 0.8。
2. `staminaRatio > 0.3` 門檻：AI 常在體力低於 30% 時才考慮學習，但此時又會被自保/休息壓過。
3. **`learnableSkillAtGate` 依賴悟性檢查**（[fuzzyInputs.ts](../../src/game/ai/fuzzy/fuzzyInputs.ts) `findLearnableSkillAtGate`）：

```ts
const unlearned = all.find((s) => {
  if ('insightRequirement' in s) return !player.innerSkillIds.includes(s.id)
  return !player.externalSkillIds.includes(s.id)
})
```

此函式**沒有檢查 `insightRequirement`**（對照 `findLearnableSkillAtHall` 有檢查），因此可能選到悟性不足的功法，導致 mapper 產生的 `learn-skill` action 被 `validateAiAction` 或執行層拒絕，goal 回傳 `{ score: 0 }`，從此該 goal 永遠拿不到分。

**修法**：`findLearnableSkillAtGate` 補上悟性過濾：

```ts
const unlearned = all.find((s) => {
  if ('insightRequirement' in s) {
    return !player.innerSkillIds.includes(s.id) && (player.attributes?.insight ?? 0) >= s.insightRequirement
  }
  return !player.externalSkillIds.includes(s.id)
})
```

### 根因 B：`attackNest` 分數被 `f_noCreatures` 硬歸零

代碼：[goals.ts](../../src/game/ai/fuzzy/goals.ts) `evaluateAttackNest`（約 L748）

```ts
const f_noCreatures = localThreatCount === 0 ? 1 : 0
const score = fuzzyAnd(f_safeHealth, fuzzyAnd(f_noCreatures, f_nestClose))
```

`fuzzyAnd` 任一為 0 則整體為 0。巢穴周圍兩格內有任一可見生物 → `attackNest` 直接 0 分。簡單案例巢穴會生成怪物（trace 顯示生成 6 隻），AI 打不死它們（0 擊殺），於是 `attackNest` 長期為 0，AI 只能靠 `engageCombat` 零散攻擊。

**修法**：把「巢穴旁有怪」從「禁止攻擊巢穴」改為「先清怪」的階段任務（見 §3 P0-2）。

### 根因 C：攻擊 95 次卻 0 擊殺 — `engageCombat` 缺乏擊殺可行性評估

代碼：[fuzzyInputs.ts](../../src/game/ai/fuzzy/fuzzyInputs.ts) L470–545 `combatCandidates` 與 [goals.ts](../../src/game/ai/fuzzy/goals.ts) `evaluateEngageCombat`

`combatCandidates` 的 `hitsSurvivable` 用「玩家血量 / 怪物 30% 血量」估算，但**沒有評估「我方需要幾次攻擊才能殺死對方」**。AI 對 Lv.3+ 巢穴怪（39–48 血）用 damage 5 攻擊，需要 8–10 次才能擊殺，期間怪物每回合反擊，AI 血量先耗盡而撤退，永遠無法完成擊殺。

**修法**：`combatCandidates` 加入 `hitsToKill = ceil(creature.health / myDamage)`，當 `hitsToKill` 超過「我方可承受的反擊回合數」時大幅降分，避免 AI 把回合浪費在打不死的目標上。

### 根因 D：升級點分配幾乎不增加攻擊力

代碼：[goals.ts](../../src/game/ai/fuzzy/goals.ts) `evaluateAllocateAttributes`（約 L285）

```ts
const attribute = healthRatio < 0.5 ? 'constitution' : (Math.random() < 0.7 ? 'constitution' : 'armStrength')
```

70% 機率投根骨（增血）、30% 投臂力。trace 顯示 200 回合只執行 2 次 `allocate-attribute`（因為 `availableAttributePoints` 長期為 0——升級太慢），且即便執行也多數投根骨，內功傷害全程停在 5。

**修法**：當存在巢穴攻略任務時，屬性分配應優先 `armStrength`/`innerEnergy`（直接提升 `getSkillDamage`），而非隨機根骨。

### 根因 E：巢穴回血抵銷傷害（完整案例主因，簡單案例次要）

代碼：[creatureActions.ts](../../src/game/actions/creatureActions.ts) L111

```ts
const regenHealth = Math.min(nest.maxHealth, nest.health + nest.maxHealth * healthRegenPercent)
```

巢穴每回合回 1% maxHealth（簡單案例測試已設 `nestHealthRegenPercent: 0`，故簡單案例不受此影響；但完整案例 120→184 證實回血+升級成長遠超 AI 傷害）。簡單案例的真正瓶頸是 A/B/C/D。

## 3. 改進方案（依優先序）

### P0-1：修正 `findLearnableSkillAtGate` 悟性過濾（根因 A）

- 檔案：[fuzzyInputs.ts](../../src/game/ai/fuzzy/fuzzyInputs.ts)
- 對照 `findLearnableSkillAtHall` 的寫法補上 `insightRequirement` 檢查。
- 驗收：簡單案例 trace 中 `learn-skill` ≥ 1 次，且玩家 `innerSkillIds` 增加。

### P0-2：巢穴攻略改為階段式任務（根因 B）

- 檔案：[goals.ts](../../src/game/ai/fuzzy/goals.ts) `evaluateAttackNest`、[goalActionMapper.ts](../../src/game/ai/fuzzy/goalActionMapper.ts) `buildAttackNestActions`
- 行為：
  1. 巢穴兩格內有可見生物 → goal 仍保持高分，但 action 改為「攻擊該生物」（清怪階段）。
  2. 清完後 → 恢復攻擊巢穴。
- 驗收：巢穴血量在 AI 抵達後單調下降至 0。

### P0-3：`engageCombat` 加入擊殺可行性（根因 C）

- 檔案：[fuzzyInputs.ts](../../src/game/ai/fuzzy/fuzzyInputs.ts) `combatCandidates`、[goals.ts](../../src/game/ai/fuzzy/goals.ts) `evaluateEngageCombat`
- `hitsToKill = ceil(creature.health / myDamage)`；若 `hitsToKill * enemyDamage > player.health` 則該候選分數乘以 0.2 以下。
- 驗收：簡單案例「擊殺生物（總）」> 0。

### P1-1：攻略期間屬性分配導向攻擊（根因 D）

- 檔案：[goals.ts](../../src/game/ai/fuzzy/goals.ts) `evaluateAllocateAttributes`
- 有存活巢穴時：`armStrength` 50%、`innerEnergy` 30%、`constitution` 20%。
- 驗收：最終 `innerSkill.damage` ≥ 8。

### P1-2：提高 `learnMartialSkill` / `practiceSkill` 在攻略前的優先級

- 檔案：[goals.ts](../../src/game/ai/fuzzy/goals.ts)、[personality.ts](../../src/game/ai/fuzzy/personality.ts)
- 當「玩家未學會任何門派功法 且 門派可達且可負擔」時，`learnMartialSkill` 分數提升至 0.85（高於 `attackNest` 的條件分），確保 AI 先取得更強內功再攻略。
- 驗收：`learn-skill` 在前 30 回合內發生。

### P2：驗證與量測強化

- 在 [aiBeginnerSandboxVictory.test.ts](../../src/game/aiBeginnerSandboxVictory.test.ts) 聚合區塊追加：
  - `learn-skill` / `practice-skill` 次數
  - 巢穴血量淨變化（起→終）
  - 擊殺率（擊殺數 / 攻擊數）
- 每次改動後重跑測試，trace 報告即為改進依據。

## 4. 預期結果

依序完成 P0-1 → P0-2 → P0-3 後，簡單案例的預期行為：

1. AI 在起點旁門派學到第一個門派內功（取代 damage 5 的吐納功）。
2. 巢穴旁生成的怪物被「清怪階段」優先處理，且只攻擊打得死的目標。
3. 巢穴血量在無回血設定下被持續磨到 0，`gameWon` 成立。

若 P0 全部完成仍未通關，下一步依據 trace 聚合數據檢查 P1 項目（屬性投資方向與功法等級成長）。
