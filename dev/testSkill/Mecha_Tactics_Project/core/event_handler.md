# SKILL: Event_Handler_System

## 1. Move_Complete_Listener（狙擊觸發）
- **Trigger**：敵方單位完成「移動」；其座標已更新為**移動目的地**（Final_Coord），State == Move_Complete。
- **Logic**（對每一台已進入 Overwatch 的己方單位 Sniper）：
  1. IF (Enemy.Final_Coord IN Sniper.Overwatch_Zone) AND (Sniper.Snipe_Triggered_This_Round == False):
  2. THEN CALL `core/systems.md` § Snipe_Check → PAUSE → UI_Prompt("Snipe?").
  3. IF 玩家選擇執行狙擊：對該敵方單位執行一次攻擊（combat_logic），設 Sniper.Snipe_Triggered_This_Round = True。
- **一回合一次**：同一 Sniper 在同一戰鬥回合內僅可因此觸發並執行一次狙擊；Snipe_Triggered_This_Round 於該單位下一回合開始（或回合輪替）時重置為 False。

## 2. Post_Attack_Listener（反擊觸發）
- **Target**: 被攻擊者（防禦方）受擊後 HP > 0。
- **Condition**: 攻擊方與防禦方距離 IN 防禦方.Default_Weapon.RNG，且防禦方.Weapon.Stance == "Melee" OR Special_Ability == "Counter_Expert"。
- **依防禦方陣營分支**：
  - **防禦方為我方**：TRIGGER `UI_Prompt("Counter_Menu")` → 玩家為該我方單位選擇 [Attack, Defend, Evade]（見 §2.1）。
  - **防禦方為敵方**：不顯示選單；**敵方自動選擇反擊**（依 AI 或預設規則擇一，如預設 Attack，或依 HP/EN 選 Defend/Evade），結算後直接進入 §2.1 對應效果。

### 2.1 Counter_Menu 選項效果（我方被攻擊時出現）
僅當**被攻擊方為我方**時，才跳出反擊選單供玩家選擇。防禦方（我方）在選單中三選一，立即生效：

| 選項 | 效果 | 備註 |
|------|------|------|
| **Attack** | 防禦方對攻擊方執行一次反擊：命中/傷害依 `core/combat_logic.md` 計算（攻防角色對調）。反擊後若攻擊方存活，**不再**觸發攻擊方的二次反擊。 | 消耗防禦方武器 EN/彈藥。 |
| **Defend** | 本回合此次被攻擊的**傷害減算**：Final_Damage 乘以 Defend_Multiplier（建議 0.5～0.7）。若傷害已算完，則改為「已扣 HP 前」套用乘數再扣 HP。 | 不執行反擊；可選耗 EN（如 10）以強化減傷（如 0.5→0.3）。 |
| **Evade** | 不反擊；**重新擲一次迴避**：用當前命中公式算 Hit_Rate，若「未命中」則此次攻擊傷害改為 0；若命中則原傷害照算。 | 可選：消耗少量 Willpower（如 5）換取 Evade_Bonus 加在迴避上。 |

- **實作約定**：三選一後即結算，不再遞迴觸發反擊（防禦方選 Attack 時，攻擊方本輪不再反擊）。
- **敵方被攻擊時**：不顯示 Counter_Menu；由系統依 AI 或預設（如一律反擊 Attack）自動決定並執行對應效果，無需玩家操作。

## 3. Unit_Death_Listener
- **Logic**: IF HP <= 0 -> Clear Unit from Grid -> Trigger Loot/EXP Logic.