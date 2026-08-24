# 代碼健康度與優化建議報告

- 審查日期：2026-08-16
- 審查範圍：TypeScript 6、React 19、Vite 8、Vitest 4 專案；重點包含近期 Buff、江湖外功與怪物掉落池變更。
- 審查對象：`src/game/catalogs/`、`src/game/rules/`、`src/game/actions/`、`src/game/lootFactory.ts`、React 元件，以及專案建置與測試設定。
- 驗證結果：`npm run build` 通過；426 項測試通過；`npm run lint` 目前有 5 個 error、3 個 warning。

---

## 0. 優化進度追蹤（2026-08-16 更新）

以下項目已於本次優化中完成：

| 項目 | 狀態 | 變更摘要 |
|---|---|---|
| A-1/M-1 功能效果型別化與集中 registry | ✅ 已解決 | 新增 `functionalSkillRegistry.ts`，統一 `FunctionalExternalSkillEffect`、描述與 Buff 對應；`ExternalSkill.functionalEffect` 改為聯合型別 |
| M-5 lint 門檻 | ✅ 已解決 | `npm run lint` 現在 0 error / 0 warning |
| P-1 Buff 查詢重複 | ✅ 已解決 | `buffCatalog`/`equipment`/技能/道具改為 Map 快取；`getEffectiveAttributesForPlayer` 單次取生效 Buff 定義 |
| M-4 江湖功法重複 | ✅ 已解決 | `jianghuExternalSkillCatalog` 改用 `createJianghuSkill` 工廠函式 |
| P-4 掉落池重複掃描 | ✅ 已解決 | 以 `Set` 過濾已學功法、以 Map 做 O(1) 查找 |
| M-3 週期函式命名 | ✅ 已解決 | `applyPeriodicBuffDamage` 重命名 `applyPeriodicBuffEffects`（保留 deprecated 別名），並以 `getActiveBuffDefinitions` 優化 |
| P-2 移動搜尋 | ✅ 已解決 | `buildMovementCostMap` 改用索引佇列取代 `array.shift()` |
| A-4 wall 破牆 | ✅ 已解決 | 新增 `canTraverseTerrain`；玩家與怪物在破壁功下可穿越牆壁（消耗降為 1） |
| A-3 getLearnableSkill | ✅ 已解決 | 巢穴摧毀時用江湖功法目錄填入 `getLearnableSkill`，傳授未學會的江湖外功 |
| P-3 bundle 過大 | ⚠️ 未處理 | 需 `React.lazy` + code splitting（較大的前端重構） |
| M-2 BuffInstance dead fields | ⚠️ 未處理 | 需序列化/存檔相容評估 |
| S-2 客戶端權威 | ⚠️ 評估 | 單機模式可接受；聯機需伺服器權威 |

### 本次優化驗證結果

- `npx tsc --noEmit`：通過（無錯誤）
- `npm run lint`：0 error / 0 warning
- `npx vitest run`：45 個測試檔、**432 項測試全部通過**（新增：registry 完整性、破壁可通行、巢穴傳授江湖功法等）
- `npm run build`：通過；bundle 大小警告仍存在

---

## 1. 架構健康度

### A-1：Buff → 功法掛載依賴多處字串映射

- 問題點：
  - `ExternalSkill.functionalEffect` 定義為一般 `string`：

    ```ts
    functionalEffect?: string
    ```

  - 功能型功法再透過另一份字串表掛載 Buff：

    ```ts
    const FUNCTIONAL_BUFF_BY_EFFECT: Record<string, string> = {
      lifesteal: 'bloodthirst',
      'damage-reduction': 'iron-wall-art',
      // ...
    }
    ```
  - `FunctionalExternalSkillEffect` 實際上另有字面量聯合型別，但沒有被 `ExternalSkill` 使用，因此拼寫錯誤可以通過型別檢查，最後在執行期找不到 Buff。
- 建議修正方式：
  - 將 `functionalEffect?: string` 改為 `functionalEffect?: FunctionalExternalSkillEffect`。
  - 將掛載資料集中於單一 registry，例如：

    ```ts
    type FunctionalSkillBinding = {
      effect: FunctionalExternalSkillEffect
      buffId: string
      description: string
    }
    ```

  - 由 registry 同時產生說明文字與 Buff 對應，移除 `skillProgressionCatalog.ts`、`combatActions.ts` 的重複映射。
- 優先級：**高**
- **狀態：已解決（2026-08-16）**，見 §0。

### A-2：江湖功法目錄與流派功法目錄分離，但查詢邏輯仍由聚合目錄隱式承擔

- 問題點：
  - `allExternalSkillCatalog` 直接拼接三組資料：

    ```ts
    export const allExternalSkillCatalog: ExternalSkill[] = [
      ...externalSkillCatalog,
      ...progressionExternalSkills,
      ...jianghuExternalSkills,
    ]
    ```
  - `getMartialHallSkills` 又額外將江湖功法加到每個武館，武館、掉落池、戰鬥查詢各自依賴不同聚合層。
  - 未來新增第四種功法來源時，容易漏改某個聚合入口。
- 建議修正方式：
  - 建立明確的 `skillCatalogRegistry`，以 `source: 'core' | 'school' | 'jianghu'`、`skillType` 分類。
  - 對外只暴露 `getAllExternalSkills()`、`getSkillsForMartialHall(schoolId)`、`getLootableSkills(level, player)` 等查詢函式。
  - 為每個查詢函式增加「來源完整性」測試。
- 優先級：**中**

### A-3：`getLearnableSkill` 已成為空殼介面

- 問題點：`lootFactory.ts` 中：

  ```ts
  export function getLearnableSkill(_player: PlayerState): LearnedSkillResult | undefined {
    return undefined
  }
  ```

  參數以底線規避 lint，但代表目前巢穴傳授功法流程尚未實作，且註解提到的設計方向與現有江湖功法系統沒有整合。
- 建議修正方式：
  - 若功能尚未排程，移除未使用的依賴與 API，避免形成假功能。
  - 若要保留，明確定義可傳授功法來源、等級、已學過濾、重複學習與 UI 回饋，並補測試。
- 優先級：**中**
- **狀態：已解決（2026-08-16）**：高階功法架構已完工，`getLearnableSkill` 以 `jianghuExternalSkills`（江湖功法）填入，巢穴摧毀時傳授未學會的江湖外功；未學者全學會時回傳 undefined。新增 `lootFactory.test.ts` 測試，並更新 `gameStore.test.ts` 巢穴摧毀斷言（改為驗證授予功法）。

### A-4：wall Buff 與移動規則架構不一致，功能目前不可達

- 問題點：`getTerrainStaminaCost` 先在有限性檢查中返回：

  ```ts
  const baseCost = terrainStaminaCost[terrain]
  if (!Number.isFinite(baseCost)) return baseCost
  ```

  因此 `wall` 在進入 `terrainCostOverrides` 前就返回 `Infinity`。

  即使修正順序，`movementRules.ts` 與怪物移動仍直接禁止牆壁：

  ```ts
  if (!cell || cell.terrain === 'wall') continue
  ```

  所以 `wall-step` / `破壁功` 目前不可能讓玩家或怪物進入牆壁格，與功法描述「可通行」矛盾。
- 建議修正方式：
  - 明確選擇其中一種設計：
    1. 牆壁永遠不可通行，移除 `wall-step`、`wall-step` 功法與相關欄位案例；或
    2. 將可通行判斷抽成 `canTraverseCell(cell, player)`，由 `terrainCostOverrides.wall` 決定，並同步修改玩家、怪物、AI、目標選取與地圖生成位置規則。
  - 不建議只調整 `getTerrainStaminaCost`，因為會留下多個硬編碼牆壁阻擋點。
- 優先級：**高**
- **狀態：已解決（2026-08-16，完整實作破牆）**。

---

## 2. 性能健康度

### P-1：`getActiveBuffsForPlayer` 與 `getBuff` 在單次計算中被重複呼叫

- 問題點：`playerDerivedRules.ts` 多個函式反覆取得相同資料：

  ```ts
  for (const buff of getActiveBuffsForPlayer(player)) { ... }
  for (const buff of getActiveBuffsForPlayer(player)) { ... }
  const healthRatio = ...
  for (const buff of getActiveBuffsForPlayer(player)) { ... }
  ```

  `getActiveBuffsForPlayer` 會過濾 Buff，`getBuff` 又對 `buffCatalog` 執行線性 `find`。在移動路徑搜尋或 AI 回合中，這些計算會被大量重複執行。
- 建議修正方式：
  - 在單一公開函式內先取得一次 `activeBuffs`，再建立 `definitions` 或 `Map`。
  - 將 `buffCatalog` 初始化為 `Map<string, BuffDefinition>`，讓查詢由 O(n) 變成 O(1)。
  - 若 profiling 證實仍是熱點，再以回合或玩家狀態版本號做安全快取；不要直接以物件引用快取，避免狀態更新後 stale data。
- 優先級：**中**

### P-2：移動成本圖使用 `Array.shift()`，最差情況會造成額外 O(V²) 行為

- 問題點：`movementRules.ts`：

  ```ts
  while (queue.length > 0) {
    const current = queue.shift()
  }
  ```

  `shift()` 會搬移陣列元素。此函式又以類似 Dijkstra 的方式反覆鬆弛節點，地圖擴大後可能成為明顯瓶頸。
- 建議修正方式：
  - 使用索引佇列：`const current = queue[head++]`。
  - 若要維持最短路徑效率，使用最小堆；目前每個地形權重非負，適合 Dijkstra 或一致成本時的 BFS 特化。
  - 補充大型地圖基準測試，測量 20×20、50×50、100×100 的平均耗時。
- 優先級：**中**

### P-3：生產 bundle 過大，缺少 code splitting

- 問題點：`npm run build` 顯示：

  ```text
  index-*.js  1,119.22 kB │ gzip: 345.34 kB
  Some chunks are larger than 500 kB after minification.
  ```

  建置報告指出 `@rolldown/plugin-babel` 佔 plugin 時間 86%。目前主要遊戲畫面、管理彈窗與資料目錄很可能被打進單一初始 chunk。
- 建議修正方式：
  - 對非首屏彈窗、管理面板與報表頁使用 `React.lazy` / `dynamic import()`。
  - 透過 Vite/Rolldown chunk 設定拆分大型依賴與非必要頁面。
  - 以 Lighthouse 或實際瀏覽器 Performance 量測首次載入、互動延遲與 chunk cache hit，不要只調高 warning limit 掩蓋問題。
- 優先級：**中**

### P-4：掉落池每次擊殺都重新掃描完整功法目錄

- 問題點：`createLootForPlayer` 每次呼叫都對所有內功、外功進行 `filter`、`map`，並且之後再次 `find` 實際掉落功法：

  ```ts
  ...allExternalSkillCatalog
    .filter(...)
    .map(...)
  ```
- 建議修正方式：
  - 將依 `requiredHallLevel` 的候選功法預先分組或快取。
  - 將玩家已學功法轉為 `Set`，避免每個候選都執行 `includes` 線性查找：

    ```ts
    const learnedExternal = new Set(player.externalSkillIds)
    ```
  - 用 ID → skill 的 Map 取代掉落後的線性 `find`。
- 優先級：**低**（目前目錄規模小；功法數量擴大後升為中）

---

## 3. 可維護性健康度

### M-1：`functionalEffect` 缺少型別約束，容易產生執行期無效 Buff

- 問題點：同 A-1。新增 17 個江湖功法時，功法、描述字典、Buff 映射需要同步維護。
- 建議修正方式：將 `ExternalSkill` 接上 `FunctionalExternalSkillEffect`，並以 `satisfies` 驗證 registry 的完整性。
- 優先級：**高**

### M-2：`BuffInstance` 仍保留與目前架構不一致的死欄位

- 問題點：`types.ts` 的 `BuffInstance` 仍有：

  ```ts
  attributeMultiplier?: number
  maxHealthDamagePercent?: number
  criticalRateMultiplier?: number
  terrainCostOverride?: number
  reflectionPercent?: number
  ```

  目前 `getActiveBuffsForPlayer` 主要以 `definitionId` 查 `buffCatalog`，這些 instance-level override 欄位沒有被一致使用，容易讓維護者誤以為可覆寫 Buff 定義。
- 建議修正方式：
  - 若不支援個體覆寫，移除死欄位並更新測試/序列化資料。
  - 若要支援動態覆寫，建立明確的 `BuffInstanceOverrides`，並在解析函式中定義「instance override > definition」優先級。
- 優先級：**中**

### M-3：週期函式命名與實際職責不一致

- 問題點：`applyPeriodicBuffDamage` 現在同時處理傷害與回復：

  ```ts
  const damage = ...
  const regen = ...
  const health = Math.min(effectiveMaxHealth, Math.max(0, player.health - damage + regen))
  ```

  函式名稱只描述 damage，呼叫端 `creatureAnimation.ts` 也依「血量下降」產生日誌，無法表達回復事件。
- 建議修正方式：
  - 改名為 `applyPeriodicBuffEffects`，或拆成 `calculatePeriodicBuffDelta` 與 `applyPeriodicBuffEffects`。
  - 回傳 damage/heal breakdown，讓 UI 可正確顯示「燃燒造成傷害」與「回春恢復生命」兩類訊息。
- 優先級：**中**

### M-4：大量功能型功法使用重複物件結構

- 問題點：17 個江湖功法都重複以下欄位：

  ```ts
  insightCost: 2,
  requiredHallLevel: 3,
  level: 1,
  innerPowerCost: 3,
  target: 'self',
  calculateDamage: () => 0,
  ```
- 建議修正方式：
  - 提供 `createSelfBuffSkill({ id, name, description, effect, ... })` 工廠函式。
  - 工廠內統一設定固定欄位與從 effect registry 取得 `formulaDescription`，消除資料漂移。
  - 保留個別功法的敘事描述作為輸入資料。
- 優先級：**低**

### M-5：Lint 已有既存錯誤，品質門檻未封閉

- 問題點：`npm run lint` 目前回報 5 errors、3 warnings，包含：
  - `src/lootFactory.ts:111`：未使用參數 `_player`。
  - `src/components/ShopModal.tsx:139`：不規則空白字元。
  - `src/components/StrategicCommandModal.tsx:47,55`：Effect 內同步 setState。
  - `src/game/worldGeneration.ts:86`：無效賦值。
  - `src/components/MapGrid.tsx:151`：Effect 缺少 `activePlayer` dependency。
- 建議修正方式：
  - 將 lint 納入 CI/PR gate。
  - 對 `StrategicCommandModal` 優先改為事件初始化、受控 reducer 或計算值，避免 Effect 造成 cascading renders。
  - 清除字元與無效賦值，再逐項處理 Hook dependency；不可用關閉規則掩蓋問題。
- 優先級：**高**

---

## 4. 安全性健康度

### S-1：目前未見 SQL 注入、憑證洩漏或伺服器端輸入執行風險

- 問題點：本專案是 Vite/React 前端，審查範圍內未發現 SQL client、後端 API、硬編碼 API key、密碼或 `dangerouslySetInnerHTML`。
- 建議修正方式：
  - 維持 React 預設 JSX escaping；不要為了顯示遊戲文本改用 `dangerouslySetInnerHTML`。
  - 若未來接入後端，將掉落、獎勵與戰鬥結果移到伺服器權威驗證，前端僅作顯示。
  - 對 URL、外部 JSON、localStorage 存檔資料加入 schema validation；不要直接信任客戶端狀態。
- 優先級：**低（目前）**

### S-2：掉落與遊戲狀態目前由客戶端隨機與客戶端邏輯決定

- 問題點：

  ```ts
  let roll = Math.random() * totalWeight
  ```

  這不是傳統注入漏洞，但若遊戲需要競技、公平交易或不可作弊的掉落，玩家可透過 DevTools、覆寫隨機數或修改狀態影響結果。
- 建議修正方式：
  - 單機遊戲可接受，但需在威脅模型中明確標註為 client-authoritative。
  - 競技/聯機模式改由伺服器產生掉落與戰鬥結果，使用伺服器端安全隨機源並記錄事件。
- 優先級：**中（若未來聯機）／低（目前單機）**

### S-3：`crypto.randomUUID()` 使用方式合理，但需考慮執行環境相容性

- 問題點：`createEquipmentLoot` 使用：

  ```ts
  `equipment-${player.id}-${crypto.randomUUID()}`
  ```

  目前瀏覽器環境通常支援；若未來在 SSR、測試或舊瀏覽器執行，可能缺少 `crypto.randomUUID`。
- 建議修正方式：封裝 `createId()`，在應用初始化時驗證能力；測試注入 ID 產生器，避免測試依賴全域 API。
- 優先級：**低**

---

## 5. 總結與優先級排序

### 高優先級

1. **修正 wall 功能語意矛盾（A-4）**： → **✅ 已解決（2026-08-16）**。
2. **將 `functionalEffect` 改為聯合型別並集中 registry（A-1/M-1）**： → **✅ 已解決（2026-08-16）**。
3. **清理 lint error，建立品質 gate（M-5）**： → **✅ 已解決（2026-08-16）**。

### 中優先級

1. **降低 Buff 查詢重複與建立 catalog Map（P-1）**。 → **✅ 已解決（2026-08-16）**。
2. **重構週期 Buff 函式及回饋資料（M-3）**。 → **✅ 已解決（2026-08-16）**。
3. **拆分大型 bundle（P-3）**。 → ⚠️ **未處理**（後續較大前端重構）。
4. **整理技能來源 registry（A-2）**。 → ⚠️ 部分（效果與 Buff 對應已集中；聚合層重構仍保留）。
5. **清理或正式支援 `BuffInstance` override 欄位（M-2）**。 → ⚠️ 未處理（需存檔相容評估）。
6. **若未來聯機，將掉落/戰鬥改為伺服器權威（S-2）**。 → ⚠️ 評估中。
7. **巢穴傳授功法（A-3）**。 → **✅ 已解決（2026-08-16）**。

### 低優先級

1. **以 index queue 或 min-heap 優化移動搜尋（P-2）**。 → **✅ 已解決（2026-08-16，改用索引佇列）**。
2. **使用功法工廠函式降低 17 個江湖功法的重複（M-4）**。 → **✅ 已解決（2026-08-16）**。
3. **掉落池使用 Set/Map 與預分組快取（P-4）**。 → **✅ 已解決（2026-08-16）**。
4. **封裝 `crypto.randomUUID` 並注入測試 ID 產生器（S-3）**。 → ⚠️（可列為後續）。

### 驗收建議

- `npm run build`：通過。
- `npx vitest run`：45 個 test files、**432 tests** 全部通過（本次新增 registry 完整性、破壁可通行、巢穴傳授江湖功法等）。
- `npm run lint`：**已修正至 0 error / 0 warning**。
- wall 功能：已新增 `canTraverseTerrain` 單元測試，並在玩家移動、怪物尋路、移動成本、目標選取與 recall 落點統一使用。
- 功法掛載：已新增 registry 完整性測試，保證每個 `functionalEffect` 都有唯一 Buff 對應與說明。
- 巢穴傳授功法：`getLearnableSkill` 已實作，摧毀巢穴時從江湖外功目錄傳授未學會功法。
