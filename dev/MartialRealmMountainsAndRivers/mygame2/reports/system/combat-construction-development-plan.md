# 戰鬥與建設系統開發文件

## 1. 文件目的

- 將 [`combat-construction-progression-design.md`](combat-construction-progression-design.md) 的設計草案拆分為可執行的工程階段。
- 定義資料模型、規則模組、Store action、UI 元件、測試與驗收標準。
- 保持現有回合、戰鬥、建築、據點、政策與結果彈窗流程可逐步演進。
- 任務系統基礎版本已在本期完成；複雜任務鏈與多階段任務仍另行規劃。

## 2. 開發原則

- **先規則、後 UI**：先完成純函式與狀態驗證，再接入 modal。
- **單一資料來源**：玩家資料放在 `PlayerState`，據點資料放在 `BaseState`，全局公共倉庫放在 `GameState`。
- **規則集中**：政策、官階、建築升級、傳送、倉庫與建料調度不得散落在元件中。
- **操作冪等**：預覽、取消、失敗不修改資源；確認時重新驗證，成功只結算一次。
- **保留後期空間**：一方太守與勢力盟主的建築暫不實作；驛站、交易所與總管府為固定功能建築。
- **小步驗證**：每個里程碑完成後執行單元測試、Store 測試與正式建置。

## 3. 目前範圍與暫不開發範圍

### 3.1 本期範圍

- 玩家個人聲望與官階。
- 官階對建築解鎖與一般建築等級上限的影響。
- 建設操作獲得聲望。
- 基本、經濟、軍事、民生四種據點政策。
- 據點政策切換。
- 一般建築升級。
- 道具商店與裝備商店商品池方向。
- 驛站固定功能：支付少量金錢，傳送至任意其他據點。
- 交易所固定功能：跨據點共享公共倉庫。
- 總管府固定功能：以 modal 管理所有據點政策與建料調度。
- 任務系統基礎版本與任務金錢／聲望獎勵。

### 3.2 暫不開發

- 複雜任務鏈、多階段任務與任務條件編輯器。
- 一方太守階段的具體建築。
- 勢力盟主階段的具體建築。
- 政策等級、政策樹與政策批次切換。
- 複雜商隊系統。
- 跨據點高階事件。
- 公共倉庫容量、重量、操作次數限制。
- 驛站除傳送外的進階功能。
- 複雜 NPC、區域控制與勢力關係。

 任務系統基礎版本已在本期完成；複雜任務鏈與多階段任務仍另行規劃。

### 4.1 玩家資料

 複雜任務鏈、多階段任務與任務條件編輯器。

```ts
level: number
availableAttributePoints: number
prestige: number
 `BuildingUpgradeModal.tsx`（未獨立建立；升級流程整合於 `BuildingListModal.tsx` 與 `BuildingListItem.tsx`）
unlockedPolicyIds: GovernancePolicyId[]
```

 功能與實作狀態：

 `BuildingUpgradeModal`：目前由建築列表與升級選單完成，未建立獨立 Modal。
level = 1
availableAttributePoints = 0
prestige = 0
governanceRank = 1
unlockedPolicyIds = ['basic']
 ### Milestone 1：官階與聲望基礎（已完成）

> 若現有程式已使用 `level`、`availableAttributePoints` 或 `prestige`，應保留現有欄位名稱，避免不必要的資料遷移。

 ### Milestone 2：建築等級與建設聲望（已完成）

```ts
type GovernancePolicyId = 'basic' | 'economic' | 'military' | 'civilian'
 ### Milestone 3：政策與據點效果（已完成）

政策解鎖屬於玩家；目前啟用政策屬於據點：

 ### Milestone 4：商店建築（核心功能已完成）
type BaseState = {
  ...
  activePolicyId: GovernancePolicyId
 ### Milestone 5：驛站傳送（已完成）
```

每個據點初始：
 ### Milestone 6：跨據點公共倉庫（已完成）
```ts
activePolicyId = 'basic'
```
 ### Milestone 7：總管府治理 modal（已完成）
### 4.3 建築資料

一般建築保留等級：
 ### Milestone 8：事件建築條件（部分完成）
```ts
 建築解法成功後效果、聲望與資源正確結算。（待完整接合驗收）
 不同建築可以提供不同事件解法。（待完整接合驗收）
  level?: number
}
```

固定功能建築不進入普通升級流程：

```ts
const fixedFunctionBuildingTypes = [
  'waystation',
  'exchange',
  'regional-management',
]
```

建築類型名稱應集中定義，實際專案若採用其他 ID，需全局統一：

- `waystation`：驛站
- `exchange`：交易所
- `regional-management`：總管府

### 4.4 公共倉庫

公共倉庫是跨據點共享的全局資料：

```ts
type SharedWarehouseEntry = {
  itemId: string
  quantity: number
}
```

```ts
type GameState = {
  ...
  sharedWarehouse: SharedWarehouseEntry[]
}
```

規則：

- 沒有容量、重量、種類或單次操作上限。
- 存入與取出不增加聲望。
- 存入與取出不消耗行動。
- 只要玩家位於任一擁有交易所的據點即可操作。

### 4.5 總管府與調度

總管府不需要額外的全局等級；建造完成即可使用核心功能。若未來確認需要擴充，再另行設計。

建料調度的計算資料：

```ts
type MaterialTransferPreview = {
  playerId: string
  sourceBaseId: string
  targetBaseId: string
  requestedAmount: number
  deliveredAmount: number
  lossAmount: number
}
```

## 5. 規則模組拆分

### 5.1 `governanceRules.ts`

建議位置：`src/game/rules/governanceRules.ts`

職責：

- 官階門檻與名稱。
- 聲望增加與官階提升。
- 政策解鎖判定。
- 政策效果計算。

建議 API：

```ts
getGovernanceRank(prestige: number): number
getNextGovernanceRequirement(rank: number): number | null
getGovernanceRankName(rank: number): string
getUnlockedPolicyIds(player: PlayerState): GovernancePolicyId[]
getPolicyDefinition(policyId: GovernancePolicyId): GovernancePolicyDefinition
applyPrestigeGain(player: PlayerState, amount: number): PlayerState
```

### 5.2 `buildingProgressionRules.ts`

建議位置：`src/game/rules/buildingProgressionRules.ts`

職責：

- 建築解鎖判定。
- 一般建築等級上限。
- 建築升級成本。
- 固定功能建築排除。
- 建築升級效果。

建議 API：

```ts
isFixedFunctionBuilding(buildingType: string): boolean
getMaxBuildingLevelForPlayer(player: PlayerState): number
canPlayerBuildBuilding(state: GameState, playerId: string, buildingType: string): boolean
canUpgradeBuilding(state: GameState, playerId: string, baseId: string, buildingId: string): RuleResult
getBuildingUpgradeCost(building: BaseBuilding): number
```

### 5.3 `policyRules.ts`

可與 `governanceRules.ts` 合併，但若政策效果增加，建議獨立：

建議 API：

```ts
getEffectiveStorePrice(state: GameState, base: BaseState, price: number): number
getEffectiveRepairCost(state: GameState, base: BaseState, cost: number): number
getEffectiveTransportCost(state: GameState, base: BaseState, cost: number): number
getPassiveMaterialIncome(state: GameState, base: BaseState, income: number): number
getResourceCollectionMaterialGain(state: GameState, base: BaseState, income: number): number
getBaseDefenseMultiplier(state: GameState, base: BaseState): number
```

政策初版效果方向：

| 政策 | 初版效果 |
|---|---|
| `basic` | 不提供額外效果 |
| `economic` | 降低商店、修理、醫療與驛站傳送金錢支出 |
| `military` | 強化據點與防禦設施的防禦效果 |
| `civilian` | 增加資源點採集與據點被動建料獲取 |

### 5.4 `transportRules.ts`

建議位置：`src/game/rules/transportRules.ts`

職責：

- 驗證出發據點擁有驛站。
- 驗證目的據點存在且不同於出發據點。
- 驗證玩家位置、回合與金錢。
- 計算少量傳送費。

建議 API：

```ts
canTransportPlayer(state: GameState, playerId: string, targetBaseId: string): RuleResult
getTransportCost(state: GameState, sourceBaseId: string, targetBaseId: string): number
```

核心規則：

- 只要求出發據點擁有驛站。
- 目的據點不需要驛站。
- 只消耗少量金錢。
- 不消耗體力與建料。

### 5.5 `storageRules.ts`

建議位置：`src/game/rules/storageRules.ts`

職責：

- 驗證玩家位於有交易所的據點。
- 存入與取出公共倉庫物品。
- 維持玩家背包與公共倉庫的一致性。

建議 API：

```ts
canAccessSharedWarehouse(state: GameState, playerId: string): RuleResult
canDepositItem(state: GameState, playerId: string, itemId: string, quantity: number): RuleResult
canWithdrawItem(state: GameState, playerId: string, itemId: string, quantity: number): RuleResult
```

核心規則：

- 公共倉庫跨據點共享。
- 不設容量與重量限制。
- 不增加聲望。
- 不消耗玩家行動。

### 5.6 `regionalManagementRules.ts`

建議位置：`src/game/rules/regionalManagementRules.ts`

職責：

- 驗證玩家位於有總管府的據點。
- 驗證跨據點政策切換。
- 驗證建料來源、目的地與調度損耗。
- 產生總管府 modal 使用的狀態資料。

建議 API：

```ts
canOpenRegionalManagement(state: GameState, playerId: string): RuleResult
canSwitchRemotePolicy(state: GameState, playerId: string, targetBaseId: string, policyId: GovernancePolicyId): RuleResult
canTransferMaterials(state: GameState, playerId: string, sourceBaseId: string, targetBaseId: string, amount: number): RuleResult
getRegionalManagementOverview(state: GameState, playerId: string): RegionalManagementOverview
```

## 6. GameStore action 規劃

`gameStore.ts` 只負責呼叫規則並更新狀態。

### 6.1 官階與聲望

```ts
addPrestige(playerId: string, amount: number): boolean
```

只有成功建設操作才能呼叫，預覽與失敗不可呼叫。

### 6.2 政策

```ts
switchBasePolicy(playerId: string, baseId: string, policyId: GovernancePolicyId): boolean
```

驗證：

- 玩家可行動。
- 玩家在據點互動範圍內，或透過總管府符合遠端管理條件。
- 政策已解鎖。
- 目的據點存在。
- 回合與 blocking modal 狀態有效。

### 6.3 建築升級

```ts
upgradeBuilding(playerId: string, baseId: string, buildingId: string): BuildingUpgradeResult | null
```

成功後：

- 扣除據點建料。
- 建築等級 +1。
- 給予執行者建設聲望。
- 更新據點衍生效果。
- 顯示結果彈窗。

### 6.4 驛站傳送

```ts
transportPlayer(playerId: string, targetBaseId: string): boolean
```

成功後：

- 扣除少量金錢。
- 更新玩家位置。
- 更新玩家視野。
- 依最終規則決定是否結束回合。

### 6.5 公共倉庫

```ts
depositToSharedWarehouse(playerId: string, itemId: string, quantity: number): boolean
withdrawFromSharedWarehouse(playerId: string, itemId: string, quantity: number): boolean
```

成功後：

- 更新玩家背包。
- 更新 `sharedWarehouse`。
- 不增加聲望。
- 不結束回合。

### 6.6 總管府

```ts
switchRemoteBasePolicy(playerId: string, targetBaseId: string, policyId: GovernancePolicyId): boolean
transferBaseMaterials(playerId: string, sourceBaseId: string, targetBaseId: string, amount: number): MaterialTransferResult | null
```

成功後：

- 更新目標據點政策，或更新來源／目的據點建料。
- 調度可套用固定損耗。
- 第一版成功後結束玩家回合。
- 顯示結果彈窗。

## 7. UI 開發規劃

### 7.1 玩家面板

新增或整理：

- 聲望。
- 官階。
- 下一官階需求。
- 已解鎖政策。
- 兩條路線發展進度。

### 7.2 建築列表與據點面板

每個建築顯示：

- 建築名稱與目前等級。
- 可升級最高等級。
- 下一級效果。
- 升級成本。
- 固定功能標籤：驛站、交易所、總管府。
- 尚未解鎖時顯示官階需求。

### 7.3 新增 UI 元件

```text
src/components/PolicySwitchModal.tsx
src/components/SharedWarehouseModal.tsx
src/components/TransportModal.tsx
src/components/RegionalManagementModal.tsx
升級流程整合於 src/components/BuildingListModal.tsx 與 src/components/BuildingListItem.tsx
```

功能與實際狀態：

- `PolicySwitchModal`：切換目前據點政策。
- `SharedWarehouseModal`：存入／取出跨據點公共倉庫物品。
- `TransportModal`：選擇目的據點並顯示傳送費。
- `RegionalManagementModal`：總管府政策切換與建料調度。
- 建築升級：由 `BuildingListModal` 與 `BuildingListItem` 顯示成本、等級與確認操作，未建立獨立 `BuildingUpgradeModal`。

## 8. 開發里程碑

### Milestone 1：官階與聲望基礎（已完成）

**範圍**：玩家聲望、官階、門檻與政策解鎖資料。

**完成條件**：

- 玩家初始官階與聲望正確。
- 聲望增加可觸發官階提升。
- 官階不因聲望暫時變化而倒退。
- 官階門檻與名稱有純函式測試。

### Milestone 2：建築等級與建設聲望（已完成）

**範圍**：一般建築等級、升級、成本與固定功能建築排除。

**完成條件**：

- 一般建築可逐級升級。
- 驛站、交易所、總管府不可進入普通升級流程。
- 升級成功扣除建料並給予一次建設聲望。
- 升級失敗不改變狀態。

### Milestone 3：政策與據點效果（已完成）

**範圍**：基本、經濟、軍事、民生政策與據點切換。

**完成條件**：

- 新據點初始為基本政策。
- 基本政策不提供額外效果。
- 玩家只能切換已解鎖政策。
- 政策效果正確套用到建料、金錢支出與防禦計算。
- 政策切換成功顯示結果提示。

### Milestone 4：商店建築（核心功能已完成）

**範圍**：道具商店、裝備商店與等級商品池。

**完成條件**：

- Lv.1 提供基礎商品。
- 更高等級提供更高品質或不同功能商品。
- 商品使用金錢購買。
- 商品不足與金錢不足正確 disabled。
- 經濟、軍事、民生政策的商品效果可獨立測試。

### Milestone 5：驛站傳送（已完成）

**範圍**：驛站、目的據點選擇與低額傳送費。

**完成條件**：

- 只有出發據點需要驛站。
- 可前往任意其他據點。
- 傳送只扣少量金錢。
- 不扣體力與建料。
- 金錢不足、目的地不存在或玩家不可行動時失敗。
- 傳送後位置與視野正確。

### Milestone 6：跨據點公共倉庫（已完成）

**範圍**：交易所、全局共享倉庫與存取 modal。

**完成條件**：

- 任一有交易所的據點都能操作同一公共倉庫。
- 存取不增加聲望。
- 存取不消耗行動。
- 公共倉庫無容量與重量限制。
- 存入與取出數量驗證正確。

### Milestone 7：總管府治理 modal（已完成）

**範圍**：總管府、跨據點政策切換與建料調度。

**完成條件**：

- 只有在有總管府的據點才能開啟 modal。
- 可查看所有據點政策、建料與狀態。
- 可切換目標據點政策。
- 可調度來源與目的據點建料。
- 目的據點不需要總管府。
- 調度損耗與建料上限正確套用。
- 操作成功後顯示結果並依規則結束回合。

### Milestone 8：事件建築條件（部分完成）

**範圍**：建築與探索事件選項的接合。

**完成條件**：

- 事件選項可要求指定建築或建築等級。
- 建築不足時選項可見但 disabled。
- 建築解法成功後效果、聲望與資源正確結算。（待完整接合驗收）
- 不同建築可以提供不同事件解法。（待完整接合驗收）

## 9. 測試計畫

### 9.1 規則單元測試

- 官階門檻與政策解鎖。
- 建築等級上限與固定功能建築排除。
- 建設聲望一次性發放。
- 政策效果計算。
- 驛站傳送條件與費用。
- 公共倉庫存取與跨據點共享。
- 總管府政策切換與建料調度。

### 9.2 GameStore 流程測試

- 成功操作只扣除或增加一次資源。
- 預覽、取消與失敗不改變資源。
- 官階不足時操作失敗。
- 玩家死亡、回合結束、Creature 行動期間操作失敗。
- 政策、建料、金錢、背包與位置狀態一致。
- blocking modal 確認前不推進不應推進的回合流程。

### 9.3 UI 驗收

- 不符合條件的按鈕顯示 disabled 與具體原因。
- 結果 modal 顯示政策、聲望、金錢、建料或位置變更。
- 商店、倉庫、驛站與總管府 modal 可取消且不修改狀態。
- 關閉 modal 後不遺留過期預覽。
- 玩家可清楚看到兩條路線進度。

## 10. 風險與處理

### 10.1 `gameStore.ts` 過大

- 新規則先寫入 `src/game/rules/`。
- `gameStore.ts` 只負責呼叫規則與更新狀態。
- 每個新 action 都要有對應 Store 測試。

### 10.2 政策效果散落

- 所有政策效果集中在 `policyRules.ts`。
- 禁止 UI 直接修改政策效果。
- 政策效果函式必須使用據點作為主要輸入。

### 10.3 個人與據點資料混淆

| 資料 | 所屬 |
|---|---|
| 聲望 | 玩家 |
| 官階 | 玩家 |
| 政策解鎖權 | 玩家 |
| 啟用政策 | 據點 |
| 建築等級 | 據點 |
| 建料 | 據點 |
| 公共倉庫 | 全局 |
| 玩家位置 | 玩家 |

### 10.4 固定功能建築被錯誤升級

- 以 `isFixedFunctionBuilding` 統一排除。
- UI 不顯示升級按鈕。
- Store action 再次驗證，不能只依賴 UI。

### 10.5 多據點共享資料一致性

- 公共倉庫使用單一全局資料源。
- 總管府調度必須使用單次狀態更新，避免來源已扣除、目的未增加。
- 跨據點政策切換確認時重新讀取最新據點狀態。

## 11. 工程驗收總表

- [x] 玩家可查看與累積個人聲望。
- [x] 官階門檻與政策解鎖正確。
- [x] 一般建築可升級，固定功能建築不可升級。
- [x] 建設操作成功後正確獲得聲望。
- [x] 基本、經濟、軍事、民生政策效果正確。
- [x] 道具商店與裝備商店依等級提供不同商品。
- [x] 驛站可支付少量金錢傳送到任意其他據點。
- [x] 交易所提供無容量限制的跨據點公共倉庫。
- [x] 總管府 modal 可管理所有據點政策與建料調度。
- [ ] 事件選項的建築／建築等級條件完整接合。（部分完成）
- [x] 全部規則測試、Store 測試與建置通過。

## 12. 實際驗收結果

- [x] 規則測試通過。
- [x] GameStore 流程測試通過。
- [x] 建設、升級與防禦設施聲望測試通過。
- [x] 政策、驛站、公共倉庫與總管府流程測試通過。
- [x] TypeScript 正式建置通過。
- [ ] 事件與建築條件完整接合，列為後續工作。

最新驗證基準：

- 32 個測試檔案通過。
- 238 個測試案例通過。
- `npm run build` 成功。

## 13. 後續功能紀錄

以下系統已在本專案後續開發中完成，但超出本文件原始範圍，應由專用設計文件維護：

- Creature 行為分類、流派、五維屬性與流派 Icon。
- Creature 目標優先級與攻城型據點攻擊。
- Creature 等級相關的經驗與金錢獎勵。
- 普通攻擊暴擊率與臂力效果調整。
- 體力制與玩家手動結束回合。
- 探索事件、道具點、Creature 巢穴與互動點生成。
- 多玩家、共享視野、存檔與讀檔。
- 防禦設施建造與 Creature 回合互動。
