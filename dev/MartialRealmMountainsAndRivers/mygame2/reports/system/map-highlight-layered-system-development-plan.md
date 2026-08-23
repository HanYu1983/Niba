# 地圖高亮分層系統開發文件

## 1. 文件目的

- 解決據點範圍、移動、攻擊、技能與防禦建造高亮互相覆蓋的問題。
- 建立可擴充、可測試、可維護的簡化版地圖狀態與渲染架構。
- 確保新增地圖提示時，不會破壞既有視覺效果或點擊行為。

## 2. 問題現況

### 2.1 已知問題

- 多種高亮直接套用在同一個地圖格子的 CSS class。
- 不同高亮共同修改 `filter`、`box-shadow`、`background` 或 `transform`，可能互相覆蓋。
- 視覺高亮與點擊互動判定混在 `MapGrid.tsx` 的 JSX 流程中。
- 目前缺少狀態組合測試，難以及早發現回歸問題。

### 2.2 目前已存在的高亮

- 據點影響範圍：有效據點選取後，曼哈頓距離 6 格內高亮。
- 玩家可移動範圍：`reachable`。
- 普通攻擊目標：`attackTarget`。
- 外功目標：`skillTarget`。
- 防禦建造範圍：`defenseBuildRange`。
- 防禦可建造格：`defenseBuildable`。
- 迷霧與已探索狀態：`unexplored`、`explored`。

## 3. 目標架構

### 3.1 分離三種責任

| 責任 | 內容 | 主要位置 |
|---|---|---|
| 狀態計算 | 判斷格子是否可見、可移動、可攻擊、是否在據點範圍 | `src/game/rules/mapCellStateRules.ts` |
| 互動解析 | 根據目前遊戲模式決定點擊格子的唯一行為 | `src/game/rules/mapCellInteractionRules.ts` |
| 視覺渲染 | 將各個 overlay 獨立繪製，避免 CSS 互相覆蓋 | `src/components/MapGrid.tsx`、`src/App.css` |

### 3.2 重要設計原則

- 一個格子可以同時擁有多個視覺狀態。
- 視覺狀態不可使用單一欄位互相覆蓋。
- 互動模式與視覺 overlay 分開管理。
- 每個 overlay 只管理自己的 DOM 與樣式，不覆蓋其他 overlay。
- 迷霧規則優先於所有非必要資訊；未探索格不顯示據點影響範圍。
- 非啟用據點不產生有效影響範圍。

## 4. 分階段開發計畫

## Phase 0：基線盤點與行為保護

### 目標

在重構前固定現有行為，避免後續改造時誤改遊戲規則。

### 工作項目

- 盤點 `MapGrid.tsx` 目前所有 cell 狀態判定。
- 盤點所有地圖點擊與鍵盤互動入口。
- 確認目前移動、攻擊、外功與防禦建造的互動優先級。
- 建立或補充現有行為測試，不改變 UI 外觀。

### 驗收條件

- 既有測試全部通過。
- 可列出每一種高亮的計算來源與點擊行為。
- 未探索格、非啟用據點與遊戲結束狀態的規則已明確記錄。

## Phase 1：集中化格子狀態計算

### 目標

將 `MapGrid.tsx` 中與遊戲規則相關的判斷抽離，建立單一狀態來源。

### 建議新增

- `src/game/rules/mapCellStateRules.ts`
- `MapCellState` 型別

### 建議狀態

```ts
export type MapCellState = {
  isUnexplored: boolean
  isExplored: boolean
  isKnownLocation: boolean
  isReachable: boolean
  isBaseInfluence: boolean
  isAttackTarget: boolean
  isSkillTarget: boolean
  isDefenseBuildRange: boolean
  isDefenseBuildable: boolean
}
```

### 重要規則

- `isBaseInfluence` 只對有效據點計算。
- 據點範圍使用曼哈頓距離 `<= 6`。
- `isUnexplored` 時不顯示據點範圍與其他非必要地點資訊。
- 各狀態彼此獨立，不使用互斥的 `highlightType`。

### 驗收條件

- `MapGrid.tsx` 不再自行重複計算相同規則。
- 可同時得到 `isBaseInfluence: true` 與 `isReachable: true`。
- 單元測試覆蓋單一狀態與至少兩種狀態組合。

## Phase 2：建立獨立 Overlay 渲染層

### 目標

讓不同高亮擁有獨立 DOM 與 CSS，避免共用 `filter`、`box-shadow` 而互相覆蓋。

### 建議結構

```tsx
<div className="map-grid__cell">
  <div className="map-grid__terrain" />
  <div className="map-grid__overlay map-grid__overlay--base-influence" />
  <div className="map-grid__overlay map-grid__overlay--movement" />
  <div className="map-grid__overlay map-grid__overlay--target" />
  <div className="map-grid__objects" />
</div>
```

### Overlay 規則

| Overlay | 顏色方向 | 互動用途 |
|---|---|---|
| 據點範圍 | 淡金色 | 僅提供資訊 |
| 移動範圍 | 藍色 | 顯示可移動位置 |
| 攻擊目標 | 紅色／橙色 | 顯示攻擊目標 |
| 外功目標 | 紫色／黃色 | 顯示技能目標 |
| 防禦建造範圍 | 黃色 | 顯示建造區域 |
| 防禦可建造格 | 明亮黃色 | 顯示可點擊格 |

### CSS 原則

- Overlay 使用 `position: absolute`，cell 使用 `position: relative`。
- Overlay 不修改 cell 本身的 `filter`、`transform`。
- Overlay 以固定 z-index 分層。
- 角色、物件與標記層位於 overlay 上方。
- 高亮樣式不可依賴 CSS 宣告順序來維持功能。

### 驗收條件

- 據點範圍與移動高亮可同時顯示。
- 據點範圍與攻擊／技能目標可同時顯示。
- 移動高亮不會因新增其他 overlay 而消失。
- 未探索格不會洩漏據點範圍資訊。

## Phase 3：集中化互動解析

### 目標

將 cell 點擊與鍵盤操作的優先級移出 JSX，避免視覺狀態與互動行為不一致。

### 建議新增

- `src/game/rules/mapCellInteractionRules.ts`
- `MapCellInteraction` 型別

### 建議互動優先級

1. 普通攻擊目標。
2. 外功目標。
3. 防禦建造位置。
4. 玩家移動。
5. 地圖物件互動。
6. 據點選取／查看。
7. 無可用操作。

### 規則

- 視覺上可以同時顯示多個 overlay。
- 每次點擊只能由互動解析器產生一個主要結果。
- 滑鼠點擊與鍵盤 Enter／Space 必須使用相同解析結果。
- 據點範圍本身不攔截移動、攻擊或建造點擊。

### 驗收條件

- 目前遊戲模式下，點擊行為符合上述優先級。
- 據點範圍高亮不會改變玩家移動結果。
- 攻擊模式不會誤觸發移動。
- 鍵盤操作與滑鼠操作結果一致。

## Phase 4：狀態組合測試與回歸保護

### 目標

建立組合測試，防止未來新增高亮功能時破壞既有行為。

### 必測組合

| 組合 | 預期 |
|---|---|
| 據點範圍 + 移動範圍 | 兩種 overlay 同時存在，移動仍可點擊 |
| 據點範圍 + 攻擊目標 | 兩種 overlay 同時存在，攻擊優先 |
| 據點範圍 + 外功目標 | 兩種 overlay 同時存在，外功優先 |
| 據點範圍 + 防禦建造 | 建造模式優先，不被範圍標記攔截 |
| 未探索格 + 據點範圍 | 不顯示據點範圍 |
| 非啟用據點 + 據點範圍 | 不產生有效範圍 |
| 多據點重疊 | 不互相覆蓋或破壞樣式 |
| 遊戲結束 + 地圖高亮 | 彈窗阻擋操作，地圖狀態不造成額外操作 |

### 驗收條件

- 規則測試通過。
- 相關元件無 TypeScript 錯誤。
- `npm run build` 成功。
- 既有地圖、戰鬥與建造測試全部通過。

## 5. 建議實作順序

1. 先完成 Phase 0，固定目前行為。
2. 再完成 Phase 1，抽離狀態計算。
3. 接著完成 Phase 2，拆分視覺 overlay。
4. 再完成 Phase 3，集中互動優先級。
5. 最後完成 Phase 4，補齊組合測試與回歸驗證。

不建議直接一次修改所有內容，因為這會同時改動規則、React 結構與 CSS，遇到問題時難以定位來源。

## 6. 風險與例外處理

- 若某格同時屬於多個 overlay，必須保留所有狀態，不以最後寫入者覆蓋。
- 若據點被摧毀或 `active === false`，立即停止產生有效影響範圍。
- 若玩家進入攻擊、外功或建造模式，據點範圍仍可保留為資訊層，但不可改變模式互動。
- 若地圖進入迷霧狀態，未探索格優先隱藏非必要資訊。
- 若新增 overlay，必須先定義其 z-index、可見性規則與互動責任，再修改 `MapGrid.tsx`。

## 7. 專案追蹤清單

| Task Item | Owner | Status | Priority | Deadline |
|---|---|---|---|---|
| Phase 0：盤點並固定現有行為 | 前端／遊戲規則工程 | Planned | P0 | TBD |
| Phase 1：集中化格子狀態計算 | 遊戲規則工程 | Planned | P0 | TBD |
| Phase 2：建立獨立 Overlay 渲染層 | 前端工程 | Planned | P0 | TBD |
| Phase 3：集中化互動解析 | 前端／遊戲規則工程 | Planned | P1 | TBD |
| Phase 4：狀態組合測試與回歸保護 | QA／前端工程 | Planned | P0 | TBD |

## 8. 最終驗收標準

- 任何單一高亮新增或修改，不會使其他高亮消失。
- 視覺狀態與互動模式不互相污染。
- 所有互動入口使用同一套優先級規則。
- 地圖規則可透過單元測試獨立驗證。
- 新增範圍型功能時，只需增加狀態欄位、overlay 定義與測試，不需重寫既有高亮流程。
