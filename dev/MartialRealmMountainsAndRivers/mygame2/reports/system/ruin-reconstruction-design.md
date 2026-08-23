# 廢墟改造系統開發設計文件

## 1. 文件目的

- 將地圖上隨機生成的「廢墟」格子，從單純的障礙物轉化為可互動的戰略資源。
- 玩家在廢墟周邊一格時可互動，消耗體力將廢墟修復為小型防禦設施。
- 建立可直接拆分成工程任務的資料模型、互動流程、UI 規範與驗收標準。
- 與現有防禦設施、戰爭迷霧、行動結果彈窗、經驗值與回合系統保持一致。

## 1.1 目前開發狀態

- **狀態：設計規劃中，尚未實作。**
- 已完成：
  - 無（本系統為全新設計）。
- 尚未完成：
  - 廢墟格子生成。
  - 廢墟互動入口與選項。
  - 小型瞭望臺 / 小型箭塔建造。
  - 經驗值獎勵。
  - 廢墟 marker 與詳情 modal。

## 2. 設計概念

### 2.1 核心幻想

- 荒野中散落著古代文明的廢墟，既是阻礙通行的障礙，也是潛在的戰略據點。
- 玩家可以花費體力修復廢墟，將其轉化為小型防禦設施，擴大視野或提供自動防禦。
- 修復廢墟不消耗建料、不增加聲望，而是直接獎勵玩家經驗值，鼓勵探索與經營地圖。

### 2.2 設計支柱

- **障礙轉資源**：將不可通行的廢墟轉化為有價值的防禦設施。
- **探索驅動**：廢墟隨機分布，玩家需要探索地圖才能發現並利用。
- **低成本高回報**：僅消耗體力即可獲得小型防禦設施與經驗值。
- **與防禦系統互補**：提供據點防禦設施之外的額外防禦選項。

## 3. 系統邊界

- 廢墟是地圖上的固定格子，初始化時隨機生成。
- 廢墟格子不可行走（等同 `wall` 地形）。
- 玩家在廢墟周邊一格時可互動。
- 互動後可選擇修復為小型瞭望臺或小型箭塔。
- 修復完成後，廢墟格子轉變為對應的防禦設施。
- 每個廢墟只能修復一次，修復後不可再改為另一種設施。

## 4. 資料模型

### 4.1 廢墟狀態

```ts
type RuinState = {
  id: string
  position: Position
  status: 'intact' | 'reconstructed'  // 完整 / 已修復
}
```

- `intact`：尚未修復，可互動。
- `reconstructed`：已修復為防禦設施，不可再互動。

### 4.2 遊戲狀態擴充

```ts
// GameState 新增
ruins: RuinState[]
```

### 4.3 小型防禦設施參數

| 設施 | 類型 | 視野 | 攻擊範圍 | 攻擊傷害 | 最大生命 | 體力成本 | 經驗值 |
|------|------|------|----------|----------|----------|----------|--------|
| 小型瞭望臺 | `small-watchtower` | 2 | 0 | 0 | 30 | 5 | 10 |
| 小型箭塔 | `small-arrow-tower` | 1 | 1 | 5 | 40 | 5 | 10 |

> 對照現有標準設施：瞭望塔 HP80/視野 3，箭塔 HP100/攻擊 10/範圍 3。小型設施約為標準的一半數值。
> 小型箭塔同時提供 1 格視野與 1 格射程；小型瞭望臺提供 2 格視野，無攻擊能力。

## 5. 互動流程

### Stage 1：發現廢墟

- **Player Action**：玩家移動到廢墟周邊一格。
- **System Response**：廢墟 marker 顯示可互動狀態。
- **State Change**：無（廢墟狀態不變）。
- **Exception Handling**：廢墟已 `reconstructed` 時不可互動。

### Stage 2：開啟互動

- **Player Action**：玩家點擊廢墟 marker。
- **System Response**：開啟廢墟互動 modal，顯示廢墟描述與兩個選項（小型瞭望臺 / 小型箭塔）。
- **State Change**：不改變回合與資源。
- **Exception Handling**：非相鄰可以查看，但互動按鈕 disabled。

### Stage 3：選擇設施類型

- **Player Action**：玩家選擇小型瞭望臺或小型箭塔。
- **System Response**：驗證玩家體力是否足夠。
- **State Change**：保存待執行選項，不先扣除體力。
- **Exception Handling**：體力不足時拒絕執行，顯示具體缺少體力。

### Stage 4：確認修復

- **Player Action**：玩家按下確認。
- **System Response**：扣除體力，將廢墟轉變為對應防禦設施，發放經驗值。
- **State Change**：廢墟 `status` 變為 `reconstructed`，新增防禦設施到 `defenseStructures`。
- **Exception Handling**：同一廢墟不能重複修復；所有資源變化必須在同一個 Store action 內完成。

### Stage 5：結果彈窗

- **Player Action**：玩家確認或關閉結果彈窗。
- **System Response**：顯示實際消耗（體力）與獲得（經驗值、設施）。
- **State Change**：依 `ActionContinuation` 決定是否結束回合。
- **Exception Handling**：結果彈窗未確認前不得提前進入 Creature 回合。

## 6. UI 規範

### 6.1 廢墟 marker

- class：`.ruin-marker`。
- 支援滑鼠點擊、Enter 與 Space。
- 點擊時 `stopPropagation`，避免誤觸地圖移動。
- Tooltip 顯示「廢墟」與目前狀態。
- `intact` 顯示可互動狀態。
- `reconstructed` 顯示已修復狀態或移除 marker。

### 6.2 廢墟互動 modal

#### Component List

- 廢墟標題與圖示。
- 廢墟描述。
- 廢墟位置與距離。
- 兩個選項：小型瞭望臺 / 小型箭塔。
- 每個選項顯示體力成本與經驗值獎勵。
- 確認、取消與關閉按鈕。

#### States

- `open` / `closed`。
- `available` / `unavailable`。
- `choice-enabled` / `choice-disabled`。
- `confirming` / `idle`。

#### Error Handling

- 非相鄰：顯示廢墟資料，互動按鈕 disabled。
- 玩家已結束回合：所有需要行動的選項 disabled。
- 體力不足：顯示具體缺少體力。
- 廢墟已修復：顯示「已修復」，禁止重複互動。

### 6.3 結果彈窗

- 使用現有 `blockingModal` 與 `ActionContinuation`。
- 顯示實際扣除（體力）與獲得（經驗值、設施）。
- 重大事件可使用 `end-player-turn` continuation。

## 7. 與現有系統的關聯

- **防禦設施**：廢墟修復後新增到 `defenseStructures`，小型瞭望臺提供視野，小型箭塔在 Creature 回合自動攻擊。
- **戰爭迷霧**：小型瞭望臺可擴大玩家視野範圍。
- **經驗值**：修復廢墟獎勵經驗值，不增加聲望。
- **體力**：修復消耗體力，與其他行動共用體力資源。
- **回合**：修復可選擇是否結束玩家回合。
- **地圖生成**：廢墟在初始化時隨機生成，數量由設置頁面控制。

## 8. 平衡與風險

- 小型設施數值較弱，避免取代據點防禦設施。
- 僅消耗體力，不消耗建料，避免與據點建設競爭資源。
- 經驗值獎勵適中（10），避免過度加速成長。
- 每個廢墟只能修復一次，避免無限刷經驗值。
- 廢墟數量由設置頁面控制，預設 10 個。

## 9. 分階段開發

### Phase 1：資料與生成

- 新增 `RuinState` 類型。
- 新增 `ruins` 到 `GameState`。
- 地圖初始化時隨機生成廢墟（數量由設置頁面控制）。
- 廢墟格子不可行走。
- **狀態：未開始。**

### Phase 2：互動與建造

- 新增廢墟 marker。
- 新增廢墟互動 modal。
- 實作小型瞭望臺 / 小型箭塔選項。
- 實作體力扣除與經驗值獎勵。
- 廢墟轉變為防禦設施。
- **狀態：未開始。**

### Phase 3：整合與驗收

- 小型瞭望臺視野效果接入戰爭迷霧。
- 小型箭塔自動攻擊接入 Creature 回合。
- 結果彈窗與 continuation。
- **狀態：未開始。**

## 10. 測試與驗收

### 純函式測試

- 廢墟生成數量與位置。
- 廢墟不可行走。
- 體力不足時修復失敗。
- 同一廢墟不可重複修復。

### Action 測試

- 非相鄰只能查看，不能修復。
- 體力不足時修復失敗且不扣資源。
- 修復後廢墟變為 `reconstructed`。
- 修復後新增對應防禦設施。
- 修復後發放經驗值。
- 結果彈窗確認前不結束回合。

### UI 測試

- 廢墟 marker 點擊與鍵盤 Enter/Space。
- 點擊 marker 不觸發地圖移動。
- 選項 disabled 狀態。
- 結果彈窗顯示實際消耗與獎勵。

### 驗收指令

```text
npm test
npm run lint
npm run build
```

## 11. 專案追蹤

| Task Item | Owner | Status | Priority | Notes |
|---|---|---|---|---|
| 新增 `RuinState` 類型 | Gameplay | Planned | High | Phase 1 |
| 新增 `ruins` 到 `GameState` | Gameplay | Planned | High | Phase 1 |
| 地圖初始化生成廢墟 | Gameplay | Planned | High | Phase 1 |
| 新增廢墟 marker | Frontend | Planned | High | Phase 2 |
| 新增廢墟互動 modal | Frontend | Planned | High | Phase 2 |
| 實作小型瞭望臺 / 箭塔選項 | Gameplay | Planned | High | Phase 2 |
| 實作體力扣除與經驗值獎勵 | Gameplay | Planned | High | Phase 2 |
| 廢墟轉變為防禦設施 | Gameplay | Planned | High | Phase 2 |
| 小型瞭望臺視野接入迷霧 | Gameplay | Planned | Medium | Phase 3 |
| 小型箭塔自動攻擊接入 | Gameplay | Planned | Medium | Phase 3 |
| 結果彈窗與 continuation | Gameplay | Planned | Medium | Phase 3 |

## 12. 與主規劃文件的關聯

- 主規劃：[`reports/game-design-master-plan.md`](game-design-master-plan.md)
- 防禦設施規格：[`reports/defense-structures-design.md`](defense-structures-design.md)
- 戰爭迷霧規格：[`reports/fog-of-war-design.md`](fog-of-war-design.md)
- 本文件負責廢墟改造系統的資料模型、互動流程、UI、獎勵與驗收標準。
