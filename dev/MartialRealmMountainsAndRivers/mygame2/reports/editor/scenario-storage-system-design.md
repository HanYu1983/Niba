# 關卡儲存與副本機制設計文件（Scenario Storage & Copy System Design）

本文件規範《武行山河》劇情關卡（Scenario）的**靜態 JSON 來源、localStorage 副本機制、版本比對、編輯器讀寫，以及開始遊戲頁面的「劇本地圖」入口**。目標是讓編輯器既能編輯沙盒型地圖，也能編輯劇本地圖，並以「官方 JSON 為種子、localStorage 為工作區」的方式隔離官方內容與玩家自訂內容。

---

## 一、設計目標與架構定位

### 1.1 設計目標

1. **單一資料源（Single Source of Truth）**：所有關卡統一使用 `ScenarioDefinition`（編輯器核心資料結構），沙盒與劇本共用同一格式。
2. **官方內容保護（Official Content Immutability）**：官方關卡以靜態 JSON 隨遊戲打包，永不被運行時修改；玩家的任何編輯都只發生在 localStorage 副本上。
3. **副本機制（Copy-on-First-Use）**：啟動遊戲時，若 localStorage 無官方關卡副本，則從 JSON 建立副本；此後一律以副本為主。
4. **版本感知（Version-Aware）**：官方 JSON 更新時，偵測版本差異並提示玩家選擇（保留修改 / 重置為新版 / 另存為自訂）。
5. **沙盒 / 劇本統一入口（Unified Entry）**：開始遊戲頁以 Tab 區分「沙盒地圖」（現有隨機生成）與「劇本地圖」（編輯器產出關卡），劇本地圖即為戰役模式入口。

### 1.2 架構原則

- **資料驅動（Data-Driven）**：關卡完全以 `ScenarioDefinition` 描述，透過 `buildGameStateFromScenario` 編譯為 `GameState`，不新增分支代碼路徑。
- **編輯器僅面對 localStorage**：編輯器讀寫的都是 localStorage 副本，永遠不碰官方 JSON。
- **儲存層抽離（Storage Layer Isolation）**：官方 JSON 讀取、副本建立、版本比對集中於單一儲存模組（`scenarioStorage.ts`），UI 與遊戲邏輯不直接操作 localStorage。
- **與現有 `campaignScenarioCatalog` 的關係**：官方關卡 JSON 取代 `campaignScenarioCatalog` 作為官方關卡來源；過渡期可保留 catalog 作為 seed 導出工具，最終移除。

---

## 二、核心概念：官方 JSON 與 localStorage 副本

### 2.1 資料流總覽

```text
官方關卡（靜態 JSON，隨遊戲打包，唯讀）
  public/data/scenarios/
  ├─ index.json                 ← 官方關卡清單（id、檔名、版本）
  ├─ prologue-village.json      ← 每個關卡一個 JSON
  └─ ...（未來更多關卡）

localStorage（玩家工作區，可讀寫）
  mygame2.scenario-copies
  ├─ { id: 'prologue-village', source: 'official', ... }   ← 官方副本
  └─ { id: 'custom-xxx', source: 'custom', ... }           ← 玩家自訂

編輯器（EditorApp）
  ├─ 讀取 localStorage 副本
  ├─ 編輯 ScenarioDefinition
  ├─ 儲存回 localStorage（副本 modified = true）
  └─ 從零新建關卡（source = 'custom'）

開始遊戲頁面（GameStartScreen）
  ├─ Tab「沙盒地圖」：現有隨機生成，原封不動
  └─ Tab「劇本地圖」：列出官方副本 + 自訂關卡 → 選擇 → 開始（完整劇本）
```

### 2.2 啟動初始化流程

```text
啟動遊戲
  └─ 讀取 public/data/scenarios/index.json
       └─ 對每個官方關卡：
            ├─ localStorage 無副本
            │     └─ 建立副本（sourceVersion = 關卡 JSON 內 version）
            │
            └─ localStorage 有副本
                  ├─ sourceVersion === 關卡 JSON version
                  │     └─ 直接使用副本
                  │
                  └─ sourceVersion !== 關卡 JSON version
                        └─ 標記「官方已更新」，提示玩家選擇
```

---

## 三、資料模型

### 3.1 官方關卡清單（`index.json`）

```jsonc
{
  "version": "1.0.0",             // index 檔自身版本（保留欄位）
  "scenarios": [
    {
      "id": "prologue-village",
      "file": "prologue-village.json",
      "version": "1.0.0"          // 僅供快速掃描；實際比對以關卡 JSON 內 version 為準
    }
  ]
}
```

### 3.2 官方關卡 JSON

即一份完整的 `ScenarioDefinition`，`version` 欄位作為版本比對的唯一依據。

```jsonc
{
  "version": "1.0.0",
  "id": "prologue-village",
  "title": "序章：青石遺恨",
  "description": "青石村妖氣頻生，村長委託主角討伐盤踞村外的妖物。",
  "chapterIndex": 0,
  "mapSize": { "rows": 10, "columns": 10 },
  "cells": [ /* ... */ ],
  "entities": [ /* ... */ ],
  "quests": { /* victoryObjectives + failConditions */ },
  "dialogues": [ /* ... */ ]
}
```

> 版本以**關卡 JSON 內的 `version` 欄位**為準，`index.json` 中的 `version` 僅作清單顯示用途，不參與比對，避免兩者不同步。

### 3.3 localStorage 副本結構（新增 `src/game/scenarioStorage.ts`）

```ts
import type { ScenarioDefinition } from '../editor/editorTypes'

export type ScenarioSource = 'official' | 'custom'

export type StoredScenario = {
  id: string
  source: ScenarioSource
  /** 官方關卡的來源版本；custom 關卡為 undefined。 */
  sourceVersion?: string
  /** 玩家是否修改過此副本（自訂關卡恆為 true）。 */
  modified: boolean
  scenario: ScenarioDefinition
}

/** localStorage 存一個 map：{ [id]: StoredScenario }。 */
export type StoredScenarioMap = Record<string, StoredScenario>
```

### 3.4 官方更新提示的三種選擇

偵測到 `sourceVersion !== 官方 JSON version` 時，提供玩家選擇：

| 選項 | 行為 | 結果 |
| :--- | :--- | :--- |
| **保留我的修改** | 繼續使用舊副本，不更新 | 副本 `sourceVersion` 保持舊值（下次仍提示） |
| **重置為官方新版** | 以新 JSON 覆蓋副本 | 副本 `sourceVersion` 更新、`modified` 重設為 false |
| **另存為自訂關卡** | 舊副本另存為 `custom-` 關卡，再以新 JSON 建立官方副本 | 保留玩家修改 + 取得官方新版 |

---

## 四、儲存層 API 設計（`src/game/scenarioStorage.ts`）

```ts
export const SCENARIO_COPIES_STORAGE_KEY = 'mygame2.scenario-copies'

/** 讀取官方關卡清單（fetch index.json）。 */
export async function fetchOfficialScenarioIndex(): Promise<OfficialScenarioIndex>

/** 讀取單一官方關卡 JSON。 */
export async function fetchOfficialScenario(file: string): Promise<ScenarioDefinition>

/** 讀取 localStorage 所有副本（含型別校驗，失敗回 {}）。 */
export function getStoredScenarios(): StoredScenarioMap

/** 儲存 / 更新一個副本。 */
export function saveStoredScenario(entry: StoredScenario): void

/** 刪除一個副本。 */
export function deleteStoredScenario(id: string): void

/**
 * 啟動時同步官方關卡：
 * 對每個官方關卡，若無副本則建立；若有副本則回傳版本差異供 UI 提示。
 */
export async function syncOfficialScenarios(): Promise<{
  scenarios: StoredScenarioMap
  outdated: Array<{ official: ScenarioDefinition; stored: StoredScenario }>
}>

/** 產生一個不與既有 id 衝突的自訂關卡 id（`custom-` 前綴 + 時間戳）。 */
export function generateCustomScenarioId(): string
```

---

## 五、編輯器改動

### 5.1 載入來源切換

編輯器不再以 `useState` 直接持有初始 scenario，而是：

1. 從 localStorage 讀取副本（官方副本或自訂關卡）。
2. 支援「從零新建」：產生空白 `ScenarioDefinition`（含 `custom-` id、空白地圖、空實體、空任務）。

### 5.2 儲存行為

- **官方副本**：編輯後儲存 → `modified = true`，`source` 保持 `official`，`sourceVersion` 不變。
- **自訂關卡**：儲存 → `source = 'custom'`。
- **儲存時驗證**：`quests.victoryObjectives.length >= 1`，不足則拒絕儲存並提示。

### 5.3 從零新建關卡

- 新建時需設定基本欄位（標題、地圖尺寸），產生空白地圖。
- 至少設定一個勝利條件後才允許儲存 / 開始。
- 儲存為 `source = 'custom'` 的副本。

### 5.4 匯出 JSON（供開發者）

- 提供「匯出 JSON」按鈕，將當前 `ScenarioDefinition` 序列化為 JSON（下載或複製到剪貼簿）。
- 開發者將匯出的 JSON 放入 `public/data/scenarios/` 並更新 `index.json`，即可成為新官方關卡。

---

## 六、開始遊戲頁面改動（`GameStartScreen.tsx`）

### 6.1 Tab 結構

```text
GameStartScreen
├─ Tab「沙盒地圖」（現有功能原封不動）
│    ├─ 開局模板下拉（隨機參數模板）
│    ├─ 地圖設定（行數/列數/種子）
│    └─ 地形權重
│
└─ Tab「劇本地圖」（新增，= 戰役模式入口）
     ├─ 關卡清單（官方副本 + 自訂關卡）
     │    ├─ 官方關卡（含「官方已更新」標記）
     │    └─ 玩家自訂關卡
     ├─ 選中關卡 → 顯示名稱、描述、版本、是否修改過
     └─ 開始 → loadScenario → 完整劇本（任務 + 對話）
```

### 6.2 關卡清單呈現

- 以 `OptGroup` 分組「官方關卡」與「我的關卡」。
- 官方關卡若標記「已更新」，顯示提示圖示，點擊後彈出三選項（保留/重置/另存）。
- 自訂關卡支援刪除。

### 6.3 開始流程

- 選中關卡 → 開始 → 呼叫既有 `loadScenario(scenario)` 流程（任務/對話全數生效）。
- 劇本地圖的「開始」與沙盒的「開始」是兩個獨立按鈕，各自對應 `onStartCampaign` 與 `onStart`。

---

## 七、互動流程

```text
【啟動初始化】
遊戲啟動
  └─ syncOfficialScenarios()
       ├─ 無副本 → 建立副本
       └─ 版本不同 → 標記 outdated，UI 提示玩家三選一

【編輯器流程】
進入編輯器
  ├─ 選擇載入：官方副本 / 自訂關卡 / 從零新建
  ├─ 編輯 ScenarioDefinition
  └─ 儲存
       ├─ 驗證勝利條件 >= 1
       ├─ 寫回 localStorage（modified = true / source = custom）
       └─ 可選「匯出 JSON」

【開始遊戲流程】
開始遊戲頁
  ├─ Tab 沙盒地圖 → 現有流程
  └─ Tab 劇本地圖
       ├─ 選擇關卡
       │    ├─ 官方「已更新」→ 三選一提示
       │    └─ 正常 → 顯示關卡資訊
       └─ 開始 → loadScenario → 完整劇本
```

---

## 八、驗收標準 / 拆分任務

- [ ] `public/data/scenarios/index.json`：建立官方關卡清單。
- [ ] `public/data/scenarios/prologue-village.json`：將現有 `campaignScenarioCatalog['prologue-village']` 導出為 JSON。
- [ ] `src/game/scenarioStorage.ts`：實作 `StoredScenario` / `StoredScenarioMap` 型別與 `fetchOfficialScenarioIndex` / `fetchOfficialScenario` / `getStoredScenarios` / `saveStoredScenario` / `deleteStoredScenario` / `syncOfficialScenarios` / `generateCustomScenarioId`。
- [ ] `src/game/scenarioStorage.ts`：實作版本比對與「官方已更新」偵測。
- [ ] `EditorApp.tsx`：載入來源改為 localStorage 副本，支援從零新建。
- [ ] `EditorApp.tsx`：儲存時驗證勝利條件 >= 1，寫回 localStorage。
- [ ] `EditorApp.tsx`：新增「匯出 JSON」按鈕。
- [ ] `GameStartScreen.tsx`：新增 Tab 結構，區分沙盒 / 劇本地圖。
- [ ] `GameStartScreen.tsx`：劇本 Tab 列出關卡（官方 + 自訂），處理「已更新」三選一提示。
- [ ] 單元測試：副本建立/讀取/刪除、版本比對、勝利條件驗證、自訂 id 唯一性。
- [ ] 手動驗收：首次啟動建立副本、刪除副本後重建、編輯器編輯並回存、劇本 Tab 選關開始完整劇本。

---

## 九、風險與備註

- **舊 catalog 相容**：過渡期保留 `campaignScenarioCatalog`，待 JSON 機制穩定後移除，避免既有測試斷裂。
- **官方更新版本號規範**：官方關卡更新內容時必須遞增 `version`，否則不會觸發「已更新」提示。
- **localStorage 容量**：關卡含完整 `cells`，大型地圖（如 40×40）序列化後體積可觀；未來可考慮 IndexedDB。
- **fetch 路徑**：`public/data/scenarios/*.json` 需確保部署後可被正確 fetch；開發時注意 base path。
- **種子與隨機**：本版劇本地圖為確定性（cells 固定），不引入隨機地形；隨機性由沙盒 Tab 維持。
