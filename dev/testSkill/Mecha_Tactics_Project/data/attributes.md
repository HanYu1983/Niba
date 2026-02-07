# SKILL: Attribute_Dictionary

## 1. Damage_Types
- **Kinetic (Kin)**: Physical shells or blades. Blocked by solid armor.
- **Beam (Beam)**: High-energy particles. Piercing; affected by coatings.
- **Thermal (Fire)**: High heat. Can cause DOT (Damage Over Time).
- **Electric (Elec)**: EMP or shock. Drains EN or causes Stun.
- **Chemical (Chem)**: Corrosive substances. Reduces Armor_Matrix.

## 2. Attack_Stances

每件武器的 Stance 決定「何時可攻擊」「是否可反擊」「是否參與中斷」。判定時以**當前裝備武器**的 Stance 為準。

### 2.1 Melee
- **語意**：近距離格鬥。
- **可攻擊時機**：目標在 RNG 內時，可在己方行動中選擇攻擊。
- **反擊**：當己方被敵方攻擊且存活時，若敵方在己方此武器 RNG 內，可觸發反擊選單（Counter_Menu）；己方可選擇 Attack / Defend / Evade。**反擊選單僅在被攻擊方為我方時出現**；若被攻擊方為敵方，則敵方自動選擇反擊（不顯示選單）。
- **其他**：部分規則給予 Melee 防禦加成（Defense_Bonus），依 combat 實作為準。

### 2.2 Assault
- **語意**：高機動射擊，移動後仍可開火。
- **可攻擊時機**：己方可在執行「移動」之後、同一回合內再執行「攻擊」；目標在當前武器 RNG 內即可。
- **反擊**：預設不參與反擊；僅在具 Special_Ability（如 Counter_Expert）時可觸發反擊選單。

### 2.3 Direct_Fire
- **語意**：精準直射，需穩定架勢。
- **可攻擊時機**：通常限定「本回合未移動」或「處於靜止狀態」時才可攻擊；目標在 RNG 內。具體條件依 action_menu 與實作為準。
- **反擊**：預設不參與反擊。

### 2.4 Snipe（狙擊，Overwatch 中斷）
- **語意**：長程狙擊，可對「敵方移動」進行一次中斷攻擊。
- **觸發時機**：**敵方機體**執行「移動」並**完成移動**時（即敵方單位狀態變為 Move_Complete）。
- **觸發條件**（全部滿足才觸發）：
  1. 敵方單位剛完成移動，其**移動目的地格**（Final_Coord）已確定。
  2. 該目的地格落在**己方某台機體的 Overwatch_Zone 內**。Overwatch_Zone 的定義：以該己方機體為原點、其**當前裝備且 Stance == Snipe 的武器**之 RNG_Min～RNG_Max 所涵蓋的格子集合（見 core/systems.md § Overwatch_Zone）。
  3. 該己方機體**本回合尚未觸發過狙擊**（見下方「一回合一次」）。
- **觸發後流程**：遊戲暫停 → 詢問該己方機體是否執行狙擊 → 若選擇是，則對該敵方單位執行一次攻擊（同 combat_logic），消耗該狙擊武器的 EN/彈藥；該己方機體本回合狙擊資格用盡。
- **一回合一次**：同一台機體在**同一個戰鬥回合（round）**內，最多只能因「敵方移動目的地進入 Overwatch_Zone」而**觸發並執行一次**狙擊。執行後將該機體的狀態標記設為「本回合已狙擊」；該標記在**下一回合開始**（或全體單位回合重置時）清除。
- **小結**：狙擊 = 敵方移動時，若移動**目的地**在己方狙擊武器射程內，則可觸發一次狙擊；每台機體每回合最多觸發一次。

## 3. Terrain_Tags
- **Plain**: Default Land.
- **Forest**: Land; provides Evade_Bonus.
- **Sea**: Water; affects Fire/Elec resistance.
- **Mountain**: High altitude; high Move_Cost for Land units.