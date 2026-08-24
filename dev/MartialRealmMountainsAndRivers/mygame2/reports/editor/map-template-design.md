# 地圖設定模板（Map Template）開發設計文件

## 1. 文件目的

- 在「地圖設定」頁（`GameStartScreen`）提供一個**下拉選單**，讓玩家一鍵套用整組地圖參數。
- 內建多種預設模板（標準均衡 / 小型快局 / 大型史詩 / 和平探索 / 戰爭競技），並支援玩家**儲存自訂模板**。
- 建立可直接拆分成工程任務的資料模型、UI 規範、互動流程與驗收標準。
- 與現有 `GameSettings` / `gameSettings.ts` 的儲存機制保持一致。

## 1.1 目前開發狀態

- **狀態：設計規劃中，尚未實作。**
- 已完成：
  - 無（本功能為全新設計）。
- 尚未完成：
  - 模板資料結構與內建模板定義。
  - 下拉選單 UI 與套用邏輯。
  - 自訂模板的儲存 / 讀取 / 刪除。
  - 套用時的隨機種子處理。

## 2. 設計概念

### 2.1 核心幻想

- 玩家不必逐一調整 15 個 `InputNumber`，而是從下拉選單挑選一種「開局風格」，
  立即得到一張符合該風格的地圖設定。
- 進階玩家可微調後「儲存為我的模板」，下次直接復用。

### 2.2 設計支柱

- **一鍵套用**：選完模板即寫入設定，下方 `InputNumber` 同步更新。
- **種子隨機**：套用模板時 `seed` 改為新的隨機值，確保每次地圖不同（玩家仍可手動改回固定種子）。
- **內建 + 自訂**：5 組內建模板覆蓋常見玩法，自訂模板滿足個人偏好。
- **與現制相容**：模板本質是 `GameSettings` 的子集，套用後仍走既有 `saveGameSettings` 流程。

## 3. 系統邊界

- 模板**不含 `seed`**；套用時另行產生隨機種子（上限沿用 `999999999`）。
- 內建模板的每個欄位都給出**明確數值**（不保留 `undefined`），避免套用後行為不一致。
- 自訂模板儲存於 `localStorage`，與 `GameSettings` 主鍵分開，不污染現有讀取邏輯。
- 自訂模板命名禁止與內建模板同名（或自動加後綴），避免歧義。
- 下拉選單以 `OptGroup` 分組顯示「內建模板」與「我的模板」。

## 4. 資料模型

### 4.1 模板型別（新增 `src/game/mapTemplates.ts`）

```ts
import type { GameSettings } from './types'

/** 模板不含 seed，套用時另行隨機產生。 */
export type MapTemplateSettings = Omit<GameSettings, 'seed'>

export type MapTemplate = {
  id: string
  name: string
  builtin: boolean
  settings: MapTemplateSettings
}
```

### 4.2 內建模板數值

| 欄位 | 標準均衡 | 小型快局 | 大型史詩 | 和平探索 | 戰爭競技 |
|------|---------|---------|---------|---------|---------|
| rows | 40 | 20 | 70 | 45 | 50 |
| columns | 40 | 20 | 70 | 45 | 50 |
| baseCount | 5 | 2 | 10 | 4 | 6 |
| nestCount | 2 | 1 | 6 | 1 | 12 |
| nestSpawnInterval | 10 | 15 | 8 | 20 | 5 |
| resourcePointCount | 10 | 4 | 30 | 20 | 12 |
| itemPointCount | 8 | 3 | 25 | 15 | 10 |
| playerCount | 1 | 1 | 1 | 1 | 2 |
| aiPlayerCount | 0 | 1 | 4 | 1 | 6 |
| explorationEventCount | 5 | 2 | 20 | 30 | 6 |
| creatureCount | 2 | 1 | 10 | 3 | 15 |
| ruinCount | 10 | 3 | 30 | 15 | 12 |
| sectGateCount | 3 | 1 | 6 | 4 | 5 |

> 數值為初版建議，開發前可再依平衡報告微調。所有值均落在 `GameStartScreen` 各 `InputNumber` 的 min/max 範圍內。

### 4.3 自訂模板持久化

```ts
export const CUSTOM_TEMPLATES_STORAGE_KEY = 'mygame2.custom-map-templates'

export function getCustomTemplates(): MapTemplate[] {
  // 從 localStorage 讀取並做基本型別校驗，失敗回傳 []。
}

export function saveCustomTemplate(template: MapTemplate): void {
  // 讀取現有清單 → 檢查同名（含內建 id/name）→ 追加 → 寫回。
}

export function deleteCustomTemplate(id: string): void {
  // 過濾掉指定 id 後寫回；內建模板不可刪除。
}
```

## 5. UI 規範

### 5.1 下拉選單位置

- 在「地圖設定」`Divider` **上方**新增一個 `Select`（antd），佔滿整行寬度。
- 標籤文字：「開局模板」。
- 預設值：顯示「標準均衡」（對應 `DEFAULT_GAME_SETTINGS` 的語意）。

### 5.2 選項分組

```
Select
├─ OptGroup: 內建模板
│   ├─ 標準均衡
│   ├─ 小型快局
│   ├─ 大型史詩
│   ├─ 和平探索
│   └─ 戰爭競技
└─ OptGroup: 我的模板
    ├─ （自訂模板 A）
    └─ （自訂模板 B）
```

### 5.3 自訂模板操作區

- 「💾 儲存目前設定為模板」按鈕：點擊後彈出命名 `Input`（或 `Modal` + `Input`）。
- 命名確認後呼叫 `saveCustomTemplate`，並把新模板加入下拉選單、自動選中。
- 自訂模板被選中時，額外顯示「🗑 刪除此模板」按鈕（內建模板不顯示）。

### 5.4 套用行為

- `onChange(templateId)`：
  1. 從內建或自訂清單找到對應 `MapTemplate`。
  2. `setSettings(prev => ({ ...prev, ...template.settings, seed: randomSeed() }))`。
  3. 呼叫 `saveGameSettings(settings)` 寫入。
  4. 下方所有 `InputNumber` 因 `value={settings.xxx}` 自動同步。
- `randomSeed()` 產生 `0`–`999999999` 的整數（沿用 `seed` 上限）。

## 6. 互動流程

```
玩家開啟地圖設定頁
  │
  ├─ 選擇下拉模板
  │     ├─ 內建 → 套用 settings + 隨機 seed → 儲存 → InputNumber 同步
  │     └─ 自訂 → 同上
  │
  ├─ 點「儲存為模板」
  │     ├─ 輸入名稱（檢查與內建/現有同名）
  │     └─ 寫入 localStorage → 下拉選單新增 → 自動選中
  │
  └─ 選中自訂模板時可「刪除」
        └─ 從 localStorage 移除 → 下拉選單更新
```

## 7. 驗收標準 / 拆分任務

- [ ] `src/game/mapTemplates.ts`：定義 `MapTemplate` / `MapTemplateSettings` 型別與 `BUILTIN_TEMPLATES`（5 組，數值如上表）。
- [ ] `src/game/mapTemplates.ts`：實作 `getCustomTemplates` / `saveCustomTemplate` / `deleteCustomTemplate` 與 `CUSTOM_TEMPLATES_STORAGE_KEY`。
- [ ] `GameStartScreen.tsx`：在「地圖設定」`Divider` 上方新增 `Select`（含 `OptGroup` 分組）。
- [ ] `GameStartScreen.tsx`：實作 `onChange` 套用邏輯（含 `randomSeed()`，上限 `999999999`）。
- [ ] `GameStartScreen.tsx`：新增「儲存為模板」按鈕 + 命名輸入，並處理同名檢查。
- [ ] `GameStartScreen.tsx`：自訂模板選中時顯示「刪除」按鈕，內建模板隱藏。
- [ ] 單元測試：內建模板數值皆落在 `InputNumber` min/max 範圍；自訂模板同名拒絕；套用後 `seed` 為新隨機值且 `settings` 其餘欄位正確。
- [ ] 手動驗收：選每個模板後 `InputNumber` 同步、開始遊戲地圖符合預期；自訂模板重新整理後仍存在。

## 8. 風險與備註

- **舊存檔相容**：自訂模板是獨立 key，不影響現有 `mygame2.game-settings` 讀取邏輯。
- **數值平衡**：內建模板數值為初版，建議結合 `combat-balance-report.md` 與 `player-feedback-analysis.md` 再校準。
- **種子隨機**：若玩家希望「同一模板產出完全一致的地图」，未來可改為模板內含固定 seed；本版依確認採「套用即隨機」。
