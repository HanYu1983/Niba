# 探索事件 MVP 開發設計文件

## 1. 文件目的

- 在現有地圖、相鄰互動、回合、道具、裝備、功法、據點與結果彈窗框架上加入探索事件。
- 讓探索事件提供多選項、條件、風險與不同結果，而不是單一隨機獎勵。
- 建立可直接拆分成工程任務的資料模型、流程、UI 規範與測試標準。
- 與戰爭迷霧、Action Continuation 及現有物品掉落系統保持一致。

## 1.1 目前開發狀態

- **狀態：探索事件 MVP 與資料驅動事件框架已完成。**
- 已完成：
  - 固定失散商隊事件。
  - 事件 marker、滑鼠點擊與 Enter/Space 鍵盤互動。
  - 事件詳情 modal 與相鄰距離限制。
  - 交易、護送、掠奪三個選項。
  - 金錢、聲望、道具效果與回合 continuation。
  - 事件完成後標記為 `resolved`，並從地圖移除 marker。
  - 事件條件與效果的資料驅動 catalog。
  - 通用事件條件判定與效果套用 resolver。
- 尚未完成：
  - 事件條件在 modal 中逐項顯示具體缺少原因。
  - 事件風險資料與 Creature / 世界狀態反應。
  - 隨機事件生成、事件期限與戰爭迷霧發現。
  - 事件鏈、事件歷史與後續事件類型。

## 2. MVP 設計範圍

### 2.0 系統邊界

- 目前不建立獨立 NPC 系統。
- 商隊以探索事件 `lost-caravan` 的形式存在。
- 商隊不保存獨立 NPC 移動、好感度、長期庫存或多次服務狀態。
- 商隊的交易、護送與掠奪全部由事件選項與事件結算處理。
- 未來若需要固定商人、治療師、情報販子或任務 NPC，再另行建立 NPC 系統文件與資料模型。

### 2.1 第一版事件

MVP 先實作一種事件：

- **失散商隊**：玩家可選擇交易、護送或掠奪。

此事件用來驗證：

- 事件點 marker。
- 事件詳情 modal。
- 多選項顯示。
- 金錢、聲望、道具與裝備獎勵。
- 選項條件檢查。
- 風險與負面結果。
- 結果彈窗與 continuation。
- 事件完成後不可重複領取。

### 2.2 後續事件

- 受傷旅者：消耗藥品救治，獲得情報或聲望。
- 神秘祭壇：獲得屬性加成，但可能召喚 Creature。
- 廢棄營地：搜尋物資，可能發現陷阱。
- 被封鎖的道路：花費建材清理，開啟捷徑。

以下內容暫不屬於本文件的實作範圍：

- 可跨回合移動的 NPC。
- NPC 好感度與關係。
- NPC 長期商店庫存。
- NPC 招募、傭兵與任務鏈系統。

## 3. 事件資料模型

### 3.1 事件狀態

```ts
type ExplorationEventStatus =
  | 'hidden'
  | 'available'
  | 'resolved'
  | 'expired'
```

- `hidden`：尚未被玩家發現。
- `available`：已發現，可以查看與互動。
- `resolved`：已完成，不可再次領取獎勵。
- `expired`：因回合或世界狀態失效。

### 3.2 EventPointState

```ts
type EventPointState = {
  id: string
  type: ExplorationEventType
  name: string
  description: string
  position: Position
  status: ExplorationEventStatus
  discovered: boolean
  expiresAtRound: number | null
}
```

實際程式型別名稱為 `ExplorationEventState`；事件狀態資料仍保留在 `GameState.explorationEvents`，完成後不刪除，供未來事件歷史與事件鏈使用。

### 3.3 事件類型

```ts
type ExplorationEventType = 'lost-caravan'
```

後續可擴充：

```ts
type ExplorationEventType =
  | 'lost-caravan'
  | 'wounded-traveler'
  | 'mysterious-altar'
  | 'abandoned-camp'
  | 'blocked-road'
```

## 4. 事件選項模型

```ts
type EventChoice = {
  id: string
  label: string
  description: string
  requirements: EventRequirement[]
  rewards: EventReward[]
  riskMessage?: string
  endsPlayerTurn: boolean
}
```

目前資料驅動實作位於：

- `src/game/events/eventCatalog.ts`：事件定義、選項、條件與效果。
- `src/game/events/eventResolver.ts`：條件判定與效果套用。

新增事件時，優先新增 `ExplorationEventDefinition`，避免在 `gameStore.ts` 增加事件專屬分支。

### 4.1 條件

MVP 只支援簡單條件：

```ts
type EventRequirement =
  | { type: 'adjacent-to-event' }
  | { type: 'active-player' }
  | { type: 'player-alive' }
  | { type: 'money-at-least'; amount: number }
  | { type: 'item-owned'; itemId: string; quantity: number }
  | { type: 'building-materials-at-least'; baseId: string; amount: number }
```

條件不足時：

- 選項 disabled。
- 顯示具體缺少條件。
- 不消耗行動、金錢、道具或回合。

### 4.2 獎勵

```ts
type EventReward =
  | { type: 'money'; amount: number }
  | { type: 'prestige'; amount: number }
  | { type: 'health'; amount: number }
  | { type: 'stamina'; amount: number }
  | { type: 'inner-power'; amount: number }
  | { type: 'item'; itemId: string; quantity: number }
  | { type: 'equipment'; equipmentId: string }
  | { type: 'reveal-area'; radius: number }
  | { type: 'reveal-target'; targetType: 'creature' | 'nest' | 'resource-point'; targetId: string }
```

## 5. 失散商隊 MVP 規格

事件名稱：`失散商隊`

### 5.1 交易

- 條件：玩家與事件點相鄰、目前是玩家回合、玩家存款至少 10。
- 結果：金錢 `-10`，獲得 `stamina-potion` ×1。
- 回合：不結束玩家回合，作為低成本互動。

### 5.2 護送

- 條件：玩家與事件點相鄰、玩家存活。
- 結果：聲望 `+5`。
- 風險：目前尚未接入 Creature 威脅或事件點移動。
- 回合：結束玩家回合。

### 5.3 掠奪

- 條件：玩家與事件點相鄰、玩家存活。
- 結果：獲得 `health-potion` ×1，聲望 `-5`。
- 風險：目前尚未接入 Creature 行動或區域威脅。
- 回合：結束玩家回合。

## 6. 事件流程

### Stage 1：事件發現

- **Player Action**：玩家進入事件視野或使用情報揭示事件。
- **System Response**：事件由 `hidden` 轉為 `available`，顯示事件 marker。
- **State Change**：`discovered = true`，保存事件位置。
- **Exception Handling**：事件已 `resolved` 或 `expired` 時不可重新發現。

### Stage 2：開啟詳情

- **Player Action**：玩家點擊事件 marker。
- **System Response**：開啟事件詳情 modal，顯示背景、位置、狀態與選項。
- **State Change**：不改變回合與資源。
- **Exception Handling**：非相鄰可以查看，但所有需要互動的選項 disabled。

### Stage 3：選擇選項

- **Player Action**：玩家選擇交易、護送或掠奪。
- **System Response**：從事件 catalog 取得選項，並再次驗證玩家、距離、資源與事件狀態。
- **State Change**：保存待執行選項，不先扣除資源。
- **Exception Handling**：預覽後條件失效時，拒絕執行且不改變事件狀態。

### Stage 4：確認選項

- **Player Action**：玩家按下確認。
- **System Response**：由 event resolver 套用資料定義的效果與事件狀態。
- **State Change**：事件變為 `resolved`，或依事件結果移動/變更狀態。
- **Exception Handling**：同一事件不能重複結算；所有資源變化必須在同一個 Store action 內完成。

### Stage 5：結果彈窗

- **Player Action**：玩家確認或關閉結果彈窗。
- **System Response**：顯示實際獎勵、消耗與風險結果。
- **State Change**：依 `ActionContinuation` 決定是否結束回合。
- **Exception Handling**：結果彈窗未確認前不得提前進入 Creature 回合。

## 7. UI 規範

### 7.1 Event marker

- class：`.event-point-marker`。
- 支援滑鼠點擊、Enter 與 Space。
- 點擊時 `stopPropagation`，避免誤觸地圖移動。
- Tooltip 顯示事件名稱與目前狀態。
- `hidden` 不渲染。
- `available` 顯示可互動狀態。
- `resolved` 保留於遊戲狀態，但從地圖移除 marker。
- `expired` 顯示失效狀態或移除。

### 7.2 EventDetailsModal

#### Component List

- 事件標題與圖示。
- 事件描述。
- 事件位置與距離。
- 事件狀態。
- 選項清單。
- 條件提示。
- 確認、取消與關閉按鈕。

#### States

- `open` / `closed`。
- `available` / `unavailable`。
- `choice-enabled` / `choice-disabled`。
- `resolved` / `expired`。
- `confirming` / `idle`。

#### Interaction Flow

```text
事件 marker
→ 事件詳情 modal
→ 選擇方案
→ 查看條件與預期成本
→ 確認方案
→ 實際結算
→ 結果彈窗
```

#### Error Handling

- 非相鄰：顯示事件資料，互動按鈕 disabled。
- 玩家已結束回合：所有需要行動的選項 disabled。
- 金錢/道具/建料不足：顯示具體缺少數量。
- 事件已完成：顯示「事件已完成」，禁止重複領取。
- 事件已失效：顯示「事件已失效」，禁止互動。
- 目標不存在：關閉或更新 modal，不執行錯誤獎勵。

### 7.3 結果彈窗

- 使用現有 `blockingModal` 與 `ActionContinuation`。
- 顯示實際扣除與獲得項目。
- 重大事件可使用 `end-player-turn` continuation。
- 未確認前不推進下一個 Creature 回合。

## 8. 與戰爭迷霧的關聯

- 未探索區域不顯示事件 marker。
- 事件進入玩家視野後由 `hidden` 轉為 `available`。
- 已發現事件可依規則保留位置記憶。
- 情報型事件可以揭示 Creature、巢穴或資源點。
- 事件獎勵可以暫時增加視野範圍或揭示指定區域。
- Debug 地圖使用 `revealed` 模式，方便測試事件流程。
- 詳細迷霧規格見 [`reports/fog-of-war-design.md`](fog-of-war-design.md)。

## 9. 與現有系統的關聯

- **道具**：受傷旅者可消耗藥品；商隊事件可提供消耗品。
- **裝備**：商隊或高風險事件可提供裝備實例。
- **功法**：高風險事件可提供功法，但不應普遍取代巢穴獎勵。
- **建築**：被封鎖道路可消耗建料；瞭望塔可增加事件發現範圍。
- **Creature**：掠奪或祭壇可能提高 Creature 威脅。
- **據點**：事件可提供任務、金錢或聲望，形成回據點的動機。
- **NPC 系統**：目前只透過事件模擬商隊與旅者，不建立獨立 NPC 狀態。
- **裝備耐久**：重大護送或風險事件可消耗裝備耐久，但 MVP 先避免跨系統隱性扣除。

## 10. 分階段開發

### Phase 1：資料與固定事件

- 新增 `EventPointState`。
- 新增 `ExplorationEventType` 與狀態。
- 建立固定的失散商隊事件。
- 新增事件點 marker。
- 新增事件詳情 modal。
- **狀態：已完成。**

### Phase 2：選項與結算

- 實作交易、護送、掠奪三個選項。
- 加入條件檢查與選項 disabled 狀態。
- 接入道具、金錢、聲望與裝備實例獎勵。
- 接入 Action Continuation。
- **狀態：已完成。**
- **補充：** 目前效果已透過 `eventCatalog.ts` 與 `eventResolver.ts` 資料驅動；裝備獎勵尚未在失散商隊中啟用。

### Phase 3：隨機事件與世界反應

- 增加受傷旅者、廢棄營地與神秘祭壇。
- 加入事件期限與 `expired` 狀態。
- 加入 Creature 威脅與區域狀態變化。
- 每回合最多觸發一個主要世界事件。
- **狀態：未開始。**

### Phase 4：探索深度

- 接入戰爭迷霧與情報揭示。
- 加入事件鏈與前置條件。
- 加入事件記錄與結果回顧。
- 加入 NPC、商隊與中立據點互動。

本階段的商隊互動仍以事件選項呈現；獨立 NPC 系統不在目前版本範圍內。

## 11. 測試與驗收

### 純函式測試

- 已完成：相鄰/非相鄰判定、選項條件判定、金錢/聲望/道具效果套用。
- 待完成：事件狀態轉換獨立測試、事件期限判定、隨機事件生成測試。

### Action 測試

- 非相鄰只能查看，不能結算。
- 金錢不足時交易失敗且不扣資源。
- 道具不足時救治失敗且事件不變更。（受傷旅者尚未實作，列為後續測試。）
- 同一事件只能結算一次。
- 不同選項產生不同狀態結果。
- 結果彈窗確認前不結束回合。
- `resolved` 與 `expired` 事件不可再次互動。

### UI 測試

- Marker 點擊與鍵盤 Enter/Space。
- 點擊 marker 不觸發地圖移動。
- 選項 disabled 狀態。（目前 modal 顯示相鄰與事件狀態限制；逐項條件原因提示待補。）
- 結果彈窗顯示實際成本與獎勵。

### 驗收指令

```text
npm test
npm run lint
npm run build
```

## 12. 平衡風險

- 事件獎勵過強可能取代戰鬥、採集與任務。
- 高報酬事件必須附帶資源、回合、聲望或 Creature 風險。
- 永久功法獎勵應保留給高風險事件，避免成長曲線過快。
- 每回合最多觸發一個主要事件，避免資訊過載。
- 事件選項必須有不同結果，避免只有文字差異。
- 事件不得無預警摧毀玩家核心進度。

## 13. 專案追蹤

| Task Item | Owner | Status | Priority | Deadline |
|---|---|---|---|---|
| 新增 `ExplorationEventState` | Gameplay | Done | High | 已完成 |
| 建立失散商隊固定事件 | Game Design / Gameplay | Done | High | 已完成 |
| 新增事件 marker 與詳情 modal | Frontend | Done | High | 已完成 |
| 建立事件 catalog 與 resolver | Gameplay | Done | High | 已完成 |
| 實作事件選項條件 | Gameplay | Done | High | 已完成 |
| 接入事件獎勵與成本 | Gameplay | Done | High | 已完成 |
| 接入結果彈窗 continuation | Gameplay | Done | High | 已完成 |
| 接入戰爭迷霧發現規則 | Gameplay | Planned | Medium | 待定 |
| 增加事件鏈與事件期限 | Game Design / Gameplay | Planned | Medium | 待定 |
| 建立獨立 NPC 系統 | Gameplay | Deferred | Low | 未定 |

## 14. 與主規劃文件的關聯

- 主規劃：[`reports/game-design-master-plan.md`](game-design-master-plan.md)
- 戰爭迷霧規格：[`reports/fog-of-war-design.md`](fog-of-war-design.md)
- 本文件負責探索事件的資料模型、流程、UI、條件、獎勵與驗收標準。
- 主規劃文件負責整體遊戲方向、系統閉環與優先級。
