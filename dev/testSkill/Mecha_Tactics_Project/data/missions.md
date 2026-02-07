# SKILL: Mission_Structure_Definition

## 1. Mission_Header_Schema
- **Mission_ID**: 唯一識別碼
- **Map_Data**: {Size_X, Size_Y, Default_Terrain}
- **Environmental_Condition**: {Weather_Tag, Light_Level}
- **Deployment_Limit**: 玩家可派擊機體數量上限
- **Reward**（選填）：勝利時結算；`{ Money: int, EXP?: int, Drops?: [Item_ID] }` — 與 `core/state_flow.md` § 經濟與報酬對接

## 2. Objective_Logic (勝利/失敗判定)
- **Win_Conditions**: 
    - [Extermination]: 敵方全滅。
    - [Capture]: 佔領座標 (X, Y)。
    - [Survival]: 撐過 N 回合。
    - [VIP_Escort]: 指定機體抵達目標區域。
- **Lose_Conditions**: 
    - [Wipeout]: 我方全滅。
    - [VIP_Death]: 重要機體損毀。
    - [Turn_Limit]: 超過指定回合數。

## 3. Mission_Instance_Sample (示範關卡)

### [M-01: 鐵鏽港突襲]
- **Context**: 敵方運輸艦在港口擱淺，趁潮汐低位發動進攻。
- **Map**: 30x30
- **Terrain_Layout**: 
    - [Row 0-10]: Sea (適性 S/A 優勢區)
    - [Row 11-15]: Sand (平地，移動加成)
    - [Row 16-30]: Ruin (提供掩護，但移動成本高)
- **Weather**: [Rain] (對應系統：Beam 傷害 -20%, Fire 傷害 -50%)

- **Enemy_Force**:
    - 3x [Standard_Guard] (Land_Type)
    - 1x [Artillery_Unit] (Fixed_Position, Overwatch_Enabled)

- **Special_Event**:
    - 第 5 回合：潮汐上漲，Sand 區域全部轉變為 Sea 標籤。