# AI 模糊邏輯開發設計文件

- 版本：v1.0
- 日期：2026-09-01
- 狀態：已實作（本文件同時作為現況文件與後續開發藍圖）
- 範圍：`src/game/ai/fuzzy/` 及其上下游（perception → decision → execution）

---

## 1. 架構總覽

### 1.1 設計原則

| 原則 | 說明 |
|---|---|
| 模糊分數 = 偏好 | 分數代表「需求／效用／風險偏好」，不是合法性判斷 |
| 硬規則 = 合法性 | 體力、距離、材料等合法性由 `validateAiAction` 與領域函數強制執行 |
| 候選式決策 | 「多選一」的行為（建造、升級、攻擊目標）必須枚舉所有候選、各自算價值、選最高 |
| 分數必附行動 | `score > 0` 的 `GoalResult` 必須附帶已驗證的 `actions`，否則視為不可執行 |
| 一步一行動 | 每次 scheduler tick 只執行一個 action，下一個由下一個 timer 觸發 |

### 1.2 管線流程

```
computeFuzzyInputs（感知）
    ↓
evaluateAllGoals（17 個目標各自評分）
    ↓
個性約束（allowedGoals / goalWeights / goalThresholds）
    ↓
rankGoals（分數降序 + tie-breaking）
    ↓
門檻過濾（MIN_THRESHOLD = 0.2）
    ↓
選出第一個有可執行 actions 的目標
    ↓
執行第一個 action（350ms 後執行下一個）
```

### 1.3 模組職責

| 模組 | 檔案 | 職責 |
|---|---|---|
| 感知 | `fuzzyInputs.ts` | 從 `GameState` 建構所有模糊輸入變數與候選清單 |
| 隸屬函數 | `membershipFunctions.ts` | `trapezoid`、`fuzzyAnd`、`fuzzyOr` |
| 目標評估 | `goals.ts` | 17 個目標的價值函數，各自產生 `GoalResult` |
| 決策 | `decision.ts` | `MIN_THRESHOLD`、`PRIORITY_ORDER`、`rankGoals` |
| 個性 | `personality.ts` | 5 種個性 profile 的目標權重與門檻 |
| 行動映射 | `goalActionMapper.ts` | `GoalResult` → 已驗證的 `AiAction[]` |
| 執行迴圈 | `aiStepRunner.ts` | `runAiStepLoop`：一步決策 + 一步執行 |
| 排程 | `aiTurnScheduler.ts` | `setTimeout` 節奏、防重入、stale 取消 |

---

## 2. 感知層（FuzzyInputs）

### 2.1 輸入變數清單

| 類別 | 變數 | 型別 | 說明 |
|---|---|---|---|
| 生存 | `hitsSurvivable` | number | health / maxEnemyDamage，無敵人 = 99 |
| 生存 | `healthRatio` | 0~1 | 氣血比 |
| 生存 | `staminaRatio` | 0~1 | 體力比 |
| 生存 | `innerPowerRatio` | 0~1 | 內力比 |
| 威脅 | `distToNearestThreat` | number | 到最近敵對單位距離（Infinity = 無） |
| 威脅 | `maxVisibleEnemyDamage` | number | 視野內最高粗估傷害 |
| 威脅 | `threatCountNearBase` | number | 據點附近（曼哈頓 ≤ 5）威脅數 |
| 戰鬥 | `distToNearestCreature` | number | 到最近可見生物距離 |
| 戰鬥 | `nearestCreatureId` | string | 最近生物 id |
| 戰鬥 | `killableCreature` | boolean | 相鄰 + 扛得住 + 體力夠 |
| 戰鬥 | `combatDamageRatio` | 0~1 | 內功單次傷害 / 最近敵人最大生命 |
| 戰鬥 | `visibleCreatureIds` | string[] | 視野內生物（近到遠） |
| 巢穴 | `distToNearestNest` | number | 到最近巢穴距離 |
| 巢穴 | `nearestNestId` | string | 最近巢穴 id |
| 資源 | `reachableItemCount` | number | 可達道具數 |
| 資源 | `distToNearestItem` | number | 到最近道具距離 |
| 資源 | `reachableInterests` | list | 可達興趣點（道具 + 資源） |
| 資源 | `nearestResourcePoint` | object | 最近資源點 |
| 資源 | `distToNearestResourcePoint` | number | 到最近資源點距離 |
| 資源 | `isAdjacentToResourcePoint` | boolean | 是否與資源點相鄰 |
| 資源 | `materialRatio` | 0~1 | 據點建料比 |
| 建設 | `constructionCandidates` | list | 所有合法建造/升級候選（含 value） |
| 建設 | `buildableDefenseStructure` | object | 可建防禦設施 |
| 建設 | `defenseTowerCount` | number | 現有箭塔數（含進階） |
| 據點 | `nearestBase` | object | 最近 active 據點 |
| 據點 | `visibleBaseIds` | string[] | 視野內據點（近到遠） |
| 據點 | `allBasesVisible` | boolean | 所有據點是否可見 |
| 據點 | `isAdjacentToBase` | boolean | 是否與據點相鄰 |
| 據點 | `needsBaseVision` | boolean | 最近據點尚未完成首次任務（永久視野解鎖） |
| 設施 | `hasMissionBoard` | boolean | 有告示牌 |
| 設施 | `hasInfirmary` | boolean | 有醫療室 |
| 設施 | `hasWorkshopDamaged` | boolean | 有工坊且裝備受損 |
| 探索 | `unexploredReachableCount` | number | 體力內可達未探索格數 |
| 探索 | `nearestUnexploredPosition` | Position | 最近未探索可達格 |
| 探索 | `unexploredInvisibleCells` | number | 不可見且未探索格數 |
| 探索 | `nearestUnexploredInvisiblePosition` | Position | 最近不可見未探索格 |
| 定位 | `exitCount` | 0~4 | 四方向可通行出口數 |
| 定位 | `nearestExit` | Position | 最近出口 |
| 成長 | `availableAttributePoints` | number | 可分配屬性點 |
| 成長 | `playerLevel` / `expectedLevel` | number | 等級 / 預期等級（round / 5） |
| 成長 | `needsLeveling` | boolean | 等級落後 |
| 成長 | `equipableEquipment` | object | 建議裝備（部位空 or 耐久 0） |
| 成長 | `betterInnerSkill` | object | 更強的未裝備內功 |
| 成長 | `hasDamageInnerSkill` | boolean | 已裝備傷害型內功 |
| 成長 | `learnableSkillAtHall` | object | 武館可學技能 |
| 成長 | `learnableSkillAtGate` | object | 門派可學技能 |
| 成長 | `practiceableSkillAtGate` | object | 門派可練技能 |
| 道具 | `bestItemToUse` | object | 建議使用道具 |
| 道具 | `buyableHealItem` | object | 商店可買回血道具 |
| 可行性 | `feasibility` | object | 學費/距離/可達性等「能不能做 + 走多遠」 |

### 2.2 建設候選（ConstructionCandidate）

```ts
type ConstructionCandidate = {
  kind: 'build' | 'upgrade'
  baseId: string
  buildingId: string
  buildingType: string
  buildingName: string
  cost: number
  currentLevel?: number
  nextLevel?: number
    value: number  // 由 constructionValue.ts 依即時狀態與個性計算
}
```

- 建造候選：所有合法模板（未建過同類型 + 門派允許 + allowedBuildings 允許 + rank 夠 + 材料夠）。
- 升級候選：所有可升級既有建築（`canUpgradeBuildingType` + `maxLevel` 未達 + `getBuildingUpgradeResult().ok`）。

---

## 3. 隸屬函數

### 3.1 梯形函數 trapezoid(x, a, b, c, d)

```
x <= a:      0
a < x <= b:  (x - a) / (b - a)
b < x <= c:  1
c < x <= d:  (d - x) / (d - c)
x > d:       0
```

### 3.2 組合運算

| 函數 | 語意 | 實作 |
|---|---|---|
| `fuzzyAnd(...)` | AND | 取最小值 |
| `fuzzyOr(...)` | OR | 取最大值 |

---

## 4. 目標評估（17 個目標）

### 4.1 目標清單與評分公式

| # | 目標 | 觸發條件 | 評分公式（摘要） | 上限 |
|---|---|---|---|---|
| 1 | `selfPreservation` | 有威脅 or 血量低 | `max(retreatScore, healScore, emergencyScore)`；緊急自保（血 < 50% + 威脅相鄰）= 0.8 | 0.95 |
| 2 | `allocateAttributes` | 有可分配點 | 固定 1.0；血低選根骨，正常 70% 根骨 / 30% 臂力 | 1.0 |
| 3 | `equipInnerSkill` | 有更強未裝備內功 | `fuzzyAnd(1, trapezoid(innerPowerRatio, 0.1, 0.2, 1, 1))` | 1.0 |
| 4 | `equipEquipment` | 有可裝備武具 | 固定 1.0 | 1.0 |
| 5 | `learnMartialSkill` | 門派/武館有可學技能 | 門派 0.7 / 武館 0.6（需可達 + 錢夠 + 體力 > 30%） | 0.7 |
| 6 | `practiceSkill` | 門派有可練技能 | `(needsLeveling ? 0.6 : 0.4) × f_stamina` | 0.6 |
| 7 | `useInnerSkillAttack` | — | 目前關閉（score = 0） | 0 |
| 8 | `engageCombat` | 視野內有生物 | 可擊殺：`min(1, combatDamageRatio × 1.5)`；否則 `min(0.85, fuzzyAnd(...))`，等級落後 × 1.5 | 0.85 |
| 9 | `attackNest` | 有巢穴 | `fuzzyAnd(f_safeHealth, fuzzyAnd(f_noCreatures, f_nestClose))` | 1.0 |
| 10 | `positioning` | 出口 < 3 且有威脅 | `exitCount === 0 ? min(1, f_fewExits + f_threatClose × 0.3) : f_fewExits` | 1.0 |
| 11 | `collectItems` | 有可達道具 | `fuzzyOr(fuzzyAnd(f_manyItems, f_staminaHigh), f_hasItems)`；距離 > 5 × 0.7 | 1.0 |
| 12 | `useItem` | 有建議道具 | 回血/回內力：恢復佔比；回體力：0.6；其他：0.4 | 1.0 |
| 13 | `repairEquipment` | 有工坊且裝備受損 | 固定 0.5（體力 ≥ 20%） | 0.5 |
| 14 | `construction` | 有可見據點 + 候選 | 相鄰：`bestCandidate.value`；非相鄰：0.7（移動）；採集：`0.8 × f_materialUrgency` | 0.9 |
| 15 | `buildDefense` | 威脅 + 箭塔不足 | `fuzzyAnd(f_threat, f_material) × 0.7` | 0.7 |
| 16 | `executeMission` | 有告示牌 | 首次任務（解鎖視野）= 0.95；否則 0.35 / 0.2 | 0.95 |
| 17 | `exploration` | 有不可見未探索格 | `min(0.6, unexploredInvisibleCells / 10)`；體力 ≤ 30% × 0.5；全據點可見 = 0.1 | 0.6 |

### 4.2 距離衰減

- 除 `exploration` 外，所有帶 `distanceToTarget` 的目標：`score ×= max(0, 1 - distance × 0.05)`（10 格以上歸零）。

### 4.3 建設候選威脅過濾

- `threatCountNearBase > 0` 時，只保留：升級候選、箭塔、進階箭塔。

---

## 5. 決策層

### 5.1 門檻

| 常數 | 值 | 說明 |
|---|---|---|
| `MIN_THRESHOLD` | 0.2 | 所有目標低於此值 → 原地待命 / 結束回合 |
| `SELF_PRESERVATION_OVERRIDE` | 0.6 | selfPreservation 高於此值時 engageCombat 歸零 |

### 5.2 Tie-breaking 優先序（PRIORITY_ORDER）

```
selfPreservation > allocateAttributes > equipInnerSkill > equipEquipment
> learnMartialSkill > practiceSkill > useInnerSkillAttack > engageCombat
> attackNest > positioning > collectItems > useItem > repairEquipment
> construction > buildDefense > executeMission > exploration
```

### 5.3 選擇流程

1. `rankGoals`：分數降序，同分依 `PRIORITY_ORDER`。
2. 逐一檢查：分數 < 門檻 → break；無 actions 或全 hold → skip。
3. 第一個通過者即選定，記錄 `[AI decision]` 日誌。

---

## 6. 個性約束（Personality）

### 6.1 Profile 定義

| 個性 | 定位 | goalWeights | goalThresholds |
|---|---|---|---|
| `balanced` | 均衡型 | （無） | （無） |
| `aggressive` | 戰鬥偏好型（好戰） | engageCombat × 1.5, attackNest × 1.3, selfPreservation × 0.8 | selfPreservation: 0.15 |
| `cautious` | 謹慎型 | selfPreservation × 1.5, useItem × 1.2, engageCombat × 0.6 | selfPreservation: 0.15 |
| `builder` | 建設偏好型 | construction × 1.5, buildDefense × 1.3, executeMission × 1.2 | — |
| `explorer` | 探索型 | exploration × 1.5, collectItems × 1.2, engageCombat × 0.7 | — |
| `guardian` | 支援輔助玩家型（護衛） | selfPreservation × 1.3, engageCombat × 1.2, positioning × 1.5, construction × 0.7, exploration × 0.5, executeMission × 0.6 | — |
| `economist` | 經營型 | executeMission × 1.5, construction × 1.3, collectItems × 1.2, engageCombat × 0.7, attackNest × 0.6 | — |
| `scholar` | 修煉型 | learnMartialSkill × 1.5, practiceSkill × 1.5, equipInnerSkill × 1.3, equipEquipment × 1.2, engageCombat × 0.8 | — |

#### guardian 特殊行為

- fuzzy 命令下，`runFuzzyStep` 自動尋找最近存活人類玩家並設定 `followTarget`（maxDistance = 3）。
- 距離 > 3 時 positioning 分數升高（`min(1, 0.65 + (distance - 3) × 0.08)`），AI 會主動靠近玩家。
- 複用 support-player 的 followTarget 機制，不重複實作跟隨邏輯。

### 6.2 命令級約束

| 命令 | allowedGoals | 額外約束 |
|---|---|---|
| `protect-base` | 防守專用（非 fuzzy 管線） | — |
| `support-player` | `selfPreservation`, `engageCombat`, `positioning` | `followTarget`（距離 > maxDistance 時 positioning 高分）；`forcedCombatTarget`（僅距離 ≤ 1 的相鄰威脅） |
| `fuzzy` | 全部 17 個 | 依 `order.personality` 套用 profile |

---

## 7. 行動映射（goalActionMapper）

### 7.1 契約

- 每個 `GoalResult`（score > 0）經 `buildValidatedActionSequence` 產生已驗證的 `AiAction[]`。
- 驗證失敗 → 回傳空陣列 → 該目標視為不可執行（score 歸零）。
- 移動目的地由 `findClosestReachablePosition`（Dijkstra 反向最短路徑樹）決定。

### 7.2 建設目標映射

| 情境 | context.action | target.kind | 產生行動 |
|---|---|---|---|
| 相鄰 + 建造 | `build` | `build` | `type: 'build'` |
| 相鄰 + 升級 | `upgrade` | `upgrade` | `type: 'upgrade'` |
| 非相鄰 | `move-to-base-for-build` | `build` / `upgrade` | `type: 'move'`（往 `context.baseId` 據點） |
| 資源點旁 | `collect` | `resource-point` | `type: 'collect'` |
| 建料不足 | `move-to-resource` | `resource-point` | `type: 'move'` |

---

## 8. 執行迴圈（runAiStepLoop）

### 8.1 單步流程

```
while (體力 > 0 && loopCount < 50):
    decision = decide()
    if exitReason → break
    action = decision.actions[0]
    驗證（保底 validateAiAction）
    執行 executeAction(action)
    記錄 actionEvent
    return { ok: true }   ← 一步一行動，立即返回
```

### 8.2 出口邏輯

| 情境 | 行為 |
|---|---|
| 正常結束（無 exitReason） | `endPlayerTurn` + 記錄 end-turn 事件 + `{ ok: true }` |
| 體力耗盡 | exitReason，`{ ok: false }`，由 scheduler 結束回合 |
| 行動失敗 | exitReason，`{ ok: false }` |
| 保底驗證失敗 | exitReason（代碼 bug），`{ ok: false }` |
| 迴圈上限（50） | exitReason，`{ ok: false }` |

### 8.3 排程器（aiTurnScheduler）

| 項目 | 值 / 規則 |
|---|---|
| 延遲 | `AI_TURN_STEP_DELAY_MS = 350` |
| 防重入 | 同一 Actor 已 pending → 冪等跳過 |
| stale 防護 | 取消後或 Actor 已換人 → 不執行 |
| 失敗處理 | step 失敗且 Actor 仍在回合 → `endTurn` + `onStepFailed` 通知 |

### 8.4 AI 行動觀察彈窗

- 來源：`state.actionEvents` 最新一筆 AI 玩家事件。
- 顯示：`formatAiActionEvent`（回合 + 名稱 + 行動 + 理由）。
- 非阻塞：不寫入 `blockingModal`，不中斷 scheduler。
- 關閉：玩家可關閉當前訊息；下一個 AI action 自動再顯示。

---

## 9. AI 探索事件自動處理

### 9.1 回合開始隨機事件

- 僅人類玩家觸發（`triggerTurnStartExplorationEvent` 排除 `isAI`）。
- AI 回合不會產生 `pendingExplorationEvent`。

### 9.2 地圖探索點

- AI 移動成功後，檢查同格是否有 `status === 'available'` 的探索事件。
- 有 → 依事件目錄順序選第一個 `checkEventRequirements` 通過的選項 → 呼叫 `resolveExplorationEvent` 結算。
- 無符合條件選項 → 保留事件，不消耗狀態。
- 人類玩家流程不變（仍顯示選項彈窗）。

---

## 10. 價值函數品質升級藍圖（持續開發）

### 10.1 現況限制

| 問題 | 位置 | 影響 |
|---|---|---|
| 建設候選 value 已完成第一階段動態化 | `fuzzyInputs.ts`、`constructionValue.ts` | 已反映材料需求、威脅、成本、距離、升級與個性；後續可補建築實際產能效益 |
| 攻擊候選價值仍是第一階段模型 | `fuzzyInputs.ts`、`combatValue.ts` | 已枚舉並排序所有可見生物；經驗/威脅度仍待接入更完整的領域收益資料 |
| 事件選項價值仍是第一階段模型 | `executeAiAction.ts`、`eventValue.ts` | 已在合法選項中排序直接效果並接入經營/修煉/謹慎個性；長期狀態效益仍可細化 |
| 裝備/內功候選價值仍是第一階段模型 | `fuzzyInputs.ts`、`equipmentValue.ts` | 已評估屬性提升、耐久、損壞替換、傷害提升與個性；尚未納入完整防禦收益與長期機會成本 |
| 價值函式仍需深化領域模型 | `valueContext.ts`、各領域 value module | 建設、戰鬥、事件、裝備/內功已接入共用契約；經驗收益、防禦收益與長期機會成本仍可細化 |
| 事件選項與長期收益仍可深化 | `eventValue.ts`、各領域 value module | ValueContext factors 已寫入候選 runtime log；事件選項已記錄合法候選排序，但仍以直接效果估值，經驗/防禦/長期機會成本可再細化 |

### 10.2 統一價值函數契約（ValueContext）

**目標**：所有候選式決策共用同一組價值維度。

```ts
type ValueContext = {
  need: number        // 需求程度（0~1）：當前狀態缺什麼
  benefit: number     // 預期效益（0~1）：做完會改善多少
  urgency: number     // 急迫性（0~1）：不做會多糟
  risk: number        // 風險（0~1）：失敗/受傷機率（分數需扣減）
  cost: number        // 機會成本（0~1）：體力/金錢/材料佔比
  distance: number    // 距離（格數）：統一衰減係數
  personalityWeight: number  // 個性對此候選類型的偏好
}

// 統一價值公式（建議）
value = max(0,
  fuzzyAnd(need, benefit, urgency)      // 需求 × 效益 × 急迫
  × (1 - risk × 0.5)                     // 風險扣減
  × (1 - cost × 0.3)                     // 成本扣減
  × distanceDecay(distance)              // 距離衰減
  × personalityWeight                    // 個性偏好
)
```

### 10.3 遷移順序（依效益排序）

| 順序 | 項目 | 為什麼先做 |
|---|---|---|
| 1 | 建設候選動態價值 | 已完成第一階段；後續補各建築的實際收益模型 |
| 2 | 攻擊目標候選化 | 已完成第一階段；從「最近」改為「枚舉視野內所有生物 → 各自算價值」 |
| 3 | 個性滲透到價值函數 | 已完成第一階段；建設、戰鬥、事件、裝備/內功均有個性權重 |
| 4 | 事件選項價值判斷 | 已完成第一階段；從「第一個符合」改為「枚舉選項 → 算價值」 |
| 5 | 裝備/內功換裝效益 | 已完成第一階段；評估屬性提升、耐久與內功傷害提升 |

### 10.4 不納入價值判斷的行為（明確排除）

| 行為 | 理由 |
|---|---|
| 移動路徑選擇 | 尋路問題（Dijkstra），非價值取捨 |
| 硬性合法性檢查 | 規則層職責，非模糊分數 |
| 單一合法選項的執行 | 無取捨空間，直接執行 |

---

## 11. 錯誤處理與例外情境

### 11.1 決策層

| 情境 | 處理 |
|---|---|
| 所有目標分數 < 門檻 | exitReason → 結束回合 |
| 目標有分數但無 actions | skip，嘗試下一個 ranked goal |
| 保底驗證失敗 | exitReason（標記為代碼 bug），不執行 |
| 迴圈超過 50 次 | exitReason，防止無限迴圈 |

### 11.2 執行層

| 情境 | 處理 |
|---|---|
| action 執行失敗 | exitReason → `{ ok: false }` → scheduler endTurn |
| AI 移動到探索點但無符合選項 | 保留事件，繼續正常流程 |
| 升級目標建築不存在 | `validateAiAction` 擋下（基礎驗證）+ `upgradeBuilding` 領域驗證 |
| 非相鄰建造候選移動中據點消失 | mapper 回傳 hold（「找不到目標據點」） |

### 11.3 排程層

| 情境 | 處理 |
|---|---|
| 彈窗開啟中（blockingModal） | App effect 取消 scheduler |
| creatureTurnInProgress | App effect 取消 scheduler |
| Actor 死亡 / 換人 | stale 防護：timer 觸發時檢查 activePlayerId |
| 元件卸載 | cleanup 函數呼叫 `scheduler.cancel()` |

---

## 12. 專案追蹤清單

### 12.1 已完成

| Task Item | Status | 驗收方式 | Result |
|---|---|---|---|
| Fuzzy-only 通用 AI（decision-tree / graph-search 降為 reference-only） | ✅ | build + AI 測試 | 通過 |
| 17 目標評估 + 門檻 + tie-breaking | ✅ | `src/game/ai` 測試 111/111 | 通過 |
| 5 種個性 profile | ✅ | personality 套用測試 | 通過 |
| 建造/升級候選枚舉 + 最高價值選擇 | ✅ | construction 測試 21/21 | 通過 |
| 攻擊目標候選枚舉 + 最高價值選擇 | ✅ 第一階段 | `combatValue.test.ts` + AI suite 119/119 | 通過 |
| 事件合法選項枚舉 + 最高價值選擇 | ✅ 第一階段 | `eventValue.test.ts` + AI suite 122/122 | 通過 |
| 裝備/內功候選枚舉 + 最高價值選擇 | ✅ 第一階段 | `equipmentValue.test.ts` + AI suite 126/126 | 通過 |
| 通用 `upgrade` action（type/stamina/validate/execute/event） | ✅ | build + 規則測試 | 通過 |
| 非相鄰候選移動保留目標 | ✅ | build | 通過 |
| 一步一行動 + 350ms setTimeout | ✅ | scheduler 測試 15/15 | 通過 |
| AI 行動觀察彈窗（非阻塞） | ✅ | build | 通過 |
| AI 回合開始隨機事件關閉 | ✅ | turnActions.exploration 測試 | 通過 |
| AI 走到探索點自動選擇 | ✅ | AI + 事件測試 117/117 | 通過 |
| `[AI decision]` runtime 日誌 | ✅ | console 輸出 | 通過 |

### 12.2 待開發（依優先序）

| Task Item | Priority | Owner | Deadline | 完成條件 |
|---|---|---|---|---|
| 統一 ValueContext 契約（need/benefit/urgency/risk/cost/distance/personality） | ✅ 第一階段 | AI | — | `valueContext.ts` 建立契約與聚合器，建設、戰鬥、事件、裝備/內功均已接入 |
| 建設候選動態價值（需求 + 效益 + 個性滲透） | ✅ 第一階段 | AI | — | `constructionValue.test.ts` 覆蓋個性、威脅、成本、距離與升級加成 |
| 攻擊目標候選化（枚舉視野內生物 → 各自算價值） | ✅ 第一階段 | AI | — | `combatValue.ts` 依距離、傷害比例、目標血量、生存能力、等級與個性排序；後續補領域收益資料 |
| 事件選項價值判斷 | ✅ | AI | — | `eventValue.ts` 依金錢、聲望、道具、學習、敵對生成效果與個性排序；同分保留原順序，runtime 記錄候選比較 |
| 裝備/內功換裝效益評估 | ✅ 第一階段 | AI | — | `equipmentValue.ts` 依屬性提升、耐久、損壞替換、傷害提升與修煉型個性排序 |
| 價值函數元件寫入 `[AI decision]` 日誌 | ✅ | AI | — | 日誌含 goal context、selectedContext、候選排名與每個候選的 ValueEvaluation factors |
| 候選枚舉抽成獨立純模組 | P3 | AI | — | `fuzzyInputs.ts` 不再內嵌枚舉邏輯 |

### 12.3 Milestone

| Milestone | Acceptance Criteria | Test Method | Result |
|---|---|---|---|
| M1：候選式決策統一 | 建造/攻擊/事件都走「枚舉 → 算價值 → 選最高」 | 回歸測試 + 行為對照 | 未開始 |
| M2：個性滲透價值函數 | 不同個性在相同局面選出不同候選 | 建設、事件、裝備/內功個性對照測試 | 第一階段完成 |
| M3：價值可解釋性 | `[AI decision]` 日誌含 goal context、selectedContext、候選排名與 ValueEvaluation factors | AI suite + console 檢查 | 完成 |

---

## 13. 測試檔案索引

| 範圍 | 檔案 |
|---|---|
| AI 全套 | `src/game/ai/**`（13 檔 111 測試） |
| 排程器 | `src/game/ai/aiTurnScheduler.test.ts` |
| 事件格式 | `src/game/ai/aiActionEvent.test.ts` |
| 建造 | `src/game/ai/construction/constructionAi.test.ts`、`src/game/gameStore.construction.test.ts` |
| 建築規則 | `src/game/rules/buildingProgressionRules.test.ts` |
| 驗證 | `src/game/ai/validation/validateAiAction.test.ts` |
| 回合事件 | `src/game/actions/turnActions.exploration.test.ts` |
| 事件互動 | `src/game/events/eventInteraction.test.ts` |
| Store 整合 | `src/game/gameStore.aiSteps.test.ts`、`src/game/gameStore.test.ts` |
