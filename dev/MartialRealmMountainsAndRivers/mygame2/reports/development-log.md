# 開發日誌

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
