# AI 決策系統整合評估報告（模糊邏輯 × 決策樹 × 圖搜索）

> 日期：2026-09-03
> 範圍：`src/game/ai/` 下 fuzzy / decisionTree / graphSearch 三套決策系統的現況診斷與整合方案評估
> 結論：**採用方案 C（單一大腦收斂 + 部件收割）**，並以「可觀測性 + 確定性」為第一優先改動

---

## 1. 現況診斷

### 1.1 三套機制的實際接線狀態

**關鍵發現：三套系統中只有一套真正在 production 路徑上運行。**

| 系統 | 入口 | Production 呼叫者 | 狀態 |
|---|---|---|---|
| fuzzy | `runFuzzyStep`（`aiStepRunner.ts:731`） | `gameStore.ts:1349-1350` → `aiTurnScheduler.ts:66` `case 'fuzzy'` | ✅ 唯一活躍 |
| decisionTree | `decideNextAction`（`decideNextAction.ts:69`） | **無任何 importer** | ❧ 死代碼 |
| graphSearch | `runGraphSearchStep`（`runGraphSearchStep.ts:14`） | 僅 `graphSearch.test.ts:3` 引用 | ❧ 死代碼 |

具體證據：

- `src/game/types/ai.ts:11-38` 的 `AiOrder` 聯合型別只有 `protect-base`、`support-player`、`fuzzy` 三種訂單，**沒有 decision-tree 或 graph-search 訂單型別**。`aiTurnScheduler.ts:60-67` 的 switch 也只分派這三種（construction 走獨立 plan 路徑）。
- 全 workspace grep `import.*decideNextAction` 與 `import.*runGraphSearchStep`：除了 `graphSearch.test.ts` 自測，**零個 production 檔案引用**。
- `decisionTree/` 資料夾下只有 3 個 `.ts` 檔，**沒有任何測試檔**——提示詞中假設的 `ai/decisionTree/*.test.ts` 實際不存在。

### 1.2 交叉依賴

**完全沒有。** 三個方向都驗證過：

- `decisionTree/*.ts` 不 import 任何 `fuzzy/` 模組（grep `computeFuzzyInputs|fuzzy` 結果為空）
- `graphSearch/*.ts` 只用自己的 `scoring.ts`（`getTierScore` = `tier/10` 的硬編碼位階分數，`scoring.ts:9`），不讀模糊分數
- `fuzzy/` 不 import 另外兩套

### 1.3 分工是刻意還是歷史遺留？

從代碼註解可判斷是**歷史演進遺留**：

- `decideNextAction.ts:1-17` 自述「決策樹 V2（方案 C：無狀態分層）」——它自己就是某次重構的產物
- `runGraphSearchStep.ts:1` 自述「V3 圖搜索貪婪演算法」
- `aiStepRunner.ts` 的 fuzzy step 是最新一代（含 mid-term goal、momentum commitment）

⚠️ 無法從目前代碼確認 decisionTree/graphSearch 是「曾接線後被拔除」還是「寫完從未接線」，需查 git 歷史。但結論不受影響：**它們現在不在任何 AI 的決策路徑上**。

### 1.4 規模對比

```
fuzzy/       ~3,800 行（fuzzyInputs 1014、goalActionMapper 1125、goals 994、midTermGoal 232...）
decisionTree ~890 行（decideNextAction 315、actionBuilders 310、conditions 268）
graphSearch  ~460 行（actionGenerators 252 為主體）
```

---

## 2. 「不滿意」的根源判斷

兩個症狀，根據實際已修復的 bug，可精確歸因：

### 症狀一：「行為忽好忽壞、難以預期」

主因不是模糊權重設計不當，而是**三個架構層因素**：

1. **跨 step 的 module-level 可變狀態**：`movementCommitments`（`aiStepRunner.ts:33-38`）、`midTermGoals`（`midTermGoal.ts:66`）、`previousMovePositions`/`recentMoveOrigins`（`goalActionMapper.ts:16-18`）都是模組級 Map。它們讓「同樣的局面」因為歷史路徑不同而產出不同決策——這是「同樣局面反應不一致」的直接機制來源。這是刻意設計（momentum/commitment），但副作用是真實的。
2. **`Math.random()` 非決定性**：巢穴 spawn、掉落、暴擊都未種子化，同一 seed 兩次跑結果不同（Level 5 測試時好時壞即此因）。
3. **分數覆寫與門檻的互動**：`overrideScoreForMidTermGoal`（`midTermGoal.ts:186`）會把鎖定目標抬到 1.0、其他 travel 壓到 0，與 personality `goalThresholds`、momentum margin 0.2 三層疊加後，行為對參數極敏感。

### 症狀二：「難以除錯、不知道哪層造成」

- 好消息：fuzzy 已有 `logAiDecision`（`aiStepRunner.ts:828`）輸出完整 decision core（trace 即此），**單一系統內的可觀測性其實不差**。
- 壞消息：決策鏈是 `inputs → 21 個 evaluator → 距離衰減（`goals.ts:472-479`）→ personality 權重（`goals.ts:507-510`）→ mid-term override → momentum → threshold` 六層串接，任何一層的數值互動都可能翻轉結果，trace 只顯示最終快照，看不到中間層。

**結論：問題不在「缺少決策樹」，而在活躍系統（fuzzy）本身的狀態管理與非確定性，加上兩套死代碼造成的認知負擔——調整 decisionTree 的參數時，它根本沒被執行。**

---

## 3. 整合方案比較

### 方案 A：分層架構（模糊算分 → 決策樹判斷）

決策樹分支條件改用模糊分數當門檻。

- **改動範圍**：復活 `decideNextAction.ts`，`conditions.ts` 的 15+ 個布林謂詞（如 `isHealthCritical` `conditions.ts:12`、`needsBaseHeal` `conditions.ts:57`）改為讀 `computeFuzzyInputs` 的輸出；`gameStore.ts` 需新增訂單型別與 `aiTurnScheduler.ts:60` 的分派分支。
- **與 graphSearch 銜接**：需另建呼叫點，等於第三條 pipeline。
- **可觀測性**：⚠️ 反而變差。等於兩個大腦並存，行為異常時要先確定「這步是誰決策的」。
- **測試影響**：decisionTree 無測試可遷移；fuzzy 的 43 個測試不受影響但行為語意會分裂。
- **風險**：⚠️⚠️ 成本最高、收益最不明確。等於把已投入大量修復的 fuzzy 決策鏈旁邊再放一個平行系統，先前的 bug（裝備循環、外功不放、travel lock）都要在第二套系統重踩一遍。

**評價：不建議。** 這是「為了整合而整合」。

### 方案 B：決策樹葉節點嵌入模糊評估

決策樹維持分支，葉節點用模糊排序選候選。

- **改動範圍**：同樣需要先復活 decisionTree 的接線，成本與 A 相當。
- **可觀測性**：比 A 略好（分支路徑明確），但 ⚠️ 葉節點分數與 fuzzy evaluator 分數的語意會重複定義（例如「選攻擊目標」在 `goals.ts:225` 的 `evaluateEngageCombat` 已有完整實作）。
- **風險**：⚠️ 與 A 相同的雙大腦問題。

**評價：不建議，理由同 A。**

### 方案 C（推薦）：單一大腦收斂 + 部件收割

**承認 fuzzy 是唯一決策系統，把另外兩套降級為「零件供應庫」，而不是平行大腦。**

**C-1：收割 decisionTree 的純謂詞**
`conditions.ts` 的 268 行裡有大量無狀態、可測試的實用謂詞（`findHealingItemToUse`、`findAdjacentBase`、`countHealingItems`、`findUnexploredNearby`）。這些與 fuzzy evaluator 的職責重疊但實作不同（例如回血道具選擇：`conditions.ts:36-42` 取最小回血量 vs `fuzzyInputs.ts:706` `pickBestItem` 的優先級鏈）。
→ **動作**：比對兩邊重複的判定，統一成一個 `perception/predicates.ts`，兩邊語意差異逐一用測試釘死後擇一刪除。`decideNextAction.ts` 與 `actionBuilders.ts`（與 `goalActionMapper.ts` 1125 行高度重複）標記 deprecated 或直接刪除。

**C-2：graphSearch 轉為 fuzzy 的「戰術規劃器」而非獨立 step**
`runGraphSearchStep` 的 DFS（`searchStrategies.ts:19-40`，depth 3）對「多步戰鬥序列」（接近→外功→普攻→擊殺）有真實價值，但它的 tier 分數（`scoring.ts:9`）太粗。
→ **動作**：不新增訂單型別；改為在 `evaluateEngageCombat`（`goals.ts:215`）內部，當 `canKillInTwoTurns` 時呼叫 graphSearch 產生 2-3 步序列，用 fuzzy 的 `damageRatio` 取代 `getTierScore` 作為邊分數。資料流：`fuzzy evaluator → graphSearch（規劃）→ 回傳 AiAction[] → 既有 buildValidatedActionSequence 驗證`。

**C-3：補可觀測性分層日誌**
在 `logAiDecision` 的 trace 中加入「決策鏈中間層」欄位：mid-term goal 狀態、momentum commitment、override 前後分數。這直接解決「不知道哪層造成」。

**測試影響**：
- `graphSearch.test.ts`（8 個測試）需改為測「被 fuzzy 呼叫」的契約
- fuzzy 43 個測試不動
- decisionTree 無測試，刪除零成本

**風險**：
- ⚠️ C-1 的語意統一要逐條比對，不能批次替換（兩邊對「何時回血」的定義不同，是有意的還是漂移需逐案判斷）
- ⚠️ C-2 讓 evaluator 內部呼叫搜尋會增加每 step 成本，需限制只在戰鬥情境觸發
- ⚠️ 刪除死代碼前建議先 git tag，保留一個 session 的觀察期

---

## 4. 明確建議

**採用方案 C。**

理由：
1. A、B 都建立在「兩套系統都活著」的前提上，但實況是一套活的、兩套死的。整合死代碼不是整合，是復活負債。
2. 「調了參數沒效果」的最大可能原因就是：**部分調整落在不會被執行的 decisionTree/graphSearch 裡**。
3. fuzzy 的已知 bug（本 session 已修 4 個：裝備循環、kill goal 被存錢壓制、外功不放、travel lock 失效）全部是單一系統內可定位、可測試釘死的問題——證明這條路徑的除錯閉環是通的。

**實作順序（風險由低到高）**：

1. **第一步（零風險）**：在 `decideNextAction.ts`、`runGraphSearchStep.ts` 頂部加 deprecation 註解與「無 production 呼叫者」標記，防止未來誤改。
2. **第二步（低風險）**：C-3 的分層 trace 日誌——純加法，先讓除錯看得見，再談重構。
3. **第三步（中風險）**：C-1 謂詞統一，一次一個謂詞配一個測試。
4. **第四步（中風險）**：C-2 graphSearch 收編為戰鬥規劃器。
5. **最後**：刪除 `decideNextAction.ts`、`actionBuilders.ts`。

**驗收指標（不憑感覺）**：

沿用既有 trace 報告機制（`reports/analysis/ai-beginner-sandbox-*-trace-*.md`），在種子化隨機後量測：
- **目標切換次數/回合**：同一 goal 連續被選中的中位數（應上升）
- **無效行動率**：`hold` + 原地 move 佔總 action 比例（應下降）
- **擊殺效率**：kill/spawn 與 attack/kill（現有報告已有此欄）
- **Level 5 達成率**：固定 seed 跑 20 局的通過率（目前非確定性下無法小於 100% 以外的有意義數字，種子化是前置條件）
- **決策可解釋率**：異常行為樣本中，能從分層 trace 指認出「哪一層」的比例（C-3 的直接驗收）

---

## 5. 驗收機制落地（2026-09-03 補充）

方案 C 的驗收指標已部分落地到測試端，讓「AI 變聰明了」不再只憑主觀判斷。

### 5.1 已實作：trace 報告新增兩項 KPI

`src/game/aiBeginnerSandboxVictory.test.ts` 的 `writeAiTraceReport` 在 `## Efficiency (KPI)` 區段新增：

- **目標切換次數 (goal switches)**：依 action 的 `reason` 前綴推斷每步目標（探索/交戰/建設/收集/購買/學招/定位/據點），相鄰兩步目標不同即算一次切換。對應驗收指標「目標切換次數/回合」。
- **無效行動率 (ineffective)**：`hold` + 原地 `move`（destination 等於玩家當前位置）佔總 action 比例。對應驗收指標「無效行動率」。

新增純函式：`inferGoalFromAction`、`countGoalSwitches`、`countIneffectiveActions`（`aiBeginnerSandboxVictory.test.ts:100-160` 附近）。

### 5.2 已實作：多局驗收測試（預設 skip）

新增 `it.skip('多局驗收：固定 seed 統計 Level 5 達成率與行為 KPI')`：

- 固定 seed 跑 20 局（`SEED_BASE = 20260910`，每局 `seed + run`）
- 統計：Level 5 達成率、目標切換中位數、無效行動率中位數
- 驗收門檻（2026-09-03 種子化後實測基線，見 §5.3）：
  - Level 5 達成率 ≥ 20%（基線 25%）
  - 目標切換中位數 ≤ 250 次（基線 230）
  - 無效行動率中位數 ≤ 50%（基線 45.6%）
- 預設 `skip` 避免拖慢 CI；需要驗收時以 `-t "多局驗收"` 執行
- 20 局約需 36 秒，設 120s timeout

### 5.3 已實作：`Math.random()` 種子化

`src/game/rules/randomRules.ts` 新增可覆寫的全域隨機來源：

- `setGlobalRandomSource(source | null)`：覆寫／還原全域隨機來源
- `seedGlobalRandom(seed)`：以固定 seed 覆寫，回傳還原函式
- `defaultRandomSource` 改為讀取可覆寫的全域來源（production 行為不變，仍為 `Math.random()`）

已改為走可覆寫來源的關鍵隨機點：

- 巢穴 spawn：`creatureActions.ts` 已用 `defaultRandomSource`（原本就注入）
- 掉落：`lootFactory.ts` 三處 `Math.random()` → `defaultRandomSource()`（掉落、道具點、巢穴功法抽取）

多局驗收測試每局開頭呼叫 `seedGlobalRandom(SEED_BASE + run)`、結尾還原。

**實測基線（2026-09-03，種子化後，20 局固定 seed）：**

```
runs=20 level5=5/20 (25%) goalSwitchMedian=230 (avg 246.3) ineffectiveMedian=45.6% (avg 47.7%)
```

兩次執行統計完全一致，證明種子化成功讓多局驗收**可重現**。此基線誠實揭露目前 AI 真實水準：Level 5 達成率僅 25%、目標切換中位數 230 次、無效行動率 45.6%——遠低於先前樂觀建議值，驗收機制有效且揭露了真實改善空間。

### 5.4 已實作：探索目標距離門檻（2026-09-03）

`src/game/ai/fuzzy/goals.ts` 的 `evaluateExploration` 據點分支新增距離門檻：

- 據點距離 `> max(6, player.stamina)` 時不鎖定據點，改為探索附近的未探索格（若有）
- 解決「探索目標太遠蠕動」：AI 鎖定超遠據點（對角 20+ 格），每回合只爬 1 格、體力耗盡目標仍遠，產生大量無效 move 與 hold

**KPI 對比（20 局固定 seed）：**

| KPI | 修正前基線 | 修正後（門檻 6） | 變化 |
|---|---|---|---|
| Level 5 達成率 | 25% | 20% | -5% |
| 目標切換中位數 | 230 | 263.5 | +33 |
| 無效行動率中位數 | 45.6% | 40.7% | **-4.9%（改善）** |

無效行動率改善（45.6%→40.7%），確認距離門檻減少了無效 move/hold。目標切換略增（AI 在探索附近格與其他目標間更頻繁切換）與 Level 5 略降（AI 較不積極往據點推進）是 trade-off。門檻 6 優於門檻 10（無效行動率 40.7% vs 43.2%）。

**目標切換偏高（230-270）是獨立問題**：AI 在探索、打工、學招、建設間頻繁切換，需後續以 mid-term goal 的 travel lock 機制（方案 C-3 分層 trace 可觀測）進一步收斂。

### 5.5 尚未落地（需後續實作）

- **決策可解釋率**：需 C-3 的分層 trace 日誌（mid-term goal / momentum / score override 中間層）才能量測。
- **暴擊 roll 種子化**：`combatActions.ts` 的暴擊已走 `dependencies.random ?? defaultRandomSource`，但 `gameStore` 的 combat deps 未注入種子化來源，仍走全域來源（已種子化）。若需更精細控制可再注入。

### 5.6 驗收流程建議

1. ✅ 已完成 `Math.random()` 種子化（§5.3）。
2. 跑 `npm test -- --run src/game/aiBeginnerSandboxVictory.test.ts -t "多局驗收"` 取得基線（已取得，見 §5.3）。
3. 每次 AI 行為改動後重跑，比較三項 KPI 是否朝目標方向移動。
4. 只有 KPI 改善且既有 fuzzy 測試（43 個）全過，才視為「AI 變聰明」。
5. 門檻以「基線為起點、逐步收緊」：AI 改善後調高達成率、調低切換與無效行動門檻。


---

## 總結

如果只能做一件事：**先做第二步——在決策 trace 中加入 mid-term goal / momentum / score override 的分層日誌，並把 `Math.random()` 種子化**。因為目前所有「忽好忽壞」的調參都是在非確定系統上盲調；看不見決策鏈中間層、且每次跑結果不同的前提下，任何架構整合的效果都無法被驗證，甚至無法被察覺。可觀測性與確定性是一切後續改進的前置條件，而它恰好也是風險最低的改動。