# SKILL: Mecha_Tactics_Project_Main

## 1. Project_Identity
- **Project_Name**: 未命名的機甲戰棋 (Custom Mecha Tactics)
- **Engine_Core**: Logic-Driven Tactical Simulation
- **Logic_Standard**: SKILL (Structured Knowledge Integration & Logical Learning)

## 2. Global_State_Machine
遊戲運作於以下三種主要狀態，AI 需根據狀態切換邏輯加載。**進出條件與流程**見 `core/state_flow.md`。

- **[LOBBY_STATE]**: 
    - 核心任務：資源管理、機體裝配、合法性驗證。
    - 載入資源：`core/lobby_logic.md`, `data/entities.md`.
- **[STRATEGY_STATE]**: 
    - 核心任務：任務選擇、環境評估、派擊準備。
    - 載入資源：`data/missions.md`, `data/terrain.md`.
- **[COMBAT_STATE]**: 
    - 核心任務：A* 尋路、戰鬥演算、中斷監聽、指令執行。
    - 載入資源：`core/systems.md`, `core/combat_logic.md`, `core/action_menu.md`, `core/event_handler.md`, `core/combat_ui.md`, `system/ai_navigation.md`.

## 3. Directory_Structure & References (路徑索引)
```text
/Mecha_Tactics_Project
│
├── main_entry.md              # 專案總入口：定義遊戲狀態機與資源索引路徑
│
├── /core                      # 核心邏輯層：定義遊戲運作的物理規則與機制
│   ├── systems.md             # 戰鬥與適性規範：五大屬性、地形適性 MC、中斷協議
│   ├── combat_logic.md        # 戰鬥演算：命中、暴擊、傷害、結算順序
│   ├── lobby_logic.md         # 大廳管理邏輯：買賣流程、裝配合法性驗證、數值堆疊
│   ├── action_menu.md         # 戰場指令集：移動、攻擊、切換武器的狀態變更邏輯
│   ├── event_handler.md       # 事件處理器：狙擊中斷、反擊觸發的時序監聽
│   ├── combat_ui.md           # 戰鬥場景 UI 規格：佈局、指令列、狀態驅動、Elm 參照
│   └── state_flow.md          # 三狀態進出條件與流程（Lobby / Strategy / Combat）
│
├── /system                    # 運算引擎層：處理複雜演算法與AI決策
│   └── ai_navigation.md       # 彈性 A* 引擎：多維權重路徑搜尋與戰術定位邏輯
│
├── /data                      # 資料定義層：物件的常態屬性與結構定義
│   ├── entities.md            # 實體 Schema：機體、駕駛員、裝備的基礎屬性欄位
│   ├── mecha_frames.md        # 機體基本資料：商店／裝配用機體清單
│   ├── pilots.md              # 駕駛基本資料：商店／編成用駕駛清單
│   ├── weapons.md             # 武器基本資料：商店／裝配用武器清單（含 Slot_Tag）
│   ├── parts.md               # 配件基本資料：商店／裝配用配件清單
│   ├── terrain.md             # 地形定義：標籤總表、格效應、環境狀態
│   ├── attributes.md          # 屬性字典：五大屬性與態式的底層定義
│   ├── spirit_skills.md       # 精神指令效果表（ID 與 Will_Cost、Effect）
│   ├── traits.md              # 駕駛被動特質效果表（ID 與 Condition、Effect）
│   └── missions.md            # 任務定義（策略階段用）
│
└── /instances                 # 實例資料夾 (未來擴充用)
    ├── samples_mecha.md       # 具體機體範例 (如：蒼藍魚人)
    └── missions.md            # 關卡與場景實例