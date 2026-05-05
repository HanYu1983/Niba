# View 框架指引（HTML 元件化）

本文件定義 `view` 層（HTML 實作）的資料流、元件化邊界、以及事件通道約定。

## 目標

- View 採 **元件化**：每個 UI 組件獨立、可重用、可測試。
- UI 組件建構子參數維持 **最精簡**（只收「識別用 id / key」）。
- UI 的 **資料查詢、狀態更新、事件訂閱/發送** 都透過 `EventCenter` 的事件流處理。

## 資料夾結構

- `src/view/`
  - View 層通用介面與事件中樞（例如 `IViewModel`、`EventCenter`）。
- `src/view/html/`
  - HTML 的具體實作（DOM 元件）。
  - 每個 UI 組件一個檔案（或一個資料夾），彼此獨立。

## 核心概念

### 1) UI 組件（ViewComponent）

- **單一職責**：只負責 DOM 生成、更新、與把互動事件送出。
- **建構子最小參數**：只傳入組件需要的識別資訊。
  - 例：Player 組件只需要 `playerId`（或 `monarchId`）。
- **不直接持有/修改賽局狀態**：
  - 需要資料時，從 `EventCenter` 取得 `IViewModel` 再呼叫 query 方法。
  - 需要跟狀態同步時，訂閱 `EventCenter` 的事件流（狀態流 / UI 事件流）。

### 2) ViewModel（`IViewModel`）

- ViewModel 是 UI 的查詢入口，提供「UI 需要的唯讀方法」。
- `IViewModel` 會繼承 `game.IGameMatchGetter`，使 UI 可透過 getter 介面查詢：
  - 玩家/君主資訊（例如 `monarchById`）
  - 玩家位置（例如 `pawnIndexOfMonarch`）
  - 地圖格資訊（例如 `tileAt`）

### 3) EventCenter（事件中樞）

`EventCenter` 是 view 層唯一的全域事件匯流點：

- **ViewModel 注入/切換**
  - UI 組件以訂閱方式取得當前可用的 `IViewModel`（例如切場景/切局時替換）。
- **UI → 系統事件**
  - UI 產生的任何互動事件都不直接呼叫 game core，而是透過 `EventCenter` 發送事件資料。
- **系統 → UI 事件**
  - 需要 UI 更新、重繪、或狀態刷新時，也可由 ViewModel 或外層流程透過事件流通知。

## 元件建構與資料取得規範

### 最小建構子參數

以 Player 組件為例：

- **允許**：`new PlayerComponent(playerId)`
- **不允許**：`new PlayerComponent(match, monarch, board, ... )`

原因：依賴越少越能重用；資料來源統一由事件流提供，避免「參數爆炸」。

### 組件內取得資料（query）

- 組件透過 `EventCenter` 訂閱 ViewModel 的流（例如 `viewModelSubject`）
- 每次取得 ViewModel 時，使用 `IGameMatchGetter` 方法查詢所需資料並更新 DOM

## 事件規範（UI 事件一律透過 EventCenter）

### 事件命名與載荷（payload）

UI 產生的事件統一使用下列兩種型別送出：

- **OnClick**：`{ id }`
- **OnSlider**：`{ id, value }`

其中：

- `id`：UI 元件/控制項的穩定識別（可用字串或結構化 id，但需可序列化、可比對）
- `value`：Slider 的值（整數或浮點數依控件而定；先以 Int 為主）

### 事件發送流程

- DOM handler（click / input）只做：
  - 組裝 payload
  - 呼叫 `EventCenter` 的事件送出方法（例如 `publishOnClick(...)`）

### 事件訂閱流程

需要處理 UI 事件的邏輯（例如應用到賽局、或驅動某種指令）：

- 在外層（或 ViewModel）訂閱 `EventCenter` 的 UI 事件流
- 將事件轉譯為賽局指令或流程狀態更新

## 建議的元件最小介面（參考）

每個 HTML 組件建議至少提供：

- `root():Dynamic` 或 `element():js.html.Element`：回傳根 DOM
- `dispose():Void`：解除所有訂閱、移除事件監聽

## 後續待辦（配合此指引的 EventCenter API）

目前 `EventCenter` 已有 ViewModel 的 `Subject<IViewModel>`。
接下來建議補齊：

- `onClickSubject`：發送 `OnClick({id})`
- `onSliderSubject`：發送 `OnSlider({id, value})`

並提供對應的 `publish...()` 方法，統一入口。

