# SKILL: State_Flow

> 三狀態的進出條件與流程；與 `main_entry.md` § Global_State_Machine 對應。

---

## 1. 狀態總覽

```
[LOBBY_STATE]  ←——→  [STRATEGY_STATE]  ←——→  [COMBAT_STATE]
      ↑                      ↑                        ↑
  從策略返回              選任務／出擊              戰鬥結束
  或遊戲開始
```

---

## 2. LOBBY_STATE（大廳）

### 2.1 進入條件

- **遊戲啟動**：首次進入遊戲時。
- **從 STRATEGY 返回**：玩家在策略階段選擇「返回大廳」或「結束任務結算後返回大廳」。

### 2.2 可執行操作

- **資源管理**：查看 Balance（貨幣）；購買／出售機體、駕駛、武器、配件（ref: lobby_logic § 1）。
- **機體裝配**：選擇機體 → 裝備武器與配件 → 合法性驗證（重量、EN、槽位）；可儲存多組「編成」供策略階段選用（可選）。
- **小隊編成**（可選）：指定哪些機體+駕駛為一隊，供出擊時選擇。

### 2.3 離開條件 → 進入 STRATEGY_STATE

- **條件**：玩家主動選擇「出擊」／「進入任務選擇」等按鈕。
- **帶出資料**：當前庫存、編成、Balance；策略階段僅讀取，不在此階段扣款。

---

## 3. STRATEGY_STATE（策略／任務選擇）

### 3.1 進入條件

- 自 **LOBBY_STATE** 選擇「出擊」後進入。

### 3.2 可執行操作

- **任務選擇**：從任務列表（ref: data/missions.md、instances/missions.md）選一關，檢視 Map_Data、Environmental_Condition、Deployment_Limit、Win/Lose 條件。
- **環境評估**：檢視地形、天氣、敵方概要（若任務有提供）。
- **派擊準備**：在 **Deployment_Limit** 內選擇要出擊的機體（含已裝配武器/配件與駕駛）；確認出擊。

### 3.3 離開條件

- **進入 COMBAT_STATE**：玩家確認出擊 → 載入關卡地圖、部署區、敵方、勝利/失敗條件 → 進入戰鬥。
- **返回 LOBBY_STATE**：玩家選擇「返回大廳」；不結算獎勵，不扣資源。

---

## 4. COMBAT_STATE（戰鬥）

### 4.1 進入條件

- 自 **STRATEGY_STATE** 確認出擊後，載入關卡並進入戰鬥。

### 4.2 可執行操作

- 回合制：移動、切換武器、攻擊、狀態、結束回合（ref: action_menu）。
- 中斷：狙擊 Overwatch、反擊選單（ref: event_handler、systems § 3）。

### 4.3 離開條件 → 返回 STRATEGY 或 LOBBY

- **勝利**：達成任務 Win_Conditions（如敵方全滅、佔領、生存 N 回合等）→ 結算報酬（見下）→ 可選擇「返回大廳」或「繼續選任務」。
- **失敗**：達成 Lose_Conditions（我方全滅、VIP 死亡、逾時等）→ 結算（若有部分報酬或無）→ 通常返回策略或大廳。
- **放棄**（可選）：玩家中途選擇「放棄任務」→ 依設計決定是否部分報酬或無 → 返回策略或大廳。

### 4.4 戰鬥結束結算（建議）

- **報酬**：依任務定義發放（見下節）；寫入 Balance、經驗、掉落等。
- **狀態**：回到 **STRATEGY_STATE**（可再選關）或直接回 **LOBBY_STATE**（依 UI 流程設計）。

---

## 5. 經濟與報酬（建議對接）

- **Balance 來源**：  
  - 初始值（新遊戲）。  
  - 戰鬥勝利／部分完成時，由任務報酬表發放（建議在 missions 或 instances 定義每關的 Reward: { Money, EXP?, Drops? }）。
- **lobby_logic** 僅定義「Balance >= Price -> Transfer_Ownership」；**報酬寫入時機**為「離開 COMBAT_STATE 且勝利（或部分完成）」時，在進入 STRATEGY 或 LOBBY 前執行一次結算邏輯。
- 若專案尚未定義報酬表，可先在 `data/missions.md` 或任務實例中預留欄位：`Reward: { Money: int, ... }`。

---

## 6. 工程實作備註

- 狀態轉換處為**單一入口**（例如 StateMachine.Transition(LOBBY → STRATEGY)），方便載入/卸載對應資源（main_entry § 2 所列載入資源）。
- 策略階段「繼續選任務」即維持 STRATEGY_STATE；「返回大廳」即 Transition to LOBBY。
- 戰鬥結束後不論勝敗，先跑結算再切狀態，避免報酬遺漏。
