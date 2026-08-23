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
  - **統一訊息佇列**：`pendingOutbox(monarchId)`／`ackOutbox(monarchId, outboxId)`（見下方「Outbox」）

### 3) Outbox（統一訊息佇列）

賽局在 `applyMenuLeaf` 等流程中產生的「需依序呈現」訊息（例如移動過場、結算說明），全部由 **`game.IGameMatchGetter` 的 outbox API** 暴露給 UI：

- **`pendingOutbox(monarchId)`**：取得該君主視角下的佇列快照（嚴格保序）。
- **`ackOutbox(monarchId, outboxId)`**：使用者確認或動畫播放完畢後消費一筆；不存在該 id 時為 no-op。

佇列元素的呈現型態由 **`game.OutboxPresentation`** 描述（例如阻塞型文字卡、`Animation` 過場等）。UI **不得**再維護第二套「popup 佇列／animation 佇列」或對應的獨立 getter。

賽局側若要寫入純文字結果訊息，契約方法為 **`IGameMatch.pushOutboxPlain(monarchId, title, payload, ctxKey)`**（內容載荷為 `game.PopupPayload`，目前以 `Plain(text)` 為主）。

HTML 實作上由 **`src/view/html/HtmlOutboxView.hx`** 單一元件負責：

- 訂閱 `EventCenter` 的 **`UiEvent.OutboxRefresh`**，於 `pendingOutbox(activeMonarch)` 有資料時渲染佇列頭部（必要時處理 `OutboxPresentationMode` 如並列預覽）。
- 使用者按下關閉（或 AI 君主自動逾時）時，發送 **`UiEvent.OutboxAck(outboxId)`**；由 **`BasicViewModel`** 呼叫 `ackOutbox` 後再發 **`OutboxRefresh`** 推進下一筆。

已不再使用獨立的 `HtmlPopupView`／`HtmlAnimationView`，亦不再有 `PopupRefresh`／`AnimationRefresh`／`PopupClose` 等平行事件。

### 4) EventCenter（事件中樞）

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

### `UiEvent`（實際使用的列舉）

遊戲相關 UI 互動與系統→UI 提示，定義於 **`src/view/UiEvent.hx`**，經 **`EventCenter.eventSubject`** 傳遞。與 view 指引直接相關者包括：

| 方向 | 事件 | 說明 |
|------|------|------|
| UI→系統 | `TileClick`、`PlayerClick`、`MenuClick`、各種表單 patch（`Slider`、`GeneralMultiPick` 等） | 由 HTML 元件發送，`BasicViewModel` 轉成對 `IGameMatch` 的操作 |
| UI→系統 | `AiStep` | AI 席位自動推進一步 |
| UI→系統 | **`OutboxAck(outboxId)`** | 關閉／確認目前阻塞型 outbox 項目（對應 **`ackOutbox`**） |
| 系統→UI | **`OutboxRefresh`** | 提示 **`HtmlOutboxView`** 重新讀取 **`pendingOutbox`** 並渲染 |

`BasicViewModel` 在 **`MenuClick`**／**`AiStep`** 成功套用選單後會發 **`OutboxRefresh`**（並 **`publishViewModel`**），無需再發送已移除的平行刷新事件。

### 事件命名與載荷（payload）

早期草稿曾約定泛用 **OnClick**／**OnSlider** payload；目前實作以 **`UiEvent` 之 ADT** 為準（見上表）。若新增控件，應擴充 `UiEvent` 或在現有事件中帶足夠結構化載荷，並在 `BasicViewModel.handleUiEvent` 集中處理。

### 事件發送流程

- DOM handler（click / input）只做：
  - 組裝對應的 **`UiEvent`**
  - 呼叫 **`EventCenter.publishEvent(...)`**

### 事件訂閱流程

需要處理 UI 事件的邏輯（例如應用到賽局、或驅動某種指令）：

- 在 **`BasicViewModel`**（或其他訂閱端）訂閱 `EventCenter.eventSubject`
- 將事件轉譯為賽局指令或流程狀態更新

## 建議的元件最小介面（參考）

每個 HTML 組件建議至少提供：

- `root():Dynamic` 或 `element():js.html.Element`：回傳根 DOM
- `dispose():Void`：解除所有訂閱、移除事件監聽

## 後續待辦（配合此指引的 EventCenter API）

目前 `EventCenter` 已具備：

- **`viewModelSubject`**：`Subject<IViewModel>`，供元件訂閱當前 ViewModel。
- **`eventSubject`**：傳遞 **`UiEvent`**（見 **`EventCenter.publishEvent`**）。

後續若仍有「泛用控件 id → 行為」的需求，可在不重複發明第二套事件總線的前提下，於 **`UiEvent`** 增量擴充，或為特定複合控件新增獨立 `publish...()` 包裝（底層仍應呼叫 **`publishEvent`**）。

