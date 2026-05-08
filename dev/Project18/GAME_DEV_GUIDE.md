# 遊戲開發指引

本文件說明本專案如何區分 **遊戲骨架** 與 **擴充內容**。兩者職責不同，開發時不可混淆。

---

## 1. 名詞定義

### 1.1 遊戲骨架（Skeleton）

**最精簡、與具體劇本無關的架構**，包含：

- **主迴圈語意**：誰在行動、何時可以結束階段、如何換到下一位玩家。
- **狀態與 API**：賽局如何被查詢、如何透過唯一入口推進局面（例如選單葉結算）。
- **可擴充掛鉤**：固定種類的「空洞」，由擴充內容填入行為與數值，骨架負責呼叫順序與一致規則。

骨架回答的是：**「局面如何往前進」**，而不是「這一格發生什麼故事」。

### 1.2 擴充內容（Content）

掛在骨架上的 **具體規剘與資料**，例如：

- 某一張計策的結算公式與文案。
- 某一個格子事件的選項與獎懲。
- 關卡初始兵力／武將列表／棋盤長度與格子種類組態。
- **Ver1 規剘實作入口**：`impl_ver1/GameMatchVer1Ops.hx`（例如終局判定、本版移動如何決定步幅與可否移動）；由 `GameMatchCore` 委派呼叫，規剘細節可隨版本替換。

擴充內容回答的是：**「玩家這一步會體驗到什麼」**。

---

## 2. 完成標準（本專案約定）

> **只要骨架完成，遊戲即可視為「架構面上」完成。**

意思是：

- 主迴路已定義且穩定（移動 → 落地結算時機 → 事件／計策暫存 → 切片完成 → 確認換手）。
- 擴充內容可以 **僅藉由骨架公開的契約** 新增，不必修改主迴路控制流程。

之後的工作主要是 **增量擴充內容** 與平衡，而非重做核心架構。

擴充再多，若破壞了骨架與內容的界線，仍視為架構問題，應回到骨架層修正契約或掛鉤，而不是把流程寫死在單一事件腳本裡。

---

## 3. 在本專案中的對應（請對照目錄）

| 層級 | 典型位置 | 屬於 |
|------|----------|------|
| 契約（介面與語意） | `src/game/`（如 `IGameMatch`、`ITileEvent`、`IJiCe`、`PlayerMenuKind`） | **骨架** |
| 賽局編排與選單／結算總線 | `impl_ver1/GameMatchCore.hx`（誰來動、`applyMenuLeaf` 分派、暫存與換手時機） | **骨架** |
| Ver1 終局／移動等規剘 | `impl_ver1/GameMatchVer1Ops.hx`（`GameMatchCore` 委派至此；同套件 `@:allow` 僅便於讀寫賽局狀態，**語意上仍屬可替換的規剘**） | **擴充內容** |
| 具體計策／事件腳本 | 例如 `impl_ver1/LuoshiJiCe`、`debug_ver1/*TileEvent`（日後可遷到 `content/` 等命名空間） | **擴充內容** |
| 關卡組立 | `impl_ver1/Game.hx` 的 `level_key` 分支（「空白局」vs「某劇本」） | **擴充內容**（編排便當）；工廠介面仍屬骨架契約 |

**計策註冊**：具體計策類別在模組載入時向 `impl_ver1.JiCeRegistry.register` 登錄 spawn 閉包；`createJiCe` 每次 `spawn` 建新實例（無狀態牌語意等同 clone）。骨架檔不再 `switch` 具體計策類別。

**`force*` API**：`IGameMatch` 上此前綴的方法（如 `forceBindTileEvent`、`forceGetPendingTileEvent`）供除錯／測試／組局透視或注入；對局推進仍以 `createPlayerMenu`／`applyMenuLeaf` 為準。

### 3.1 `force*` / setter 命名與暴露規範（重要）

- **測試/除錯專用的介面方法才使用 `force*` 前綴**  
  - 例：`IGameMatch.forceSetCityOwner`、`IGameMatch.forcePutCityStores`、`IGameMatchGetter.forceGetPendingTileEvent`
  - 測試案例 **不可依賴具象類別 cast**（避免測試綁死 ver1 實作）；因此測試需要的「注入/透視」能力必須保留在 `IGameMatch`/`IGameMatchGetter` 的 `force*` API 內。

- **具象實作類別上的 setter 不加 `force`**  
  - 例：`impl_ver1.General.setStamina`
  - 原因：impl 端本來就知道具體類型與友元可見性，應直接呼叫具象 public/友元 private 方法，不把 setter 汙染到介面層。

- **只有「測試真的需要從介面呼叫 setter」時，才在介面新增 `force*` wrapper**  
  - 作法：在介面新增 `forceSetX(...)`，並在具象實作內把它 **綁定到非 force 方法**（例如 `forceSetX` 內部呼叫 `setX`）。  
  - 這樣可同時滿足：測試不 cast、介面不背負完整 setter 族、impl 仍保持自然命名。

- **impl 內 code 的使用準則**  
  - 規剘/內容若已拿到具象類（如 `GameMatchCore`、`General`）就 **直接呼叫非 force 方法**。  
  - `force*` 主要用於測試/除錯/組局階段的注入與透視；避免在一般規剘結算流程中濫用。

**判斷小技巧：**  
若拿掉某一個計策或事件類別後，主迴路仍可編譯且「換另一組內容」仍能跑通同樣流程，則該類別多半是 **擴充內容**。  
若拿掉後無法定義「如何結束暫存」「如何換手」，則屬 **骨架**。  
`GameMatchVer1Ops` 若改為另一套規剘模組（仍由 `GameMatchCore` 以同樣掛鉤呼叫），主迴路不變，故歸 **擴充內容**。

---

## 4. 開發規範：不可混淆

1. **骨架不應硬編特定劇本**  
   例如不要在 `GameMatchCore`／總線裡寫死某一事件的選項文字或某一計策的公式；應透過 `ITileEvent`／`IJiCe` 等實作注入。

2. **擴充內容不應繞過公開 API**  
   計策暫存應經 **`enterJiCeStaging`**／對應 **`IJiCe.buildPlayerMenu`**，並以 **`JiCeStagingSubmit`**＋表單結算（見 **`applyMenuLeaf`**）；格子事件應經 **`ITileEvent.buildPlayerMenu`** 與 **`TileEventPick`**，pending 清除由賽局在 **`resolveChoice`** 流程內統一處理，事件腳本不得自行維持「第二回合選單」狀態。避免從腳本篡改 **`GameMatchCore`** 私有欄位或複製一套平行主迴圈。

3. **同一個契約，多種實作**  
   計策暫存選將由骨架統一的 **`JiCeStagingSubmit`** 與節點內 **`MenuFormWidget.GeneralMultiPick`**（UI 就地改寫 **`selectedGeneralIds`**）結算；格子事件是否在 **`buildPlayerMenu`** 裡放武將複選、滑桿等 widget，由各路 **`ITileEvent`** 決定。UI 將複選／滑桿結果寫入即將送出之 **`IPlayerMenuNode#formWidgets`** 對應 enum 取值，**`applyMenuLeaf(actor, menuNode)`** 與 **`resolveChoice(actor, menuNode)`** 從該節點（含 **`activationEntry`**）讀取；不再有賽局第二階段「事件選將子選單」。預覽文案與數值規剘仍屬擴充內容。

4. **錯誤處理：規則拒絕必須用 `GameError`（重要）**  
   本專案需要同時支援「程式錯誤（bug）」與「玩家可理解的操作失敗（規則拒絕）」兩種錯誤來源，兩者處理方式不同：
   - **必須用 `GameError` 的情境（可預期、應回饋給玩家）**  
     - 資源不足：金／糧／兵不足、領地庫不足、投入數值超過可用等。  
     - 操作時機不合法：不是 active monarch、不是在對應的 pending 狀態（例如不在村落/城池拜訪、無 pendingResource 等）。  
     - 表單輸入不合法（弱語意情境）：例如「非強語意的 menu」或「非由 widget 產生之輸入」造成的負數/超界/未選等，視為規則拒絕，用 `GameError` 回饋。  
     - 選單 entry 被 disable：玩家點到不可用按鈕時，應以 `GameError` 告知（正式版可改為 UI 直接不觸發）。  
     - 以上錯誤應使用 `throw new GameError(message, popupTitle, ctxKey)`，讓 UI 以 popup 呈現、不中斷整局。
   - **不應用 `GameError` 的情境（屬程式 bug，應直接 throw 以利除錯）**  
     - 內部 invariant 破壞：狀態機不一致、unmatched patterns、internal routing、資料結構缺欄位等。  
     - 開發者環境/掛載錯誤：例如 mount element 不存在、必須存在的資源檔缺失等。  
     - 這類錯誤要保留一般 `throw`（或 `throw new Exception`）讓測試/console 立刻暴露問題。
   - **`ctxKey` 命名建議**  
     - 使用「模組/情境/原因」分段，例如：`village-trade/insufficient-gold`、`menu/not-active`、`dispatch/negative`。  
     - 目的：後續 UI 可依 `ctxKey` 做一致文案/在地化，也利於 log 聚合與測試定位。

5. **選單強語意（buildPlayerMenu / resolveChoice）與狀態變更歸因（重要）**  
   本專案對「表單式選單」（含 `MenuFormWidget` + `PlayerMenuKind.StagingSubmit`）採 **強語意** 約定，用以避免「UI 顯示可按，但 resolve 又拒絕」的錯誤體驗，並讓錯誤能快速歸因。
   - **強語意定義（enabled 的意義）**  
     - `buildPlayerMenu` 回傳之 submit entry 若 `enabled=true`，代表：在 **賽局狀態不變**（menu snapshot sig match），且使用者依該 menu 提供的 **widget 約束**（choices/slider 範圍等）提交時，`resolveChoice` **必須可成功執行**。  
     - 若在上述前提下仍失敗，視為 **menu 組裝/約束漏算** 或 **流程 bug**，應以 fail-fast 方式直接 `throw` 暴露問題（而不是吞成一般規則彈窗）。
   - **`resolveChoice` 的檢查順序（建議範式）**  
     - **先以「當下合法性」為準**：重新計算目前合法 choices/上下限（或直接檢查 pending/owner/kind/資源等），判斷本次提交是否仍合法。  
     - **sig 僅作歸因，不是 veto**：sig mismatch 不代表必拒絕；只有在「當下不合法」時，才用 mismatch 來區分是狀態變更或流程 bug。
   - **狀態變更錯誤：統一用 `StageChangeError`**  
     - 當「當下不合法」且判定為狀態變更（sig mismatch）時，應 `throw` `StageChangeError`（透過 `JiCeMenuSig.stateChangedError(...)` 建立）。  
     - 目的：讓 UI/測試/紀錄能用型別區分「合法的重試彈窗」（狀態變更）與其他規則拒絕（一般 `GameError`）。
   - **fail-fast 規則（sig match + 不合法/條件不符）**  
     - 當「當下不合法」但 sig match（或無法解析 sig）時，更像是 menu/widget 組裝錯誤或提交流程被竄改；此時應 **直接 `throw` 字串或例外**（非 `GameError`）以利開發期快速爆出。  
     - 例：`throw "XxxAction: invalid-choice (sig matched) — menu/widget mismatch";`
   - **常見錯誤使用（應避免）**  
     - **slider/widget 約束與 resolve 不一致**：  
       - 例：slider 設為 `0..max`，但 resolve 要求 `>0`；此時就算 `enabled=true`，使用者仍可提交 0 造成拒絕。  
       - 修正：把 slider 下限改為 1（或 submit disabled/限制輸入），讓「enabled + widget 約束」能保證成功。  
     - **只用 sig 判斷合法性**：sig 不是狀態檢查本體，`resolveChoice` 必須仍做「當下合法性」檢查（choices membership、pending/owner/kind/資源等）。  
     - **把狀態變更當成一般規則拒絕**：狀態變更應使用 `StageChangeError`，避免被誤認為需要修正規則或 UI 文案的 `GameError`。

6. **測試分層**  
   - 驗證主迴路與狀態機：`debug_ver1` 中以流程為主的測試。  
   - 驗證單一計策／事件數學或分支：應與該擴充模組鄰近，避免把大量數值断言塞進骨架測試。

---

## 5. 骨架責任簡表（對照意識）

| 骨架負責 | 擴充內容負責 |
|----------|----------------|
| `createPlayerMenu`／`applyMenuLeaf` 與選單節點／葉種類語意 | 各 `ITileEvent`／`IJiCe` 的選項與結算 |
| 內部暫存與切片是否可結束（對外除錯見 `forceGetPendingTileEvent` 等） | 兵力／糧食變動數值與條件 |
| `Move` 葉時委派規剘模組；環狀索引位移 API（`Monarch.advanceOnBoard`）與落地後 `settleAfterMoveLanding` 的銜接 | `GameMatchVer1Ops`：本版步幅、終局條件等；骰子結果、路網修正、動畫與演出 |
| 計策暫存：`enterJiCeStaging`、預覽列校驗與 **`JiCeStagingSubmit`**（節點 widgets）解析；事件無第二階段，武將 widget 與 **`TileEventPick`** 由 **`ITileEvent`** 自組 | 預覽列文案、`predicted` 語意、結算數值與事件選項機械鍵 |

---

## 6. 延伸閱讀

- 建置與執行：見專案根目錄 `README.md`。  
- 契約細節：直接閱讀 `src/game/IGameMatch.hx` 與 `ITileEvent.hx` 類別註解。
