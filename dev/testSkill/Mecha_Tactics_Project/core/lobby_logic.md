# SKILL: Lobby_Management

## 1. Inventory_Control
- Categories: [Mecha, Pilot, Weapon, Part]
- Transaction: Balance >= Price -> Transfer_Ownership.

## 2. Assembly_Validation (Legality_Check)
- **Weight_Constraint**: Σ(Weapon.Weight + Part.Weight) <= Mecha.Weight_Limit
- **Energy_Constraint**: Σ(Part.Passive_Draw) <= Mecha.EN_Regen（見 §3 淨 EN 回復）
- **Slot_Constraint**: Weapon.Slot_Tag MUST MATCH 機體該槽之 Slot_Tag (Hand/Shoulder/Internal)

## 3. Stat_Stacking
- **Final_HP** = Mecha.Max_HP + Σ(Part.Stat_Modifiers.HP_Bonus)
- **Final_Adaptability** = Mecha.Adaptability -> Apply(Part.Adaptability_Fix)
- **淨 EN 回復**（每回合）：`Net_EN_Regen = Mecha.EN_Regen + Σ(Part.Stat_Modifiers.EN_Regen_Bonus) - Σ(Part.Passive_Draw)`；裝配合法條件為 **Net_EN_Regen >= 0**（建議同時滿足 Energy_Constraint，即 Σ Passive_Draw <= Mecha.EN_Regen，以利平衡）