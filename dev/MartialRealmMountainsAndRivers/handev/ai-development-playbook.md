# mygame2 AI 開發方法指示文件（AI Development Playbook）

> 建立日期：2026-08-24
> 目的：規範接手 AI 開發時的標準方法——**盤點現況 → 對齊設計文件 → 一切片一驗收 → 測試先行遷移**。
> 配套文件：
> - `mygame2/reports/system/ai-strategy-and-construction-development-design.md`（v0.8，功能線：戰略命令／防守／支援／建設）
> - `mygame2/reports/system/ai-system-refactoring-development-design.md`（v0.2 Draft，架構線：通用核心／Validator／Scheduler／事件化）
> - `handev/mygame2-architecture.md`（整體骨架）、`reports/development-log.md`（進度真源）

---

## 總原則（不可違反）

1. **決策與執行分離**：AI 規則層只產生行動意圖（`AiDefenseAction`，未來統一為 `AiAction`），不得直接修改 `GameState`；所有狀態變更必須經過既有 domain action 或 `gameStore`。
2. **自保優先級鏈**：`死亡／無法行動 > AI 自保 > active 戰略命令／Creature 行為 > 戰術行動 > 待命或結束回合`。自保是隱藏的系統級優先級：不可被玩家命令覆蓋、不可修改命令內容、解除後恢復原命令。
3. **行為保持遷移**：先抽共用核心並補測試，再遷移既有 AI；每個階段既有測試必須全部通過；行為差異用固定地圖＋固定 seed 比對。
4. **不依賴 UI API**：AI 不得呼叫 `previewAttackTarget()` 等 preview／React API；preview 只服務人類玩家。（現况尚未達標，見 §1 缺口清單——這是最優先要還的債。）
5. **隨機可重現**：domain AI 內禁止直接呼叫 `Math.random()`；一律注入 `RandomSource`（沿用 `rules/randomRules.ts` 的 `defaultRandomSource` 注入模式）。相同 seed＋相同 GameState 必須產生相同決策。
6. **只加不改不刪**：舊入口（`moveCreatures()`、`runAiDefenseStep()`、`runAiSupportStep()`）保留為相容包裝層，直到新管線通過驗收才移除。
7. **Data-driven 白名單**：JSON policy 只能描述條件、參數、權重與順序；condition／action 必須落在 TypeScript union 白名單內；驗證失敗時記錄日誌並 fallback，絕不讓 AI 回合卡死；JSON 內不得出現任何可執行程式碼。
8. **一個切片一個驗收**：每次改動前先從設計文件抄下該項目的 Acceptance Criteria 與 Test Method，做完當場驗證（tsc ＋ vitest ＋ eslint ＋ build）才算完成。

---

## 1. 現況盤點（2026-08-24 實測程式碼）

AI 開發有**兩條主線**，各自有獨立設計文件，工作時必須分辨自己在哪條線上：

| 主線 | 文件 | 性質 | 進度 |
|---|---|---|---|
| 功能線 | ai-strategy-and-construction（v0.8） | 玩家指揮 AI 的玩法功能 | M1～M3 已完成；M4 防守、M5 支援部分完成（單步決策＋自動回合已接入）；建設自動執行、逐步動畫、全域日誌未完成 |
| 架構線 | ai-system-refactoring（v0.2 Draft） | Creature／玩家 AI 共用核心重構 | Phase 1～6 全部 Todo；`src/game/ai/` 目錄尚未建立 |

### 1.1 已存在的實作（檔案地圖）

**玩家陣營 AI（純函式決策層，皆有測試）**

| 檔案 | 內容 |
|---|---|
| `src/game/aiDefenseRules.ts` | `AiDefenseAction` 型別（`:5`）、`assessBaseThreats` 威脅評估、`chooseDefenseAction`（`:67`）→ attack／move／hold-position／end-turn |
| `src/game/aiSupportRules.ts` | `chooseSupportAction`（`:58`）：靠近支援目標、相鄰威脅優先攻擊 |
| `src/game/aiSelfPreservationRules.ts` | `chooseSelfPreservationAction`（`:40`）：血量門檻／包圍 → move 或 end-turn；健康時回 null |

**執行層（gameStore.ts）**

- `runAiDefenseStep`（`:1778`）／`runAiSupportStep`（`:1810`）：驗證（isAI＋輪次＋非 creature turn＋active 命令）→ 自保先行 → 讀決策 → `movePlayerTo` 或 **`previewAttackTarget`＋`executeAttackTarget`**（`:1798`、`:1838`）→ 失敗或待命則 `endPlayerTurn`。
- 支援目標死亡時命令自動轉 `paused`（`:1826-1834`）。
- ⚠️ 兩處攻擊都走 Preview API——違反總原則 4，為既存技術債。

**排程層（App.tsx `:166-191`）**

- `useEffect` ＋ `window.setTimeout(350ms)` 驅動；守衛條件：`creatureTurnInProgress`、`blockingModal`、三個 Modal 開啟時跳過。
- step 失敗且仍在該 AI 回合時直接 `endPlayerTurn`（不卡回合）。
- ⚠️ Scheduler 與 React 掛載生命週期耦合——重構線 Phase 3 要抽離的對象。

**資料模型（types.ts ＋ gameStore.ts）**

- `PlayerState.isAI`（types.ts `:160`）、`GameState.aiOrders?`／`aiConstructionPlans?`（`:909-910`）、`AiOrder`（`:915`，protect-base／support-player 二型）、`AiConstructionPlan`（`:946`，一位 AI 管理一個據點）。
- `setAiOrder`（`:423`，同型重複拒絕、異型降級 paused）、`removeAiOrder`（`:459`）、`setAiConstructionPlan`（`:473`）；命令隨 `localStorage` 存檔保存，舊檔缺欄位補空集合。

**Creature AI（另一套執行模型，批次結算）**

- `actions/creatureActions.ts` 的 `moveCreatures()`（單體大函式）：箭塔先制（`:290`起）→ 逐隻 `selectCreatureTarget`（依 `behaviorType`）→ greedy 逐格移動（地形體力成本＋佔位＋陷阱，`:358-390`）→ 相鄰動作結算（吃道具／打據點／資源點／玩家／防禦設施）→ 產生 `logs`＋`steps`。
- 行為型別在 `rules/creatureBehaviorRules.ts`：`scavenger | hunter | sieger | wanderer | roamer`（`:5`）＋ aggro range 表。
- 回合結果由 `creatureAnimation.ts` 一次性套用；`pendingCreatureTurn` 存放於 gameStore 模組層（`:234`），`animateCreatureTurn`（`:260`）。
- ⚠️ 巡邏步使用 `Math.random()`（creatureActions.ts `:382`）——不可重現；戰鬥 roll 已用 `defaultRandomSource`（`:435`）。
- ⚠️ `blocked` 時 fallback 攻擊相鄰的任意防禦設施（`:398-400`）——重構文件 §12 明列要修的行為。

### 1.2 缺口清單（= 待辦池，依優先級）

1. AI 攻擊去 Preview 化（總原則 4 的債）。
2. 共用感知層（距離／阻擋／可達性）＋ Creature 巡邏 RandomSource 注入。
3. 統一 `AiAction` 型別＋Action Validator。
4. `moveCreatures()` 拆分為 perceive／select／plan／validate／execute／reduce。
5. Scheduler 抽出 App.tsx、合併防守／支援執行框架。
6. 事件化回合結果＋逐步動畫＋全域遊戲日誌。
7. 建設 AI：效用評分純函式→queue 狀態機→建築 action 執行→完成提醒。
8. Creature 外功 AI（creature-system-design.md 明列未完成）。
9. JSON policy 白名單系統。

---

## 2. 開發流程：研究 → 切片 → 實作 → 驗證 → 回寫

### 2.1 研究（動手前必讀）

1. 讀 `reports/development-log.md` 最後幾篇，確認沒有人已在做同一件事或已被否決的方向。
2. 依工作主線讀對應章節：
   - 功能線 → 該 Milestone 的 Acceptance Criteria／Test Method／可測試項目清單（§11）＋ §12 討論決策點（避免重新討論已確認事項）。
   - 架構線 → §3 分層架構與各層責任表、§4 資料模型、§12～§13 遷移規則、§17 開發入口。
3. 對照 §1.1 的檔案地圖實際讀碼，確認文件描述與現況一致（文件可能落後於碼，以碼為準並回報差異）。

### 2.2 切片原則

- 一個切片 = 設計文件中的一個 Phase 項目或一條 Acceptance Criteria 群；先寫下「本切片不改變什麼」（行為保持承諾）。
- **不混合兩條主線**：架構線的重構切片不加新玩法；功能線的新玩法不動舊執行模型（必要時只加 Adapter）。
- 新檔案位置遵循重構文件的規劃：`src/game/ai/perception/`、`planner/`、`execution/`、`configs/`；決策純函式不放 React、不放 store。
- 切片完成定義：該項 Acceptance Criteria 全數可演示＋全套測試通過＋build 通過。

### 2.3 實作紀律

- 決策函式簽名模式沿用現例：`(state: GameState, actorId: string, order/policy) => 意圖 | null`，輸入只有 GameState 與設定。
- 執行前必須重新驗證（stale check）：目標死亡／位移／體力不足視為 stale → 重新感知重规划一次 → 重試上限後 hold／end-turn。
- 隨機：注入 `RandomSource` 參數（預設 `defaultRandomSource`），測試傳入固定偽隨機。
- 存檔相容：新增 GameState 欄位一律 optional＋讀檔補預設值（沿用 `aiOrders?` 模式）。
- 中文註解只在解釋「為什麼」時加；id 用英文 kebab-case。

### 2.4 測試方法

- 單元測試與來源同層放置（`*.test.ts`），情境工廠沿用 `aiDefenseRules.test.ts` 的 `state()`／`player()` helper 風格。
- 固定地圖情境測試：手工構造小地圖（牆、據點、敵人座標全指定），斷言決策輸出的確切形狀（如 `toEqual({ type: 'attack', targetId: 'creature-1', targetType: 'creature' })`）。
- Action contract 序列：`perception → decision → validation → execution → event`，每段都要有獨立案例（目標執行前死亡、位置改變、體力不足、stale 重试、超限安全結束）。
- 生命週期案例：Modal 開啟暫停、Game Over 後不再排程、同一 Actor 不重入、死亡 AI 正確結束。
- 隨機重現案例：同一 seed 兩次跑出相同巡邏路徑。

### 2.5 驗證指令（主機無 node/npm，走 Docker）

workdir：`C:\Users\johny\Documents\han\Niba\dev\MartialRealmMountainsAndRivers\mygame2`

```text
docker compose run --rm node npm run test        # 全套 vitest
docker compose run --rm node npx tsc -b          # 型別
docker compose run --rm node npx eslint <files>  # lint
docker compose run --rm node npm run build       # production build
```

PowerShell 備忘：判斷成敗用 `$LASTEXITCODE`（`$?` 是 True/False）；docker progress 行會觸發 NativeCommandError 噪音，非真錯誤。

### 2.6 回寫義務

切片完成後當次更新三處：

1. 對應設計文件：Milestone／Phase 的 Result、Status、Verification 欄位。
2. `reports/development-log.md`：新增日期條目（做了什麼、怎麼麼驗證、測試數）。
3. 若慣例或檔案地圖改變 → 更新本文件 §1 與 `mygame2-architecture.md`。

---

## 3. 建議切片順序（接手後的執行佇列）

| # | 切片 | 對應 | Priority | 驗收重點 |
|---|---|---|---|---|
| A | AI 攻擊去 Preview 化：新增原子攻擊 domain action，`runAiDefenseStep`／`runAiSupportStep` 改呼叫之；preview 保留給人類玩家 | 重構 Phase 2 前半 | P0 | 新增「AI 不經 preview API 執行攻擊」測試；既有 AI 測試全過 |
| B | 共用感知純函式（距離／阻擋／存活／目標有效／可達性）＋ Creature 巡邏改注入 RandomSource | 重構 Phase 1＋§12 Phase 1 | P0 | 既有測試全過；相同 seed 巡邏結果一致；不可達目標會重選或安全待命 |
| C | 統一 `AiAction` 型別＋`validateAiAction()`（先不改變行為） | 重構 Phase 1 後半＋Phase 2 | P0 | Validator 對既有四種決策都能給出 valid/reason；行為零變化 |
| D | `moveCreatures()` 拆六段（perceive/select/plan/validate/execute/reduce），維持 `CreatureTurnResult` 相容 | 重構 §12 Phase 2 | P0 | 步驟化後既有 creature 測試全過；`blocked` 不再打錯防禦設施 |
| E | 統一 Player AI Scheduler：抽出 App.tsx 成 `src/game/ai/aiTurnScheduler.ts`，合併防守／支援執行框架 | 重構 Phase 3 | P1 | 回合生命週期測試；timer cancellation；同 Actor 不重入 |
| F | 事件化回合結果＋全域遊戲日誌＋逐步動畫消費 steps | 重構 Phase 3~5＋功能線 M4/M5 未完項 | P1 | 事件順序測試；動畫不改變規則結果；讀檔/Game Over 清理 |
| G | 建設 AI：`chooseConstructionAction()` 效用評分 → queue 狀態機（planned/building/completed/blocked/cancelled）→ 建築 action 執行＋完成提醒彈窗 | 功能線下一個 Milestone＋重構 Phase 6 | P2 | 前置不足／建料不足 → blocked 含原因；`paused` 方針不建造但可採集 |
| H | JSON policy 白名單系統（defensive-guardian／creature-sieger 等內建 config） | 重構 §6 | P2 | Schema 驗證＋fallback 測試；非法 condition/action 被拒 |

> 順序理由：A 還債最便宜且解鎖 Executor；B 是所有後續共用地基；C/D 讓 Creature 與玩家 AI 有共同語言之後，E~H 才有意義。若使用者另有指示，以其為準。

---

## 附錄：快速事實

- 目前全套測試基準：2026-08-24 為 723 項全過（數字會漂移，動工前先跑一次記錄當下基準）。
- `AiOrder` 同時間每 AI 只能一個 active；建立異型新命令 → 舊命令降級 paused；完全同型同目標 → 拒絕。
- 支援命令目標死亡 → 自動 `paused`（不是 failed）；據點被毀 → `failed` 且保存原因。
- 建設方針五種：`defense | economy | frontline | balanced | paused`；`paused` 不建造但可行動。
- AI 可用共享倉庫與共享裝備（與人類同套）；AI 不得修改自己或他人的命令（僅人類經戰略 Modal）。
- 戰略 Modal 預設防守半徑 6 格；AI 行動需要逐步動畫、日誌採全域遊戲日誌（§12 已確認決策，勿重新討論）。
