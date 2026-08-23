# 地圖網格渲染效能優化設計文件

## 1. 文件目的

- 解決地圖尺寸達 50×50 以上時 `MapGrid` 明顯卡頓的問題。
- 釐清瓶頸來源（非 React 框架本身，而是 DOM 數量與重複計算），並提出分階段優化方案。
- 建立可直接拆分成工程任務的資料模型、優化策略、驗收標準。
- 與現有 `MapGrid.tsx` / `visibilityRules` / `movementRules` 保持一致。

## 1.1 目前開發狀態

- **狀態：設計規劃中，尚未實作。**
- 已完成：
  - 無（本文件為效能問題的診斷與方案設計）。
- 尚未完成：
  - 實體位置索引（優化 B）。
  - `getCellVisibility` 參數快取（優化 C）。
  - `map` 引用穩定化（優化 D）。
  - cell 元件 `React.memo` 化（優化 E）。
  - 視窗化 / Canvas 渲染（優化 A，高成本，最後考慮）。

## 2. 問題診斷

### 2.1 誤區澄清

- React 是**單向資料流**（state → UI），不是雙向綁定框架。
- 卡頓**不是**因為「雙向同步」框架特性，而是 `MapGrid` 的渲染實作方式。

### 2.2 瓶頸定位（基於 `src/components/MapGrid.tsx`）

#### 瓶頸 1：DOM 節點數 = O(格子數)，且每格含多個子節點

```tsx
{cells.map((cell) => (
  <div className="map-grid__cell" ...>
    <span className="map-grid__overlay-layer">...</span>
    {defenseStructuresHere.map(...)}
    {explorationEventsHere.map(...)}
    ...
  </div>
))}
```

- 50×50 = **2500** 個 `.map-grid__cell` div；80×80 = **6400** 個。
- 每格還有 overlay + 多個 marker 子節點，實際 DOM 數更高。
- 這是純 DOM 成本，與框架無關。

#### 瓶頸 2：每格渲染做 11 次 O(實體數) 過濾

每個 cell 對 11 類實體各做一次 `.filter()`：

```tsx
const playersHere = players.filter(p => p.position.row === cell.row && ...)
const creaturesHere = creatures.filter(...)
const basesHere = bases.filter(...)
// ... 共 11 次 filter
```

- 總計算量 ≈ **格子數 × 實體數**。
- 50×50 且有 ~50 個實體時 ≈ 2500 × 50 ≈ **12.5 萬次比較**，且每次 `MapGrid` re-render 都重跑。

#### 瓶頸 3：`getCellVisibility` 被呼叫 2500 次，每次重建大物件

```tsx
const cellVisibility = getCellVisibility(
  { map, visibility, bases, defenseStructures, players, creatures, ... round: 0, operation: { type: 'idle' }, ... },
  visibilityPlayerId, cell)
```

- 那個包含整個 `map` + 所有實體陣列的大物件，在**每個 cell 迭代都重新建立**（2500 次記憶體分配）。
- 對所有 cell 來說該物件內容相同，應只建立一次。

#### 瓶頸 4：`useMemo` 可能因 `map` 引用變動而失效

```tsx
const reachableCellIds = useMemo(() => ..., [activePlayer, movementEnabled, map, blockedPositions])
```

- 若父層每次 render 傳入**新引用**的 `map` 物件（內容未變），`useMemo` 會頻繁重算，失去快取意義。

## 3. 優化策略（分階段）

### 3.1 優化 B：實體位置索引（高收益、低成本）

- 在 `MapGrid` 內用 `useMemo` 將 11 類實體按 `cell.id` 建立 `Map<string, Entity[]>` 索引。
- 每格改為 `index.get(cell.id) ?? []`，取 O(1)。
- 計算量從 O(格子數 × 實體數) 降為 O(實體數) 一次建索引 + O(格子數) 查詢。

```ts
const entityIndex = useMemo(() => {
  const index = new Map<string, { players: PlayerState[]; creatures: CreatureState[]; ... }>()
  // 每類實體遍歷一次，按 cell.id 分組
  return index
}, [players, creatures, bases, creatureNests, resourcePoints, defenseStructures, itemPoints, explorationEvents, ruins, traps, sectGates])
```

### 3.2 優化 C：`getCellVisibility` 參數快取（高收益、低成本）

- 那個大參數物件對所有 cell 相同，應在 `cells.map` 外建立一次（或 `useMemo`）。
- 避免 2500 次重複物件分配。

```ts
const visibilityContext = useMemo(() => ({
  map, visibility, bases, defenseStructures, players, creatures,
  creatureNests, resourcePoints, itemPoints, explorationEvents,
  revealedCreatureCellIds, revealedCreatureUntilRound,
  activePlayerId: activePlayerId ?? '', round: 0,
  creatureActionLogs: [], attackPreview: null, externalSkillPreview: null,
  creatureTurnInProgress: false, activeCreatureId: null,
  operation: { type: 'idle' as const }, blockingModal: null,
}), [map, visibility, bases, defenseStructures, players, creatures, creatureNests, resourcePoints, itemPoints, explorationEvents, revealedCreatureCellIds, revealedCreatureUntilRound, activePlayerId])

// 在 cells.map 內：
const cellVisibility = visibility && visibilityPlayerId
  ? getCellVisibility(visibilityContext, visibilityPlayerId, cell)
  : 'visible'
```

### 3.3 優化 D：`map` 引用穩定化（中收益、需父層配合）

- 確保 `map` 內容不變時父層保持同引用（避免每次 render 新建 `map` 物件）。
- 可配合 `React.memo` 包裝 `MapGrid`，或在狀態管理層用結構共享（如 immer 的 produce）維持引用。
- 讓 `useMemo` 依賴 `[..., map, ...]` 真正生效。

### 3.4 優化 E：cell 元件 `React.memo` 化（中收益、中成本）

- 將每格抽成 `React.memo(MapCell)` 子元件，只有相關 props 變動才重渲染。
- 配合穩定的 `map` 引用與索引，可避免無關 cell 的重算。
- 注意：props 需為基本型別或穩定引用，否則 memo 失效。

### 3.5 優化 A：視窗化 / Canvas 渲染（高收益、高成本，最後考慮）

- **視窗化（virtualization）**：只渲染可視區域的格子，DOM 數從 2500 降到 ~幾百。
- **Canvas 渲染底層**：地形與 marker 改用 Canvas 繪製，徹底擺脫 DOM 數量限制。
- 適用於 80×80 以上或上述 B/C/D/E 仍不足時。

## 4. 優化優先級建議

| 優先級 | 優化 | 改動成本 | 預期收益 | 風險 |
|--------|------|---------|---------|------|
| 1 | B 實體索引 | 低 | 高 | 低 |
| 2 | C 參數快取 | 低 | 高 | 低 |
| 3 | D 引用穩定 | 中 | 中 | 中（需父層配合） |
| 4 | E cell memo | 中 | 中 | 中（props 設計） |
| 5 | A 視窗化/Canvas | 高 | 最高 | 高（互動邏輯需重寫） |

> 建議先實作 **B + C**（改動小、收益大），再視情況做 D/E，最後才考慮 A。

## 5. 驗收標準 / 拆分任務

- [ ] **優化 B**：`MapGrid` 內建立實體位置索引，11 類實體改為 `index.get(cell.id)` 查詢；單元測試驗證索引正確性。
- [ ] **優化 C**：`getCellVisibility` 參數物件在 `cells.map` 外以 `useMemo` 建立一次；確認每格不再重複分配。
- [ ] **優化 D**：確認父層 `map` 引用在內容不變時保持穩定；必要時 `React.memo` 包裝 `MapGrid`。
- [ ] **優化 E**：抽取 `MapCell` 子元件並 `React.memo`，驗證無關 cell 不重渲染。
- [ ] **效能基準**：建立 50×50、80×80 的渲染時間基準（可用 `performance.now()` 或 React Profiler），優化前後對比。
- [ ] **手動驗收**：50×50 / 80×80 地圖下拖動、移動、攻擊互動流暢無明顯卡頓。

## 6. 風險與備註

- **非框架問題**：卡頓源於 DOM 數量與重複計算，非 React 雙向同步（React 本為單向資料流）。
- **引用穩定是前提**：B/C 優化若搭配每次 render 都新建的 `map` 引用，收益會被 `useMemo` 失效抵消，需 D 配合。
- **視窗化互動成本**：A 方案需重寫點擊命中測試（目前依賴 DOM 事件），建議最後階段才做。
- **基準先行**：建議先量測再優化，避免過早優化或誤判瓶頸。
