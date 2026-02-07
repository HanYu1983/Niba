# SKILL: Combat_Logic

> 戰鬥演算：命中判定、暴擊、傷害結算、資源扣除與死亡判定。  
> 上層引用：`core/action_menu.md` § 攻擊 → 觸發本文件。  
> 數值基礎：`core/systems.md` § Attribute_Calculus、`data/attributes.md`。

---

## 1. 戰鬥流程總序

單次「攻擊」的執行順序：

1. **前置檢查**：目標在當前武器 RNG 內、攻擊方 EN/彈藥足夠、狀態非 Finished（ref: action_menu）。
2. **命中判定**：計算 Hit_Rate → 擲骰 → 若未命中則跳至步驟 6（可選：擦傷/格擋表現）。
3. **暴擊判定**：若命中，再依 Crit_Rate 判定是否暴擊。
4. **傷害計算**：依武器 Atk_Vector、目標 Armor_Matrix、地形/環境修正，得 Final_Damage（ref: systems § 1）。
5. **結算**：扣目標 HP、扣攻擊方 EN/彈藥；若目標 HP ≤ 0 觸發 Unit_Death_Listener。
6. **後續**：若目標存活且距離在反擊武器 RNG 內，觸發 Counter_Check（ref: event_handler § 2）。被攻擊方為我方時跳出反擊選單；被攻擊方為敵方時敵方自動選擇反擊。

---

## 2. 命中率 (Hit_Rate)

### 2.1 基礎公式

```
Base_Hit = 80   // 常數，可調
Attacker_Mod = f(Pilot.Melee 或 Pilot.Ranged, Weapon.Stance)
Defender_Mod = Pilot.Reflex → 換算為迴避修正
Terrain_Mod = 目標所在格地形效應（見 data/terrain.md）
Weather_Mod = 當前環境（見 data/terrain.md § Environmental_States）
Distance_Mod = 依距離在 RNG_Min～RNG_Max 內線性或分段表

Hit_Rate = clamp(0, 100,
  Base_Hit
  + Weapon.Accuracy_Mod
  + Attacker_Mod
  - Defender_Mod
  + Terrain_Mod
  + Weather_Mod
  + Distance_Mod
)
```

### 2.2 攻擊方補正 (Attacker_Mod)

- **近戰武器** (Stance == Melee)：使用 **Pilot.Melee**。  
  - 建議換算：`Attacker_Mod = (Pilot.Melee - 10)` 或查表，使約 10 為 0 修正。
- **遠程武器** (Assault / Direct_Fire / Snipe)：使用 **Pilot.Ranged**。  
  - 同上，例如 `(Pilot.Ranged - 10)` 或查表。
- 數值可依平衡再細調；若未實作查表，暫用線性：每點能力 ±1% 命中。

### 2.3 防禦方補正 (Defender_Mod)

- 使用 **防禦方 Pilot.Reflex** 換算為「迴避」，從命中率中扣除。
- 建議：`Defender_Mod = (Defender.Reflex - 10)` 或查表，即 Reflex 越高敵方命中越低。
- 若機體/配件有 **Evade_Bonus**，一併計入（例如直接加在 Defender_Mod 的減項）。

### 2.4 距離與地形／環境

- **Distance_Mod**：在武器 RNG_Min～RNG_Max 內，可設「最佳距離」區間（如 RNG_Min+1～RNG_Max-1）給 0 修正，過近/過遠懲罰（負修正）。
- **Terrain_Mod**：目標格地形若提供 Evade_Bonus（如 Forest），則換算為對命中率的負修正（見 terrain.md Grid_Effect_Rules）。
- **Weather_Mod**：如 Sandstorm 的 Ranged_Accuracy -30%，直接加在 Hit_Rate 上。

---

## 3. 暴擊判定 (Crit_Rate)

- **觸發時機**：僅在「已命中」時再擲一次暴擊。
- **Crit_Rate** 建議公式：
  ```
  Crit_Rate = base_crit + (Attacker.Pilot.Technique - 10)  // 或查表
  ```
  base_crit 可設 5～10；Technique 每點約 +1% 暴擊。
- **暴擊效果**：Final_Damage 乘以 Crit_Multiplier（建議 1.5 或 2.0），再進入 §4 傷害計算後的結算。

---

## 4. 傷害計算 (Final_Damage)

與 `core/systems.md` § 1 一致：

- **屬性**：Fire, Elec, Beam, Kin, Chem。
- **公式**：對每種屬性分別計算，再加總。
  ```
  Final_Damage = Σ over n in Damage_Types: max(0, Atk_n - Res_n)
  ```
- **Atk_n**：武器 Atk_Vector 對應屬性；若有暴擊，可先乘 Crit_Multiplier 再減防，或先減防再乘（建議先減防再乘，避免破防後暴擊過高）。
- **Res_n**：目標當前 Armor_Matrix（機體 + 配件 Stat_Modifiers 的 Armor_* 疊加）+ 目標格地形抗性（terrain.md 的 Fire_Res、Elec_Res 等）。
- **環境**：Rain 等對 Beam_Atk / Fire_Atk 的修正，作用在 Atk_n 或最終傷害均可，需與 terrain.md 定義一致。

---

## 5. 結算順序（單次攻擊後）

1. **目標 HP**：HP -= Final_Damage（下限 0）。
2. **攻擊方 EN**：若武器 EN_Cost > 0，當前 EN -= EN_Cost。
3. **攻擊方彈藥**：若武器 Max_Ammo ≥ 0 且非無限，當前 Ammo -= 1；若歸零則該武器本場不可再使用（或需補給規則）。
4. **死亡判定**：若目標 HP ≤ 0，觸發 `core/event_handler.md` § Unit_Death_Listener（移除格子、掉落/經驗等）。
5. **反擊觸發**：若目標 HP > 0 且防禦方在攻擊方武器 RNG 內、且防禦方武器為 Melee 或具反擊能力，觸發 Counter_Check。防禦方為我方則顯示反擊選單；防禦方為敵方則敵方自動反擊。

---

## 6. 與駕駛員／機體資料的對照

| 來源 | 用途 |
|------|------|
| **Weapon** (data/weapons.md) | Atk_Vector, Stance, RNG_Min/Max, Accuracy_Mod, EN_Cost, Max_Ammo |
| **Pilot** (data/pilots.md) | Melee / Ranged → Attacker_Mod；Reflex → Defender_Mod；Technique → Crit_Rate |
| **Mecha + Parts** | 目標 Armor_Matrix、HP、EN、Evade_Bonus 等（ref: lobby_logic Stat_Stacking） |
| **Terrain / Weather** | data/terrain.md Grid_Effect_Rules、Environmental_States |

---

## 7. 工程實作備註

- 命中/暴擊可先做簡化：例如 Attacker_Mod = Pilot.Melee 或 Ranged，Defender_Mod = Defender.Reflex，單位為 %，再後續平衡調表。
- 若暫無「查表」，所有 Pilot 相關修正用線性即可；之後可抽成 Config 或表驅動。
- 反擊時的命中/傷害計算與上述同一套，僅攻擊方/防禦方角色對調。
