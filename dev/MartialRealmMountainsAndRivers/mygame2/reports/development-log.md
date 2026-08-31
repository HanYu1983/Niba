# 開發日誌

## 2026-09-01｜生物對稱防禦、等級 3+ 裝備外功與成長公式調整

### 本次完成

- **生物對稱防禦機制**：生物作為被攻擊方時套用與玩家一致的回避（依身法）、根骨減傷（依根骨，機率使傷害減半）、暴擊判定；生物攻擊玩家時可暴擊（1.5 倍）並支援多次攻擊（依體力）。新增 `getCreatureEvasionRate`、`getCreatureRootReductionRate`、`getCreatureCriticalRate` 純函式。
- **攻擊預覽顯示敵方減傷／回避**：攻擊目標為生物時，`createAttackPreview`／`createExternalSkillPreview` 的 `targetReduction` 改以根骨 ×2%（`getCreatureRootReductionRate`）計算，`targetEvasion` 依身法；`AttackPreviewModal`／`ExternalSkillPreviewModal` 顯示「敵方減傷率／敵方回避率」。
- **攻擊結果彈窗說明被減傷／被回避**：新增 `targetDefense: 'evaded' | 'reduced'` 欄位至 `AttackExecutionResult`、`ExternalDamageExecutionResult`（含 `areaTargets` 各目標）；`executeAttack`／`executeExternalDamage` 記錄判定結果；`formatAttackResult`／`formatExternalSkillResult` 顯示「敵人回避了本次攻擊，傷害為 0！」或「敵人根骨強健，傷害減半。」。
- **等級 3+ 生物裝備門派靈氣外功**：新增 `getCreatureEquippedExternalSkillIds`，依悟性容量（扣除內功需求後依序填裝）自動裝備所屬門派靈氣型外功（有常駐被動 Buff 者）；`createRoamerCreatures` 與 `spawnCreaturesFromNests` 皆套用，`createCreatureState` input 型別補上 `externalSkillIds`／`equippedExternalSkillIds`。
- **生物五維成長公式調整**：`getCreatureAttributes` 改為「基礎值 + 門派修正 × 等級 + 每級成長（2）× 等級」，修正值隨等級放大；`CREATURE_LEVEL_GROWTH` 提升至 2；Lv.1（等級加成 0）不套用門派修正，身法底限 2、悟性底限 5。

### 影響檔案

- 修改：`src/game/rules/creatureBehaviorRules.ts`（成長公式、`getCreatureEquippedExternalSkillIds`）
- 修改：`src/game/rules/playerDerivedRules.ts`（生物回避／減傷／暴擊函式）
- 修改：`src/game/worldGeneration.ts`、`src/game/actions/creatureActions.ts`（生成時裝備外功）
- 修改：`src/game/previewOrchestration.ts`、`src/components/AttackPreviewModal.tsx`、`src/components/ExternalSkillPreviewModal.tsx`（預覽顯示減傷／回避）
- 修改：`src/game/actions/combatActions.ts`、`src/game/types/combat.ts`、`src/game/actionResultFormatters.ts`（結果彈窗說明減傷／回避）
- 修改：`src/game/actions/creatureTurnPipeline.ts`（生物暴擊、多次攻擊）

### 驗證結果

- TypeScript：通過。vitest：**104 檔／1143 項全數通過**（含新增的護甲外功裝備、回避／減傷提示測試）。

### 下一步

- 確認攻擊預覽彈窗與結果彈窗在實際遊戲中正確顯示減傷／回避資訊。
- 確認等級 3+ 生物於巢穴與開局生成時正確裝備門派靈氣外功。

## 2026-08-27｜名冊角色功法帶入、殘卷結算與戰績修正

### 本次完成

- **名冊角色功法帶入功法設定頁**：`createInitialPlayers` 開局時只把初始內功寫入 `innerSkillId`（當前裝備），未寫入 `innerSkillIds`（已知內功清單），導致功法設定頁（`UnifiedSkillModal` 讀 `player.innerSkillIds`）看不到名冊角色帶入的內功。修正為將初始內功一併寫入 `innerSkillIds`（含吐納功，去重），外功原本就正確傳入 `externalSkillIds`。
- **「單回合最高傷害」NaN 修正**：`runStats.ts` 的 `recordDamageDealt`／`bumpRunStatMax` 對非有限數字不再寫入戰績，並以 `0` 為基準重新計算既有異常值；`GameOverModal` 顯示戰績時加 `Number.isFinite` 防護。
- **名冊角色殘卷結算修正**：
  - 結算成功後同步寫回最新自動存檔，讓存檔摘要正確顯示「已領取殘卷」。
  - 載入局末但尚未結算的存檔時，改以 `runId` 登記表判斷是否已結算，允許正常補發殘卷（舊存檔無 `runId` 時沿用舊規則防重）。
  - 僅在名冊角色實際寫入成功後才鎖定本局結算，避免角色資料異常時永久遺失獎勵。
- **`activeCharacterId` 移入 `GameState`**：名冊角色 id 直接隨存檔序列化（`GameState.activeCharacterId`），讀檔後優先從 state 還原、舊存檔回退到 payload 欄位；`startGame`／`restartGame`／`loadScenario`／`loadDebugMap`／`startTestCampaign`／`resetForTest` 皆同步模組變數與 state。`gameSave.ts` 的 payload 欄位保留作向下相容。

### 影響檔案

- 修改：`src/game/worldGeneration.ts`（`createInitialPlayers` 寫入 `innerSkillIds`）
- 修改：`src/game/runStats.ts`、`src/components/GameOverModal.tsx`（NaN 防護）
- 修改：`src/game/gameStore.ts`、`src/game/gameSave.ts`、`src/game/types.ts`（`activeCharacterId` 序列化與殘卷結算）
- 修改：`src/components/overlays/SystemOverlays.tsx`（以實際結算結果顯示殘卷）

### 驗證結果

- TypeScript：通過。vitest：**93 檔／1010 項全數通過**。

### 下一步

- 確認沙盒選用名冊角色後，功法設定頁能顯示帶入的內功／外功。
- 確認名冊角色完成對局後，結算畫面顯示殘卷、存檔標記「已領取」。

## 2026-08-26｜怪物主場五行化、視野抽象化、修路快捷指令

### 本次完成

- **怪物主場 Buff 改以五行屬性判斷**：將硬編碼的 `schoolId → 主場` 對應表改為「五行 → 主場」共有對應（`skillProgressionCatalog` 的 `martialSchoolCatalog[].element` 為單一事實來源）。新增流派只需具備五行屬性即自動獲得對應主場，無需逐一註冊。金、土皆歸山嶽主場（`home-turf-mountain`）；移除孤兒 Buff `home-turf-ruin`。五行概念（`MartialElement`、`getSchoolElement`、`elementHomeTurfBuffs`）集中於 `martialSchoolCatalog.ts`，`skillRules` 與 `playerDerivedRules` 皆自此引用，打破原本的循環依賴。
- **修復資源點修復距離條件**：`repairResourcePoint` 與採集一致，改用 `isSameOrAdjacent`（自身格或相鄰一格），修正 UI（Modal 允許自身格修復）與後端不一致的問題。
- **傷害型外功數字快捷鍵**：公用指令欄中傷害型外功依顯示順序對應數字鍵 1..N。新增共用 helper `getCommandPanelSkills`（依裝備順序過濾非 aura 外功），指令面板與快捷鍵監聽共用同一順序，確保兩者同步。
- **防禦建築視野抽象化**：將視野範圍抽到建築參數 `visionRange`（取代 `visibilityRules` 硬編碼的各地形常數）。所有防禦建築至少提供自身一格範圍（曼哈頓距離 ≤ 1）的視野；瞭望塔類依 `visionRange` 維持較大範圍。廢墟修復後的探索範圍同步改用 `visionRange`。
- **公用指令欄新增「修路」**：消耗 2 體力，將玩家所在格地形改為 `road`；不需據點、不需選格、不消耗建料。快捷鍵 **R**。新增 `buildRoadAtPlayer` action 與 `gameStore.buildRoad`，並移除防禦建築目錄中的「道路」（`'road'` 移出 `DefenseStructureType`，建造面板不再顯示）。保留 `changesTerrain`／`roadBuild` 作為未來非實體設施的擴充基礎。

### 影響檔案

- 修改：`src/game/catalogs/martialSchoolCatalog.ts`、`skillProgressionCatalog.ts`、`buffCatalog.ts`、`defenseStructureCatalog.ts`
- 修改：`src/game/rules/skillRules.ts`、`playerDerivedRules.ts`、`visibilityRules.ts`、`commandPanelSkills.ts`、`actionCostRules.ts`
- 修改：`src/game/actions/buildingActions.ts`、`ruinActions.ts`；`src/game/gameStore.ts`
- 修改：`src/hooks/useKeyboardShortcuts.ts`；`src/components/PlayerCommandPanel.tsx`；`src/App.tsx`
- 修改：`src/editor/rules/scenarioCompiler.ts`；測試若干

### 驗證結果

- TypeScript：通過。Build：通過。vitest：**88 檔／930 項全數通過**。

### 下一步

- 可為「修路」補上操作回饋（如成功後地圖格動畫）。
- 檢視 `home-turf-*` 各主場數值是否需依五行再平衡。

## 2026-08-25｜情境地圖 `inDevelopment` 標記與 UI 組件更新

### 本次完成

- **情境標記系統**：`public/data/scenarios/index.json` 新增 `inDevelopment` 旗標（預設 `false`），用於標記尚未完成開發的情境。編輯器下拉選單與遊戲開始畫面自動過濾未完成的內容。
- **湖風嘆情境重構**：`lake-wind-lament.json` 大幅重寫（+676 / -214 行）：
  - 重新設計地圖佈局與事件觸發邏輯。
  - 優化角色屬性平衡與難度曲線。
  - 新增區域進入／離開觸發器支援一次性區域移除功能。
- **UI 組件更新**：
  - `CampaignScenarioTab.tsx`：情境標籤頁支援顯示 `inDevelopment` 狀態提示。
  - `GameStartScreen.tsx`：遊戲開始畫面過濾未完成情境，僅顯示可玩內容。
  - `QuestSequencerModal.tsx`：任務序列彈窗改進區域觸發器的視覺化配置。
  - `scenarioStorage.ts`：情境存儲系統更新以支援新標記與清除已儲存情境功能。
- **編輯器功能增強**：
  - 新增區域編輯功能與進入／離開觸發器配置。
  - 實現一次性區域移除功能（由進入／離開事件觸發）。

### 影響檔案

- 修改：`public/data/scenarios/index.json`、`lake-wind-lament.json`
- 修改：`src/components/CampaignScenarioTab.tsx`、`GameStartScreen.tsx`、`QuestSequencerModal.tsx`
- 修改：`src/game/scenarioStorage.ts`

### 驗證結果

- TypeScript：通過。ESLint：通過。Build：通過。

### 下一步

- 持續完善情境編輯器的工作流。
- 考慮為 `inDevelopment` 情境提供開發者專用開關（如 dev mode 或查詢參數）。

## 2026-08-24｜AI 重構切片 L：Creature 感知層委託（距離單一事實來源）

### 本次完成

- `src/game/rules/creatureBehaviorRules.ts`：移除本地 `distance()` 實作，改 import 感知層統一出口 `manhattanDistance`（`ai/perception/distance.ts` → `rules/mapCellStateRules.getManhattanDistance`），以別名保持呼叫點零改動；`nearest()` 的「距離相同依 id 破平手」屬目標選擇策略，保留在決策側但底層走感知層。
- `src/game/actions/creatureTurnPipeline.ts`：本地 `stepDistance` 改為 `manhattanDistance` 別名；箭塔瞄準迴圈的內聯 `Math.abs` 距離算式一併替換。
- 盤點結論：管線的貪婪步進移動是領域模型（體力結算／陷阱觸發／堵路反擊語意），不是 `collectReachableCells` 的重複實作，維持原樣。自此 Creature 側不再有任何自帶的距離／路徑重複算式，perception 匯出函式成為唯一事實來源。
- 測試：本片為純重構（無新測試）；同 seed 巡邏／追擊釘住測試與全套 839 項零修改通過即為行為等價證明。

### 影響檔案

- 修改：`creatureBehaviorRules.ts`、`creatureTurnPipeline.ts`
- 文件：重構文件 §12 Phase 1 Result、playbook §3 L 列

### 驗證結果

- vitest：**81 檔／839 項全數通過**（與前片持平）
- tsc -b：通過；ESLint：零警告；Build：通過。

### 下一步

- §3 切片佇列（A0~L）全數完成。後續候選：§9.3 stale action 重試、policy priorities 強制排序（切片 K 已文件化的分歧）、外部 JSON config（§6.6）。

## 2026-08-24｜AI 重構切片 K：JSON policy 消費（emergency 參數＋Creature aggroRange 查表）

### 本次完成

- `src/game/ai/policy/aiPolicyRegistry.ts`：新增兩個消費 resolver——`getPlayerAiEmergency()`（defensive-guardian 的 emergency）與 `getCreatureAiParameters(behaviorType)`（經 `getCreaturePolicyId` 查表，查無走 fallback 人格 → undefined）。
- `src/game/aiSelfPreservationRules.ts`：`chooseSelfPreservationAction` 新增可選 `emergency` 參數；`minimumHealthPercent`／`surroundedEnemyCount` 未提供時逐項退回既有常數（10／2）。內建 defensive-guardian 的值與常數完全一致 → 零行為變化。`avoidFatalAttack` 欄位暫不消費（需要攻擊傷害預估，留待行為變更切片），已於文件註記。
- `src/game/gameStore.ts`：防守／支援兩 step 的自保呼叫傳入 `getPlayerAiEmergency()`。
- `src/game/rules/creatureBehaviorRules.ts`：新增 export `getCreatureAggroRange(behavior)`——policy 的 `parameters.aggroRange` 優先，fallback 退回 `CREATURE_AGGRO_RANGES` 常數表；`selectCreatureTarget` 改用之。`creature-scavenger.json` 補上 `"parameters": {"aggroRange": 5}`（=常數 5，零行為變化且讓消費路徑真實生效）。
- 測試＋7（aiSelfPreservationRules 四例：minimumHealthPercent 覆寫、surroundedEnemyCount 覆寫、內建值與常數逐情境全等、部分欄位 fallback；aiPolicyRegistry 三例：resolver 回傳值、scavenger/sieger 參數差異、getCreatureAggroRange 的 policy 優先與常數退回）。全套既有釘住測試零修改通過＝同 seed 行為一致。

### 已發現待處理（文件化，不在本片動）

- `chooseDefenseAction` 目前的分支執行序（attack→return-to-radius→intercept→hold）與 defensive-guardian priorities 的嚴格排序（intercept 80 應先於 return-to-radius 70）在「同時離基地過遠且有威脅進圈」情境下會分歧。強制以 policy 排序驅動分支屬行為變更，留待後續切片連同 §9.3 stale 重試一起處理。

### 驗證結果

- vitest：**81 檔／839 項全數通過**（前片 832＋本片 7）
- tsc -b：通過；ESLint：新碼零警告；Build：通過。

### 下一步

- 切片 L：Creature 感知層委託（`selectCreatureTarget` 與管線移動計算改用 `ai/perception/`，消除雙份距離/路徑實作）。

## 2026-08-24｜AI 重構切片 J：Creature 行動事件化（§1.3 事件格式單一協定）

### 本次完成

- `src/game/actions/creatureTurnPipeline.ts`：
  - `CreatureTurnContext`／`CreatureTurnResult` 新增 `events` 累加器與 `round` 輸入；`executeCreatureAction` 回傳 `CreatureExecutionOutcome`（attack 含目標 id/kind/position／move／idle）作為行為事實來源。
  - 新增 export `buildCreatureActionEvent(...)`：把單一 Creature 的回合行動轉成 §4.5 `AiActionEvent`（與玩家 AI 同格式）。攻擊／移動記 succeeded；驗證失敗或體力不足的待命記 failed 並帶原因；無目標待命記 succeeded。
  - orchestrator 逐隻 push 事件，順序與 `survivingCreatures` 輸入順序一致（批次結果一致）。
- `src/game/actions/creatureActions.ts`：`moveCreatures` 尾端新增可選 `round` 參數（預設 0），傳入管線供事件歸屬回合。
- `src/game/actions/turnActions.ts`：`endPlayerTurn` 回合完成時把 `scheduledCreatureTurn.events` 依序附加進回傳 state 的 `actionEvents`（既有玩家事件保留、舊存檔相容不變）；steps 動畫快照照舊。
- `src/game/gameStore.ts`：moveCreatures dependency 補傳 `currentState.round`。行動日誌面板（ActionLogPanel 讀 `actionEvents`）自此可見 Creature 攻擊／移動／待命。
- 測試＋6（新檔 creatureTurnPipeline.events.test.ts：相鄰攻擊事件全欄位、無目標待命 succeeded、體力不足 failed、多隻順序一致性；endPlayerTurn 整合兩例：回合完成時玩家事件保留＋Creature 附加、回合未完成 actionEvents 不變）。既有 creature 測試零修改全過。

### 影響檔案

- 修改：`creatureTurnPipeline.ts`、`creatureActions.ts`、`turnActions.ts`、`gameStore.ts`
- 新增：`src/game/actions/creatureTurnPipeline.events.test.ts`
- 文件：重構文件 §12 Phase 4 補實作現況、playbook §3 J 列

### 驗證結果

- vitest：**81 檔／832 項全數通過**（前片 826＋本片 6）
- tsc -b：通過；ESLint：新碼零警告；Build：通過。

### 下一步

- 切片 K：JSON policy 消費（玩家 AI 自保參數與優先序讀 `getAiJsonPolicy()`；Creature 依 `getCreaturePolicyId()` 參數化門檻，同 seed 釘住）。

## 2026-08-24｜AI 重構切片 I：Validator 接線（§9.2 單一把關落地）

### 本次完成

- `src/game/ai/validation/validateAiAction.ts`：
  - 新增 export `validateAiDefenseDecision(state, playerId, decision)`：把 `AiDefenseAction` 決策經 Adapter（`defenseActionToAiAction`）轉成 `AiAction` 後走同一套 §9.2 驗證，作為 store step 執行前的單一把關點。
  - 更新 docblock：creature kind 回合資格改由管線 `validateCreatureTurnEligibility` 執行（兌現切片 C 遺留註解）。
- `src/game/actions/creatureTurnPipeline.ts`：
  - 新增 export `validateCreatureTurnEligibility(creature)`（存活＋座標有限值），orchestrator 在 select／plan 前呼叫；不合格者跳過該回合、不產生行動或日誌。因倖存者清單已預過濾，行為零變化（釘住網全數通過即證明）。
- `src/game/gameStore.ts`：
  - 新增模組級 helper `validateAiStepAction`；防守／支援兩 step 的 attack／move／end-turn 分支與建設 step 的 build／paused-collect 分支全部改為「先建 AiAction → validateAiAction → 不合格記 failed 事件並回傳失敗；合格才執行既有路徑」。
  - 建設 build 分支驗證失敗時將 queue item 標 blocked（原因＝驗證訊息）後換下一候選，沿用 §14.6 狀態機語意。
- 測試＋7（validateAiAction.test.ts 新增 validateAiDefenseDecision 四例：合法攻擊／移動、死目標拒絕、超距離拒絕、牆內不可達移動拒絕、非當前回合拒絕、chooseDefenseAction 實際輸出必過驗證的零行為變化保證；新檔 creatureTurnPipeline.validate.test.ts 三例：存活通過／死亡拒絕／座標缺失或 NaN 拒絕）。

### 影響檔案

- 修改：`validateAiAction.ts`（＋測試）、`creatureTurnPipeline.ts`、`gameStore.ts`
- 新增：`src/game/actions/creatureTurnPipeline.validate.test.ts`
- 文件：重構文件 §9.2 補接線現況、playbook §3 I 列

### 驗證結果

- vitest：**80 檔／826 項全數通過**（前片 819＋本片 7）
- tsc -b：通過；ESLint：新碼零警告；Build：通過。

### 下一步

- 切片 J：Creature 行動事件化（pipeline 決策同步產出 AiActionEvent 流入 GameState.actionEvents，行動日誌面板可見 Creature 行動）。

## 2026-08-24｜AI 重構切片 H：JSON policy 白名單系統（內建 config＋Schema 驗證＋fallback）

### 本次完成

- 新增 `src/game/ai/policy/aiJsonPolicy.ts`（重構文件 §6.3／§6.7）：
  - `AiConditionId`（7 條件）與 `AiActionId`（9 行動）白名單常數；`SUPPORTED_AI_POLICY_VERSION = 1`。
  - `validateAiJsonPolicy(raw)`：id 非空、version 必須為支援版本、actorKind 限 player/creature、condition/action 必須在白名單（非法項目一律拒絕，不執行任意內容）、priority 有限數值、生命百分比 0～100、包圍敵數非負、avoidFatalAttack 布林、parameters 僅 number/boolean/string。錯誤逐條彙報；通過後 `Object.freeze` 為不可變 Policy。
- 內建設定檔 `src/game/ai/configs/`：`defensive-guardian.json`（§6.4 範例原文）、`creature-sieger.json`（§6.5 範例原文）、`creature-scavenger.json`（拾荒型：自保→反擊→collect-resource→wander）。tsconfig 加 `resolveJsonModule` 以型別安全載入 JSON。
- 新增 `src/game/ai/policy/aiPolicyRegistry.ts`（§6.6／§6.8）：
  - `loadAiPolicyRegistry(configs)`：驗證並註冊；非法設定與重複 id 被略過且回報錯誤清單（模組載入時對內建 config 執行，錯誤走 console.error）。
  - `getAiJsonPolicy(id, actorKind)`：查無 id 或 actorKind 不符 → 回傳同類預設 fallback（default-player／default-creature：自保→反擊→待命），AI 回合不得卡死；設定不寫入 GameState。
  - `getCreaturePolicyId(behaviorType)`：sieger→creature-sieger、scavenger→creature-scavenger，其餘行為回 null 走 fallback——供後續 Planner 依行為型別取 policy。
- 測試＋19（aiJsonPolicy 13 例：白名單拒絕／範圍驗證／凍結不可變／多錯誤彙報；aiPolicyRegistry 6 例：三內建載入、未知 id fallback、跨 actorKind 拒用、行為型別對應、非法＋重複 id 載入路徑）。

### 影響檔案

- 新增：`src/game/ai/policy/aiJsonPolicy.ts`（含測試）、`src/game/ai/policy/aiPolicyRegistry.ts`（含測試）、`src/game/ai/configs/*.json` ×3
- 修改：`tsconfig.app.json`（resolveJsonModule）
- 文件：重構文件 §6 新增 §6.10 實作現況、playbook §1／§3 H 列

### 驗證結果

- vitest：**79 檔／819 項全數通過**（前片 800＋本片 19）
- tsc -b：通過；ESLint：新碼零警告；Build：通過。

### 下一步

- 重構計畫 §3 切片佇列（A~H）全數完成；後續依 §15 各 Phase 剩餘項目（stale 重試、逐步動畫接線等）另開切片。

## 2026-08-24｜AI 重構切片 G：建設 AI（效用評分＋queue 狀態機＋完成提醒）

### 本次完成

- 新增純決策模組 `src/game/ai/construction/constructionAi.ts`：
  - `pickNextBuildCandidate()`：效用評分＝queue item 的 priority＋方針類別加權（defense→城牆/兵營、economy→倉庫/貿易市場/交易所/總管府、frontline→醫療室/工坊/驛站；balanced/paused 不加權）；同分依佇列順序穩定排序。
  - 狀態過濾：跳過 cancelled／completed；blocked 僅在原因為「建料不足。」時可重試（暫時性阻塞），永久性原因不再嘗試。
  - 武館流派解析與 `constructBuilding` 同源：據點有 `martialSchoolId` 才能解析出唯一武館模板；未定流派時回傳偽候選（`unknown:` 前綴）交執行層標記 blocked，不在決策層靜默丟棄。
  - `pickUpgradeCandidate()`／`chooseConstructionAction()`：建造優先、其次升級最低等建築、最後待命（含原因）。
- gameStore 新增 `runAiConstructionStep(playerId)`：
  - 守衛同其他 AI step（isAI／當前回合／creatureTurnInProgress／gameOver／計畫存在、據點存在）。
  - `paused` 方針不主動建造：改為採集相鄰資源點（collectResourcePoint），無相鄰點則記 hold 並結束回合——符合「paused 方針不建造但可採集」驗收。
  - 體力護欄：體力不足以建造時直接結束回合且**不**標 blocked（暫時性狀態不可污染 queue）。
  - 逐候選嘗試 `constructBuilding`：成功 → item `completed`＋build succeeded 事件＋完成提醒彈窗（blockingModal 暫停排程器直到玩家關閉）；失敗 → item `blocked`（帶執行層中文原因）續試下一候選；全受阻且 `allowUpgrade` 時升級既有建築，否則結束回合。
- 排程器整合：`aiTurnScheduler.ts` 的 `AiOrderKind` 新增 `'construction'`、deps 新增 `runConstructionStep`；App effect 改為戰術命令（防守／支援）優先，無活躍命令且有建設計畫時 requestStep('construction')——威脅解除後自動恢復建設。
- 測試＋22（constructionAi 純函式 14 例：評分／方針加權／穩定排序／狀態過濾／武館解析／升級候選／決策優先序；gameStore.construction 7 例：建料不足標 blocked、補料自動重試 completed＋扣料＋日誌＋彈窗、硬阻擋跳過下一項、paused 採集／hold、體力不足保 planned、守衛拒絕；scheduler 1 例 construction 分派）。

### 影響檔案

- 新增：`src/game/ai/construction/constructionAi.ts`（含測試）、`src/game/gameStore.construction.test.ts`
- 修改：`src/game/gameStore.ts`（runAiConstructionStep＋updateConstructionPlanItem helper）、`src/game/ai/aiTurnScheduler.ts`（construction 步驟型別）、`src/App.tsx`（effect 建設分支）、`src/game/testHelpers/aiTestFixtures.ts`（makeTestResourcePoint／makeConstructionPlan）
- 文件：重構文件 §15 Phase 6（Done＋Result）、playbook §1／§3 G 列

### 驗證結果

- vitest：**77 檔／800 項全數通過**（前片 778＋本片 22）
- tsc -b：通過；ESLint：新碼零警告（僅剩 App.tsx 既有一處 exhaustive-deps 舊警告）；Build：通過。

### 下一步

- 切片 **H**：JSON policy——把 AI 決策參數外移成資料檔（playbook §3 最後一片）。

## 2026-08-24｜AI 重構切片 F：Player AI 行動事件化＋全域行動日誌

### 本次完成

- 新增 `src/game/ai/aiActionEvent.ts`（重構文件 §4.5）：
  - `AiActionEvent`＝`{ id, round, actor, action: AiAction, result: 'started'|'succeeded'|'failed', reason?, createdAt }`，可序列化、Creature／玩家 AI 同一格式（本切片先接 Player AI）。
  - `createAiActionEvent()` 以遞增序號產生 id（同回合多筆可比對順序）；未顯式給 reason 時沿用 `action.reason`。
  - `formatAiActionEvent()` 產生日誌一行文字（`[第 X 回合] 名字 動作細節（原因）`，失敗帶原因）。
- `GameState.actionEvents?: AiActionEvent[]`（可選欄位，比照其他新進欄位慣例）：上限 `MAX_ACTION_EVENTS = 200` 只留最新，隨存檔整包序列化；舊存檔缺欄位 → 讀取端一律 `?? []` 相容。
- **事件化接線**：`runAiDefenseStep`／`runAiSupportStep` 每一步決策經切片 C 的 `defenseActionToAiAction` 轉成通用 `AiAction` 後寫入事件——攻擊／移動／自保撤退／原地待命／支援目標消失暫停命令，成敗如實記錄（失敗含執行結果訊息，例如「體力不足。」）。決策→執行的對應邏輯零改動，只加側寫。
- **Game Over 防護**：兩個 step 的守衛條件加上 `state.gameOver`（拒絕執行、不寫事件）；App.tsx 的 Scheduler effect 守衛同步加上 `gameState.gameOver`（取消待執行 timer）。讀檔清理＝讀檔整包替換 state＋effect 重跑自動 cancel。
- **UI**：新增 `src/components/ActionLogPanel.tsx`（antd Modal＋List，最新在上、失敗紅字），遊戲畫面狀態卡旁新增「📜 行動日誌」按鈕開啟。
- 測試＋11（aiActionEvent 4 例：id 遞增順序／格式化成功、失敗、無名 actor；gameStore.actionEvents 7 例：attack succeeded、hold+結束回合、failed 含原因、支援暫停 end-turn、連續兩步事件順序與 id 遞增、Game Over 拒絕不寫入、舊存檔缺欄位相容）。

### 本切片不改變什麼

- AI 決策與規則結果零變化（事件為純側寫；既有 aiSteps 釘住網原樣通過）。
- Creature 行動仍走既有 steps 快照＋CreatureActionLog 動畫路徑（重構文件 §12：「測試穩定後再改用 AiActionEvent[]」——待 Creature 回合全面事件化時收斂）；人類玩家行動的日誌埋點留待建設 AI／正式 UI 里里程碑。

### 影響檔案

- 新增：`src/game/ai/aiActionEvent.ts`（＋測試）、`src/game/gameStore.actionEvents.test.ts`、`src/components/ActionLogPanel.tsx`
- 改：`src/game/types.ts`（GameState.actionEvents）、`src/game/gameStore.ts`（append/record helpers＋兩 step 接線＋gameOver 守衛）、`src/App.tsx`（日誌按鈕＋面板＋scheduler gameOver 守衛）
- 文件：本日誌、架構文件 §15 Phase 5、playbook §1／§3

### 驗證結果

- vitest：75 檔 / **778 項全過**。tsc -b：通過。ESLint：新碼零警告（僅剩 App.tsx 既有一處 exhaustive-deps 舊警告）。Build：通過。

### 下一步

- 切片 **G**：建設 AI——`chooseConstructionAction()` 效用評分 → queue 狀態機（planned/building/completed/blocked/cancelled）→ 建築 action 執行＋完成提醒彈窗。

## 2026-08-24｜AI 重構切片 E：Player AI Scheduler 抽出 App.tsx

### 本次完成

- 新增 `src/game/ai/aiTurnScheduler.ts`（重構文件 §11 Turn Scheduler／§12 Phase 3）：
  - 防守（`protect-base`）與支援（`support-player`）合併為單一執行框架——差異只剩 Policy（`requestStep(actorId, orderType)` 內部分派），計時、取消、失敗結束回合全部共用。
  - **同 Actor 不重入**：同一 actor 已有待執行 step 時，重複請求為冪等操作（不新增、不重置計時器）；換 Actor 時自動取消前一筆。
  - **stale 防護**：timer 觸發時先驗證 Actor 仍是當前回合玩家才執行；cancel 後不得觸發任何回呼。
  - 失敗語意與原實作一致：step 回 `{ ok: false }` 且 Actor 仍在回合中 → 呼叫 `endTurn(actorId)`。
  - `AI_TURN_STEP_DELAY_MS = 350` 成為具名常數；`setTimeout` 只作動畫節奏（§11.3）。
- `App.tsx` 的 AI effect 從「自行 setTimeout＋分派」改為呼叫 scheduler（`requestStep`／cleanup `cancel()`）；App 不再直接決定 AI 下一步。scheduler 實例放 `useRef` 只建一次。
- 測試＋7（fake timers）：延遲生命週期、兩種訂單正確分派、cancel 後 stale timer 不執行、同 Actor 冪等不重入（含不重置計時）、換 Actor 取消前一筆、失敗結束回合、換人後 stale 不執行也不誤結束新玩家回合。

### 本切片不改變什麼

- AI 決策本體（`runAiDefenseStep`／`runAiSupportStep`）與節奏（350ms）完全不變；純排程框架搬家＋防護強化。
- Creature phase 排程與 §11 的統一 `runAiTurnStep` 入口屬後續切片（F/G 接線時收斂）。

### 影響檔案

- 新增：`src/game/ai/aiTurnScheduler.ts`（＋測試 7 例）
- 改：`src/App.tsx`（AI effect 改用 scheduler）
- 文件：本日誌、架構文件 §12 Phase 2 計畫表 Phase 3／§15 Phase 3、playbook §1／§3

### 驗證結果

- vitest：73 檔 / **767 項全過**。tsc -b：通過。ESLint：新碼零警告（App.tsx 剩 1 個既有的 `map.cells` exhaustive-deps 警告，位於拾取判定 effect，非本次範圍）。Build：通過。

### 下一步

- 切片 **F**：Player AI 事件化——`AiActionEvent[]` 取代 steps 快照陣列。

## 2026-08-24｜AI 重構切片 D：moveCreatures 拆六段管線＋blocked 誤擊修復

### 本次完成

- 新增 `src/game/actions/creatureTurnPipeline.ts`，把 288 行的 `moveCreatures()` monolith 拆為六段（重構文件 §12 Phase 2）：
  - `createCreatureTurnContext()`（perceive）：世界快照＋佔位圖＋可變累加器。
  - `selectCreatureTarget()`（沿用既有規則）→ 最小目標快照 `CreatureTargetSelection`。
  - `planCreatureMovement()`（plan）：貪婪步進預演，隨機來源消費順序與舊實作逐次一致（seed 巡邏測試原樣通過）。
  - `validateCreaturePlan()`（validate）：終點可通行、未被他佔、體力非負、阻路設施仍存活；失敗則安全待命。
  - `executeCreatureAction()`（execute）：陷阱套用＋互動分支（道具→據點→資源→玩家→防禦設施），傷害公式原樣搬移。
  - `reduceCreatureEvents()`（reduce）：終點吞噬／反震／組裝下一隻快照與動畫 step。
- **修復 blocked bug**：舊實作被擋時攻擊「任一相鄰」防禦設施（依陣列順序），可能打錯目標、甚至體力耗盡被牆擋住也誤擊無辜設施。新實作在 plan 段以 `findBlockingDefenseId` 找出真正堵住最佳去路的那座（除防禦設施外皆可通行且體力可負擔的鄰格中離目標最近者）；體力／地形造成的 blocked 不再觸發反擊。
- `creatureActions.moveCreatures` 簽名與回傳契約不變（薄委託 `runCreatureTurn`）；`CreatureTurnResult`／`CreatureTurnStep` 型別移至管線檔並轉出口維持相容。
- 測試＋2：兩座相鄰木柵只打「堵路的東側」（非陣列順序優先的北側）；體力耗盡被擋不誤擊旁邊木柵。

### 本切片不改變什麼

- 移動模型仍是貪婪步進（非 Dijkstra 重尋路——那是統一移動管線的後續議題）；巡邏 seed 可重現性原樣保留。
- 箭塔先手攻擊、巢穴生成（`spawnCreaturesFromNests`）不在本次範圍。

### 影響檔案

- 新增：`src/game/actions/creatureTurnPipeline.ts`
- 改：`src/game/actions/creatureActions.ts`（−288 行 monolith → 薄委託）、`creatureActions.test.ts`（+2 例）
- 文件：本日誌、架構文件 §12 Phase 2、playbook §1／§3

### 驗證結果

- vitest：72 檔 / **760 項全過**（含既有 17 例 creature 測試零修改通過）。tsc -b：通過。ESLint：通過。Build：通過。

### 下一步

- 切片 **E**：Player AI Scheduler 抽出 App.tsx 成 `aiTurnScheduler.ts`（timer cancellation、同 Actor 不重入）。

## 2026-08-24｜AI 重構切片 C：統一 AiAction 型別＋Action Validator

### 本次完成

- 新增通用資料模型 `src/game/ai/aiAction.ts`（重構文件 §4）：
  - `AiActorRef`／`AiTargetKind`／`AiTargetRef` 與六種 `AiAction`（move／attack／collect／build／hold／end-turn）；collect、build 先定義型別供切片 D/G 使用。
  - `defenseActionToAiAction(state, actorId, action)`：舊 `AiDefenseAction` → `AiAction` 的 Adapter（文件 §12 Phase 1 指定步驟）。舊 attack 不帶 reason，轉換時補空字串；目標位置查表補上，查不到以 (-1,-1) 佔位（有效性由 Validator 依 id 判定）。
- 新增 `src/game/ai/validation/validateAiAction.ts`（重構文件 §9.2）：
  - 行動者存在＋存活；player kind 的回合合法性沿用 `canPlayerPerformAction`（單一事實來源，非玩家回合／Creature 回合中／結果視窗／遊戲結束都會擋下）。
  - move：目的地是否在 `collectReachableCells` 結果內（一次 Dijkstra 同時涵蓋牆、佔位與體力）。
  - attack：目標存在且存活＋相鄰（與 `getAttackTarget` 契約一致）；collect/build 最小檢查；hold/end-turn 直接有效。
  - creature kind 的回合階段檢查留待切片 D 接線。
- 測試 `validateAiAction.test.ts`（11 例）：既有四種決策輸出經 Adapter 後全數 valid；死亡／過遠攻擊、體力不可達、佔位阻隔、牆中孤格、行動者不存在或死亡、非該玩家回合等 stale 情境給出明確 reason。

### 本切片不改變什麼

- 三個決策函式輸出仍是 `AiDefenseAction`；`gameStore` 執行路徑一行未動——Validator 只驗證不接線（Scheduler／Creature 管線在後續切片消費）。

### 影響檔案

- 新增：`src/game/ai/aiAction.ts`、`src/game/ai/validation/validateAiAction.ts` ＋測試
- 文件：本日誌、`ai-system-refactoring-development-design.md` §15 Phase 1、`handev/ai-development-playbook.md` §1／§3

### 驗證結果

- vitest：72 檔 / **758 項全過**。tsc -b：通過。ESLint（新檔案）：通過。Build：通過。

### 下一步

- 切片 **D**：Creature 行為改走共用管線（Adapter → Policy → Validator → Executor），巡邏決策去 greedy 化。

## 2026-08-24｜AI 重構切片 B：共用感知層＋巡邏隨機注入

### 本次完成

- 新增感知模組 `src/game/ai/perception/`（重構文件 §5.2 前四項）：
  - `distance.ts`：曼哈頓距離統一出口（委託 `mapCellStateRules.getManhattanDistance`）。
  - `targetDiscovery.ts`：存活敵對目標枚舉（`listHostileActors`）與目標有效檢查（`isHostileActorStillValid`，stale check 最小版）。
  - `blockedPositions.ts`：阻擋／成本函式的 AI 層固定進入點（現階段直接轉出口 `rules/movementRules`）。
  - `reachablePositions.ts`：`collectReachableCells` 一次 Dijkstra 成本圖列出體力可達格。
- 三個決策純函式改委託感知層：`aiDefenseRules`／`aiSupportRules`／`aiSelfPreservationRules` 移除各自重複的距離、敵人枚舉與候選生成；**行為保持**（同樣的過濾、排序與 tie-break），並順帶把「每個候選格重跑一次 Dijkstra」改為整輪只建一次成本圖。
- `moveCreatures` 注入 `RandomSource`（尾參，預設 `defaultRandomSource`）：巡邏步選格與攻擊閃避／根骨減傷 roll 都走注入來源，符合重構文件 §5.4「domain AI 不得直呼 Math.random()」。
- 測試：新增 `perception.test.ts`（7 項）；`creatureActions.test.ts` 加「巡邏隨機注入」（3 項：同 seed 可重現、開闊地走盡體力、不同 seed 路徑不同）；`aiDefenseRules.test.ts` 加「不可達→安全待命」2 項。fixture 補 `makeTestNest`。

### 本切片不改變什麼

- 三個決策函式的輸出契約（既有 11 例原樣通過）、`CreatureTurnResult` 格式、巢穴生成隨機（`spawnCreaturesFromNests` 維持自己的 roll）。
- Creature 移動仍走 greedy 步進模型（統一移動管線屬切片 D）。

### 影響檔案

- 新增：`src/game/ai/perception/`（5 檔含測試）
- 改：`src/game/aiDefenseRules.ts`、`aiSupportRules.ts`、`aiSelfPreservationRules.ts`、`actions/creatureActions.ts`、`testHelpers/aiTestFixtures.ts`＋兩個對應測試檔
- 文件：本日誌、`ai-system-refactoring-development-design.md` §15 Phase 1、`handev/ai-development-playbook.md` §3

### 驗證結果

- vitest：71 檔 / **747 項全過**。tsc -b：通過。ESLint（本切片檔案）：通過。Build：通過。

### 下一步

- 切片 **C**：統一 `AiAction` 型別＋`validateAiAction()`（先記錄不阻擋）。

## 2026-08-24｜AI 重構切片 A：攻擊去 Preview 化

### 本次完成

- 新增原子 domain action `src/game/ai/execution/executeAiAttack.ts`：執行前用 `createAttackPreview` 再驗證目標，再呼叫既有 `executeAttack`，**不寫入** `attackPreview`／`operation`。
- `runAiDefenseStep`／`runAiSupportStep` 改呼叫 `gameStore.executeAiAttack`；人類玩家仍走 `previewAttackTarget`。
- 行為保持：決策函式、移動／結束回合、傷害結算路徑不變。體力不足失敗時不再留下殘餘 preview。

### 本切片不改變什麼

- 人類 Preview＋確認攻擊流程
- `chooseDefenseAction`／`chooseSupportAction`／`chooseSelfPreservationAction`
- `runAiDefenseStep`／`runAiSupportStep` 公開簽名與移動／待命／paused 路徑

### 影響檔案

- 新增：`src/game/ai/execution/executeAiAttack.ts`、`executeAiAttack.test.ts`
- 改：`src/game/gameStore.ts`、`src/game/gameStore.aiSteps.test.ts`
- 文件：`handev/ai-development-playbook.md`、`handev/mygame2-architecture.md`、`reports/system/ai-system-refactoring-development-design.md`

### 驗證結果

- TypeScript：通過。ESLint（本切片檔案）：通過。Build：通過。
- 測試：70 檔 / **735 項全過**（A0 8 例＋不經 preview 1 例＋原子攻擊 3 例＋既有案例）。

### 下一步

- 切片 **B**：共用感知純函式＋ Creature 巡邏注入 `RandomSource`。

## 2026-08-24｜對齊門派外功數測試：36 → 35

### 本次完成

- `skillProgressionCatalog.test.ts` 總數斷言落後於 catalog：百毒流「驛路步」已移除（同檔逐派測試已豁免靈氣），合計外功 35 而非 36。將預期值改為 35，註解寫明各派組成。未改功法資料。

### 驗證結果

- 該檔 14 項通過；全套 69 檔 / **731 項全過**。

## 2026-08-24｜AI 重構前置 A0：補 player AI 執行層整合測試

### 本次完成

- 依 `handev/ai-development-playbook.md` 切片 **A0**（A 的前置安全網）：為 `runAiDefenseStep`／`runAiSupportStep` 補 8 例 gameStore 整合測試，**不改 production 行為**。
- 案例：守衛拒絕（非 AI／非其回合／Creature 行動中）、防守攻擊成功、防守移動進半徑、無威脅結束回合、體力不足攻擊失敗不結束回合、支援攻擊成功、支援目標死亡 → `paused` 並結束回合、無 active 支援命令拒絕。
- 斷言只看結果（血量／位置／回合／命令狀態），不鎖定 Preview API 路徑，作為切片 A 去 preview 化的驗收網。
- 抽出共用夾具 `src/game/testHelpers/aiTestFixtures.ts`；三個既有 `ai*.test.ts` 改用同一套 helper。

### 影響檔案

- 新增：`src/game/gameStore.aiSteps.test.ts`、`src/game/testHelpers/aiTestFixtures.ts`
- 改寫測試 helper：`aiDefenseRules.test.ts`、`aiSupportRules.test.ts`、`aiSelfPreservationRules.test.ts`
- 文件：`handev/ai-development-playbook.md`、`handev/mygame2-architecture.md`、`reports/system/ai-system-refactoring-development-design.md`

### 驗證結果

- TypeScript：通過。ESLint（本切片檔案）：通過。Build：通過。
- 測試：AI 相關 19 項全過（11 決策＋8 執行）；全套 731 項中 730 過。
- 已知無關失敗：`skillProgressionCatalog.test.ts`「外功數預期 36 實得 35」（catalog 與測試不同步，非本切片改動）。

### 下一步

- 切片 **A**：AI 攻擊去 Preview 化（新增原子攻擊 domain action；A0 測試須持續全過）。

## 2026-08-24｜江湖線擴充：新增 10 個江湖功法

### 本次完成

- `jianghuExternalSkillCatalog` 由 9 個靈氣型外功擴至 **19 個**（皆 `target: 'self'`、常駐靈氣、可於任何武館學習或掉落取得）：
  - **悟性輔助線 ×7**：天眼功（視野 +1）、四兩功（外功內力消耗 −1）、商道功（買 −15%／賣 +15%）、天工功（建材 −25%、聲望 +50%）、百草功（採集 −1 體力、50% 雙倍）、神行功（最大體力 +2）、引氣功（體力轉內力 1→2）。
  - **資源回復線 ×1**：長生功（每回合回復最大血量 10%，掛既有 `spring-return-art` Buff）。
  - **迴避與保命線 ×2**：幻影功（迴避 +5%）、回光功（瀕死復活至 30% 並清 debuff，掛既有 `return-light`）。
- 新增 2 個 registry effect key（純資料層）：`evasion` → 既有 `phantom-step`、`revive-guard` → 既有 `return-light`，讓原本無功法來源的兩個孤兒 Buff 正式可取得；`FunctionalExternalSkillEffect` 31→33 種，未動任何規則層程式碼。
- 測試同步：江湖靈氣型外功數 9→19。

### 等級成長補全（同日追加）

- 審查發現 10 個新功法中 8 個已有等級縮放（`functionalSkillScaling.ts`），**幻影功／回光功缺漏**，補齊：
  - 幻影功：迴避率每級 +1%（比照 `-step` 系加法公式）。
  - 回光功：復活血量 30%＋每級 5%（上限 100%）。此項需小改規則層：`BuffInstance` 新增 `reviveHealthPercent` 覆寫欄位，`creatureAnimation.ts` 復活時優先讀實例覆寫、回退定義基礎值（沿用 conditional 覆寫的既有模式）。
- 兩功法描述同步改為成長式寫法；新增 3 條縮放測試。

### 影響檔案

- `src/game/catalogs/jianghuExternalSkillCatalog.ts`、`src/game/catalogs/functionalSkillRegistry.ts`
- `src/game/catalogs/skillProgressionCatalog.test.ts`
- 文件：`handev/effects-taxonomy.md`（功能外功 46→56、effect 34 種）

### 驗證結果

- TypeScript：通過。ESLint：通過。測試：68 檔 / 721 項全數通過（registry ↔ buffCatalog 綁定測試自動涵蓋新 effect）。

## 2026-08-24｜五行補全：新增五門派，每屬性兩派

### 本次完成

- 依「**每個五行元素應有 2 個門派**」的設計目標，一次新增五派（此前金/水/火/土/無各僅一派，木有兩派）：
  - **銳鋒流**（`sharp-edge`，金）：新興鑄劍世家的快劍搶攻之道。內功「銳鋒淬芒」（臂力 ×0.7＋身法 ×0.3，補上無人使用的組合）；傷害外功「銳鋒斬」；靈氣外功「劍心明鑑」（視野 +1）、「凌厲劍勢」（普攻傷害 +10%）。
  - **煙雨流**（`misty-rain`，水）：江南煙雨樓的養生綿掌。內功「煙雨養元」（內息 ×0.5＋悟性 ×0.5）；傷害外功「煙雨掌」；靈氣「雨潤回春」（每回合回血 5%）、「雨幕遮身」（減傷 10%）。
  - **烈陽流**（`blazing-sun`，火）：西域烈陽教遺部的血性武學。內功「烈陽戰體」（根骨 ×0.6＋臂力 ×0.4）；傷害外功「烈陽轟」；靈氣「烈陽戰意」（臂根 +1）、「烈目凝芒」（暴擊 ×1.25）。
  - **黃土流**（`yellow-earth`，土）：黃土溝壑獵戶自衛武團。內功「黃土紮根」（根骨 ×0.5＋身法 ×0.5）；傷害外功「裂石棍」；靈氣「夯土工事」（建材消耗 −15%）、「負重健行」（最大體力 +2）。
  - **幽影流**（`ghost-shadow`，無）：playbook 世界觀既有的隱世幽影流落地。內功「幽影藏形」（身法 ×0.5＋悟性 ×0.5）；傷害外功「影襲」；靈氣「幽影蔽身」（迴避 +10%）、「孤影決絕」（血量 <25% 時五維 ×1.6）。
- 每派嚴守三式限制（1 內功＋1 基礎傷害＋2 靈氣）；**零新規則層改動**——10 個新 Buff 全部只組合既有解譯欄位（visionRadiusBonus／damageDealtPercent／healthRegenPercent／damageReductionPercent／attributeModifiers／criticalRateMultiplier／buildingMaterialCostReduction／maxStaminaBonus／evasionRateBonus／conditional），未新增 `FunctionalExternalSkillEffect` 型別（31 種 effect 不變）。
- 新門派刻意不佔用移動技位：七種地形 step 技已由原七派配滿，避免重複輕功。
- 週邊註冊補齊：`MartialSchoolId` union、`getSchoolElement` 四行對應（幽影流走 default 'none'）、妖物圖示（🦂🐬🦁🐗🦇）與屬性修正、主場 Buff 映射（幽影流比照太虛流無主場）、武館／山門彈窗圖示鏈（⚔️🌧️☀️🧱🌑）。山門生成與編輯器下拉為 catalog 驅動，自動收錄 12 派。
- 測試同步：流派數 7→12、外功總數 21→36；新增「**五行元素各由兩個門派守護**」防回退測試。

### 影響檔案

- `src/game/catalogs/martialSchoolCatalog.ts`、`skillProgressionCatalog.ts`、`buffCatalog.ts`
- `src/game/rules/skillRules.ts`、`creatureBehaviorRules.ts`、`playerDerivedRules.ts`
- `src/components/MartialHallModal.tsx`、`SectGateDetailsModal.tsx`（圖示鏈）
- `src/game/catalogs/skillProgressionCatalog.test.ts`
- 文件：`handev/effects-taxonomy.md`（Buff 45→55、功法 54→74）

### 已知留白（後續可選）

- ~~五個新門派暫無**武館建築**與**門派裝備**~~ → 同日稍後已補齊，見下一篇日誌。
- ~~debug 地圖維持 7 座山門~~ → 同日稍後已補上五新派山門（現 12 座，依主場地形分區配置；妖物仍維持 7 隻）。

### 驗證結果

- TypeScript：通過。ESLint：通過。測試：68 檔 / 721 項全數通過。

## 2026-08-24｜補上五新派的武館建築與門派裝備

### 本次完成

- **武館建築 ×5**（`buildingCatalog.ts`）：銳鋒／煙雨／烈陽／黃土／幽影武館，id `building-type-martial-hall-{schoolId}`、造價 30、官階 1，與既有六派格式一致。玩家可在自建據點蓋對應武館學功法（`buildingActions` 依 `martialSchoolId` 過濾門派建築的機制自動生效）。
- **門派裝備 ×15**（`equipmentCatalog.ts` 的 `sectEquipmentCatalog` tuple 表）：每派武器／防具／配件各一，id 自動為 `sect-{schoolId}-{slot}`，屬性總和與價格由既有平衡公式規範（每級 2 點／$30），解鎖順序刻意交錯（銳鋒 W→A→Ac、煙雨 A→Ac→W、烈陽 Ac→A→W、黃土 W→Ac→A、幽影 Ac→W→A）：
  - 銳鋒流：銳鋒疾影劍 ⚔️／薄刃軟鱗甲 🦺／凝鋒劍心佩 📿
  - 煙雨流：煙雨羅衣 👘／雨潤青玉佩 💧／煙波傘中劍 ☂️
  - 烈陽流：烈陽血玉佩 ☀️／炎陽戰甲 🛡️／焚天重拳 👊
  - 黃土流：裂石開山棍 🪵／負重行囊 🎒／溝壑獵皮甲 🧥
  - 幽影流：夜行蔽影墜 🌑／無蹤暗影刃 🗡️／幽冥蟬翼衣 🕴️
- 測試同步：debug 據點預建築數 17→22（debug 夾具本就收錄全 catalog 建築，12 座武館全數可用於測試）。
- 文件回寫：`handev/effects-taxonomy.md`（裝備 45→60、建築 20→25）。

### 影響檔案

- `src/game/catalogs/buildingCatalog.ts`、`src/game/catalogs/equipmentCatalog.ts`
- `src/game/debugMap.test.ts`
- 文件：`handev/effects-taxonomy.md`

### 驗證結果

- TypeScript：通過。ESLint：通過。測試：68 檔 / 721 項全數通過（含 equipmentCatalog 數值規則對 15 件新裝備的自動驗證）。

## 2026-08-23｜新增第七門派「百毒流」與其三式功法

### 本次完成

- 新增南疆小派**百毒流**（id：`hundred-poison`，木屬性）：世界觀定位為「名不經傳的小門派，卻也各家爭鳴，不能小看」，六章派並立敘事不變。
- 嚴格遵循門派功法三式限制（傷害外功／功能外功／輕功），且三式皆為全新內容：
  - **內功**「百毒納氣」（`hundred-poison-inner`），公式：臂力 × 0.5 + 身法 × 0.5（補上此前無人使用的屬性組合）。
  - **傷害外功**「腐骨爪」（`-external-damage`）。
  - **功能外功**「百毒流·淬毒」（`-external-functional`）＝全新效果 `poison`：目標中毒 3 回合，每回合損失最大生命 10% 且五維 -15%（新 Buff `hundred-poison-rot`，僅組合既有解譯欄位，零規則層改動）。
  - **輕功**「驛路步」（`-external-light-foot`）＝全新效果 `road-step`：官道移動消耗降為 1（`road` 是唯一未被六步涵蓋的地形；新 Buff `road-step`）。
- 週邊註冊全數補齊：`martialSchoolCatalog`、百毒武館建築、三件門派裝備（蠱囊／軟甲／毒爪）、妖物圖示 🐍 與屬性修正、森林主場 Buff 映射、`getSchoolElement` 木行對應、debug 地圖第七座山門與百毒妖、武館／山門彈窗圖示。
- 順手重構：`skillProgressionCatalog` 的機能效果三元鏈改為 `schoolFunctionalLabels` / `schoolFunctionalEffects` / `SELF_TARGETED_FUNCTIONAL_EFFECTS` 映射表，未來再加門派不必增長鏈條。

### 影響檔案

- `src/game/catalogs/martialSchoolCatalog.ts`（union＋清單）
- `src/game/catalogs/skillProgressionCatalog.ts`（學校定義＋映射重構）
- `src/game/catalogs/functionalSkillRegistry.ts`（`poison` / `road-step` 型別、描述、綁定）
- `src/game/catalogs/buffCatalog.ts`（`hundred-poison-rot`、`road-step`）
- `src/game/catalogs/buildingCatalog.ts`（百毒武館）、`equipmentCatalog.ts`（三件裝備）
- `src/game/rules/creatureBehaviorRules.ts`、`playerDerivedRules.ts`、`skillRules.ts`
- `src/components/MartialHallModal.tsx`、`SectGateDetailsModal.tsx`
- `src/game/worldSetup.ts`＋測試更新（skillProgressionCatalog / debugMap / worldGeneration）

### 驗證結果

- TypeScript：通過。測試：67 檔 / 696 項全數通過。
- `npm run analyze:combat` 已執行並寫出 `reports/combat-balance-report.md`。

### 待驗收項目

1. 開局前往百毒武館／山門學習三式，確認淬毒命中後目標每回合掉血且五維下降、持續 3 回合。
2. 裝備「驛路步」於官道移動，確認體力消耗降為 1 且獲得幻影步迴避。
3. 確認編輯器下拉選單與詞彙高亮自動收錄百毒流條目（catalog 驅動，理論免改）。
4. 後續可選：地圖上中毒妖物的視覺標記（MapGrid 的 buff class 過濾清單未納入 `hundred-poison-rot`）。

## 2026-08-23｜移除門派進階傷害外功，確立門派功法三式限制

### 本次完成

- 依新的設計約束「**門派功法僅限三式**」（傷害外功／功能外功／輕功，見 `handev/content-expansion-playbook.md` 總原則 5），移除同日稍早新增的六門派進階傷害外功（`{schoolId}-external-damage-2`：撼山拳／踏雲掌／赤焰指／凝霜指／崩山掌／空明掌）。
- 每個門派的功法組成回歸固定三式：`-external-damage`、`-external-functional`、`-external-light-foot`（後者 `lootExcluded`）。
- 流派名字表（`externalNames` 等）維持不動，名稱留作未來等級擴充素材。

### 影響檔案

- `src/game/catalogs/skillProgressionCatalog.ts`
  - 刪除 `advancedDamageSkill` 定義；`progressionExternalSkills` 每派回傳三式（24 → 18），並註解標記三式限制來源。
- `src/game/catalogs/skillProgressionCatalog.test.ts`
  - 總量斷言 24 → 18；移除「四級武館進階外功」相關斷言與同源對照測試。
  - 武館販售目錄太虛流外功數 4 → 3。
- 文件：`handev/content-expansion-playbook.md`（新約束＋檢查清單）、`handev/effects-taxonomy.md`（功法統計同步）。

### 驗證結果

- TypeScript：`docker compose run --rm node npx tsc -b --pretty false` 通過。
- 測試：67 個檔案 / 696 項全數通過。

### 待驗收項目

1. 開一局加入任一門派，確認武館僅販售該派三式功法，無第四式。
2. 確認 Lv.4 掉落池不再出現 `-external-damage-2` 功法。

## 2026-08-23｜六門派二層傳承傷害外功

### 本次完成

- 為六個門派各新增一個進階傷害型外功，取流派名字表第二個名稱（此前從未使用）：
  - 金剛流「撼山拳」、追風流「踏雲掌」、赤炎流「赤焰指」、寒水流「凝霜指」、厚土流「崩山掌」、太虛流「空明掌」。
- 定位為「二層傳承」：同源公式威力 ×2（使用既有 `school.calculate(attributes, 2)` 等級參數），成長曲線對齊既有外功階梯——
  - 悟性成本 3（基礎外功 2 +1）、內力消耗 6（基礎 4 → 6）、需武館 Lv.4（基礎外功 Lv.2、功能外功 Lv.3 的下一階）。
- 自動接入所有消費端：`allExternalSkillCatalog` 掉落池（Lv.4 以上怪物才會掉落）、各門派武館貨源（`getMartialHallSkills`）、編輯器選單與詞彙高亮。

### 影響檔案

- `src/game/catalogs/skillProgressionCatalog.ts`
  - `progressionExternalSkills` 生成流程新增 `advancedDamageSkill`（id：`{schoolId}-external-damage-2`）。
- `src/game/catalogs/skillProgressionCatalog.test.ts`
  - 更新總量斷言（18 → 24）與各流派組成斷言。
  - 新增測試：每流派進階外功與基礎外功同名不同招、成本更重、威力更高、元素一致。

### 驗證結果

- TypeScript：`npx tsc -b --pretty false` 通過。
- 測試：67 個檔案 / 697 項全數通過。

### 待驗收項目

1. 在太虛武館將建築升級至 Lv.4，確認可學習「空明掌」且價格為 45 金（悟性成本 3 × 15）。
2. 確認 Lv.4 以下怪物不掉落進階外功。
3. 實戰施放任一進階外功，確認傷害約為基礎版兩倍。

## 2026-08-20｜地形深度系統收尾階段

### 本次完成

- 完成戰鬥結果的天地共鳴資訊流：
  - 普通攻擊結果保留攻擊預覽中的地形共鳴來源。
  - 外功結果依技能元素與目標地形計算並保留共鳴來源。
  - 攻擊結果彈窗與外功結果彈窗顯示 `天地共鳴：<共鳴名稱>`。
  - 不符合地形共鳴條件時不顯示共鳴提示。
- 補充結果格式化測試：
  - 普通攻擊共鳴提示。
  - 外功共鳴提示。
  - 保留原有傷害、擊敗、經驗與掉落資訊順序。

### 影響檔案

- `src/game/types.ts`
  - `AttackExecutionResult` 新增可選欄位 `terrainResonance`。
  - `ExternalDamageExecutionResult` 新增可選欄位 `terrainResonance`。
- `src/game/actions/combatActions.ts`
  - 普通攻擊執行結果帶入預覽共鳴來源。
  - 外功執行結果帶入技能元素與目標地形的共鳴來源。
- `src/game/actionResultFormatters.ts`
  - 攻擊與外功結果格式化時顯示天地共鳴提示。
- `src/game/actionResultFormatters.test.ts`
  - 新增普通攻擊與外功共鳴結果驗證。

### 驗證結果

- 重點測試：`3` 個測試檔案通過。
- 測試案例：`117` 項通過。
- TypeScript：`npx tsc -b --pretty false` 通過。
- 相關檔案診斷：無錯誤。

### 目前狀態

- 地形深度系統的核心功能已完成，可進入遊戲內手動冒煙測試。
- 尚未完成本階段的人工驗收，因此仍需確認實際彈窗顯示與非共鳴情境。

### 待驗收項目

1. 在草地使用土元素普通攻擊，確認顯示 `天地共鳴：厚土共鳴`。
2. 在森林使用木元素外功，確認顯示對應的追風共鳴提示。
3. 在荒漠、水域與山嶽分別驗證火、水、金元素共鳴。
4. 在不匹配地形施放功法，確認結果彈窗不顯示天地共鳴。
5. 確認怪物主場 Buff 在對應地形生效，離開主場後消失。

### 後續開發順序

1. 完成遊戲內手動冒煙測試並記錄結果。
2. 執行完整 `npx vitest run`，確認沒有跨模組回歸。
3. 依手動測試結果修正 UI 或數值問題。
4. 若核心系統穩定，再補齊尚未完整實作的地形專屬事件內容。
