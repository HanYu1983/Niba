# SKILL: Traits（駕駛被動特質）

> 駕駛員常駐被動效果；駕駛資料中的 Trait 為本表 ID 列表。  
> 對應：`data/entities.md` § Pilot_Profile_Schema — Trait。  
> 戰鬥／大廳：數值參與 combat_logic、地形適性等計算時讀取。

---

## 1. 欄位定義 (Schema)

| 欄位 | 型別 | 說明 |
|------|------|------|
| **ID** | string | 唯一識別碼，與 pilots.md Trait 對應 |
| **Name** | string | 顯示名稱 |
| **Name_TW** | string | 中文名稱（選填） |
| **Condition** | string | 觸發條件（見下）；Always 表示常駐 |
| **Effect** | object | 效果鍵值；與 spirit_skills / combat_logic 對接 |

### Condition 常用值

| 值 | 說明 |
|----|------|
| Always | 常駐生效 |
| Terrain_Sea | 單位所在格 Terrain_Tag == Sea |
| Terrain_Land | 單位所在格為 Land 系（Plain, Forest, Ruin, Desert, Sand） |
| Weapon_Stance_Melee | 當前武器 Stance == Melee |
| Weapon_Stance_Snipe | 當前武器 Stance == Snipe |
| HP_Below_30 | 當前 HP ≤ 30% Max_HP（可擴） |

### Effect 常用鍵

| 鍵名 | 說明 | 數值例 |
|------|------|--------|
| Hit_Bonus | 命中率加算（%） | 5 |
| Evade_Bonus | 迴避率加算（%） | 8 |
| Damage_Mod | 傷害乘數 | 1.1 |
| Crit_Rate_Bonus | 暴擊率加算（%） | 5 |
| MOV_Bonus | 移動力加算 | 1 |
| EN_Regen_Bonus | EN 回復加算 | 5 |
| Adaptability_Sea | 僅在 Condition 滿足時，Sea 適性視同提升一級 | 1 |
| Snipe_Accuracy_Bonus | 使用 Snipe 武器時命中加算 | 10 |

---

## 2. 特質清單

### SEA_AFFINITY（海域適性）

```yaml
ID: SEA_AFFINITY
Name: Sea Affinity
Name_TW: 海域適性
Condition: Terrain_Sea
Effect:
  MOV_Bonus: 1
  EN_Regen_Bonus: 5
  Evade_Bonus: 5
```

### SNIPE_ACCURACY（狙擊命中）

```yaml
ID: SNIPE_ACCURACY
Name: Snipe Accuracy
Name_TW: 狙擊命中
Condition: Weapon_Stance_Snipe
Effect:
  Snipe_Accuracy_Bonus: 10
```

- **對接**：combat_logic 命中計算時，若當前武器 Stance == Snipe 且駕駛具本特質，則 Hit_Rate += 10。

### MELEE_CRIT_BONUS（格鬥暴擊）

```yaml
ID: MELEE_CRIT_BONUS
Name: Melee Crit Bonus
Name_TW: 格鬥暴擊
Condition: Weapon_Stance_Melee
Effect:
  Crit_Rate_Bonus: 10
```

- **對接**：combat_logic 暴擊判定時，若攻擊方武器為 Melee 且駕駛具本特質，則 Crit_Rate += 10。

### IRON_DEFENSE（鐵壁，範例擴充）

```yaml
ID: IRON_DEFENSE
Name: Iron Defense
Name_TW: 鐵壁
Condition: Always
Effect:
  Evade_Bonus: 5
```

---

## 3. 工程實作備註

- **疊加**：同一單位多個 Trait 的數值效果為加算（Hit_Bonus、Evade_Bonus、MOV_Bonus 等）；Damage_Mod 若多個則可相乘或取最大，需在 combat_logic 內約定。
- **Condition**：每回合或每格移動後重算；Terrain_* 以單位**當前格**為準。
- **適性修正**：Adaptability_Sea: 1 表示在滿足 Condition 時，該單位在 Sea 格上的適性等級視為提升一級（如 B→A），用於 MC 與移動力計算（ref: systems § 2）。
