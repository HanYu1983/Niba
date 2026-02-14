# SKILL: Entity_Data_Schema

## 1. Mecha_Frame_Schema
- **Basic**: [ID, Name, Size, Description]
- **Vitals**: [Max_HP, Max_EN, EN_Regen, Base_MOV]
- **Capacity**: [Weight_Limit, Weapon_Slots, Part_Slots]
- **Adaptability**: {Land, Mountain, Sea, Air, Space} (Grades: S-E)
- **Armor_Matrix**: {Fire, Elec, Beam, Kin, Chem} (Flat Reduction)

## 2. Pilot_Profile_Schema
- **Basic**: [ID, Name, Rank]
- **Combat_Stats**: [Melee, Ranged, Reflex, Technique]
- **Mental**: [Current_Willpower, Spirit_Skills]
- **Trait**: [Passive_Abilities]

## 3. Weapon_Profile_Schema
- **Basic**: [ID, Name, Weight, Price, Slot_Tag]
- **Slot_Tag**: Hand | Shoulder | Internal — 裝備時須符合機體 Weapon_Slots 之槽位類型（ref: lobby_logic Slot_Constraint）
- **Performance**: [Atk_Vector, Stance, RNG_Min, RNG_Max, Accuracy_Mod]
- **Cost**: [EN_Cost, Max_Ammo]

## 4. Part_Profile_Schema
- **Basic**: [ID, Name, Weight, Price]
- **Passive_Draw**: int — 每回合被動 EN 消耗；裝配時 Σ Passive_Draw <= 機體 EN_Regen（ref: lobby_logic Energy_Constraint）
- **Effects**: [Stat_Modifiers, Adaptability_Fix, Special_Functions]