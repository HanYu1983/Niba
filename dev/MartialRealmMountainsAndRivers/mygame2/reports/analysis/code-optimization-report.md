# 專案工程優化報告

## 1. 文件目的

- 提供給工程團隊的代碼優化依據。
- 聚焦概念混肴、重複實作、責任邊界不清與後續擴充風險。
- 本文件不修改遊戲規則，只定義優化方向、優先級與驗收方式。

## 2. 掃描範圍

- `src/game/types.ts`
- `src/game/gameStore.ts`
- `src/game/buildingActionRegistry.ts`
- `src/components/GameOverlays.tsx`
- `src/components/BuildingListModal.tsx`
- `src/components/BaseDetailsModal.tsx`
- `src/components/ActionResultModal.tsx`
- `src/components/RepairPreviewModal.tsx`
- `src/hooks/useModalState.ts`
- `src/App.tsx`

## 3. 目前判斷

- 專案功能已可運作，且已通過 `npm test`、`npm run lint`、`npm run build`。
- 目前最大問題不是功能缺失，而是概念邊界開始變厚，後續新增功能時會更容易產生重複邏輯與錯誤回流。
- 目前的優化重點應該是「收斂共享型別」、「拆分 store 職責」、「統一建築互動模型」、「減少 modal orchestration 膨脹」。

## 4. 核心問題總覽

### 4.1 共享型別與 UI 型別重複

- `ActionResult` 已經在共享型別區定義，但 `ActionResultModal` 又重新宣告一次。
- `RepairPreview`、`BlockingModal`、`GameOperation` 這些資料同時包含遊戲規則與 UI 流程資訊，概念上偏混雜。
- 這種重複短期可用，但會讓工程團隊很難判斷單一真實來源在哪裡。

### 4.2 `gameStore.ts` 職責過大

- `gameStore.ts` 同時處理回合流程、建造流程、修理流程、醫療流程、戰鬥流程、結果彈窗與可行動規則。
- 同一檔案既負責資料變更，也負責操作中介，長期維護風險高。
- 目前新增功能通常都需要回頭修改同一個核心檔，容易引入副作用。

### 4.3 建築系統概念分層仍不夠乾淨

- `buildingCatalog` 負責資料。
- `BaseBuilding.actions` 負責可宣告的操作。
- `buildingActionRegistry` 負責執行邏輯與可用性。
- 但 `gameStore` 仍直接以字串判斷 `board`、`workshop`、`infirmary`。
- 這代表建築系統仍有兩套入口：宣告式 registry 與硬編碼型別判斷。

### 4.4 Modal orchestration 集中化

- `GameOverlays.tsx` 已經變成所有 modal 的總控點。
- 這不是立即錯誤，但它已經承接太多不同流程：攻擊、外功、修理、任務、採集、結果、遊戲結束、建造與詳情。
- 若未來繼續擴張，這個檔案會成為高耦合熱點。

### 4.5 UI metadata 局部重複

- 建築名稱與效果已在 catalog 裡，但 icon mapping 仍在 `BuildingListModal` 內另外維護。
- `BaseDetailsModal`、`BuildingListModal` 兩邊都在描述據點建築，語氣與展示層級不同，但都在呈現同一類資訊。
- 這類重複雖然屬於 UI 層，但會讓後續樣式與文案不一致。

## 5. 優化優先級

### P0: 收斂共享型別

- 目標：讓 `ActionResult`、`RepairPreview`、`BlockingModal` 的來源單一化。
- 原因：這些型別會跨越 `store`、`modal`、`測試` 與 `App`，重複定義最容易引發維護分歧。
- 建議方向：把 shared result model 集中在單一檔案，元件只做 import，不再各自宣告。

### P0: 拆分 `gameStore` 核心責任

- 目標：把「規則計算」、「action 執行」、「preview 流程」、「回合切換」、「UI blocking 狀態」拆開。
- 原因：現在所有流程都在同一檔，後續任何調整都會增加回歸風險。
- 建議方向：先抽出純規則 helper，再抽出 action service，最後再考慮把 preview / result 流程獨立成 action layer。

### P1: 統一建築系統的單一入口

- 目標：讓建築功能只存在一條明確路徑：資料 catalog → action registry → store 執行。
- 原因：目前 `gameStore` 還有 `board`、`workshop`、`infirmary` 的直接判斷，與 registry 概念重疊。
- 建議方向：把建築可用性與執行條件盡量收進 registry 或 helper，避免 UI 與 store 各寫一套規則。

### P1: 縮小 `GameOverlays` 的總控責任

- 目標：讓 overlay 層只做掛載與轉接，不再寫太多流程決策。
- 原因：目前 modal 種類增加後，`GameOverlays` 會快速膨脹。
- 建議方向：把相近 modal 流程拆成子區塊或獨立 controller，例如結果彈窗、建築互動、戰鬥預覽。

### P2: UI metadata 集中化

- 目標：減少 icon、文案、標籤在多處重複維護。
- 原因：目前建築 icon 與部分展示詞仍散在 component 內。
- 建議方向：把建築展示資料補齊到 catalog 或獨立 view model。

## 6. 建議優化項目清單

### 6.1 共享型別收斂

| Task Item | Owner | Status | Priority | Deadline |
|---|---|---|---|---|
| 將 `ActionResult` 統一定義到共享型別來源 | 前端工程 | Pending | P0 | D+2 |
| 將 `RepairPreview`、`BlockingModal`、`ActionContinuation` 的資料責任分層 | 遊戲規則工程 | Pending | P0 | D+3 |
| 檢查各 modal / store / test 是否仍有本地重複型別 | 前端工程 | Pending | P0 | D+3 |

### 6.2 Store 拆分

| Task Item | Owner | Status | Priority | Deadline |
|---|---|---|---|---|
| 把可重用規則抽成純 helper 或 selector | 遊戲規則工程 | Pending | P0 | D+4 |
| 把 repair / heal / mission / building action 的流程統一成 action service | 遊戲規則工程 | Pending | P0 | D+5 |
| 評估 `gameStore.ts` 是否需要拆成 `combat`、`base`、`ui flow` 三層 | 架構負責人 | Pending | P1 | D+7 |

### 6.3 建築系統收斂

| Task Item | Owner | Status | Priority | Deadline |
|---|---|---|---|---|
| 統一據點建築的資料來源、操作來源與可用性判斷 | 遊戲規則工程 | Pending | P1 | D+4 |
| 移除 UI 內重複的建築 icon / label map | 前端工程 | Pending | P2 | D+4 |
| 檢查 `BaseDetailsModal` 與 `BuildingListModal` 的資訊層級是否可再整理 | UI 工程 | Pending | P2 | D+5 |

### 6.4 Overlay 與 modal 組織

| Task Item | Owner | Status | Priority | Deadline |
|---|---|---|---|---|
| 將 `GameOverlays` 的 modal 群組拆成更小區塊 | 前端工程 | Pending | P1 | D+6 |
| 定義 result modal 的共用契約，避免各 modal 自行定義結構 | 前端工程 | Pending | P0 | D+3 |
| 檢查修理預覽、行動結果、遊戲結束的 UI 文案格式是否一致 | UI 工程 | Pending | P2 | D+5 |

## 7. 驗收標準

### Milestone A: 型別收斂完成

- Acceptance Criteria
	- `ActionResult` 只有單一來源。
	- `RepairPreview`、`BlockingModal` 的資料結構不再在 component 內重複宣告。
	- 新增一個 modal 時，不需要再複製型別。
- Test Method
	- TypeScript compile。
	- 相關元件與 store 的型別檢查。
- Result
	- 預期可降低 modal 與 store 的資料歧義。

### Milestone B: Store 責任拆分完成

- Acceptance Criteria
	- 可重用規則抽成純函式或 helper。
	- 修理、就醫、任務、建築操作至少有統一的流程層。
	- `gameStore.ts` 的單檔密度下降。
- Test Method
	- `npm test`
	- `npm run lint`
	- `npm run build`
- Result
	- 預期可降低回歸與 cross-cutting change 成本。

### Milestone C: 建築與 modal 邊界收斂完成

- Acceptance Criteria
	- 建築資料、建築行為、UI 展示不再互相重複描述。
	- `GameOverlays` 只保留組裝與轉接邏輯。
	- 建築圖示與文案有單一維護位置。
- Test Method
	- 重新跑現有測試與建置。
	- 檢查建築相關 UI 操作是否維持原行為。
- Result
	- 預期可提升後續擴充性與可讀性。

## 8. 風險說明

- 這份報告不建議一次重構所有檔案，否則會讓回歸範圍過大。
- 優先順序應該是：型別收斂 → store 拆分 → 建築系統收斂 → modal 層再整理。
- 若工程團隊只能先做一件事，建議先處理共享型別與 `gameStore` 職責切分，這兩項對後續所有功能都有影響。

## 9. 結論

- 目前專案不是寫錯，而是概念邊界開始混在一起。
- 最明顯的技術債務是共享型別重複、`gameStore` 過度集中、建築行為入口重疊、以及 `GameOverlays` 的總控膨脹。
- 若工程團隊依照本文件先做架構優化，後續新增防禦建築、修理、事件與結果彈窗會更穩定，也更容易維護。

## 10. 預計修改項目

> 本章節是工程實作清單。修改時應維持目前遊戲規則與既有操作流程，除非任務另有明確規格。

### 10.1 Phase 0：建立重構基線

- [ ] 確認目前基線指令可通過：`npm test`、`npm run lint`、`npm run build`。
- [ ] 記錄目前測試數量、建置結果與既有 bundle size warning。
- [ ] 確認重構前後 `gameStore` 對外 action 名稱與回傳型別不變。
- [ ] 先補充建築、修理、醫療、任務的成功與失敗案例測試。
- [ ] 將所有預計修改的 action 列出對應測試，避免重構後只驗證 TypeScript。

### 10.2 Phase 1：統一共享型別

#### 預計修改檔案

- `src/game/types.ts`
- `src/components/ActionResultModal.tsx`
- `src/game/gameStore.ts`
- 相關測試檔案

#### 預計修改內容

- [ ] 保留 `src/game/types.ts` 的共享 `ActionResult` 定義。
- [ ] 移除 `ActionResultModal.tsx` 內重複的 `ActionResult` 型別宣告，改為 import type。
- [ ] 檢查 `RepairPreview`、`BlockingModal`、`ActionContinuation` 是否存在其他本地重複型別。
- [ ] 維持 `gameStore` 既有 re-export，避免一次改動所有 import 路徑。
- [ ] 不在此階段改變 `GameState` 欄位名稱或 modal 流程。

#### 驗收條件

- [ ] `ActionResult` 在專案內只有一個正式定義。
- [ ] `ActionResultModal`、`GameOverlays` 與 `gameStore` 使用相同型別。
- [ ] `npm test`、`npm run lint`、`npm run build` 通過。

### 10.3 Phase 2：抽離純規則 helper

#### 預計新增檔案

- `src/game/rules/baseRules.ts`
- `src/game/rules/defenseRules.ts`
- `src/game/rules/movementRules.ts`
- `src/game/rules/playerRules.ts`

#### 預計修改內容

- [ ] 將據點建料上限、資源採集加成、據點生命加成抽離至 `baseRules.ts`。
- [ ] 將防禦設施建造範圍、位置佔用與建料驗證抽離至 `defenseRules.ts`。
- [ ] 將 BFS 移動成本與可到達格計算抽離至 `movementRules.ts`。
- [ ] 將玩家可行動、玩家死亡、目前玩家與回合狀態判斷抽離至 `playerRules.ts`。
- [ ] 純 helper 不得直接讀取或修改 module-level `gameState`。
- [ ] `gameStore.ts` 初期只 import helper，不改變既有 action API。
- [ ] 第一階段只移動純函式，不改變任何 component 的呼叫方式或狀態結構。
- [ ] 若某個 helper 抽離後會牽動過多 import 或測試，應拆成更小步驟，不要一次搬完。

#### 驗收條件

- [ ] 抽離後 helper 可使用獨立輸入進行單元測試。
- [ ] 建造、移動、採集、戰鬥的既有結果不變。
- [ ] 既有測試全部通過，並新增至少一組邊界案例測試。
- [ ] helper 抽離後，`gameStore.ts` 仍可維持原本對外 API 與流程順序。

### 10.4 Phase 3：統一據點建築 action

#### 預計修改檔案

- `src/game/types.ts`
- `src/game/buildingActionRegistry.ts`
- `src/game/gameStore.ts`
- `src/components/BuildingListModal.tsx`
- `src/App.tsx`

#### 預計修改內容

- [ ] 明確區分建築 action 的 UI metadata 與遊戲規則驗證。
- [ ] `buildingActionRegistry` 保留 action id、label、icon、顯示用 availability 資訊。
- [ ] `gameStore` 保留最終權威驗證與狀態變更。
- [ ] 所有建築 action 在 store 執行時重新驗證，不能只依賴 UI disabled 狀態。
- [ ] 將 `board`、`workshop`、`infirmary` 的重複存在性判斷整理成共用 helper。
- [ ] 保留目前 `mission`、`heal`、`repair` 的功能與操作入口。
- [ ] 不將 UI callback 直接當成 domain action，避免 registry 與 React 層耦合。
- [ ] 第一輪先統一驗證入口與共用 helper，暫不追求把所有建築 action 完全域模型化。
- [ ] 若 registry 與 store 之間出現設計拉扯，優先保留 store 作為最終驗證點。

#### 必須保留的安全規則

- [ ] 玩家不在據點相鄰位置時不可執行。
- [ ] 玩家死亡或回合已結束時不可執行。
- [ ] Creature 回合中不可執行。
- [ ] 修理確認時重新檢查玩家位置、金錢、裝備耐久與修理工坊。
- [ ] action 失敗時不扣除資源、不結束回合、不顯示成功結果。

#### 驗收條件

- [ ] UI availability 與 store 最終驗證使用同一套規則 helper。
- [ ] 修理、就醫、任務的成功與失敗測試通過。
- [ ] 預覽過期時，確認操作不會錯誤扣款或結束回合。

### 10.5 Phase 4：集中建築展示 metadata

#### 預計修改檔案

- `src/game/types.ts` 或新增建築展示資料檔案
- `src/components/BuildingListModal.tsx`
- `src/components/BaseDetailsModal.tsx`

#### 預計修改內容

- [ ] 移除 `BuildingListModal.tsx` 內獨立的 `buildingIcons` 重複映射。
- [ ] 建立建築 icon 的單一來源。
- [ ] 檢查建築名稱、描述、成本與狀態標籤是否由同一份資料產生。
- [ ] 區分 domain building data 與純 UI view metadata，避免過度把 antd 或 React 型別放進遊戲規則層。
- [ ] 統一 `BaseDetailsModal` 與 `BuildingListModal` 的資訊層級：詳情 modal 顯示摘要，列表 modal 顯示建造與操作。
- [ ] 若 icon 或 label 的共用資料會造成型別膨脹，先保留最小可用的共用表，不要過度抽象。

#### 驗收條件

- [ ] 建築 icon 不再於多個 component 重複宣告。
- [ ] 建築 catalog 變更後，列表與詳情不會出現名稱或圖示不一致。
- [ ] UI 樣式與操作功能維持不變。

### 10.6 Phase 5：拆分 `GameOverlays`

#### 預計新增檔案

- `src/components/overlays/CombatOverlays.tsx`
- `src/components/overlays/BaseOverlays.tsx`
- `src/components/overlays/WorldObjectOverlays.tsx`
- `src/components/overlays/PlayerOverlays.tsx`
- `src/components/overlays/SystemOverlays.tsx`

#### 預計修改內容

- [ ] 將攻擊預覽、外功預覽、Creature 行動紀錄歸入 `CombatOverlays`。
- [ ] 將建築列表、防禦建造、修理、任務、就醫相關 modal 歸入 `BaseOverlays`。
- [ ] 將資源點、道具點、巢穴、探索事件與防禦設施詳情歸入 `WorldObjectOverlays`。
- [ ] 將背包、裝備、技能 modal 歸入 `PlayerOverlays`。
- [ ] 將遊戲結束與行動結果歸入 `SystemOverlays`。
- [ ] `GameOverlays.tsx` 只負責組裝各 overlay 群組與傳遞必要 props。
- [ ] 不在拆分過程中更改 `useModalState` 的狀態語意。
- [ ] 先以功能群組整理內部區塊，只有在檔案持續膨脹時，再把群組拆成獨立元件。

#### 驗收條件

- [ ] 所有 modal 開關行為與目前一致。
- [ ] preview 清除、blocking modal continuation 與回合結束時機不變。
- [ ] modal 拆分後 ESLint、TypeScript、測試與 build 全部通過。
- [ ] 若拆分後 props 傳遞過深，優先停在群組整理，不強行再切更細。

### 10.7 Phase 6：分階段拆分 `gameStore`

#### 預計新增檔案

- `src/game/actions/baseActions.ts`
- `src/game/actions/defenseActions.ts`
- `src/game/actions/equipmentActions.ts`
- `src/game/actions/combatActions.ts`
- `src/game/actions/turnActions.ts`

#### 預計修改內容

- [ ] 先將 action implementation 抽成接收 state、回傳 next state/result 的函式。
- [ ] 由既有 `gameStore` facade 呼叫新 action module。
- [ ] 保留 `gameStore.constructBuilding()`、`gameStore.previewRepair()`、`gameStore.executeRepair()` 等既有 API。
- [ ] 不直接建立多個互相獨立、各自持有 state 的 store。
- [ ] 不在此階段改變 `GameState` 的所有權或 React 訂閱方式。
- [ ] 待 action module 穩定後，再評估是否需要進一步拆分 store facade。
- [ ] Phase 6 只作為長期目標，不納入第一輪必交範圍。
- [ ] 如果前面 Phase 1 到 Phase 5 仍能維持可讀性與測試穩定，Phase 6 可以延後處理。

#### 驗收條件

- [ ] 外部 component 不需要知道 action module 的內部位置。
- [ ] 所有 state mutation 仍經過單一更新流程。
- [ ] action result、continuation、preview 清除行為維持原本語意。
- [ ] 測試覆蓋成功、失敗、重複執行與過期 preview。
- [ ] 若拆分 action module 的收益不足以抵銷搬移成本，允許暫停在 facade 內部整理層級。

## 11. 明確暫不修改項目

- [ ] 暫不改變 `GameState` 的主要欄位命名。
- [ ] 暫不把 `GameOperation` 完全移出 `GameState`。
- [ ] 暫不把 `RepairPreview` 改成純 component local state。
- [ ] 暫不建立多個獨立 store。
- [ ] 暫不改變任務、就醫、修理、建造與 Creature 戰鬥規則。
- [ ] 暫不處理防禦設施維修、拆除與建料回收等尚未規格化功能。
- [ ] 暫不以 code splitting 作為本次核心重構的一部分。

## 12. 預計修改順序與提交策略

- [ ] Commit 1：補充基線測試與失敗案例。
- [ ] Commit 2：統一共享型別。
- [ ] Commit 3：抽離純規則 helper。
- [ ] Commit 4：整理建築 action 驗證與 registry 邊界。
- [ ] Commit 5：集中建築 metadata。
- [ ] Commit 6：拆分 `GameOverlays`。
- [ ] Commit 7：視前面階段成果，再決定是否抽離 `gameStore` action modules。
- [ ] 每個 commit 都必須至少通過 `npm test`、`npm run lint`、`npm run build`。
- [ ] 任一階段出現遊戲規則結果改變，應先停止後續重構並回退該階段。

## 13. 已完成優化進度

### 13.1 第一批：共享型別與據點規則

- [x] 移除 `ActionResultModal.tsx` 內重複的 `ActionResult` 型別宣告。
- [x] 保留 `src/game/types.ts` 作為 `ActionResult` 的單一正式來源。
- [x] 新增 `src/game/rules/baseRules.ts`。
- [x] 將據點建料上限、資源採集加成、據點生命與防衛營生命加成計算移至 `baseRules.ts`。
- [x] 保留 `gameStore` 原有 re-export 與外部 API。
- [x] 新增修理預覽、金錢不足、離開據點的回歸測試。

### 13.2 第二批：防禦與移動規則

- [x] 新增 `src/game/rules/defenseRules.ts`。
- [x] 將防禦設施建造位置、範圍、地形、建料與佔用驗證移至 `defenseRules.ts`。
- [x] 新增 `src/game/rules/movementRules.ts`。
- [x] 將 BFS 移動成本、可達格與目標移動成本計算移至 `movementRules.ts`。
- [x] 保留 `gameStore` 原有 `getDefenseBuildValidation`、`getReachableCellIds` 與相關 API。
- [x] 新增規則邊界測試，涵蓋封鎖格、體力範圍、建料不足與位置佔用。

### 13.3 第三批：建築 action 與修理規則

- [x] 新增 `src/game/rules/buildingRules.ts`。
- [x] 將 `hasBuilding` 與相鄰且未結束回合判斷集中管理。
- [x] 將修理耐久、裝備數量與金錢成本計算集中至 `getRepairSummary`。
- [x] 將裝備全滿耐久處理集中至 `repairEquipmentInventory`。
- [x] `buildingActionRegistry.ts` 不再依賴 `gameStore.ts`，改依賴純規則模組。
- [x] `gameStore` 修理預覽與確認流程改用同一套修理計算規則。
- [x] 修理確認仍會重新驗證據點、修理工坊、玩家位置、耐久與金錢。
- [x] 保留 `EQUIPMENT_REPAIR_COST_PER_POINT` 的 `gameStore` re-export 相容性。

### 13.4 第四批：建築展示 metadata 與 registry 測試

- [x] 新增 `src/game/buildingViewData.ts`，集中管理據點建築 icon。
- [x] `BuildingListModal.tsx` 改用共用建築 icon helper。
- [x] `BaseDetailsModal.tsx` 改用共用建築 icon helper。
- [x] 不將 antd、React 或 component 型別放入 `BaseBuilding` domain model。
- [x] 移除 `BuildingListModal.tsx` 內重複的 `buildingIcons` map。
- [x] 新增 `buildingActionRegistry.test.ts`。
- [x] 補充告示牌任務、醫療室與修理工坊 availability 測試。
- [x] 驗證回合結束、金錢不足、沒有修理工坊等狀態會正確 disabled。

### 13.5 第五批：低風險建築一致性與 metadata 測試

- [x] `buildingActionRegistry` 的 mission availability 會確認據點擁有告示牌。
- [x] `buildingActionRegistry` 的 heal availability 會確認據點擁有醫療室。
- [x] 缺少必要建築時，availability 會回傳明確 disabled reason。
- [x] 新增 `buildingViewData.test.ts`，驗證已知建築 icon 與未知建築 fallback icon。
- [x] 擴充 `buildingActionRegistry.test.ts`，涵蓋缺少告示牌與缺少醫療室。
- [x] 檢查 `GameOverlays.tsx` 的拆分成本後，暫不進行大型 props 重組。
- [x] 保留 `GameOverlays` 現有掛載方式，避免低收益重構造成 modal 流程回歸。

### 13.6 本階段驗證結果

- [x] `npm test`：74 tests passed。
- [x] `npm run lint`：通過。
- [x] `npm run build`：通過。
- [x] TypeScript diagnostics：無錯誤。
- [ ] Vite bundle size warning：仍待後續處理，未列入本階段核心重構。

### 13.7 第六批：視野與目標解析規則

- [x] 新增 `src/game/rules/visibilityRules.ts`。
- [x] 將玩家視野、據點視野、瞭望塔視野與 explored cell 合併規則移至 `visibilityRules.ts`。
- [x] 保留 `gameStore` 原有視野常數與 helper re-export。
- [x] 新增 `src/game/rules/targetRules.ts`。
- [x] 將 Creature、巢穴、資源點、探索事件與移動目標解析移至 `targetRules.ts`。
- [x] `gameStore` 仍負責 `getActionablePlayer`，target rules 不重複實作回合、死亡與 blocking modal 驗證。
- [x] 保留 `gameStore` 原有 target helper 呼叫方式與 action API。
- [x] 新增視野規則測試，涵蓋玩家視野、瞭望塔視野與探索格合併。
- [x] 新增 target rules 測試，涵蓋存活目標、相鄰條件、已採集資源點與事件狀態。

### 13.8 第六批驗證結果

- [x] `npm test`：81 tests passed。
- [x] TypeScript diagnostics：無錯誤。
- [x] `npm run lint`：通過。
- [x] `npm run build`：通過。
- [ ] Vite bundle size warning：仍存在，屬於後續效能優化項目。

### 13.9 第七批：結果 formatter 與玩家純規則

- [x] 新增 `src/game/actionResultFormatters.ts`。
- [x] 將修理、普通攻擊、外功、資源採集與任務結果文案抽成純 formatter。
- [x] `GameOverlays.tsx` 保留 action 執行與 continuation，只委託結果資料組合。
- [x] 將掉落顯示文字抽成共用 `formatLootLabel`。
- [x] 簡化 `getPlayerVisionRange` 的冗餘條件，保留既有 selector API。
- [x] 新增 `src/game/rules/playerRules.ts`。
- [x] 將玩家回合恢復、最低傷害與 Creature 去重規則移至 `playerRules.ts`。
- [x] 隨機戰利品產生與裝備 instance ID 分配仍保留在 `gameStore`，避免改變副作用生命週期。
- [x] 新增 formatter 與 player rules 單元測試。

### 13.10 第七批驗證結果

- [x] `npm test`：87 tests passed。
- [x] TypeScript diagnostics：無錯誤。
- [x] `npm run lint`：通過。
- [x] `npm run build`：通過。
- [ ] Vite bundle size warning：仍存在，屬於後續效能優化項目。

### 13.11 第八批：完整 Action Result formatter

- [x] 新增防禦建造結果 formatter。
- [x] 新增道具使用結果 formatter。
- [x] 新增道具點撿取結果 formatter。
- [x] 新增探索事件結果 formatter。
- [x] `GameOverlays.tsx` 不再直接組合上述四類結果文案。
- [x] 補充防禦建造成本、道具使用、道具點撿取與探索事件 formatter 測試。

### 13.12 第九批：防禦建造成本單一來源

- [x] 移除 `actionResultFormatters.ts` 內重複的防禦建築成本 mapping。
- [x] `formatDefenseStructureBuildResult` 改為接收 `DefenseStructureDefinition`。
- [x] 防禦建造結果直接使用 `definition.constructionCost`。
- [x] `GameOverlays.tsx` 從 `defenseStructureCatalog` 取得正式建築定義。
- [x] formatter 測試改為使用 `defenseStructureCatalog`，不再自行重複定義成本。
- [x] 修正 `GameOperation` narrowing，保留建造 operation 的區域 snapshot。

### 13.13 第九批驗證結果

- [x] `npm test`：89 tests passed。
- [x] `npm run lint`：通過。
- [x] `npm run build`：通過。
- [x] TypeScript diagnostics：無錯誤。
- [ ] Vite bundle size warning：仍存在，屬於後續效能優化項目。

### 13.14 後續項目評估結果

- [x] 建築名稱、描述與建造成本維持由 `buildingCatalog` 單一來源提供。
- [x] 不另建立完整的建築 view model，避免名稱、描述與成本產生第二份資料來源。
- [x] 建築 icon 維持由 `buildingViewData.ts` 管理，因其屬於展示 metadata。
- [x] `GameOverlays` 目前先維持既有掛載方式，不立即進行多檔案拆分。
- [x] `lootRules` 暫不抽離，等待隨機來源與裝備 instance ID 注入方式明確化。
- [ ] 下一個建議優化目標：評估新增 `src/game/rules/equipmentRules.ts`。
- [ ] `equipmentRules.ts` 預計先處理裝備 loadout 套用、耐久扣除與衍生屬性重算。
- [ ] 完整 `gameStore` action module 拆分維持長期目標，不列入下一個低風險批次。

### 13.15 第十批：裝備純規則抽離

- [x] 新增 `src/game/rules/equipmentRules.ts`。
- [x] 將裝備 loadout 套用與衍生屬性重算移至 `equipmentRules.ts`。
- [x] 將裝備耐久扣除與指定 slot 更新移至 `equipmentRules.ts`。
- [x] `gameStore` 保留原有 equip、unequip、攻擊與受擊流程及對外 API。
- [x] 裝備資源超過新上限時仍會正確裁切。
- [x] 無指定 slot 裝備時維持 no-op 行為。
- [x] 新增 `equipmentRules.test.ts`，覆蓋 loadout、衍生上限與耐久扣除。

### 13.16 第十批驗證結果

- [x] `npm test`：92 tests passed。
- [x] TypeScript diagnostics：無錯誤。
- [x] `npm run lint`：通過。
- [x] `npm run build`：通過。
- [ ] Vite bundle size warning：仍存在，屬於後續效能優化項目。

### 13.17 第十一批：世界生成與角色工廠抽離

- [x] 新增 `src/game/characterFactory.ts`。
- [x] 將 `createCharacterState`、`applyExperienceAndLevelUp`、`restoreAfterAttributeChange` 移至 `characterFactory.ts`。
- [x] 新增 `src/game/worldGeneration.ts`。
- [x] 將地形 noise、`createMapCells`、`createRandomBases`、`createCreatureNests`、`createRandomPositions`、`createItemPoints`、`createResourcePoints`、`getRandomFreeInteractionPosition`、`replenishInteractionPoint` 移至 `worldGeneration.ts`。
- [x] 新增 `createRoamerCreatures` 與 `createInitialPlayers`，集中開局角色生成。
- [x] `gameStore.ts` 改為 import 新模組，移除約 576 行世界生成與角色工廠邏輯。
- [x] `gameStore.ts` 行數由 1865 降至 1289。
- [x] 保留 `gameStore` 既有 `createGameState`、`createDebugGameState` 與對外 API。
- [x] 新增 `worldGeneration.test.ts`，涵蓋地圖生成、據點距離、隨機位置排除、巢穴、道具點、資源點、游蕩 Creature、初始玩家、互動點補點與地圖全滿邊界。
- [x] 新增 `characterFactory.test.ts`，涵蓋衍生上限、裝備 loadout、行為類型保留、經驗升級與屬性重置。

### 13.18 第十一批驗證結果

- [x] `npm test`：277 tests passed（新增 31 個測試案例）。
- [x] TypeScript diagnostics：無錯誤。
- [x] `npm run lint`：新檔案無錯誤；既有 `CreatureNestDetailsModal`、`MartialHallModal` 與 `gameStore` 的 `useInfirmaryAction` 命名警告為既有問題，非本批次引入。
- [x] `npm run build`：通過。
- [ ] Vite bundle size warning：仍存在，屬於後續效能優化項目。

### 13.19 第十二批：拆分 `GameOverlays`

- [x] 新增 `src/components/overlays/CombatOverlays.tsx`，集中攻擊預覽、外功預覽、Creature 行動紀錄與 Creature 指令面板。
- [x] 新增 `src/components/overlays/BaseOverlays.tsx`，集中建築列表、商店、武館、政策、倉庫、傳送、區域管理、防禦建造、資源採集、任務獎勵與修理預覽。
- [x] 新增 `src/components/overlays/WorldObjectOverlays.tsx`，集中據點、資源點、巢穴、道具點、探索事件與防禦設施詳情。
- [x] 新增 `src/components/overlays/PlayerOverlays.tsx`，集中背包、裝備與技能 modal。
- [x] 新增 `src/components/overlays/SystemOverlays.tsx`，集中遊戲結束與行動結果彈窗。
- [x] `GameOverlays.tsx` 改為只組裝各 overlay 群組並轉傳 props，不再直接組合 modal 流程。
- [x] `GameOverlays.tsx` 行數由 585 降至 227。
- [x] 各 overlay 群組維持既有 modal 開關行為、preview 清除、blocking modal continuation 與回合結束時機。
- [x] `useModalState` 的狀態語意與 `App.tsx` 的 props 傳遞方式不變。

### 13.20 第十二批驗證結果

- [x] `npm test`：277 tests passed。
- [x] TypeScript diagnostics：無錯誤。
- [x] `npm run lint`：新 overlay 檔案無錯誤；既有 `CreatureNestDetailsModal`、`MartialHallModal` 與 `gameStore` 的既有警告非本批次引入。
- [x] `npm run build`：通過。
- [ ] Vite bundle size warning：仍存在，屬於後續效能優化項目。

### 13.21 第十三批：建料採集規則修正

修正據點建料採集的三個規則缺陷，讓民生政策與建料倉庫加成正確生效。

#### 修正項目

- [x] **被動建料收入未套用民生政策加成**：`turnActions.ts` 的回合結算被動收入原先直接使用原始收入，未呼叫 `getEffectivePassiveMaterialIncome`。修正後民生政策（+10%）會正確套用。
- [x] **主動採集未套用民生政策加成**：`explorationActions.ts` 的 `collectResourcePoint` 原先只套用建築加成（`getResourceCollectionMaterialGain`），未套用政策加成。修正後先計算建築加成，再套用 `getEffectiveMaterialGain`。
- [x] **被動收入上限未含倉庫加成**：`turnActions.ts` 原先用 `base.maxBuildingMaterials` 截斷，修正後改用 `getBaseMaxBuildingMaterials(base)`（含倉庫 `materialCapacityBonus`）。
- [x] **主動採集上限未含倉庫加成**：`explorationActions.ts` 同上修正。
- [x] **建料調度上限使用來源據點基礎上限**：`regionalManagementRules.ts` 的 `canTransferMaterials` 原先用 `source.maxBuildingMaterials` 作為目的據點容量檢查，修正後改用 `getBaseMaxBuildingMaterials(target)`（目的據點含倉庫加成的實際上限）。

#### 修改檔案

- `src/game/actions/turnActions.ts` — 被動收入套用政策加成與倉庫上限。
- `src/game/actions/explorationActions.ts` — 主動採集套用政策加成與倉庫上限。
- `src/game/rules/regionalManagementRules.ts` — 調度容量改用目的據點含倉庫加成的上限。

#### 新增回歸測試

- [x] `gameStore.test.ts`：民生政策提高主動採集量（10 → 11）。
- [x] `gameStore.test.ts`：建料倉庫上限允許主動採集超過基礎上限（98 + 10 = 108，上限 150）。
- [x] `gameStore.test.ts`：民生政策提高回合被動建料收入（2.5 → 3）。
- [x] `gameStore.test.ts`：建料倉庫上限允許被動收入超過基礎上限（99 + 2.5 = 101.5，上限 150）。
- [x] `regionalManagementRules.test.ts`：目的據點建料倉庫提高調度上限（95 + 18 = 113，基礎上限 100 會拒絕但倉庫上限 150 允許）。

### 13.22 第十三批驗證結果

- [x] `npm test`：282 tests passed（新增 5 個回歸測試）。
- [x] TypeScript diagnostics：無錯誤。
- [x] `npm run lint`：修改檔案無新錯誤。
- [x] `npm run build`：通過。
- [ ] Vite bundle size warning：仍存在，屬於後續效能優化項目。

### 13.23 第十三批補充：被動建料收入被 Creature 動畫覆蓋修正

#### 問題根因

第十三批修正了 `turnActions.ts` 的被動建料收入計算後，發現收入仍無法在遊戲中生效。
根因在於 `creatureAnimation.ts` 的動畫流程：

1. `endPlayerTurn` 透過 `updateGameState` 同步寫入被動建料收入到 `state.bases`。
2. 隨後 `animateCreatureTurn` 啟動逐隻 Creature 動畫。
3. 動畫的中間步驟與最終步驟皆以 `result.bases`（`moveCreatures` 回傳的攻擊前 snapshot）覆蓋 `state.bases`。
4. 由於 `result.bases` 不含被動建料收入，回合結算結果被舊 snapshot 完全覆蓋。

#### 修正方式

- [x] 新增 `mergeCreatureAttackBases` helper，以 `state.bases`（含被動收入）為底，僅套用 Creature 攻擊造成的據點血量變動。
- [x] `creatureAnimation.ts` 中間步驟改用 `mergeCreatureAttackBases`，不再以 `step.bases ?? result.bases` 直接覆蓋。
- [x] `creatureAnimation.ts` 最終步驟改用 `mergeCreatureAttackBases`，保留被動建料收入。
- [x] 空步驟路徑（`steps.length === 0`）原本已使用 `state.bases`，維持不變。

#### 修改檔案

- `src/game/creatureAnimation.ts` — 新增 `mergeCreatureAttackBases`，中間與最終步驟改用合併邏輯。

#### 新增回歸測試

- [x] `creatureAnimation.test.ts`：回合結算的被動建料收入不被 Creature 動畫覆蓋（2.5 保留）。
- [x] `creatureAnimation.test.ts`：Creature 攻擊造成的據點血量變動仍保留（450 → 400），且建料不被覆蓋。

### 13.24 第十三批補充驗證結果

- [x] `npm test`：284 tests passed（新增 2 個回歸測試）。
- [x] TypeScript diagnostics：無錯誤。
- [x] `npm run build`：通過。
- [ ] Vite bundle size warning：仍存在，屬於後續效能優化項目。

## 14. 目前剩餘項目

- [x] 檢查並集中建築 icon、名稱與展示 metadata。
- [x] 集中建築 icon metadata。
- [x] 評估建築名稱與描述是否需要獨立 view model；結論：維持 `buildingCatalog` 單一來源，不另建完整 view model。
- [x] 視 `GameOverlays.tsx` 後續膨脹程度，進行功能群組整理；已完成拆分為 CombatOverlays、BaseOverlays、WorldObjectOverlays、PlayerOverlays、SystemOverlays。
- [x] 補強建築 action registry 的 availability 測試與必要建築驗證。
- [x] 補強建築 action registry 的基礎 availability 測試。
- [x] 評估是否需要將更多 `gameStore` 純 helper 移至 rules 模組；已完成 `equipmentRules.ts`。
- [x] 抽離世界生成與角色工廠至 `worldGeneration.ts` 與 `characterFactory.ts`。
- [ ] `gameStore` action module 拆分仍維持長期目標，不列入下一個必做批次。
- [x] 抽離視野純規則。
- [x] 抽離 Creature、巢穴、資源點、探索事件與移動 target resolver。
- [x] 完成 `GameOverlays` 結果 formatter 的局部整理。
- [x] 抽離 `GameOverlays` 結果 formatter。
- [x] 抽離玩家恢復、最低傷害與 Creature 去重純規則。
- [x] 評估 `lootRules`；結論：暫不抽離，先保留於 `gameStore`，等待隨機來源與裝備 instance ID 注入方式明確化。
- [x] 暫不進行完整 `gameStore` action module 拆分與 bundle code splitting；`GameOverlays` 拆檔已完成。
- [x] 防禦建造成本使用 `DefenseStructureDefinition.constructionCost` 單一來源。
