# mygame2 專案架構筆記

> 檢視日期：2026-08-23
> 範圍：`dev/MartialRealmMountainsAndRivers/mygame2`

## 1. 專案概要

武俠風格的**回合制探索／經營遊戲**（對應專案名「江湖山河」）。玩家在危險荒野中建立勢力：

```
探索地圖 → 發現資源點/道具點/Creature/巢穴/事件 → 戰鬥與互動
→ 消耗生命/體力/內力/裝備耐久 → 獲得道具、裝備或功法
→ 回據點任務/修理/建設 → 建築能力支撐後續探索
```

核心設計支柱（摘自 `reports/game-design-master-plan.md`）：探索感、選擇感、成長感、世界反應、資訊價值。

## 2. 技術棧

| 項目 | 選擇 |
|---|---|
| UI 框架 | React 19（啟用 React Compiler） |
| 語言 | TypeScript ~6.0 |
| 打包 | Vite 8（rolldown + babel） |
| UI 元件庫 | antd 6 |
| 測試 | Vitest 4 |
| Lint | ESLint 10 + typescript-eslint |
| 分析 | react-ga4 |

npm scripts：`dev` / `build`(`tsc -b && vite build`) / `test`(vitest run) / `lint` / `analyze:combat`（戰鬥平衡分析）/ `benchmark:map`（地圖效能）。

## 3. 目錄結構

```
mygame2/
├── src/
│   ├── main.tsx / App.tsx      # 入口；App 管理 start/game/editor 三種畫面切換
│   ├── App.css / index.css     # 全域樣式（App.css 約 35KB，手寫 CSS）
│   ├── components/             # 遊戲 UI
│   │   ├── MapGrid.tsx         # 地圖渲染（~33KB，最大 UI 元件）
│   │   ├── PlayerPanel / BasePanel / PlayerCommandPanel
│   │   ├── GameStartScreen / GameOverlays / GameStatusCard
│   │   ├── QuestTrackerPanel / GameSaveModal
│   │   └── overlays/
│   ├── game/                   # ★ 遊戲核心邏輯（純 TS，不依賴 React）
│   │   ├── gameStore.ts        # 中央狀態儲存（~1950 行，最大檔案）
│   │   ├── types.ts            # 全部領域型別（~930 行）
│   │   ├── worldGeneration.ts / mapTemplates.ts / worldSetup.ts
│   │   ├── actions/            # 玩家操作入口（回傳新 state 或結果物件）
│   │   ├── rules/              # 純規則函式（~50 個檔案，多數附測試）
│   │   ├── catalogs/           # 靜態資料目錄（功法/裝備/道具/建築/劇情…）
│   │   ├── events/             # 探索事件：catalog / spawner / resolver
│   │   ├── ai*.ts              # AI 規則：防守 / 自保 / 支援
│   │   ├── ai/                 # AI 重構核心（execution/ 原子攻擊；perception／planner 待建）
│   │   └── testHelpers/        # 測試夾具（AI 固定地圖／玩家／命令）
│   ├── editor/                 # 關卡編輯器（獨立子應用 EditorApp）
│   │   ├── components/         # Canvas / Palette / Inspector / 各編輯 Modal
│   │   ├── hooks/              # useEditorHistory (undo/redo)、useEditorSelection
│   │   └── rules/              # scenarioCompiler（場景→遊戲狀態）、scenarioValidator
│   ├── hooks/                  # useKeyboardShortcuts、useModalState
│   └── lib/analytics.ts        # GA4 包裝
├── reports/                    # 大量中文設計文件與開發日誌（見第 8 節）
└── scripts/                    # analyzeCombatBalance.mjs、benchmarkMapGrid.mjs
```

規模約 **247 個原始檔**。

## 4. 核心架構模式

### 4.1 自製外部 Store（無 Redux/Zustand）

`gameStore.ts` 是自製的單例 store：

```ts
// src/game/gameStore.ts:264
export const gameStore = { /* getState / updateGameState / subscribe / 數十個 action */ }

// src/game/gameStore.ts:1951
export function useGameState() {
  return useSyncExternalStore(gameStore.subscribe, gameStore.getState, gameStore.getState)
}
```

- 所有變更走 `updateGameState((state) => newState)`，immutable 更新。
- store 內含自動存檔邏輯（回合結束時寫入 AUTO_SAVE_SLOT）。
- 另提供 `setStateForTest` / `resetForTest` 測試後門。

### 4.2 分層：actions → rules → catalogs

- **actions/**：玩家操作的進入點（`combatActions`、`creatureActions`、`buildingActions`、`turnActions`…），負責流程編排，回傳結果物件（如 `AttackExecutionResult`）。
- **rules/**：純函式規則層（`skillRules`、`equipmentRules`、`terrainCombatRules`、`visibilityRules`、`movementRules`、`governanceRules`…），可獨立測試。
- **catalogs/**：靜態內容資料（`innerSkillCatalog`、`externalSkillCatalog`、`itemCatalog`、`equipmentCatalog`、`buildingCatalog`、`storyDialogueCatalog`、`campaignScenarioCatalog`…），型別集中在 `types.ts` 引用它們。
- **actionResultFormatters.ts**：把執行結果轉成給玩家看的文字訊息（UI 與邏輯解耦）。
- **storeAdapters.ts**：統一「驗證→執行→更新 store」的動作樣板。

### 4.3 GameState 形狀（types.ts:826）

單一大物件承載全部世界狀態：地圖/迷霧、據點、防禦設施、廢墟、陷阱、巢穴、資源點、道具點、探索事件、宗門門、玩家、Creature、回合序、各種 preview（攻擊/外功/道具爆破/修理）、戰績 `runStats`、劇情模式 `campaignState`、共用倉庫、AI 指令與建設計畫等。

### 4.4 探索事件系統

`events/` 三件套：
- `eventCatalog.ts`：事件定義（~34KB，選項＋效果＋需求）。
- `eventSpawner.ts`：依地形池生成事件點；也支援回合結束隨機觸發 pending 事件。
- `eventResolver.ts`：檢查需求、套用效果到玩家或世界狀態。

### 4.5 編輯器管線

`editor/rules/scenarioCompiler.ts` 把場景 JSON 編譯成 `GameSettings`＋初始世界，`scenarioValidator.ts` 做規則驗證，`scenarioStorage.ts` 管理官方/自訂場景存取。支援自訂事件、觸發器、對話、任務序列的編輯 Modal。

## 5. 主要遊戲系統清單

功法（內功/外功/悟性容量）、五維屬性＋三槽裝備（獨立實例＋耐久）、道具、Buff（`buffSystem`，含全局靈氣）、據點建築＋地圖防禦設施、探索事件、寶箱遺物、NPC 商隊、迷霧視野、地形效果（體力成本 `terrainStaminaCost`、地形共鳴「天地共鳴」、怪物主場 Buff）、 Creature 行為與巢穴、宗門門（中立據點）、廢墟重建、治理政策、劇情戰役（五章节＋對話系統）、AI 同盟指令（protect-base / support-player）與建設計畫、存檔（自動＋手動槽位）、戰役通關記錄（localStorage）、GA4 埋點。

## 6. 我的觀察與發現

### 優點

1. **邏輯與 UI 分離徹底**：`game/` 目錄幾乎是純 TS，React 只做呈現；測試直接打 state 函式即可。
2. **測試文化扎實**：幾乎每個 rules/actions 模組都有對應 `.test.ts`（gameStore.test.ts 高達 ~84KB）；還有戰鬥平衡分析與地圖 benchmark 腳本。
3. **文件極豐富**：`reports/` 有完整的系統設計文件（繁中）、開發日誌（最新至 2026-08-20 地形深度系統收尾）、玩家回饋分析、code health 報告（2026-08-16）。
4. **內容資料導向**：catalogs 集中管理，新增功法/道具/事件多半只需加資料。
5. **開發節奏健康**：日誌顯示每階段都有「完成項目→影響檔案→驗證結果→待驗收」紀律。

### 風險與注意點

1. **gameStore.ts 過大**（~84KB / 近 2000 行）：中央 store 同時承擔狀態、數十個 action、自動存檔。雖然已有 `storeAdapters` 抽象，但 store 本身仍是改動衝突熱區，值得繼續拆分（例如把存檔、AI 回合、事件觸發抽成模組）。
2. **types.ts 單檔 ~930 行**：所有領域型別集中，耦合面大；GameState 可選欄位很多（`?`），代表系統是漸進疊加的，讀程式碼時要注意 undefined 處理。
3. **MapGrid.tsx / InspectorSidebar.tsx 等 UI 巨石**：33KB／30KB 的單檔元件，修改前需先理解其內部區塊。
4. **手寫 CSS（App.css 35KB）**：未用 CSS-in-JS 或 utility framework（除 antd 外），全域類名可能互相影響。
5. **reports/ 有重複文件**：根層與 `reports/system/`、`reports/analysis/` 存在同名檔（如 fog-of-war-design.md、combat-balance-report.md），引用時注意哪份才是最新。
6. **README 是模板預設**：真正的專案說明都在 reports/ 內，新人上手成本落在文件閱讀。

## 7. 快速上手建議路徑

1. 讀 `reports/game-design-master-plan.md`（整體玩法願景）。
2. 讀 `src/game/types.ts` 的 `GameState`（types.ts:826）建立世界觀。
3. 看 `src/game/worldSetup.ts` 的 `createGameState()` 了解一局怎麼開始。
4. 追一條主流程：`PlayerCommandPanel` → `gameStore.attack*` → `combatActions.ts` → `rules/skillRules` + `terrainCombatRules` → `actionResultFormatters`。
5. 改內容優先看 `catalogs/`；改規則去 `rules/` 並跑對應 `.test.ts`。
6. 驗證一律：`npx tsc -b --pretty false` ＋ `npx vitest run`（開發日誌中的既定慣例）。
