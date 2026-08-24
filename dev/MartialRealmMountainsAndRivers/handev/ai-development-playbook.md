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
4. **不依賴 UI API**：AI 不得呼叫 `previewAttackTarget()` 等 preview／React API；preview 只服務人類玩家。（玩家 AI 攻擊已達標，見切片 A；Creature 批次仍走自己的結算路徑。）
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
| 架構線 | ai-system-refactoring（v0.2 Draft） | Creature／玩家 AI 共用核心重構 | A0＋A 已完成；Phase 1～6 其餘 Todo；`src/game/ai/execution/` 已建立 |

### 1.1 已存在的實作（檔案地圖）

**玩家陣營 AI（純函式決策層，皆有測試）**

| 檔案 | 內容 |
|---|---|
| `src/game/aiDefenseRules.ts` | `AiDefenseAction` 型別（`:5`）、`assessBaseThreats` 威脅評估、`chooseDefenseAction`（`:67`）→ attack／move／hold-position／end-turn |
| `src/game/aiSupportRules.ts` | `chooseSupportAction`（`:58`）：靠近支援目標、相鄰威脅優先攻擊 |
| `src/game/aiSelfPreservationRules.ts` | `chooseSelfPreservationAction`（`:40`）：血量門檻／包圍 → move 或 end-turn；健康時回 null |
| `src/game/ai/perception/`（切片 B 新增） | `distance.ts` 曼哈頓距離出口、`targetDiscovery.ts` 存活敵人枚舉＋目標有效、`blockedPositions.ts` 阻擋/成本出口、`reachablePositions.ts` `collectReachableCells`（一次 Dijkstra）；三個決策函式已委託此層 |
| `src/game/ai/aiAction.ts` ＋ `ai/validation/validateAiAction.ts`（切片 C 新增） | 通用 `AiAction` 六型（§4.4）＋舊 `AiDefenseAction` 的 `defenseActionToAiAction` Adapter；Validator 只驗證不接線，player 回合合法性沿用 `canPlayerPerformAction` |

**執行層（gameStore.ts）**

- `runAiDefenseStep`（`:1790`）／`runAiSupportStep`（`:1821`）：驗證（isAI＋輪次＋非 creature turn＋active 命令）→ 自保先行 → 讀決策 → `movePlayerTo` 或 **`executeAiAttack`**（`:1810`、`:1849`）→ 失敗或待命則 `endPlayerTurn`。
- 支援目標死亡時命令自動轉 `paused`。
- 原子攻擊：`src/game/ai/execution/executeAiAttack.ts` 當場 `createAttackPreview`＋`executeAttack`，不寫入 `attackPreview`／`operation`。人類玩家仍走 `previewAttackTarget`。
- 測試：`src/game/gameStore.aiSteps.test.ts`（A0 8 例＋A「不經 preview API」）；`executeAiAttack.test.ts`（3 例）；共用夾具 `src/game/testHelpers/aiTestFixtures.ts`。

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

1. ~~AI 攻擊去 Preview 化~~ **已完成（切片 A）**。
2. 共用感知層（距離／阻擋／可達性）＋ Creature 巡邏 RandomSource 注入。
3. 統一 `AiAction` 型別＋Action Validator。
4. `moveCreatures()` 拆分為 perceive／select／plan／validate／execute／reduce。
5. Scheduler 抽出 App.tsx、合併防守／支援執行框架。
6. 事件化回合結果＋逐步動畫＋全域遊戲日誌。
7. 建設 AI：效用評分純函式→queue 狀態機→建築 action 執行→完成提醒。
8. Creature 外功 AI（creature-system-design.md 明列未完成）。
9. JSON policy 白名單系統。

### 1.3 兩套 AI 的關係與合併方針（架構決策）

**現況：玩家陣營 AI 與 Creature AI 是兩套完全不同的執行模型。**

| | 玩家陣營 AI | Creature AI |
|---|---|---|
| 觸發 | App.tsx `useEffect`＋350ms timer 逐步驅動 | 玩家結束回合時批次結算（`moveCreatures()` 一次跑完） |
| 決策 | 每步重新讀 GameState：自保 → 命令 → 單一決策 | 函式內逐隻：`selectCreatureTarget`(behaviorType) → 移動 → 結算 |
| 回傳 | 經 gameStore domain action 即時變更狀態 | 回傳完整 `CreatureTurnResult` snapshot 由 `creatureAnimation` 一次套用 |
| 規則來源 | `aiOrders`（玩家設定）＋三個 ai*Rules 純函式 | `behaviorType` 寫死在 `creatureBehaviorRules` |

**方針：合併「基礎設施」，不合併「行為決策」**（與重構文件 §1.2 非目標「不做同一套行為樹」一致）：

值得合併的（已在付雙重維護稅）：
- **感知層**：距離、阻擋、可達性兩邊各寫一份，已產生行為分歧（creature `blocked` fallback 亂打防禦設施）。玩家攻擊已改走原子 action，不再依賴 Preview API。
- **驗證與執行邊界**：統一 Validator＋原子 domain action，AI 才能在無 UI 環境測試與重播。
- **事件格式**：全域日誌和逐步動畫需要單一事件協定，否則要寫兩套。

不合併的：
- **決策邏輯**：自保/命令 vs 行為型別是合法的陣營差異，硬合一棵行為樹只會用 if 分岔偽裝統一。
- **排程粒度短期不強求**：Creature 一回合幾十隻，改成玩家式逐步 store 更新會有效能成本；長期讓「批次回合」內部迴圈呼叫同一條共用管線即可，UI 節奏維持批次。

落點：即 §3 切片順序的 B（共用感知）→ C（AiAction+Validator）→ D（creature 拆管線）；拆完兩邊自然共享大部分流程，決策層各自保留。做任何 AI 改動前先自問：這件事屬於「基礎設施」（應共用）還是「行為」（應留在該陣營的 Policy）。

#### 1.3.1 合併的具體形狀：三分岔點設計

合併不是把兩套邏輯揉在一起，而是讓共用管線只認抽象介面，把陣營差異擠進**恰好三個被認可的分岔點**：

```text
GameState
   ↓
①Actor Adapter        ← 分岔點 1：唯一知道兩種 State 形狀的地方
   ↓
Perception／路徑      ← 完全無分支（只吃 Snapshot＋地圖）
   ↓
②Policy 查表          ← 分岔點 2：決策邏輯的選擇在這裡一次解決
   ↓
Planner（共用骨架）
   ↓
Validator（共用檢核＋少量陣營規則掛鉤）
   ↓
③Executor 戰鬥效果    ← 分岔點 3：獎勵／攻城傷害／功法觸發差異用 hook 注入
   ↓
Event／Log            ← 完全無分支（單一格式）
```

關鍵程式碼形狀（示意）：

```ts
// 分岔點 1：Adapter——全 codebase 唯一允許 ref.kind 分岔處理資料形狀
const getActorSnapshot = (state: GameState, ref: AiActorRef): AiActorSnapshot =>
  ref.kind === 'player' ? snapshotFromPlayer(state, ref.id) : snapshotFromCreature(state, ref.id)

// 分岔點 2：決策選擇——用註冊表查表，不是散落的 switch/case
const CREATURE_POLICIES: Record<CreatureBehaviorType, AiPolicy> = {
  scavenger: scavengerPolicy, hunter: hunterPolicy, sieger: siegerPolicy,
  wanderer: wandererPolicy, roamer: roamerPolicy,
}
const resolvePolicy = (state: GameState, ref: AiActorRef): AiPolicy =>
  ref.kind === 'player'
    ? resolvePlayerOrderPolicy(state, ref.id)   // 內部再按 active AiOrder 型別分：protect-base / support-player / 未來 construction
    : CREATURE_POLICIES[getCreatureBehaviorType(...)]
```

**「快速區別原演算邏輯」的唯一合法位置：**

| 分岔點 | 區別依據 | 形式 |
|---|---|---|
| ①Adapter | `ref.kind`（'player' \| 'creature'） | 一個普通三元/switch，可接受 |
| ②Policy 選擇 | 玩家→active `AiOrder.type`；Creature→`behaviorType` | **Record 註冊表查表**優先於 switch——新增行為型別＝加一筆資料，不改核心 |
| ③戰鬥執行效果 | 共用傷害解析序列＋陣營 hook 物件（玩家：功法觸發/獎勵；Creature：攻城傷害/Buff） | hook 函式由 Policy 附帶，不在 executor 裡寫 if |

兩條防劣化紀律：
1. **禁止布林旗標**（`isPlayer: true` 沿參數鏈傳遞）——那是重複邏輯爬回來的路。
2. **聞到味道要回報**：若在感知、驗證、事件層發現自己想寫 `if (kind === 'player')`，代表該差異其實是 Policy 或 hook 的職責，應上移到分岔點 ②③。

遷移對應：B 抽感知時兩側先各自呼叫共用函式（無分岔）；C 的 Validator 先以「只記錄不阻擋」模式上線再收緊；D 拆 `moveCreatures()` 後，Creature 各階段變成同一 Planner 介面的薄轉接，批次回合＝同步 for 迴圈跑共用管線。每一步舊入口照常運作，行為保持承諾不變。

#### 1.3.2 resolvePolicy 的職責邊界與多步行為（踩點怎麼來的）

**resolvePolicy 幾乎不做任何事——這是刻意設計。** 它只負責查表回傳哪個 Policy 物件決策（O(1)，無計算、無 IO、不移動、不評分、不迴圈）。理由：「誰在做決策」必須一眼可預測，否則除錯時無法定位行為來自哪一層。

「移動力沒用完就一路踩點」不是 Policy 做的，是整條迴圈疊出來的：

```text
Scheduler 迴圈（真正讓 AI 走起來的地方）：
while (仍有行動資源 && 上一步不是 end-turn/hold) {
    perception = buildPerception(state, actorRef)             // ① 感知層：每步重新感知
    rescue     = checkEmergency(perception)                   // ①' 自保層：優先於一切，可短路
    policy     = resolvePolicy(state, actorRef)               // ② 分岔點②：查表，找到「誰負責」

    // ③ Goal 層：policy.selectGoal 把命令／習性翻譯成 AiGoal（回答 why）
    goal       = rescue ? RESCUE_GOAL                         // 自保插隊＝暫換目標，不改原命令
                     : policy.selectGoal(perception, actorParams)
    if (!goal) → end-turn                                     // 無目標 → 安全結束

    // ④ Planner：planAiAction 把（感知＋goal）翻譯成一個 AiAction（回答 what-now）
    { action, nextBlackboard } =
        planAiAction({ perception, goal, blackboard, scoring: policy.scoring })

    if (!validateAiAction(state, action)) → retry/stale 上限後 end-turn
    executeAiAction(state, action)                            // ⑤ Executor 經 domain action 落地
    blackboard = nextBlackboard                               // ⑥ 黑板往下一步傳
}
```

三個要點：

1. **`goal` 在迴圈內、每次迭代重取**，不是迴圈外算一次帶進來——命令會中途變化（支援目標死亡→paused、玩家改命令、據點被毀→failed），每步都要用最新 GameState 重新確認 goal 是否仍成立。
2. **Policy 拆成兩個方法**（重構文件 §8.3 原設計）：`selectGoal()` 產目標、`scoring` 附帶評分參數；動作翻譯交給共用的 `planAiAction`（見 §1.3.3）。
3. **Emergency 在 selectGoal 之前短路**：它不修改玩家的命令／goal，只是本次迭代暫時換上 `RESCUE_GOAL`（撤退／脫離）；危機解除後下一步自然取回原 goal——這就是「自保不修改命令、解除後恢復」的實作位置。

| 職責 | 歸屬 |
|---|---|
| 每步只回一個 `move`（通常是相鄰格或短程落點） | `planAiAction`（Planner） |
| 產生並維持本步的 AiGoal | `policy.selectGoal` |
| 走完一步再問一次、直到移動力耗盡 | **Scheduler 迴圈** |
| 「我在巡邏哪個點、別每步亂換目標」的連續性 | **AI 黑板**（暫態，不進 GameState／存檔，符合戰略文件 §3.4） |
| 停止條件（體力盡、hold、stale 重試超限） | Validator＋迴圈判斷 |

黑板做成**顯式參數**而非 module 全域：`planAiAction({ perception, goal, blackboard })` 回傳 `{ action, nextBlackboard }`——純函式、可重現、單測好寫。內容例如「當前巡邏目標座標、最後已知敵人位置」。

兩條邊界：
1. **Policy 內部禁止自己 while 完整回合**——那會讓 Validator 與動畫插不進中間步驟，違反單一決策原則。「多格路徑」的正確做法是回傳帶 `path?: Position[]` 的 move action，執行仍逐段過驗證。
2. **逐步踩 vs 一口氣走是 Policy 的參數選擇**：近距離巡邏用相鄰格逐步（每步可被新威脅的自保攔截、動畫可逐步呈現）；長途返防用單一帶 path 的 move（省感知次數）。同一套管線都支援，差異只在 policy 回什麼。

現況註記：目前玩家 AI 已隱性以此模式運作——App.tsx 的 effect 在 state 變更後重新觸發就是那個迴圈，只是藏在 React 裡；合併工作的一部分是把它顯式化為 `aiTurnScheduler` 的迴圈（切片 E），Creature 批次則是同一管線外套同步 for。

#### 1.3.3 AiGoal 與 Planner：目標與翻譯機

**AiGoal＝宣告式目標：「我要達成什麼狀態」，不是「下一步做什麼」。** 它是 Goal Policy 層的產出、Planner 的輸入，本質是任務簡報：

```ts
type AiGoal =
  | { kind: 'protect-base'; baseId: string; radius: number; retreatHealthPercent: number }
  | { kind: 'support-player'; playerId: string; maxDistance: number; retreatHealthPercent: number }
  | { kind: 'creature-role'; behaviorType: CreatureBehaviorType; aggroRange: number; homePosition?: Position }
  | { kind: 'hold-position' }   // 沒命令／沒目標時的安全預設
```

特性：
- **不可執行、只描述意圖**：沒有「往哪走一格」這種戰術細節。
- **壽命長於單步行動**：一次回合內（甚至跨回合）穩定；`AiAction` 只活一步。「自保結束後恢復原命令」正是靠這個——危機只是插隊，goal 從沒變過。
- **可以為 null**：policy 找不到合理目標 → 回 null → Scheduler 走 hold/end-turn。
- **攜帶參數**：radius、maxDistance 等玩家調整值跟著 goal 走，Planner 不回頭查 `aiOrders`。

**Planner＝戰術參謀：把（感知＋目標）翻譯成恰好一個 AiAction。**

```ts
type PlanInput = { perception: AiPerception; goal: AiGoal; blackboard: AiBlackboard }
type PlanResult = { action: AiAction; nextBlackboard: AiBlackboard }  // action 帶 path 與 reason
planAiAction(input: PlanInput): PlanResult
```

職責邊界：

| Planner 做 | Planner 不做 |
|---|---|
| 把 goal 翻譯成候選行動集（趨近移動／相鄰攻擊／採集…） | 執行（Executor 的活） |
| 用確定性評分選出一個（距離、體力成本、威脅分） | 最終合法性裁決（Validator 的活） |
| 為多格移動附上 `path` | 改 GameState |
| 寫 `reason` 字串供日誌與測試斷言 | 分岔陣營——內部零 `if (kind)` |

陣營差異只從兩個縫進來：**(a) goal 是誰給的**（玩家命令 vs behaviorType）、**(b) 評分參數由 Policy 附帶**（aggroRange、追擊上限、stoppingDistance）。Planner 本體共用。

一回合實例（protect-base）：

| 迴圈次 | 感知摘要 | Goal | Planner 產出 |
|---|---|---|---|
| 1 | 敵人距據點 3 格、我距敵人 4 格、體力 12 | protect-base(洛陽, r=6) | `{type:'move', path:[…], reason:'intercept-threat'}` |
| 2 | 我已相鄰敵人 | 同上 | `{type:'attack', target:'creature-7', reason:'adjacent-hostile'}` |
| 3 | 敵人死了、我在半徑內無威脅 | 同上 | `{type:'hold-position', reason:'no-threat'}` → 迴圈結束 |

每次迴圈重新感知重新規劃——goal 不變，戰術隨世界更新，不預鎖整回合路徑（符合戰略文件 §2.2）。

現有程式碼對應與切片落點：目前沒有獨立 Planner——`chooseDefenseAction()` 與 `selectCreatureTarget()` 都是「讀目標＋選戰術」混在一個函式。切片 C/D 拆成：

```text
src/game/ai/planner/
├── planAiAction.ts          # 共用骨架：候選生成 → 評分 → 選一
├── planPlayerAiAction.ts    # 薄層：protect-base / support-player 參數化
└── planCreatureAction.ts    # 薄層：五種 behaviorType 參數化
```

後兩個檔案必須是同一骨架的參數注入（評分權重表＋候選規則集），不能長成兩棵決策樹——否則 §1.3.1 三分岔點紀律就破了。

一句話總結：**AiGoal 回答 why，AiAction 回答 what-now，Planner 是兩者之間那台確定性翻譯機。**

#### 1.3.4 決策代碼住在哪：resolvePolicy vs selectGoal vs planAiAction

「AI 決策」其實是**兩層決策**加上一層「派工」：

| 層 | 函式 | 做的決策 | 陣營專屬邏輯 |
|---|---|---|---|
| 派工（非決策） | `resolvePolicy` | **誰**來決策（查表） | 零——只看 kind／order.type／behaviorType |
| 戰略決策（why） | `policy.selectGoal()` | 要達成什麼：scavenger 決定「搶那個資源點」、protect-base 決定「攔截接近洛陽的敵人」 | **全部在這**——現有 `chooseDefenseAction`／`selectCreatureTarget` 的判斷邏輯遷來此處 |
| 戰術決策（what-now） | `planAiAction()` | 這一步做什麼：往哪走、打誰、附 path、寫 reason | 零 if 分岔——差異靠 `scoring` 參數注入 |

`resolvePolicy` 裡沒有任何遊戲性判斷：回傳值只依賴（kind、命令型別、存活與否），永遠不看座標與威脅。這是可測試契約。

`planAiAction`（§1.3.3 的 PlanInput／PlanResult）就是迴圈第④步，直接參與每步決策：

```text
while (...) {
    ...
    goal = rescue ? RESCUE_GOAL
                  : policy.selectGoal(perception, actorParams)   // ← 決策 A：選目標
    { action, nextBlackboard } =
        planAiAction({ perception, goal, blackboard,
                       scoring: policy.scoring })                // ← 決策 B：選動作
    validate → execute
}
```

四個輸入各自餵給 Planner 不同的判斷材料：

```ts
type PlanInput = {
  perception,   // 候選從哪來：可見敵人、可達位置、路徑成本都在這
  goal,         // 什麼算「進展」：目標座標、半徑限制、停止距離
  blackboard,   // 連續性：巡邏點不亂換
  scoring       // 從 policy 注入的性格：aggroRange、追擊上限、權重表
}               // → 產出恰好一個 AiAction＋更新後的黑板
```

實例走一遍（scavenger 找資源）：
1. `resolvePolicy` → 回傳 `scavengerPolicy`（尚未發生任何遊戲性決策）
2. `scavengerPolicy.selectGoal(perception)` → 「最近資源點 r-3 在 4 格外」→ goal
3. `planAiAction(...)` → 用感知中的可達位置算路徑 → `{ type:'move', path:[…], reason:'pursue-resource' }`

把第 2 步換成 hunterPolicy，同一台 Planner 就會朝玩家移動；敵人剛好相鄰時，兩者的評分都會讓 attack 勝出。**同一台翻譯機、不同簡報、不同權重**——這正是決策管線能共用、人格留在 Policy 的原因。

#### 1.3.5 策略選擇與「加新策略」：resolvePolicy 選整包，權重調參不開新檔

`resolvePolicy` 做的就是策略選擇（分診），但選擇粒度是**整包人格**。每個 Policy 物件＝一整套策略：

```ts
type AiPolicy = {
  selectGoal:      (perception, actorParams) => AiGoal | null  // 戰略：怎麼選目標
  scoring:         ScoringTable                                // 戰術：動作評分權重（餵給 Planner）
  emergencyConfig: EmergencyConfig                             // 自保門檻
  combatHooks:     CombatHooks                                 // 戰鬥差異（玩家功法／生物攻城）
}
```

| 你想做的事 | 正確做法 | 動 `resolvePolicy` 本體嗎 |
|---|---|---|
| 調整現有策略強弱（更凶、更膽小） | 改該 policy 的 `scoring`／`emergencyConfig` 數值（終點是外移成 JSON，見重構文件 §6） | 否 |
| 加全新策略人格（如伏擊型 `ambusher`） | 新增 policy 物件＋union 加型別＋註冊表加一筆 | 註冊表加一筆，函式本體不動 |
| 加一種玩家命令 | `AiOrder` union 加 type＋`PLAYER_ORDER_POLICIES` 加工廠 | 同上 |

**權重出現在兩個不同層，不可混同：**

① **Goal 層權重（選哪個目標）**——住在該 policy 的 `selectGoal`。「用權重計算各種 goal」的 policy 長這樣：

```ts
// 「機會主義者」：不寫死優先序，動態加權仲裁
const opportunistPolicy: AiPolicy = {
  goalWeights: {
    'pursue-resource': 1.0,   // 資源基礎誘因
    'hunt-player':     0.8,   // 獵殺誘因
    'defend-nest':     3.0,   // 巢穴受威脅時壓倒性優先
  },
  selectGoal(perception) {
    const candidates = enumerateCandidateGoals(perception)
    return maxBy(candidates, g => utility(g) * this.goalWeights[g.kind])
  },
  scoring: { /* 動作層權重，交給 Planner */ },
  combatHooks: creatureCombat,
}
```

既有的 scavenger（資源優先、退而求玩家）日後可重構成此形式——把寫死的 if 序換成權重表後，「同一種決策結構、不同參數」。

② **Action 層權重（目標定了之後選哪個動作）**——那是 `planAiAction` 的 `scoring` 參數，本來就是權重驅動，所有 policy 共用。

**何時才需要新 policy（嗅探測試）：**
- 只調權重／門檻 → 改參數或 JSON，**不要**開新 policy。
- 決策結構真的不同（候選目標產生方式不同、或有新的目標種類要仲裁）→ 才開新 policy。
- 兩個策略若只是 `goalWeights` 數字不同，它們應該是**同一 policy 的兩份設定**，不是兩份程式碼。權重全外移 JSON 後，「加策略」退化成「加一份設定檔」（呼應總原則 7 的白名單機制）。

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

### 2.7 現有 AI 測試資產盤點（2026-08-24 實測）：重構安全網評估

逐層對照「現有測試 ↔ 重構後元件」，結論：**決策與 Creature 層可沿用，執行層 A0 已補 8 例作為切片 A 驗收網。**

| 層 | 現有測試 | 重構後可否沿用 | 備註 |
|---|---|---|---|
| 玩家決策純函式 | `aiDefenseRules.test.ts`（4 例）＋ `aiSupportRules.test.ts`（4 例）＋ `aiSelfPreservationRules.test.ts`（3 例） | ✅ 原樣沿用 | 斷言精確到輸出形狀與 reason 字串（`'no-threat'`／`'command-paused'`／`'self-preservation'`）。wrapper 策略下（簽名與輸出不變、內部委託新管線）一行不改持續綠燈＝行為保持證據；但會從單元測試降格為端到端行為釘住，新內部元件仍需自己的單元測試 |
| Creature 批次行為 | `creatureActions.test.ts`（13 例）＋ `creatureNest.test.ts` 的 moveCreatures 互動（~10 例），全走公開批次介面黑箱斷言 | ✅ 大致可用 | 拆管線時只要 `CreatureTurnResult` 格式相容，這是最厚的安全網。⚠️ 切片 B 注入 RandomSource 後，凡走到巡邏分支的案例要把 Math.random stub 換成顯式注入偽隨機（現有案例幾乎都給了目標、未踩巡邏路徑，需逐一確認） |
| 執行層 | `gameStore.aiSteps.test.ts`（8 例，A0 已補） | ✅ 沿用為切片 A 驗收網 | 斷言結果（扣血／位移／回合／命令狀態），不鎖定 Preview API 內部路徑。失敗步由 store 回 `ok: false`、App.tsx 才 `endPlayerTurn` |
| Validator／Scheduler／事件化 | （全新元件） | — | 本來就沒有，按 §14.3/14.4 新寫 |

**由此推出的前置義務：**

1. **切片 A0＋A 已完成**（2026-08-24）：執行層整合測試與去 Preview 化。下一刀是切片 B（共用感知）。
2. 之後所有重構切片以「11 決策＋8 執行＋既有 Creature 案例持續通過」為行為基準；新增元件各補單元測試：resolvePolicy 查表契約（回傳值只依賴 kind／型別／存活）、planAiAction 確定性評分（同輸入同 seed 同輸出）、Validator stale 矩陣。

---

## 3. 建議切片順序（接手後的執行佇列）

| # | 切片 | 對應 | Priority | 驗收重點 |
|---|---|---|---|---|
| A0（A 的前置） | 為 `runAiDefenseStep`／`runAiSupportStep` 補 gameStore 整合測試（見 §2.7） | §14.4 生命週期 | P0 **已完成** | 8 例通過；此組測試即切片 A 的驗收網 |
| A | AI 攻擊去 Preview 化：新增原子攻擊 domain action，`runAiDefenseStep`／`runAiSupportStep` 改呼叫之；preview 保留給人類玩家 | 重構 Phase 2 前半 | P0 **已完成** | 「AI 不經 preview API」測試＋A0 全過 |
| B | ✅ 完成（2026-08-24）：共用感知 `src/game/ai/perception/`＋三規則檔委託＋`moveCreatures` 注入 RandomSource | 重構 Phase 1＋§12 Phase 1 | P0 | 既有測試全過；同 seed 巡邏一致（測試釘住）；不可達目標安全待命（測試釘住） |
| C | ✅ 完成（2026-08-24）：`aiAction.ts` 六型＋Adapter；`validateAiAction()`（11 例，含四種既有決策全 valid） | 重構 Phase 1（完成）＋Phase 2 前置 | P0 | 四種決策經 Adapter 皆 valid/reason；執行路徑零變化（未接線） |
| D | `moveCreatures()` 拆六段（perceive/select/plan/validate/execute/reduce），維持 `CreatureTurnResult` 相容 | 重構 §12 Phase 2 | P0 | 步驟化後既有 creature 測試全過；`blocked` 不再打錯防禦設施 |
| E | 統一 Player AI Scheduler：抽出 App.tsx 成 `src/game/ai/aiTurnScheduler.ts`，合併防守／支援執行框架 | 重構 Phase 3 | P1 | 回合生命週期測試；timer cancellation；同 Actor 不重入 |
| F | 事件化回合結果＋全域遊戲日誌＋逐步動畫消費 steps | 重構 Phase 3~5＋功能線 M4/M5 未完項 | P1 | 事件順序測試；動畫不改變規則結果；讀檔/Game Over 清理 |
| G | 建設 AI：`chooseConstructionAction()` 效用評分 → queue 狀態機（planned/building/completed/blocked/cancelled）→ 建築 action 執行＋完成提醒彈窗 | 功能線下一個 Milestone＋重構 Phase 6 | P2 | 前置不足／建料不足 → blocked 含原因；`paused` 方針不建造但可採集 |
| H | JSON policy 白名單系統（defensive-guardian／creature-sieger 等內建 config） | 重構 §6 | P2 | Schema 驗證＋fallback 測試；非法 condition/action 被拒 |

> 順序理由：A0 先織安全網，A 才能還債且解鎖 Executor；B 是所有後續共用地基；C/D 讓 Creature 與玩家 AI 有共同語言之後，E~H 才有意義。若使用者另有指示，以其為準。

---

## 附錄：快速事實

- 目前全套測試基準：2026-08-24 切片 A 後為 735 項全過（數字會漂移，動工前先跑一次記錄當下基準）。AI 相關 11 決策＋9 執行＋3 原子攻擊全過。
- `AiOrder` 同時間每 AI 只能一個 active；建立異型新命令 → 舊命令降級 paused；完全同型同目標 → 拒絕。
- 支援命令目標死亡 → 自動 `paused`（不是 failed）；據點被毀 → `failed` 且保存原因。
- 建設方針五種：`defense | economy | frontline | balanced | paused`；`paused` 不建造但可行動。
- AI 可用共享倉庫與共享裝備（與人類同套）；AI 不得修改自己或他人的命令（僅人類經戰略 Modal）。
- 戰略 Modal 預設防守半徑 6 格；AI 行動需要逐步動畫、日誌採全域遊戲日誌（§12 已確認決策，勿重新討論）。
