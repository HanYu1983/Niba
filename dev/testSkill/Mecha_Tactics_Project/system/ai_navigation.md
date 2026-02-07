# SKILL: Tactical_AStar_Engine

## 1. Multi_Weighted_Pathing
- **Function**: $f(n) = g(n) + h(n)$
- **g(n)**: Dynamic_Move_Cost (based on Adaptability).
- **h(n)**: Tactical_Heuristics.
    - [Ally_Protection]: -10 weight for cells covering Allies via Overwatch.
    - [Safety_Seek]: +50 weight for cells in Enemy_Danger_Zone.

## 2. Search_Objectives
- FIND_TARGET: Min(Distance) to Attackable_Enemy.
- PROTECT_ZONE: Optimize(Overwatch_Coverage) for Ally_Count.