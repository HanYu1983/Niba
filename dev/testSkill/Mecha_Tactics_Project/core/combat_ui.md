# SKILL: Combat_Scene_UI

> 戰鬥場景 UI 設計規格。供前端／Elm 實作參照。  
> 上層引用：`main_entry.md` § COMBAT_STATE。  
> 邏輯依賴：`core/action_menu.md`、`core/combat_logic.md`、`core/event_handler.md`。

---

## 1. 設計目標與對齊

### 1.1 與 action_menu 對齊

| 指令 | 條件 | UI 表現 |
|------|------|---------|
| **移動** | State == Active | 指令區「移動」可用；地圖上可移動格可點擊並有視覺區分。 |
| **切換武器** | State == Active | 指令區「切換武器」可用；選後狀態變 Post_Move，移動／切換武器禁用。 |
| **攻擊** | 目標在射程內、State ≠ Finished | 指令區「攻擊」或目標列表可用；可選顯示射程高亮。 |
| **狀態** | 隨時可用 | 指令區「狀態」可點，開啟單位詳情（機體／駕駛／EN／彈藥）。 |
| **結束** | State ≠ Finished | 指令區「結束」可點；點後單位標記為 Finished。 |

### 1.2 狀態驅動視覺

- **Active**：可移動、可切換武器、可攻擊（若有目標）、可結束。可移動格與當前單位格需明確標示。
- **Post_Move**：不可再移動、不可切換武器；可攻擊、可結束。已移動格或單位可做視覺區分（例如不同底色）。
- **Finished**：所有主動指令禁用，單位以「已行動」樣式顯示（例如灰階或遮罩）。

---

## 2. 場景佈局 (Layout)

整體為**頂部資訊列 + 中央地圖 + 右側／底部指令與資訊**，預留事件彈窗層。

```
┌─────────────────────────────────────────────────────────────────┐
│  [頂部資訊列] 回合 N | 我方/敵方 | 任務名 | (可選)下一動單位        │
├─────────────────────────────────────────────────────────────────┤
│                    │                                             │
│    [中央地圖區]     │  [指令面板]                                  │
│    網格 + 單位      │  - 移動 / 切換武器 / 攻擊 / 狀態 / 結束       │
│    可移動/可攻擊    │  [當前單位簡訊] 名稱 HP/EN 當前武器           │
│    視覺區分        │  [可攻擊目標列表]                             │
│                    │                                             │
├─────────────────────────────────────────────────────────────────┤
│  (可選) 戰鬥 log；攻擊後顯示 §2.4 攻擊結果面板（命中/迴避/傷害）   │
└─────────────────────────────────────────────────────────────────┘
         [事件層：攻擊結果面板 / 反擊選單 / 狙擊確認 / 狀態彈窗 覆蓋於上]
```

### 2.1 頂部資訊列

- **必要**：回合數、階段（我方／敵方行動）、當前任務名稱。
- **可選**：下一動單位預覽、本回合尚未行動的單位列表（小隊順序）。

### 2.2 中央地圖區

- **網格**：以 CSS Grid 排版，格子尺寸建議 `min(2rem, 4vw)` 或固定 2rem，確保可點擊性。
- **格子語意與 class**：
  - `cell`：一般空地。
  - `cell--reachable`：可移動格（我方 Active 且未移動時顯示）。
  - `cell--attack-range`（可選）：在當前武器射程內的格子，用於輔助判斷。
  - `cell--current-unit`：當前操作單位所在格。
  - `cell--player` / `cell--enemy`：我方／敵方單位所在格。
- **格子內容**：除標記 P／E 或圖示外，建議顯示迷你 HP 條或 HP 數字，便於辨識。
- **地形**（未來）：依 `data/terrain.md` 以 `data-terrain` 或 class 區分地形，用於色塊或圖示。

### 2.3 指令面板

- **指令列**：移動、切換武器、攻擊、狀態、結束。依 `ActionState` 與 `currentSide` 決定 disabled 與樣式。
- **當前單位簡訊**：名稱、當前 HP/EN、當前武器名稱（及彈藥若有限）。
- **可攻擊目標列表**：列出射程內敵方單位，可點選後執行攻擊（或點擊即攻擊）。

### 2.4 攻擊結果面板（Attack Result Panel）

攻擊或反擊結算後短暫顯示的結果區塊，供玩家確認「命中／未命中／傷害／防禦減傷」等。

- **觸發時機**：單次攻擊（或狙擊、反擊）依 `combat_logic.md` 結算完成後。
- **顯示時長**：約 2～3 秒後自動關閉，或玩家點擊／按鍵關閉；關閉後若觸發反擊選單則顯示 Counter 選單。
- **資料來源**：與 `combat_logic` 結算輸出對齊，建議在 `CombatModel` 內以 `lastAttackResult : Maybe AttackResult` 驅動。

#### 2.4.1 AttackResult 欄位（建議）

| 欄位 | 型別 | 說明 | 顯示方式 |
|------|------|------|----------|
| **outcome** | enum | Hit / Miss / Evade | 主標：如「命中」「未命中」「迴避成功」 |
| **damage** | int | 實際造成的傷害（未命中／迴避成功時為 0） | 數字，如「-30」或「造成 30 傷害」 |
| **isCrit** | bool | 是否暴擊 | 若 true，可標「暴擊」或圖示 |
| **defenseNote** | string 選填 | 防禦減傷說明 | 簡短文案，如「裝甲減傷 12」或「防禦減傷 40%」 |
| **evadeNote** | string 選填 | 迴避說明（僅 outcome == Evade 時） | 如「迴避成功」 |
| **attackerName** / **defenderName** | string | 攻擊方／防禦方名稱 | 可選，用於標題「A 對 B 的攻擊結果」 |

#### 2.4.2 顯示邏輯（精簡）

- **outcome == Hit**：主標「命中」；顯示 damage（如「-30」）；若 isCrit 則加註「暴擊」；若有 defenseNote 則一行小字（防禦減傷）。
- **outcome == Miss**：主標「未命中」；damage 不顯示或顯示 0；可選顯示 evadeNote（如「偏離」）。
- **outcome == Evade**：主標「迴避成功」；damage = 0；可選 evadeNote（如「迴避成功」）。
- 反擊時同理：先顯示本次攻擊結果，關閉後若觸發反擊再顯示反擊的結果面板。

#### 2.4.3 版面建議

- 彈窗或固定區塊（如畫面中央偏上），不擋住地圖與單位；可半透明底。主標 + 傷害數字突出，其餘為輔助文案一行。

---

### 2.5 單位狀態視窗（狀態指令）與資料揭露程度

- **觸發**：點擊「狀態」或點擊單位（可選）。
- **呈現**：側欄或彈窗，由 `CombatModel.statusUnitId : Maybe String` 驅動。
- **設計原則**：精簡、僅揭露足以支援**決策**的資訊——例如「要不要用這把武器打這個目標」「要不要切換武器」「預期會受到多少傷害」；不列出未使用的原始參數表。

#### 2.5.1 機體（Mecha）

| 揭露項目 | 說明 | 決策用途 |
|----------|------|----------|
| 名稱 | 機體名 | 辨識 |
| HP | 當前 / 最大，如 280/320 | 生存與集火判斷 |
| EN | 當前 / 最大，如 120/180 | 能否使用耗 EN 武器 |
| MOV | 當前移動力（或本回合剩餘） | 走位與脫離 |
| 裝甲摘要 | 見 §2.5.2 | 預估受到傷害 |

#### 2.5.2 裝甲（Armor_Matrix）揭露

- **原則**：五屬（Kin, Beam, Fire, Elec, Chem）可合併為一行或小表，數值為「減傷值」（flat 或等效），供玩家快速判斷「用哪種屬性打較有效」。
- **建議顯示**：五屬並排，如 `抗性 動20 光10 火40 電5 化15` 或簡寫 `K20 B10 F40 E5 C15`；或僅顯示「最低抗性」「最高抗性」兩項以節省空間。
- **精簡版**：若空間不足，可只顯示「弱點」（抗性最低的 1～2 屬）與「強項」（抗性最高的 1 屬），文字如「弱 光」「強 火」。

#### 2.5.3 武器（Weapon）揭露

每件裝備武器一行或一區塊，欄位精簡、對齊「是否選來攻擊／切換」的決策：

| 揭露項目 | 說明 | 決策用途 |
|----------|------|----------|
| 名稱 | 武器名 | 辨識、切換武器 |
| 架勢 | Melee / Assault / Direct_Fire / Snipe | 能否移動後攻擊、是否可反擊／Overwatch |
| 射程 | RNG_Min～RNG_Max，如 2～5 | 能否打到目標 |
| 傷害摘要 | 屬性與數值簡寫，如「動45」「光55」或「動45+電30」 | 預期傷害與屬性克制 |
| EN／彈藥 | 每次消耗 EN 或剩餘彈藥，如「EN 15」或「24/24」 | 能否使用、是否保留 |
| 狀態 | 當前是否為 Default_Weapon、是否已用盡彈藥 | 切換與攻擊選擇 |

- **不必要**：Accuracy_Mod、完整 Atk_Vector 逐項（可用「傷害摘要」取代）、Weight（戰鬥中不影響決策）。

#### 2.5.4 駕駛（Pilot）

| 揭露項目 | 說明 | 決策用途 |
|----------|------|----------|
| 名稱 | 駕駛名 | 辨識 |
| 鬥志 | 當前 / 最大 Willpower | 是否使用精神指令 |
| 四維摘要（可選） | 如「格14 射10 反16 技12」或僅「格鬥/射擊」 | 預期命中與暴擊感 |

- 精神指令列表可摺疊或僅顯示「可使用的精神指令數量」，點開再展開名稱與消耗。

#### 2.5.5 配件（Parts）

- **精簡**：列出配件名稱；若有關鍵效果（如「海域 MOV+2」「命中+8」）可一行一字串。
- **不必**：完整 Stat_Modifiers 表、Passive_Draw 數值（除非玩家需判斷 EN 餘裕）。

---

### 2.6 結果與事件層

- **勝／敗**：專區顯示結果文案與「返回策略」按鈕。
- **攻擊結果面板**：見 §2.4；由 `lastAttackResult` 驅動，顯示命中／迴避／傷害／防禦減傷等。
- **反擊選單**（ref: `event_handler.md` §2）：僅當**被攻擊方為我方**時顯示；Attack / Defend / Evade 三選一，以 Modal 或固定區塊覆蓋，由 `Maybe CounterPrompt` 驅動。被攻擊方為敵方時不顯示選單，敵方自動反擊。
- **狙擊確認**（ref: `event_handler.md` §1）：`UI_Prompt("Snipe?")` 以 Modal 或固定區塊呈現，由 `Maybe SnipePrompt` 驅動。

---

## 3. 元件拆分 (View 結構建議)

建議 Elm 端拆成以下 view 函數，方便對應狀態與維護：

| 函數名 | 職責 |
|--------|------|
| `viewCombatHeader` | 頂部資訊列（回合、階段、任務名）。 |
| `viewCombatGrid` | 地圖網格；參數含 reachable、targets、currentUnit，用於 class 與點擊。 |
| `viewCombatActionMenu` | 指令列；依 `CombatModel`、`Maybe CombatUnit` 與 action_menu 條件決定按鈕狀態。 |
| `viewCombatUnitBrief` | 當前單位簡訊（名稱、HP/EN、當前武器）。 |
| `viewCombatTargets` | 可攻擊目標列表。 |
| `viewAttackResultPanel` | 攻擊結果面板（§2.4）：outcome、damage、isCrit、defenseNote、evadeNote。 |
| `viewUnitStatusDetail` | 狀態視窗內容（§2.5）：機體／裝甲／武器／駕駛／配件，揭露程度見該節。 |
| `viewCombatResult` | 勝／敗結果區。 |
| `viewCounterPrompt` / `viewSnipePrompt` | 事件彈窗（反擊／狙擊）。 |

主畫面組合：`viewCombat` = Header + Grid + ActionPanel（含 Brief + Targets）+ 依 result 顯示 Result 或 Active 區塊；若有 lastAttackResult 則疊加攻擊結果面板；若有 statusUnitId 則疊加 Status 視窗；若有 Counter/Snipe prompt 則疊加對應 Modal。

---

## 4. 互動與 Msg 對應

| 使用者操作 | Msg（建議） | 備註 |
|------------|-------------|------|
| 點擊可移動格 | `CombatMoveTo x y` | 僅在 Active 且我方時有效。 |
| 點擊「切換武器」並選擇武器 | `CombatSwitchWeapon Int` | 選後單位狀態改 Post_Move（ref: action_menu）。 |
| 點擊目標或「攻擊」 | `CombatAttack targetId` | 需目標在射程、狀態非 Finished。 |
| 點擊「狀態」或單位 | 設 `statusUnitId = Just id` | 僅影響 view，可選用 Msg `CombatShowStatus String`。 |
| 點擊「結束」 | `CombatEndTurn` | 單位狀態改 Finished。 |
| 反擊選單選擇 | `CombatCounterChoice Attack/Defend/Evade` | 依 event_handler 結算。 |
| 狙擊確認 | `CombatSnipeConfirm Bool` | 依 event_handler 觸發狙擊或略過。 |

---

## 5. 與 combat_logic / event_handler 的對齊

### 5.1 戰鬥回饋（combat_logic）與攻擊結果面板

- 攻擊／反擊／狙擊結算後，依 `combat_logic.md` 得到 outcome（Hit/Miss/Evade）、damage、isCrit、可選的防禦減傷與迴避說明。
- `CombatModel` 建議欄位：`lastAttackResult : Maybe AttackResult`，欄位見 §2.4.1（outcome, damage, isCrit, defenseNote, evadeNote, 可選 attackerName/defenderName）。
- UI：以 **攻擊結果面板**（§2.4）顯示，主標（命中／未命中／迴避成功）+ 傷害數字 + 可選暴擊／防禦減傷文案；約 2～3 秒自動關閉或點擊關閉，關閉後若觸發反擊則顯示反擊選單，反擊結算後再顯示一次結果面板。

### 5.2 事件彈窗（event_handler）

- **反擊**：防禦方被攻擊且存活、距離與武器符合時，**若防禦方為我方**則顯示 Counter 選單（Attack / Defend / Evade），由 `Maybe CounterPrompt` 驅動 view，選完送對應 Msg；**若防禦方為敵方**則不顯示選單，敵方自動選擇反擊並結算。
- **狙擊**：敵方移動結束若進入我方 Overwatch 範圍，顯示「Snipe?」確認，由 `Maybe SnipePrompt` 驅動。

---

## 6. 實作優先順序

| 優先級 | 項目 | 說明 |
|--------|------|------|
| 高 | 完整指令列 | 移動／切換武器／攻擊／狀態／結束，依 ActionState 與 currentSide 控制 enabled/樣式。 |
| 高 | 格子視覺與語意 | 可移動／可攻擊／當前單位／敵方之 class 與樣式；當前單位與目標列表版面整理。 |
| 中 | 切換武器 UI | 列出武器與彈藥／EN，選擇後更新 currentWeaponIndex 並將狀態設為 Post_Move。 |
| 中 | 狀態視窗 | §2.5 揭露程度：機體 HP/EN/MOV、裝甲摘要、武器名稱/架勢/射程/傷害摘要/EN或彈藥、駕駛鬥志；由 statusUnitId 驅動。 |
| 中 | 攻擊結果面板 | §2.4：結算後顯示 outcome、damage、isCrit、defenseNote、evadeNote；lastAttackResult 驅動。 |
| 後續 | 反擊／狙擊 Modal | CounterPrompt、SnipePrompt 與對應 Msg/update。 |
| 後續 | 地形與迷你 HP 條 | 格子地形標示、單位格迷你 HP 條。 |

---

## 7. 檔案索引

- 狀態與指令邏輯：`core/action_menu.md`
- 戰鬥演算與數值：`core/combat_logic.md`
- 事件與中斷：`core/event_handler.md`
- 專案入口與 COMBAT_STATE：`main_entry.md`
