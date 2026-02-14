# SKILL: Spirit_Skills（精神指令）

> 駕駛員於戰鬥中消耗 Willpower 使用；駕駛資料中的 Spirit_Skills 為本表 ID 列表。  
> 對應：`data/entities.md` § Pilot_Profile_Schema — Spirit_Skills。  
> 戰鬥流程：於行動階段或指定時機選擇發動（可依 UI 設計：回合開始／選單位時／選指令時）。

---

## 1. 欄位定義 (Schema)

| 欄位 | 型別 | 說明 |
|------|------|------|
| **ID** | string | 唯一識別碼，與 pilots.md Spirit_Skills 對應 |
| **Name** | string | 顯示名稱 |
| **Name_TW** | string | 中文名稱（選填） |
| **Will_Cost** | int | 消耗鬥志 (Current_Willpower) |
| **Target** | enum | Self / Ally_One / Ally_All / Enemy_One（依指令） |
| **Effect** | object | 效果鍵值，見下表 |
| **Timing** | string | 使用時機：Phase_Start / Before_Action / After_Action / On_Being_Hit（可選） |
| **Duration** | string | 當回合 (Turn) / 永久至戰鬥結束 (Battle) / 單次 (Once) |

### Effect 常用鍵

| 鍵名 | 說明 | 數值例 |
|------|------|--------|
| Hit_Bonus | 命中率加算（%） | 20 |
| Evade_Bonus | 迴避率加算（%） | 15 |
| Damage_Mod | 傷害乘數 | 1.2 |
| MOV_Bonus | 移動力加算 | 2 |
| EN_Regen_Once | 單次 EN 回復量 | 30 |
| HP_Heal_Once | 單次 HP 回復量 | 50 |
| Counter_Enable | 本回合可反擊（若武器非 Melee 則暫時視同具反擊資格） | true |
| Remove_Debuff | 解除負面狀態（可擴） | — |

---

## 2. 精神指令清單

### FOCUS（集中）

```yaml
ID: FOCUS
Name: Focus
Name_TW: 集中
Will_Cost: 15
Target: Self
Effect:
  Hit_Bonus: 20
  Evade_Bonus: 10
Timing: Before_Action
Duration: Turn
```

### ACCEL（加速）

```yaml
ID: ACCEL
Name: Accel
Name_TW: 加速
Will_Cost: 10
Target: Self
Effect:
  MOV_Bonus: 3
Timing: Before_Action
Duration: Turn
```

### TRUST（信賴）

```yaml
ID: TRUST
Name: Trust
Name_TW: 信賴
Will_Cost: 20
Target: Ally_One
Effect:
  EN_Regen_Once: 25
  HP_Heal_Once: 30
Timing: Before_Action
Duration: Once
```

### HIT（必中）

```yaml
ID: HIT
Name: Hit
Name_TW: 必中
Will_Cost: 25
Target: Self
Effect:
  Hit_Bonus: 50
Timing: Before_Action
Duration: Turn
```

### SPIRIT（氣合）

```yaml
ID: SPIRIT
Name: Spirit
Name_TW: 氣合
Will_Cost: 30
Target: Self
Effect:
  Damage_Mod: 1.25
Timing: Before_Action
Duration: Turn
```

### STRIVE（努力）

```yaml
ID: STRIVE
Name: Strive
Name_TW: 努力
Will_Cost: 20
Target: Self
Effect:
  Hit_Bonus: 15
  Damage_Mod: 1.15
Timing: Before_Action
Duration: Turn
```

### COUNTER（反擊）

```yaml
ID: COUNTER
Name: Counter
Name_TW: 反擊
Will_Cost: 18
Target: Self
Effect:
  Counter_Enable: true
  Evade_Bonus: 5
Timing: Phase_Start
Duration: Turn
```

- **說明**：當武器非 Melee 時，本回合仍可選擇反擊（或反擊命中/傷害加成，依實作擇一）。

---

## 3. 工程實作備註

- **Willpower**：每回合開始可回復一定量（如 10）或依擊殺/被擊中變化；上限為 Pilot.Max_Willpower。
- **時機**：Phase_Start = 該單位回合開始時可選；Before_Action = 執行移動/攻擊前可選。
- **Target Ally_One**：由玩家在合法目標中選擇一名友軍。
- 新增精神只需在本表追加一筆，並在對應駕駛的 Spirit_Skills 中加入 ID。
