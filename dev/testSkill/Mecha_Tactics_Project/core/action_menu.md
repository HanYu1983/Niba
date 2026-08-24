# SKILL: Unit_Action_Menu

## 1. Action_State_Definition
- **Active**: 單位尚未行動，所有選單可用。
- **Post_Move**: 單位已執行[移動]，[切換武器]、[移動]選項禁用。
- **Finished**: 單位已執行[攻擊]或[結束]，所有主動選項禁用，直到下回合重置。

## 2. Menu_Command_Logic

### [移動 (Move)]
- **Condition**: IF State == Active
- **Effect**: 
    - 消耗移動力 (MOV)。
    - 狀態變更為 [Post_Move]。
    - 鎖定 [移動] 與 [切換武器]。

### [切換武器 (Switch_Weapon)]
- **Condition**: IF State == Active
- **Effect**: 
    - 變更當前預設武裝 (Default_Weapon)。
- **Note**: 代表整備切換需要時間，不可先跑位再換槍。

### [攻擊 (Attack)]
- **Condition**: 
    - Target_In_Range(Current_Weapon.RNG) == True
    - AND State != Finished
- **Effect**: 
    - 觸發戰鬥演算 (ref: combat_logic.md)。
    - 狀態變更為 [Finished]。

### [狀態 (Status)]
- **Condition**: Always Available (即使是 Finished 狀態)
- **Effect**: 顯示單位狀態視窗；揭露內容與精簡程度見 `core/combat_ui.md` §2.5（機體 HP/EN/MOV、裝甲摘要、武器架勢/射程/傷害摘要/EN或彈藥、駕駛鬥志、配件摘要）。

### [結束 (End_Turn)]
- **Condition**: State != Finished
- **Effect**: 強制變更狀態為 [Finished]，觸發灰色遮罩標記。