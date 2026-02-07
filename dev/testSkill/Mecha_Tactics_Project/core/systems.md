# SKILL: Core_Systems_v2

## 1. Attribute_Calculus
- Types: [Fire, Electric, Beam, Kinetic, Chemical]
- Formula: $Final\_Damage = \sum \max(0, Atk_{n} - Res_{n})$

## 2. Terrain_Adaptability (Movement Cost - MC)
- Grades: [S:0.5, A:1.0, B:1.5, C:2.0, D:3.0, E:∞]
- Logic: Cost = Grid_Terrain_Tag -> Match(Unit_Adaptability) -> Get(MC)

## 3. Interrupt_Protocol (Destination-Based)

### 3.1 Snipe_Check（狙擊中斷）
- **Trigger**：敵方單位完成「移動」動作；即 Enemy_Unit.State == "Move_Complete"，且其座標已更新為**移動目的地**（Final_Coord）。
- **判定**：對每一台已進入 Overwatch 狀態的己方單位 U，檢查：
  - (Final_Coord IN U.Overwatch_Zone) AND (U.Snipe_Triggered_This_Round == False)。
- **若成立**：PAUSE → 詢問 U 是否執行狙擊 → 若執行則對該敵方單位進行一次攻擊（同 combat_logic），並設 U.Snipe_Triggered_This_Round = True。
- **一回合一次**：同一台機體在同一戰鬥回合內最多觸發並執行一次狙擊。Snipe_Triggered_This_Round 在該機體下一回合開始時（或全域回合輪替時）重置為 False。
- **小結**：狙擊觸發 = 敵方機體**移動時**，其**移動目的地**在己方狙擊武器射程內；每機體每回合僅可觸發一次。

### 3.2 Counter_Check（反擊判定）
- **Trigger**: Post_Attack_Survival（被攻擊者 HP > 0）。
- **Condition**: 攻擊方與防禦方距離 IN 防禦方當前武器 RNG；防禦方武器 Stance == Melee 或具反擊能力。
- **Effect**（依被攻擊方陣營）：
  - **被攻擊方為我方**：PROMPT [Attack, Defend, Evade] → 玩家選擇後執行對應效果。
  - **被攻擊方為敵方**：不顯示選單；**敵方自動選擇反擊**（如預設 Attack 或依 AI 規則），直接執行反擊結算。

## 4. Overwatch_Zone 定義
- **來源**：以**發動 Overwatch 的單位**為基準，使用其**當前裝備且 Stance == Snipe 的武器**之射程（RNG_Min, RNG_Max）。
- **範圍**：自該單位所在格起算，距離在 [RNG_Min, RNG_Max] 內的**格子集合**。敵方單位**移動完成後**，若其**目的地格**（Final_Coord）在此集合內，則可觸發該 Overwatch 單位的狙擊檢查（且需滿足該單位本回合尚未狙擊）。
- **視線（可選）**：若實作阻擋視線，Overwatch_Zone 僅含與該單位之間無障礙的格子；否則以距離為準即可（菱形/圓形）。
- **更新時機**：單位在「結束回合」且裝備 Snipe 武器時進入 Overwatch，將此時的 Overwatch_Zone 寫入該單位狀態；直至其下一回合行動或取消 Overwatch。