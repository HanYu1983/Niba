# 關卡與場景編輯器設計文件（Scenario & Map Editor Design）

本文件規範《武行山河》劇情關卡與場景編輯器（Scenario & Map Editor）的系統架構、操作流程、UI 元件佈局、物件檢視器規範、資料交換格式（JSON Schema）與一鍵試玩（Playtest）機制。

---

## 一、設計目標與架構原則

### 1.1 設計目標
1. **可視化關卡建構（Visual Level Design）**：提供直覺的筆刷與圖章工具，讓企劃/開發者無需手寫座標代碼即可繪製地形、配置物件與設定事件。
2. **完整的物件屬性自訂（Deep Entity Inspection）**：支援據點預建建築、怪物首領數值/行為/技能、巢穴生成參數、道具點掉落與特定劇情事件配置。
3. **任務與對話編排（Quest & Dialogue Authoring）**：視覺化編排主支線勝利條件、失敗條件、開局對話與達成目標後的階段推進對話。
4. **即時驗證閉環（Live Playtesting & Hot-Swapping）**：支援一鍵進入遊戲試玩、一鍵退出回編輯器，大幅縮短關卡調試週期。
5. **資料驅動與版控相容（Data-Driven & Git-Friendly）**：輸出純結構化 JSON，可匯入、匯出、複製剪貼，並直接轉化為專案內的 Catalog 代碼。

### 1.2 與既有系統相容與易擴充原則（Extensibility & Compatibility）
- **高擴充性外掛式架構（Plugin / Registry Pattern）**：
  - **圖章註冊表（Entity Registry）**：所有可放置物件（玩家、怪物、據點、巢穴、事件等）皆透過 Registry 註冊 icon、型別、預設值與專屬 Inspector 元件。後續新增「NPC 商人」、「傳送陣」或「環境機關」時，只需新增一筆註冊資料，無需修改主編輯器畫布邏輯。
  - **任務目標註冊表（Quest Objective Registry）**：任務類型、參數校驗與編輯 UI 抽離為獨立子模組，未來新增「護送 NPC」、「限時採集」、「特定功法擊殺」只需擴充型別與規則。
  - **自訂屬性袋（Custom Metadata Bag）**：每個實體支援可選的 `customMetadata?: Record<string, unknown>` 欄位，供未來試驗性功能（如特定 AI 仇恨偏好、特殊對白標籤、掉落自訂權重）暫存，無需頻繁變更頂層 Schema。
- **複用遊戲渲染組件**：地圖網格、物件圖標、五行標籤直接複用既有 UI 組件（如 `MapGrid`、`HighlightText`、`StatValue`）。
- **無縫轉化為 GameState**：劇本資料格式（`ScenarioDefinition`）可透過純函式 `loadScenarioToGameState(scenario)` 一鍵轉化為標準 `GameState`。
- **編輯器模組獨立性**：編輯器代碼集中於 `src/editor/`，不污染遊戲核心運行邏輯，生產環境可透過按鈕直接開啟。

---

## 二、編輯器整體架構與版面佈局

### 2.1 三欄式工作區佈局（Three-Panel Layout）

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 頂部工具列（Top Toolbar）: 章節名稱 | 尺寸調整 | 筆刷切換 | 撤銷/重做 | 試玩 | 匯入/匯出 │
├───────────────────┬─────────────────────────────────────┬───────────────────┤
│ 左側調色盤         │ 中央地圖畫布                         │ 右側屬性檢視器     │
│ (Palette Panel)   │ (Map Canvas Viewport)               │ (Inspector Panel) │
│                   │                                     │                   │
│ 1. 地形筆刷       │ ・支援平移、滾輪縮放                 │ 依目前選取物件顯示 │
│   - 草地/森林/山嶽│ ・網格座標標註 (Row, Col)            │                   │
│   - 水域/荒漠/牆壁│ ・筆刷即時預覽輪廓                   │ 【選取怪物】：    │
│                   │ ・物件點選選取框 (Selection Outline) │ ・名稱、等級、流派│
│ 2. 物件圖章       │                                     │ ・行為類型、首領標│
│   - 據點 / 廢墟   │                                     │ ・初始血量、內功  │
│   - 巢穴 / 怪物   │                                     │                   │
│   - 資源/道具/事件│                                     │ 【選取據點】：    │
│   - 門派據點/設施 │                                     │ ・預建建築清單    │
│                   │                                     │ ・初始建料與政策  │
│ 3. 橡皮擦 / 選取  │                                     │                   │
│                   │                                     │ 【全域關卡設定】：│
│ 4. 任務/對話按鈕  │                                     │ ・任務目標清單    │
│                   │                                     │ ・對話事件序列    │
└───────────────────┴─────────────────────────────────────┴───────────────────┘
```

---

## 三、操作流程規範（Interaction Flow）

### 3.1 地形繪製流程（Terrain Painting Flow）
- **Stage**: 選擇筆刷 → 滑鼠按下與拖曳 → 地圖狀態更新 → 畫布重繪
- **Player Action**: 在左側調色盤點選「森林筆刷（2×2）」，於畫布 (row: 3, col: 4) 按下左鍵並拖曳至 (row: 5, col: 6)。
- **System Response**:
  1. 游標移動期間顯示 2×2 綠色預覽選框。
  2. 拖曳經過的所有格子 `cell.terrain` 批次寫入為 `'forest'`。
  3. 將本次操作壓入 Undo 歷史堆疊。
- **State Change**: `scenario.cells[3..5][4..6].terrain = 'forest'`。
- **Exception Handling**: 若筆刷範圍超出地圖邊界，自動截斷於有效網格內，不拋出邊界溢出錯誤。

### 3.2 物件放置與檢視流程（Entity Stamp & Inspect Flow）
- **Stage**: 選擇圖章 → 點選地圖格 → 生成物件實例 → 開啟 Inspector
- **Player Action**: 選擇「生物圖章」，點選 (row: 8, col: 8)。
- **System Response**:
  1. 檢查該格是否已有其他不重疊物件（如據點、巢穴）。
  2. 於該格生成預設怪物（Lv.1 游蕩妖物）。
  3. 自動將右側 Inspector 切換為該怪物，聚焦於名稱與數值輸入框。
- **State Change**: `scenario.entities.creatures.push({ id: 'creature-custom-1', ... })`。
- **Exception Handling**: 若目標格已有阻擋物件（如據點格），彈出微型提示「此位置已有據點，請先清除或更換格子」，不產生重複覆蓋。

### 3.3 任務目標編排流程（Quest Objective Authoring Flow）
- **Stage**: 開啟任務編排彈窗 → 新增目標 → 關聯物件/條件 → 儲存驗證
- **Player Action**: 點擊「任務編排」，點選「+ 新增目標」，選擇類型「擊敗指定首領」，點選地圖上的 `boss-wolf` 物件。
- **System Response**:
  1. 自動綁定 `targetId = 'boss-wolf'`，目標名稱預設帶入 `擊敗 狂化赤狼`。
  2. 支援設定可選條件（如「限制回合數 <= 20」）。
- **State Change**: `scenario.quests.objectives.push({ type: 'defeat-creature', targetId: 'boss-wolf', ... })`。
- **Exception Handling**: 若關聯的物件隨後在地圖上被刪除，任務列表中該目標標記紅字警告「⚠️ 關聯目標物件已不存在」。

### 3.4 一鍵試玩流程（Live Playtest Flow）
- **Stage**: 點擊試玩 → 格式驗證 → 狀態編譯 → 載入遊戲 → 退出還原
- **Player Action**: 點擊頂部工具列「▶️ 一鍵試玩」。
- **System Response**:
  1. 檢查關卡合法性：必須至少有 1 名玩家起始點、勝敗條件不可為空。
  2. 通過後將當前 `ScenarioDefinition` 透過 `buildGameStateFromScenario()` 注入為運行中的 `GameState`。
  3. 切換至完整遊戲畫面，玩家可立即開始移動、戰鬥與對話。
  4. 遊戲畫面頂部浮動顯示「⏹️ 結束試玩」按鈕，點擊後回到編輯器並保留編輯歷史。
- **State Change**: `currentAppMode = 'game'`, `gameState = compiledScenarioState`。
- **Exception Handling**: 試玩期間即使遊戲失敗或勝利，點擊「退出試玩」均能安全返回編輯器，不遺失未匯出的修改。

---

## 四、UI 與彈窗規範（UI & Popup Specifications）

### 4.1 頂部工具列規範（Top Toolbar）

| 元件名稱 | 元件類型 | 狀態（States） | 動作與反饋 |
| :--- | :--- | :--- | :--- |
| `ChapterTitleInput` | Input.Text | active | 即時更新章節名稱（如「序章：青石遺恨」） |
| `MapSizeSelect` | Select/InputNumber | active | 調整地圖長寬（10×10 至 40×40），縮小時若有物件在邊界外彈出裁剪確認 |
| `RandomGenerateButton` | Button (Ghost) | active | 以隨機地形與雜訊演算法自動鋪底，覆蓋當前地圖（需二次確認） |
| `UndoButton / RedoButton` | Button.Group | enabled / disabled | 撤銷（Ctrl+Z）／重做（Ctrl+Y），記錄最近 50 次操作 |
| `PlaytestButton` | Button (Primary, Green) | active | 格式檢查後載入遊戲試玩 |
| `IOButton` | Button | active | 開啟 JSON 匯入/匯出彈窗 |

### 4.2 物件檢視面板規範（Inspector Panel）

右側 Inspector 根據目前選取的物件動態切換：

#### 4.2.1 選取「怪物／首領」時：
- **基礎欄位**：
  - `名稱 (name)`：Text Input（如「赤焰妖王」）
  - `首領標記 (isBoss)`：Switch（開啟時血條加寬、地圖顯示專屬金框）
  - `等級 (level)`：InputNumber (1~20)
  - `五行流派 (schoolId)`：Select (`golden-body` / `swift-wind` / `scarlet-flame` / `frost-water` / `earth-mountain` / `void-spirit`)
  - `行為模式 (behaviorType)`：Select (`hunter` / `scavenger` / `wanderer` / `sieger` / `roamer`)
  - `警戒範圍 (aggroRange)`：InputNumber (1~10)
- **數值自訂（可選覆寫）**：
  - `基礎五維覆寫`：手動調整臂力、根骨、身法、內息、悟性
  - `起始 Buff 清單`：可掛載常駐護體 Buff 或特殊狀態

#### 4.2.2 選取「據點」時：
- **基礎欄位**：
  - `據點名稱 (name)`：Text Input（如「青石村」）
  - `初始建料 (buildingMaterials)`：InputNumber (0~500)
  - `初始生命值 (health / maxHealth)`：InputNumber
  - `初始政策 (policyId)`：Select (`basic` / `civilian` / `military` / `economic`)
- **預建建築清單**：
  - 勾選並設定等級：醫療室 (Lv.1~3)、告示牌 (Lv.1~3)、建料倉庫 (Lv.1~3)、修理工坊、防衛營、各流派武館。

#### 4.2.3 選取「固定劇情事件點」時：
- `事件類型 (eventType)`：Select（自現有 `explorationEventCatalog` 選擇）
- `專屬對話觸發 (customDialogueId)`：綁定對話文本 ID
- `觸發後動作`：完成後是否在地圖上消失、是否給予專屬道具/功法

---

## 五、劇本資料結構定義（Scenario Schema）

```ts
export type ScenarioCell = {
  row: number
  column: number
  terrain: 'plain' | 'forest' | 'mountain' | 'water' | 'desert' | 'wall'
  customMetadata?: Record<string, unknown>
}

export type ScenarioPlayerConfig = {
  id: string
  name: string
  position: { row: number; column: number }
  schoolId?: string
  innerSkillId?: string
  externalSkillIds?: string[]
  initialMoney?: number
  initialStamina?: number
  initialInventory?: Array<{ itemId: string; quantity: number }>
  customMetadata?: Record<string, unknown>
}

export type ScenarioCreatureConfig = {
  id: string
  name: string
  position: { row: number; column: number }
  level: number
  schoolId: 'golden-body' | 'swift-wind' | 'scarlet-flame' | 'frost-water' | 'earth-mountain' | 'void-spirit'
  behaviorType: 'scavenger' | 'hunter' | 'sieger' | 'wanderer' | 'roamer'
  isBoss?: boolean
  aggroRange?: number
  customAttributes?: {
    armStrength?: number
    constitution?: number
    agility?: number
    innerEnergy?: number
    insight?: number
  }
  customMetadata?: Record<string, unknown>
}

export type ScenarioBaseConfig = {
  id: string
  name: string
  position: { row: number; column: number }
  health?: number
  maxHealth?: number
  buildingMaterials?: number
  policyId?: string
  presetBuildings?: Array<{
    type: string
    level: number
    schoolId?: string
  }>
  customMetadata?: Record<string, unknown>
}

export type ScenarioDialogueStep = {
  id: string
  speakerName: string
  speakerIcon: string
  content: string
  triggerCondition: 'on-start' | 'on-objective-complete' | 'on-enter-region' | 'on-defeat-boss' | string
  triggerParam?: string // objectiveId 或 region 座標
  customMetadata?: Record<string, unknown>
}

export type ScenarioDefinition = {
  version: string // Schema 版本號（如 "1.0.0"），供未來 Migration 相容升級
  id: string
  title: string
  description: string
  chapterIndex: number
  mapSize: { rows: number; columns: number }
  cells: ScenarioCell[]
  entities: {
    players: ScenarioPlayerConfig[]
    bases: ScenarioBaseConfig[]
    creatures: ScenarioCreatureConfig[]
    nests: Array<{ id: string; position: { row: number; column: number }; schoolId: string; behaviorType: string; customMetadata?: Record<string, unknown> }>
    ruins: Array<{ id: string; name: string; position: { row: number; column: number }; status: 'intact' | 'reconstructed'; customMetadata?: Record<string, unknown> }>
    resourcePoints: Array<{ id: string; name: string; position: { row: number; column: number }; ownerBaseId?: string; customMetadata?: Record<string, unknown> }>
    itemPoints: Array<{ id: string; position: { row: number; column: number }; specificItemId?: string; customMetadata?: Record<string, unknown> }>
    events: Array<{ id: string; eventType: string; position: { row: number; column: number }; customMetadata?: Record<string, unknown> }>
    customEntities?: Array<{ id: string; type: string; position: { row: number; column: number }; metadata: Record<string, unknown> }>
  }
  quests: {
    victoryObjectives: Array<{
      id: string
      title: string
      type: 'defeat-creature' | 'destroy-nest' | 'build-building' | 'reconstruct-ruin' | 'learn-skill' | 'reach-prestige' | 'survive-rounds' | string
      targetId?: string
      targetValue: number
      customMetadata?: Record<string, unknown>
    }>
    failConditions: {
      maxRounds?: number
      baseMustSurvive?: boolean
      playerMustSurvive?: boolean
      customConditions?: Array<{ type: string; param?: unknown }>
    }
  }
  dialogues: ScenarioDialogueStep[]
  customMetadata?: Record<string, unknown>
}
```

---

## 六、專案模組與檔案結構規劃

```
src/
├── editor/
│   ├── EditorApp.tsx               # 編輯器頂層容器（切換遊戲/編輯器）
│   ├── components/
│   │   ├── EditorHeader.tsx        # 頂部操作列（尺寸、筆刷切換、試玩）
│   │   ├── EditorCanvas.tsx        # 互動式地圖畫布（平移、縮放、筆刷繪製）
│   │   ├── PaletteSidebar.tsx      # 左側調色盤（地形、物件圖章、橡皮擦）
│   │   ├── InspectorSidebar.tsx    # 右側屬性面板（單位、據點、任務屬性）
│   │   ├── QuestSequencerModal.tsx # 任務目標與勝敗條件編輯器
│   │   ├── DialogueEditorModal.tsx # 劇情對話文本編輯器
│   │   └── ScenarioIOModal.tsx     # JSON 匯出/匯入/預覽彈窗
│   ├── hooks/
│   │   ├── useEditorHistory.ts     # Undo / Redo 操作歷史紀錄
│   │   └── useEditorSelection.ts   # 當前筆刷與選取中物件狀態管理
│   ├── rules/
│   │   ├── scenarioCompiler.ts     # ScenarioDefinition ↔ GameState 互轉純函式
│   │   └── scenarioValidator.ts    # 關卡合法性檢查（是否有起點、是否有孤立目標）
│   └── editorTypes.ts              # 編輯器專屬型別定義
reports/
└── scenario-editor-design.md       # 本規格文件
```

---

## 七、開發里程碑與逐步測試計畫（Detailed Milestones & Step-by-Step Testing）

為確保「一步一步開發、一步一步測試」的漸進式開發節奏，將原本的 5 大階段細分為 **12 個可獨立驗收的里程碑**。每個里程碑結束後都必須通過測試並由開發者手動確認，才進入下一步。

### Phase 1：基礎畫布與地形編輯

#### Milestone 1-1：編輯器骨架與地圖網格渲染
- **開發任務**：
  1. 建立 `src/editor/EditorApp.tsx` 頂層容器與路由入口（從主選單進入）。
  2. 建立 `EditorCanvas.tsx`，以網格方式渲染空白地圖（預設 15×15）。
  3. 每格顯示座標 `(row, col)` 與目前地形 icon。
  4. 支援滾輪縮放與拖曳平移。
- **測試方式**：
  - 手動確認：進入編輯器後能看到 15×15 網格，可縮放與平移。
  - 自動測試：`EditorCanvas` 能正確渲染指定尺寸的網格數量。
- **驗收標準**：✅ 畫布渲染正常、座標標註正確、縮放平移流暢。

#### Milestone 1-2：地形筆刷與即時繪製
- **開發任務**：
  1. 建立 `PaletteSidebar.tsx` 左側調色盤，提供 7 種地形按鈕（草/林/山/水/沙/牆/路）。
  2. 實作單格筆刷：點擊格子即切換地形。
  3. 實作拖曳連刷：按住左鍵拖曳可連續刷地形。
  4. 筆刷大小切換（1×1 / 2×2 / 3×3）。
  5. 游標移動時顯示筆刷預覽輪廓。
- **測試方式**：
  - 手動確認：選「森林 2×2」後拖曳，能看到綠色預覽框，放開後格子變為森林。
  - 自動測試：`useEditorSelection` 筆刷狀態切換正確。
- **驗收標準**：✅ 7 種地形可自由切換、筆刷大小正確、預覽框對齊網格。

#### Milestone 1-3：地圖尺寸調整與隨機生成打底
- **開發任務**：
  1. 頂部工具列加入 `MapSizeSelect`（10×10 ～ 40×40）。
  2. 縮小地圖時若有物件在邊界外，彈出裁剪確認。
  3. 加入「隨機生成打底」按鈕，呼叫既有 `createMapCells()` 生成地形。
  4. 支援地形權重設定（複用 `TerrainWeights`）。
- **測試方式**：
  - 手動確認：將地圖從 15×15 改為 20×20，網格正確擴展；點隨機生成後地形分布合理。
  - 自動測試：尺寸變更後 `cells` 陣列長度正確。
- **驗收標準**：✅ 尺寸調整無崩潰、隨機生成可作為打底再手動微調。

#### Milestone 1-4：Undo/Redo 歷史與 JSON 匯入匯出
- **開發任務**：
  1. 實作 `useEditorHistory.ts`，記錄最近 50 次操作快照。
  2. 鍵盤快捷鍵 Ctrl+Z（撤銷）/ Ctrl+Y（重做）。
  3. 實作 `ScenarioIOModal.tsx`：匯出 JSON 到剪貼簿/檔案、匯入 JSON 載入。
  4. 匯入時自動驗證 Schema 合法性。
- **測試方式**：
  - 手動確認：刷 5 次地形後按 Ctrl+Z 5 次能回到空白；匯出 JSON 後清空再匯入能完整還原。
  - 自動測試：`useEditorHistory` push/undo/redo 序列正確。
- **驗收標準**：✅ Undo/Redo 無遺漏、JSON 匯入匯出往返無資料遺失。

---

### Phase 2：物件圖章與屬性檢視

#### Milestone 2-1：物件圖章放置與衝突檢查
- **開發任務**：
  1. 左側調色盤新增「物件圖章」分頁：玩家、據點、怪物、巢穴、廢墟、資源點、道具點、事件點、門派據點、防禦設施。
  2. 點選圖章後點擊地圖格，生成預設實例。
  3. 衝突檢查：同格已有不可重疊物件時彈出提示。
  4. 橡皮擦模式：清除指定格的物件。
- **測試方式**：
  - 手動確認：放置據點後再放怪物到同格，彈出衝突提示；橡皮擦能清除。
  - 自動測試：`scenarioValidator` 衝突檢查函式回傳正確。
- **驗收標準**：✅ 所有圖章可放置、衝突檢查生效、橡皮擦正常。

#### Milestone 2-2：Inspector 面板 — 怪物與 Boss
- **開發任務**：
  1. 實作 `InspectorSidebar.tsx`，點選地圖上的怪物後顯示屬性面板。
  2. 欄位：名稱、等級、流派（下拉）、行為模式（下拉）、警戒範圍、首領標記（Switch）。
  3. 進階欄位：五維覆寫、血量上限覆寫、內功指定、裝備外功清單、初始 Buff。
  4. 修改後即時更新地圖上的物件預覽（icon 與名稱）。
- **測試方式**：
  - 手動確認：放置怪物後改等級為 5、開啟 Boss 標記，地圖上顯示金框與新名稱。
  - 自動測試：Inspector 修改後 `ScenarioCreatureConfig` 數值正確同步。
- **驗收標準**：✅ 怪物所有欄位可編輯、Boss 標記視覺化、即時同步。

#### Milestone 2-3：Inspector 面板 — 據點與預建建築
- **開發任務**：
  1. 點選據點後顯示：名稱、初始建料、初始血量/上限、初始政策、官階、武館流派、已解鎖視野。
  2. 預建建築清單：從 `buildingCatalog` 動態讀取，勾選並設定等級。
  3. 支援預建防禦設施（箭塔、城牆等）。
- **測試方式**：
  - 手動確認：放置據點後勾選「醫療室 Lv.2」與「告示牌 Lv.1」，匯出 JSON 確認 `presetBuildings` 正確。
- **驗收標準**：✅ 建築清單動態讀取、等級可設、JSON 正確。

#### Milestone 2-4：Inspector 面板 — 其餘實體（巢穴/廢墟/門派/事件/資源/道具）
- **開發任務**：
  1. 巢穴：流派、行為、生成機率、生成等級、冷卻、血量。
  2. 廢墟：名稱、狀態（intact/reconstructed）。
  3. 門派據點：流派、等級（1/2/3）、經驗值。
  4. 事件：事件類型（下拉讀取 `explorationEventCatalog`）、綁定對話 ID。
  5. 資源點：名稱、所屬據點、產出量。
  6. 道具點：指定固定道具 ID（可選）。
- **測試方式**：
  - 手動確認：逐一放置每種實體並編輯輯屬性，匯出 JSON 確認所有欄位正確。
- **驗收標準**：✅ 所有實體類型均可放置與編輯。

#### Milestone 2-5：玩家起點與初始配置
- **開發任務**：
  1. 玩家 Inspector：名稱、流派、初始金錢、初始體力、初始道具、初始裝備、初始功法等級、初始聲望/官階、初始 Buff。
  2. 支援多玩家放置（最多 4 名）。
- **測試方式**：
  - 手動確認：放置玩家並設定初始裝備與功法，匯出 JSON 確認 `initialEquipment` 與 `initialSkillProgression` 正確。
- **驗收標準**：✅ 玩家初始配置完整、支援多玩家。

---

### Phase 3：任務與對話序列編排

#### Milestone 3-1：任務目標編排器
- **開發任務**：
  1. 實作 `QuestSequencerModal.tsx`。
  2. 支援新增/編輯/刪除勝利目標。
  3. 目標類型下拉：`defeat-creature`、`destroy-nest`、`build-building`、`reconstruct-ruin`、`learn-skill`、`reach-prestige`、`survive-rounds`、`build-defense-structure`。
  4. Target Picker：點選「關聯物件」按鈕後，回到地圖點選目標物件，自動填入 `targetId`。
  5. 支線目標（`isOptional`）與評分條件。
- **測試方式**：
  - 手動確認：新增「擊敗 boss-treant」目標，使用 Target Picker 點選地圖上的 Boss，確認 ID 自動填入。
  - 自動測試：`scenarioValidator` 能偵測目標關聯的物件不存在時標記警告。
- **驗收標準**：✅ 所有目標類型可建立、Target Picker 正確綁定、支線標記生效。

#### Milestone 3-2：失敗條件與彈性據點政策
- **開發任務**：
  1. 失敗條件編輯：最大回合數、玩家必須存活。
  2. 彈性據點失敗政策：`criticalBases`（必須存活的關鍵據點清單）、`maxLostBasesCount`（允許損失據點上限）。
  3. 預設值：`baseMustSurvive = true`（任一據點失守即失敗，對應第一/二章）。
- **測試方式**：
  - 手動確認：設定 `criticalBases = ['base-wanxiang']`、`maxLostBasesCount = 1`，匯出 JSON 確認正確。
- **驗收標準**：✅ 失敗條件可自訂、彈性據點政策正確儲存。

#### Milestone 3-3：對話序列編排器
- **開發任務**：
  1. 實作 `DialogueEditorModal.tsx`。
  2. 新增對話步驟：說話者名稱、頭像 icon、對話內容（多行文字）。
  3. 觸發條件下拉：`on-start`、`on-objective-complete`、`on-enter-region`、`on-defeat-boss`。
  4. 觸發參數：關聯目標 ID 或區域座標。
  5. 對話排序（拖曳或上下移動按鈕）。
- **測試方式**：
  - 手動確認：建立開局對話與擊殺 Boss 後對話，匯出 JSON 確認 `dialogues` 陣列順序與觸發條件正確。
- **驗收標準**：✅ 對話可新增/排序/刪除、觸發條件正確綁定。

---

### Phase 4：一鍵試玩與編譯器

#### Milestone 4-1：ScenarioCompiler 純函式與測試
- **開發任務**：
  1. 實作 `scenarioCompiler.ts`：`buildGameStateFromScenario(scenario: ScenarioDefinition): GameState`。
  2. 自動生成 `MapCell.id`（`${row}-${column}`）。
  3. 初始化所有隱藏欄位（`visibility`、`runStats`、`operation`、`blockingModal` 等）。
  4. 編譯據點預建建築、怪物屬性覆寫、玩家初始裝備與功法。
  5. 實作 `scenarioValidator.ts`：檢查至少 1 名玩家、勝敗條件非空、目標物件存在。
- **測試方式**：
  - 自動測試：`scenarioCompiler.test.ts` 驗證 JSON → GameState 無資料遺失。
  - 自動測試：`scenarioValidator.test.ts` 覆蓋起點缺失、目標遺失等邊界。
- **驗收標準**：✅ 編譯器測試全數通過、隱藏欄位正確初始化。

#### Milestone 4-2：一鍵試玩與安全返回
- **開發任務**：
  1. 頂部工具列「▶️ 試玩」按鈕：呼叫 `scenarioValidator` → `buildGameStateFromScenario` → `gameStore.setStateForTest()`。
  2. 切換至遊戲畫面，頂部浮動顯示「⏹️ 結束試玩」按鈕。
  3. 點擊「結束試玩」後返回編輯器，保留未匯出的編輯狀態。
  4. 試玩期間的遊戲勝利/失敗不影響編輯器資料。
- **測試方式**：
  - 手動確認：編輯一張簡單地圖（1 據點 + 1 Boss），點試玩後能移動、戰戰鬥、擊殺 Boss；點結束試玩後回到編輯器，地形與物件仍在。
- **驗收標準**：✅ 試玩無縫切換、返回後編輯狀態完整保留。

---

### Phase 5：官方關卡製作與打包

#### Milestone 5-1：序章關卡製作與驗證
- **開發任務**：
  1. 使用編輯器製作「序章：青石遺恨」（10×10，單據點 + 1 Boss + 基礎教學對話）。
  2. 匯出 JSON 並打包進 `campaignScenarioCatalog.ts`。
  3. 在主選單加入「劇情模式」入口，可選擇章節並載入。
- **測試方式**：
  - 手動確認：從主選單進入劇情模式 → 選序章 → 開局對話 → 移動 → 戰鬥 → 擊殺 Boss → 通關結算。
- **驗收標準**：✅ 序章完整通關流程無卡頓。

#### Milestone 5-2：第一章關卡製作與多目標驗證
- **開發任務**：
  1. 使用編輯器製作「第一章：萬木逢春・林海異變」（20×20，雙廢墟 + 雙巢穴 + Boss + 事件點）。
  2. 編排 3 條主線目標與 4 段對話。
  3. 打包進劇情模式章節選單。
- **測試方式**：
  - 手動確認：通關流程涵蓋修復廢墟 → 拆巢穴 → 擊殺妖王 → 通關結算，所有目標正確判定。
- **驗收標準**：✅ 多目標順序判定正確、對話觸發時機正確。

#### Milestone 5-3：小地圖導航與平衡檢查器（大關卡支援）
- **開發任務**：
  1. 畫布右下角加入小地圖導航器（Minimap Overview），點擊可快速平移。
  2. 右側 Inspector 加入「實體清單快速定位（Entity Quick-Jumper）」。
  3. 加入「關卡平衡檢查器」：自動統計初始總建料、怪物總血量、巢穴總數。
- **測試方式**：
  - 手動確認：在 30×30 地圖上使用小地圖快速跳轉；平衡檢查器顯示正確統計。
- **驗收標準**：✅ 大地圖導航流暢、平衡數值一覽無遺。

---

### 里程碑總覽與依賴關係

```text
M1-1 編輯器骨架與網格
  └─ M1-2 地形筆刷
       └─ M1-3 尺寸調整與隨機打底
            └─ M1-4 Undo/Redo 與 JSON 匯入匯出
                 └─ M2-1 物件圖章放置
                      ├─ M2-2 怪物 Inspector
                      ├─ M2-3 據點 Inspector
                      ├─ M2-4 其餘實體 Inspector
                      └─ M2-5 玩家初始配置
                           └─ M3-1 任務目標編排
                                └─ M3-2 失敗條件
                                     └─ M3-3 對話序列
                                          └─ M4-1 ScenarioCompiler
                                               └─ M4-2 一鍵試玩
                                                    ├─ M5-1 序章製作
                                                    ├─ M5-2 第一章製作
                                                    └─ M5-3 大關卡導航
```

---

## 八、第一章實戰範例與編輯器需求檢驗（Chapter 1 Case Study & Editor Requirements）

為確保編輯器初始版本既能實作具體章節、又具備高度可擴充性，本節以**第一章：《萬木逢春・林海異變》**作為原型推演，盤點關卡大綱與編輯器功能需求。

### 8.1 第一章故事大綱：《萬木逢春・林海異變》
- **故事背景**：
  - 主角受邀來到江南「翠竹鎮」。此地地處萬木蔥蘢之林海邊緣，本為祥和藥鄉。
  - 近日深林靈木地脈遭妖氣侵蝕，狂暴化的追風木狼與妖物四處掠奪，切斷了通往鄰村「古木原」的聯絡驛道。
  - 村長委託主角修復古驛站連通交通、清除兩處狼穴、深入密林核心討伐盤踞首領**「青木妖王」**。
- **地圖規格與地理配置（20×20）**：
  - **西北平原區**：安全起點，翠竹鎮（`base-cuizhu`，預建醫療室 Lv.1、告示牌 Lv.1、起始建料 60）。
  - **中央廣袤林海**：木屬性主場（追風共鳴區），怪物主場移動暢行與迴避加成。
  - **東南水澤區**：河流阻隔，需繞行或利用輕功/小型驛站。
  - **東北深林核心**：山嶽環繞的封閉林地，Boss 所在地。
- **核心實體配置**：
  - 玩家起點：`player-1`（位於翠竹鎮相鄰格，初始攜帶療傷藥×2、聚氣丹×1）。
  - 廢墟點：`ruin-bridge`（古橋廢墟）、`ruin-outpost`（林間哨站）。
  - 怪物巢穴：`nest-wolf-1`（掠奪型）、`nest-wolf-2`（攻城型）。
  - 首領 Boss：`boss-treant`（**青木妖王**，Lv.5，追風流，首領金框，血量 160）。
  - 劇情事件點：`event-herbalist`（密林採藥人）、`event-ancient-tree`（千年古木殘篇）。
- **目標與勝敗條件**：
  - **主線勝利目標**：
    1. 修復 2 處廢墟（`reconstruct-ruin`, target: 2）。
    2. 摧毀 2 處林間巢穴（`destroy-nest`, target: 2）。
    3. 擊敗深林之主「青木妖王」（`defeat-creature`, targetId: `boss-treant`）。
  - **支線目標（評分 S/A/B）**：翠竹鎮血量未低於 80%、25 回合內通關。
  - **失敗條件**：翠竹鎮被摧毀、玩家陣亡、超過 35 回合。

---

### 8.2 編輯器在第一章實作中的需求檢驗與功能映射

| 關卡設計需求 | 編輯器對應支援功能 | 初始版本可擴充設計考量 |
| :--- | :--- | :--- |
| **大面積森林與水路繪製** | 1×1 / 2×2 / 3×3 地形筆刷、隨機地形生成打底後微調 | 筆刷支援自訂形狀擴充，底層為純陣列替換 |
| **據點自帶初始建築與建料** | 據點 Inspector 勾選預建建築（醫療室/告示牌/倉庫等級）與填入起始建料 | 建築清單動態讀取 `buildingCatalog`，新增建築不需改編輯器 |
| **自訂高血量、特定流派 Boss** | 怪物 Inspector 提供 `isBoss` 開關、自訂等級、流派、行為模式與五維/血量覆寫 | 支援 `customMetadata` 與額外 Buff 清單注入 |
| **指定廢墟村落名稱與狀態** | 廢墟圖章放置，Inspector 編輯 `originName` 與 `status` | 支援將廢墟初始狀態設為已修復或待清除 |
| **指定特定劇情探索事件** | 事件圖章放置，下拉選擇事件類型並綁定 ID | 事件池動態讀取 `explorationEventCatalog` |
| **編排多階段任務目標** | 任務編排器（Quest Sequencer）支援多目標組合、目標物件點選器（Target Picker） | 目標類型採開放式字串註冊，方便日後擴充新目標 |
| **開局與進度觸發對話** | 對話編排器（Dialogue Editor）支援 `on-start`、`on-objective-complete` 等觸發器 | 觸發器條件參數化，支援擴充自訂條件 |
| **數值強度即時驗證** | 一鍵試玩（▶️ Playtest）與隨時返回編輯器（⏹️ Stop） | 透過純函式編譯，不污染沙盒模式代碼 |

---

## 九、第二章實戰範例與編輯器進階需求檢驗（Chapter 2 Case Study & Advanced Requirements）

為了檢驗編輯器在更複雜關卡機制（多據點防守、雙流派五行相剋、門派輕功學習、區域治理與階段性伏擊）下的承載力，本節以**第二章：《烈日狂沙・烽火赤炎》**進行深度推演。

### 9.1 第二章故事大綱：《烈日狂沙・烽火赤炎》
- **故事背景**：
  - 第一章平定林海後，追查妖氣源頭直指西北邊陲「赤沙荒漠」。
  - 邊境重鎮「陽關鎮」與駐紮前哨「烽火寨」正遭逢劇變：荒漠地脈燥熱引動赤炎暴動，盤踞在灼熱沙丘中的熾炎沙蠍與荒漠悍匪瘋狂圍攻水源與城鎮。
  - 當地駐守長老受困，需要主角前往解救、向沙漠中的「赤炎門」修得《踏沙功》橫渡流沙、運用寒水流外功以水剋火、在兩座據點間調度物資並堅守據點，最終平定熔岩裂谷中的**「赤焰邪尊」**。
- **地圖規格與地理配置（25×25）**：
  - **東南水源綠洲區**：平原與水澤交錯，陽關鎮所在地（`base-yangguan`，預建貿易市場 Lv.2 帶來全局靈氣、告示牌 Lv.2）。
  - **中央大荒漠區**：大面積荒漠（赤炎共鳴區/移動高消耗），沙暴橫行，普通移動消耗大，敵方享有沙地增傷。
  - **西南前哨營區**：孤立於荒漠西緣的「烽火寨」（`base-fenghuo`，初始受損且建料短缺，需調度建料修築城牆）。
  - **北面赤炎山門**：赤炎門派據點（`sect-gate-scarlet`，提供學習赤炎功法與專屬輕功《踏沙功》）。
  - **西北熔岩裂谷**：被山嶽與荒漠包圍的死地，Boss 盤踞處。
- **核心實體配置**：
  - 玩家起點：`player-1`（位於陽關鎮綠洲，初始建議配置寒水或追風流技能）。
  - 雙據點：`base-yangguan`（主鎮，健全）、`base-fenghuo`（前哨寨，殘血且建料為 0）。
  - 門派據點：`sect-gate-scarlet`（赤炎門，可學習火系內外功與踏沙功）。
  - 廢墟點：`ruin-oasis-well`（綠洲古井，修復後可提供水源視野與小型驛站）。
  - 怪物巢穴×3：
    - `nest-scorpion-1`（荒漠沙蠍穴，赤炎流，行為：掠奪型，奪取周邊資源點）。
    - `nest-bandit-1`（荒漠悍匪寨，赤炎流，行為：攻城型，主攻烽火寨）。
    - `nest-bandit-2`（遊蕩獵殺群，行為：獵殺型，追殺橫渡沙漠的玩家）。
  - 首領 Boss：`boss-fire-lord`（**赤焰邪尊**，Lv.8，赤炎流，首領金框，血量 240，帶燃燒與烈焰高爆發外功）。
  - 劇情事件點：
    - `event-desert-caravan`（風沙埋沒車隊，挖掘可獲得大量建料補貼烽火寨）。
    - `event-ascetic`（苦行散修，切磋可獲得水行爆發符道具）。
- **目標與勝敗條件**：
  - **主線勝利目標**：
    1. **【橫渡流沙】**：於赤炎門派據點習得《踏沙功》（`learn-skill`, skillId: `desert-step`）。
    2. **【修固烽火】**：調度建料並在烽火寨修築「強化城牆」或將其血量修復至 100%（`build-building` / `reach-base-health`）。
    3. **【拔除沙煞】**：摧毀 3 處荒漠巢穴（`destroy-nest`, targetValue: 3）。
    4. **【止息炎禍】**：擊敗深淵首領「赤焰邪尊」（`defeat-creature`, targetId: `boss-fire-lord`）。
  - **支線目標（評分 S/A/B）**：烽火寨未曾失守、使用水屬性招式擊敗赤焰邪尊、30 回合內通關。
  - **失敗條件**：任一據點被摧毀（陽關鎮或烽火寨失守）、玩家陣亡、超過 40 回合。

---

### 9.2 第二章對編輯器提出的進階需求檢驗與功能補充

透過第二章的複雜情境，我們發現編輯器需要進一步支援以下**進階功能與擴充點**：

| 關卡進階需求 | 編輯器檢驗發現的擴充點 | 編輯器架構補充設計 |
| :--- | :--- | :--- |
| **多據點配置與非滿血開局** | 第一章只有單一健全據點；第二章需要「烽火寨」初始血量 50%、建料 0，且兩據點有不同初始政策。 | **據點 Inspector** 需支援自訂 `initialHealth`、`initialBuildingMaterials` 與 `initialPolicyId`。 |
| **指定門派據點與功法解鎖** | 需要在地圖上放置特定門派據點（赤炎門），並確認其傳授功法清單。 | **門派據點圖章（Sect Gate Stamp）**：可下拉指定 `schoolId`（如 `scarlet-flame`）。 |
| **任務目標包含「習得特定輕功」** | 任務目標不只是打怪/拆巢穴，需要判定玩家是否在門派據點學會特定技能。 | **任務目標類型擴充**：支援 `type: 'learn-skill'`，在目標編輯器中可下拉選擇指定功法（如 `desert-step`）。 |
| **任務目標包含「特定據點建造/修復」** | 判定特定據點（烽火寨）是否建造了指定建築（如 `wall`）或血量回滿。 | **任務目標類型擴充**：支援 `type: 'build-building'`，可綁定 `baseId` 與 `buildingType`。 |
| **多單位與多區域批次編輯** | 25×25 地圖較大，荒漠與平原過渡邊界需要快速鋪設。 | **筆刷工具升級**：支援「框選區域填充（Box Fill）」與「地形替換（Replace Terrain，如將圈選區內草地全換成沙地）」。 |
| **Boss 專屬外功與裝備配置** | Boss 需要攜帶特定高傷火系外功與特殊抗性。 | **怪物 Inspector**：支援指定 `equippedExternalSkillIds` 與自訂初始屬性。 |

---

## 十、第三章實戰範例與高階系統整合檢驗（Chapter 3 Case Study & High-End System Requirements）

為了檢驗編輯器在最高複雜度場景（大跨度山河地貌、多門派結盟、官階治理、全局靈氣搭配、高階防禦箭塔工事網、階段性怪物潮與多階段最終 Boss）下的承載能力，本節以**第三章（終章篇）：《萬象歸宗・天柱擎天》**進行深度推演。

### 10.1 第三章故事大綱：《萬象歸宗・天柱擎天》
- **故事背景**：
  - 前兩章平定林海與荒漠後，五行地脈異變的源頭終於揭曉——位於天下中心的神聖山脈「擎天絕峰」與「太虛古墟」。
  - 盤踞於古陣之巔的混沌魔尊**「混沌始祖」**正在抽取天地靈氣，引動金剛、寒水、厚土三系怪物群發起全圖圍攻，意圖摧毀天下三大重鎮。
  - 主角必須受封朝廷**「鄉鎮主事」**官階，在中央重鎮「萬象城」、防禦樞紐「玄武堡」與水路要道「碧波鎮」之間統籌調度，聯合金剛門與寒水門兩大門派據點，修築進階箭塔陣地與高牆，並在最終血月降臨時攻入太虛古陣，擊破具備雙重形態的最終 Boss。
- **地圖規格與地理配置（30×30 大型地圖）**：
  - **西南方平原萬象城**：主都城（`base-wanxiang`，初始官階治理中心，預建總管府、倉庫 Lv.3、告示牌 Lv.3）。
  - **東南方水澤碧波鎮**：水運樞紐（`base-bibo`，預建貿易市場 Lv.3 提供強大全局靈氣、醫療室 Lv.3）。
  - **西北方高山玄武堡**：要塞哨堡（`base-xuanwu`，扼守山谷隘口，預建強化城牆，承受主要攻城壓力）。
  - **東西兩側門派據點**：
    - `sect-gate-golden`（金剛門，位於高山崖邊，提供金剛內外功與《破壁功》）。
    - `sect-gate-frost`（寒水門，位於湖泊島嶼，提供寒水內外功與《踏水功》）。
  - **中央天柱絕峰（30% 山嶽 + 牆壁圍繞）**：險峻地勢，狹窄隘口，需藉由破壁功或小型驛站突破。
  - **東北方太虛古陣深淵**：混沌死地，魔尊與高階魔傀盤踞處。
- **核心實體配置**：
  - 玩家起點：`player-1`（位於萬象城，初始官階 3 級，金錢 150，配有進階裝備）。
  - 三大據點：`base-wanxiang`（主城）、`base-bibo`（水鎮）、`base-xuanwu`（高山堡壘）。
  - 兩大門派據點：金剛門（山嶽）、寒水門（水域）。
  - 廢墟點×4：分佈於山谷咽喉，修復後可作為前線小型驛站或補給站。
  - 怪物巢穴×4：
    - `nest-metal-golem`（金剛傀儡巢，山嶽，攻城型，猛攻玄武堡）。
    - `nest-water-serpent`（寒潭魔蛇巢，水域，掠奪型，襲擊碧波鎮資源點）。
    - `nest-earth-bear`（厚土狂熊巢，草地/山林，獵殺型，阻斷三城聯絡道）。
    - `nest-void-fiend`（太虛魔將巢，太虛混沌，攻城型，定時向萬象城推進）。
  - 最終 Boss（雙階段首領）：
    - `boss-chaos-lord`（**混沌始祖**，Lv.12，無屬性太虛流，血量 400，自帶「太虛金身」受傷 -25%、每回合召喚游蕩爪牙）。
  - 劇情事件點×4：
    - `event-sealed-monument`（太虛封魔石碑，提供太虛絕學解鎖線索）。
    - `event-refugee-convoy`（避難流民車隊，救助可獲得大量聲望與建料）。
- **目標與勝敗條件**：
  - **主線勝利目標**：
    1. **【治理天下】**：累積聲望使官階達到「鄉鎮主事」以上（`reach-prestige`, targetValue: 240）。
    2. **【固若金湯】**：在玄武堡周圍建造至少 2 座「進階箭塔」（`build-defense-structure`, type: `advanced-arrow-tower`, targetValue: 2）。
    3. **【宗門大同】**：於金剛門與寒水門分別習得門派輕功（`learn-skill`, skills: [`wall-step`, `water-step`]）。
    4. **【淨化四方】**：摧毀地圖上全部 4 座侵蝕巢穴（`destroy-nest`, targetValue: 4）。
    5. **【平定乾坤】**：攻入太虛古陣，擊敗最終首領「混沌始祖」（`defeat-creature`, targetId: `boss-chaos-lord`）。
  - **支線目標（評分 S/A/B）**：三座據點全數存活且血量均 >= 60%、45 回合內通關、無任何防禦設施被摧毀。
  - **失敗條件**：萬象城被摧毀、其他任兩座據點失守、玩家陣亡、超過 60 回合。

---

### 10.2 第三章對編輯器提出的終極需求檢驗與功能補充

透過第三章頂級規模的關卡推演，我們進一步提煉出編輯器在面對大型複雜戰役時所需的**關鍵架構補強**：

| 關卡高階需求 | 編輯器檢驗發現的擴充點 | 編輯器架構補充設計 |
| :--- | :--- | :--- |
| **聲望與官階勝利目標** | 勝利目標需要判定玩家聲望是否達到指定數值（如 240 點）以解鎖高級防禦建造。 | **任務目標類型擴充**：支援 `type: 'reach-prestige'`，輸入門檻數值 `targetValue: 240`。 |
| **防禦設施建造目標** | 需要判定玩家是否在特定據點影響區內建造了指定防禦設施（如「進階箭塔」2 座）。 | **任務目標類型擴充**：支援 `type: 'build-defense-structure'`，可指定 `structureType: 'advanced-arrow-tower'` 與數量。 |
| **多重技能學習目標** | 玩家需同時從多個門派習得複數輕功。 | **任務目標支援陣列式條件**：`type: 'learn-skills'` 支援多選功法 ID 清單。 |
| **據點多元失敗條件** | 第一/二章是「任一據點被摧毀即失敗」；第三章是「主城萬象城被摧毀，或副城損失達 2 座才失敗」。 | **失敗條件彈性化（Fail Condition Policy）**：支援設定 `criticalBases`（必須存活的關鍵據點清單）與 `maxLostBasesCount`（允許損失據點上限）。 |
| **大尺寸地圖（30×30）的導航與效能** | 畫布格子達到 900 格，平移與找尋目標物件費時。 | **編輯器畫布優化**：<br>1. 支援**小地圖導航器（Minimap Overview）**。<br>2. 支援**實體清單快速定位（Entity Quick-Jumper）**：點選右側清單中的怪物或據點，畫布自動平移置中並選取。 |
| **關卡數值預覽與平衡檢查（Balance Validator）** | 大型關卡實體眾多，容易漏算建料總量或怪物威脅度。 | **關卡檢查器（Inspector Summary）**：自動統計當前地圖的「初始總建料」、「怪物總血量」、「巢穴總產能」，供設計師一覽平衡度。 |

---

## 十一、三章大綱對比與編輯器功能覆蓋度總覽

透過序章、第一章、第二章、第三章的完整推演，編輯器的功能光譜已完全覆蓋不同維度的玩法：

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 序章：青石遺恨（10×10）   ── 基礎教學：單據點、普通怪物、單一首領、基礎建造   │
│ 第一章：萬木逢春（20×20） ── 區域探索：大面積林海、怪物主場、廢墟修復、小型驛站 │
│ 第二章：烈日狂沙（25×25） ── 戰略調度：雙據點殘局、大荒漠、五行剋制、門派輕功   │
│ 第三章：萬象歸宗（30×30） ── 全局大戰：三城聯防、官階治理、進階防禦陣、雙形態Boss│
└─────────────────────────────────────────────────────────────────────────────┘
```

**結論**：
透過三章實戰情境的反覆檢檢驗，證明目前在 `reports/scenario-editor-design.md` 中確立的架構（**圖章註冊表 + 開放式任務引擎 + 自訂 Metadata + 三欄式 Inspector + 小地圖快速定位**）具備極高的擴充彈性，既能支撐第一版的極簡上手，也能平滑支撐未來所有複雜機制的關卡創作！

---

## 十一點五、實際程式碼對照與補充建議（Codebase Cross-Reference & Supplements）

本節透過實際檢視 `src/game/types.ts`、`src/game/worldSetup.ts`、`src/game/gameStore.ts` 與 `src/game/gameSettings.ts`，盤點設計文件與現有程式碼之間的落差，並提出具體補充建議。

### 11.5.1 ScenarioCell.terrain 缺少 `'road'` 地形

**現況**：`types.ts` 中 `TerrainType = 'plain' | 'forest' | 'water' | 'mountain' | 'desert' | 'wall' | 'road'`，但設計文件的 `ScenarioCell.terrain` 只列了 6 種，漏了 `'road'`。

**建議**：將 `ScenarioCell.terrain` 更新為完整的 `TerrainType`，並在編輯器地形筆刷面板中加入「道路（road）」選項。

### 11.5.2 ScenarioDefinition 實體清單缺少既有 GameState 欄位

**現況**：實際 `GameState` 包含 `defenseStructures`、`traps`、`globalBuffs`、`sharedWarehouse`、`sharedEquipmentWarehouse` 等欄位，但 `ScenarioDefinition.entities` 中未涵蓋。

**建議**：在 `ScenarioDefinition.entities` 中補充：
```ts
defenseStructures?: Array<{ id: string; type: string; position: Position; ownerBaseId: string; level?: number }>
traps?: Array<{ id: string; position: Position; type: 'snare' | 'immobilize'; ownerPlayerId: string; damage?: number }>
globalBuffs?: Array<{ kind: GlobalBuffKind; magnitude: number; sourceBaseId: string }>
```
這對應第三章「預建進階箭塔」與「貿易市場初始全局靈氣」的需求。

### 11.5.3 ScenarioPlayerConfig 過於簡化，不支援初始裝備與功法等級

**現況**：實際 `PlayerState` 包含 `baseAttributes`、`equipmentInventory`、`equipmentLoadout`、`skillProgression`、`buffs`、`governanceRank`、`unlockedPolicyIds`、`unlockedEquipmentDropIds` 等欄位。設計文件的 `ScenarioPlayerConfig` 只涵蓋了基本欄位。

**建議**：補充以下可選欄位：
```ts
export type ScenarioPlayerConfig = {
  // ...existing fields...
  baseAttributes?: PlayerAttributes          // 覆寫初始五維（預設 8）
  governanceRank?: number                    // 初始官階（第三章需設為 3）
  prestige?: number                          // 初始聲望
  initialEquipment?: Array<{ equipmentId: string; slot: 'weapon' | 'armor' | 'accessory' }>
  initialSkillProgression?: Array<{ skillId: string; level: number }>
  initialBuffs?: Array<{ definitionId: string; remainingRounds: number | null }>
  unlockedPolicyIds?: string[]
}
```

### 11.5.4 ScenarioCreatureConfig 需補充裝備外功與初始 Buff

**現況**：`CreatureState extends PlayerState`，怪物實際上擁有 `equippedExternalSkillIds`、`innerSkillId`、`buffs`、`externalSkillsUsedThisTurn` 等欄位。第二章 Boss「赤焰邪尊」需要攜帶特定外功，但設計文件中 `ScenarioCreatureConfig` 缺少這些欄位。

**建議**：補充：
```ts
export type ScenarioCreatureConfig = {
  // ...existing fields...
  innerSkillId?: string                      // 自訂內功（預設依流派自動推導）
  equippedExternalSkillIds?: string[]        // 裝備的外功清單
  initialBuffs?: Array<{ definitionId: string; remainingRounds: number | null }>
  maxHealthOverride?: number                 // 自訂血量上限（如 Boss 400 血）
}
```

### 11.5.5 ScenarioBaseConfig 需補充 `martialSchoolId`、`discovered`、`active`

**現況**：實際 `BaseState` 有 `martialSchoolId`（武館流派綁定）、`discovered`（是否已解鎖視野）、`active`（是否停用）等欄位。第三章「萬象城」需要預建總管府，且可能需要預設 `discovered: true`。

**建議**：在 `ScenarioBaseConfig` 補充：
```ts
martialSchoolId?: MartialSchoolId           # 據點專屬武館流派
discovered?: boolean                        # 預設已解鎖視野
active?: boolean                            # 預設是否停用（殘血據點可設為 true 但低血量）
```

### 11.5.6 巢穴設定缺少 `spawnChance`、`cooldownRounds`、`spawnLevel`

**現況**：`CreatureNestState` 有 `spawnChance`、`cooldownRounds`、`spawnLevel` 等生成參數，設計文件中巢穴只列了 `schoolId` 與 `behaviorType`。

**建議**：在巢穴 Schema 補充：
```ts
nests: Array<{
  // ...existing fields...
  spawnChance?: number         # 預設 0.1（10%）
  spawnLevel?: number          # 生成怪物的初始等級
  cooldownRounds?: number      # 初始冷卻回合
  maxHealth?: number           # 巢穴血量上限
}>
```

### 11.5.7 門派據點缺少 `experience` 與 `level`

**現況**：`SectGateState` 有 `experience` 與 `level`（1/2/3）欄位，決定可學習的功法等級。設計文件中門派據點只列了 `schoolId`。

**建議**：在門派據點 Schema 補充：
```ts
sectGates: Array<{
  id: string
  schoolId: MartialSchoolId
  position: Position
  level?: 1 | 2 | 3            # 預設 1；第三章可設為 3 直接解鎖全部功法
  experience?: number          # 預設 0
}>
```

### 11.5.8 編譯器（scenarioCompiler）需處理的隱藏欄位

**現況**：`createGameState()`（`worldSetup.ts`）在建立 `GameState` 時會初始化許多衍生欄位：`visibility`（視野系統）、`runStats`（戰績）、`sharedWarehouse`、`sharedEquipmentWarehouse`、`aiOrders`、`aiConstructionPlans`、`operation`、`blockingModal`、`creatureTurnInProgress` 等。

**建議**：設計文件中應明確列出 `scenarioCompiler.ts` 需要初始化的**隱藏欄位清單**：
```ts
function buildGameStateFromScenario(scenario: ScenarioDefinition): GameState {
  return {
    map: { rows, columns, cells: scenario.cells.map(c => ({ id: `${c.row}-${c.column}`, ...c })) },
    visibility: initializeVisibilityFromScenario(scenario),  // 依玩家起點與據點計算初始視野
    bases: compileBases(scenario.entities.bases),
    defenseStructures: compileDefenseStructures(scenario.entities.defenseStructures ?? []),
    ruins: scenario.entities.ruins ?? [],
    traps: scenario.entities.traps ?? [],
    creatureNests: compileNests(scenario.entities.nests),
    resourcePoints: compileResourcePoints(scenario.entities.resourcePoints),
    itemPoints: scenario.entities.itemPoints,
    explorationEvents: scenario.entities.events.map(compileEvent),
    sectGates: scenario.entities.sectGates ?? [],
    globalBuffs: scenario.entities.globalBuffs ?? [],
    players: compilePlayers(scenario.entities.players),
    creatures: scenario.entities.creatures.map(compileCreature),
    activePlayerId: scenario.entities.players[0]?.id ?? 'player-1',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    repairPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    runStats: createEmptyRunStats(),
    sharedWarehouse: [],
    sharedEquipmentWarehouse: [],
    aiOrders: [],
    aiConstructionPlans: [],
    // 劇情模式專屬欄位
    campaignState: { currentChapter: scenario.chapterIndex, activeQuests: scenario.quests, dialogueQueue: scenario.dialogues },
  }
}
```

### 11.5.9 一鍵試玩可直接複用 `gameStore.setStateForTest()`

**現況**：`gameStore.ts` 已有 `setStateForTest(nextState: GameState)` 方法，可直接注入任意 `GameState`。

**建議**：設計文件中明確指出「一鍵試玩」的實作路徑：
```ts
// 編輯器點擊「試玩」時：
const gameState = buildGameStateFromScenario(currentScenario)
gameStore.setStateForTest(gameState)
// 切換至遊戲畫面...
```
這樣不需要修改 `gameStore` 的核心邏輯，只需在編輯器端呼叫既有的測試注入方法。

### 11.5.10 既有 `createDebugGameState()` 是劇本編譯器的原型

**現況**：`worldSetup.ts` 中已有 `createDebugGameState()` 與 `createDebugMap()`，它手動建立了一張 21×21 的固定地形地圖（五地形分區），並手動放置據點、怪物、巢穴與門派據點。

**建議**：設計文件中應參照此函式作為「劇本編譯器」的原型與參考實作。`scenarioCompiler.ts` 本質上就是 `createDebugGameState()` 的**資料驅動通用版**——將硬編碼的固定配置改為從 `ScenarioDefinition` JSON 讀取。

### 11.5.11 `MapCell.id` 格式需由編譯器自動生成

**現況**：每個 `MapCell` 都有 `id` 欄位（格式為 `${row}-${column}`），這是地圖渲染與視野系統的索引鍵。`ScenarioCell` 中沒有 `id` 欄位。

**建議**：在 `scenarioCompiler.ts` 中自動生成 `id`：
```ts
cells: scenario.cells.map(c => ({ id: `${c.row}-${c.column}`, row: c.row, column: c.column, terrain: c.terrain }))
```
設計文件中應註明此編譯細節，避免開發時遺漏。

---

## 十二、驗收與測試標準（Definition of Done）

- [ ] `scenarioCompiler.test.ts` 驗證 Scenario JSON 轉 GameState 無資料遺失，支援雙據點與自訂門派據點。
- [ ] `scenarioValidator.test.ts` 覆蓋起點缺失、目標物件遺失、多據點無效座標等例外邊界檢查。
- [ ] 完整執行 `npm run test` 與 `npm run build` 通過。
- [ ] 實際操作驗收：在編輯器刷出一張 15×15 地圖，放置 1 座據點與 1 隻自訂 Boss，設定勝利條件為擊殺 Boss，點擊「試玩」可正常戰鬥並結算勝利。
