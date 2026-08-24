# UI 模組 (src/ui)

此資料夾集中放置**視圖 (View)** 相關程式碼，方便 UI 工程師專注在介面與互動，而不必改動主流程與業務邏輯。

## 模組說明

| 檔案 | 職責 |
|------|------|
| **Common.elm** | 共用輔助：`displayName`（中英文名稱）、`slotTagName`（武器槽標籤字串） |
| **LobbyView.elm** | 大廳畫面：商店／持有／編成／出擊小隊、買賣與裝備按鈕 |
| **StrategyView.elm** | 策略畫面：任務列表、任務詳情、派擊選擇 |
| **CombatView.elm** | 戰鬥畫面：地圖格、當前單位、指令選單、目標選擇、勝負結果 |

## 依賴關係

- 所有 UI 模組依賴 **Types**（資料型別）、**Messages**（GameMsg 訊息建構子）。
- LobbyView 另依賴 **Lobby**（裝配合法性、finalHp 等）。
- CombatView 另依賴 **Combat**（當前單位、可移動格、目標列表）、**Lobby**（finalHp）。
- 視圖一律回傳 `Html GameMsg`，事件透過 `onClick` 等送出 `GameMsg`，由 **Main** 的 `update` 處理。

## 修改 UI 時

1. **只改版面／樣式**：在對應的 `Ui.*View.elm` 或 `index.html` 的 `<style>` 中修改即可。
2. **新增按鈕或互動**：在 View 中加上 `onClick (SomeMsg ...)`，再在 **Messages.elm** 新增 `SomeMsg`，並在 **Main.elm** 的 `update`／`updateLobby` 等處處理該訊息。
3. **共用元件**：可抽到 `Common.elm` 或新增 `Ui/Components.elm`。

主流程、狀態轉換與遊戲邏輯保留在 **Main.elm**、**Lobby.elm**、**Combat.elm**、**GameData.elm**。
