# 配件基本資料 (Parts) — 商店／裝配用

> 對應 Schema：`data/entities.md` § Part_Profile_Schema  
> 裝配驗證：`core/lobby_logic.md` § Assembly_Validation — Weight、EN_Regen、Part_Slots

## 1. 欄位定義 (Schema)

| 欄位 | 型別 | 說明 | 商店／裝配用途 |
|------|------|------|----------------|
| **ID** | string | 唯一識別碼 | 庫存、裝配綁定 |
| **Name** | string | 顯示名稱 | 商店列表、機體狀態畫面 |
| **Name_TW** | string | 中文名稱（選填） | 介面在地化 |
| **Weight** | int | 重量 | 裝配驗證：Σ Part.W <= Mecha.Weight_Limit |
| **Price** | int | 購買價格 | 商店扣款：Balance >= Price |
| **Passive_Draw** | int | 被動 EN 消耗 | 每回合從 EN_Regen 扣除；裝配驗證：Σ Passive_Draw <= Mecha.EN_Regen |
| **Stat_Modifiers** | object | 數值修正 | HP/EN/MOV/命中/裝甲等（見下表） |
| **Adaptability_Fix** | object | 地形適性修正（選填） | 對 Land/Sea/Air/Mountain/Space 加減等級 |
| **Special_Functions** | list | 特殊效果 ID（選填） | 條件式效果，由戰鬥／大廳邏輯解析 |

---

## 2. Stat_Modifiers 常用鍵

| 鍵名 | 說明 | 疊加方式（ref: lobby_logic § Stat_Stacking） |
|------|------|----------------------------------------------|
| HP_Bonus | 最大 HP 加算 | Final_HP = Mecha.Base_HP + Σ Part.HP_Bonus |
| EN_Bonus | 最大 EN 加算 | 同上概念 |
| MOV_Bonus | 移動力加算 | 與地形適性一併計算實際 MC |
| EN_Regen_Bonus | EN 回復加算 | 可抵銷 Passive_Draw 或增加淨回復 |
| Evade_Bonus | 迴避修正（%） | 戰鬥公式使用 |
| Accuracy_Bonus | 命中修正（%） | 戰鬥公式使用 |
| Armor_* | 單一屬性裝甲加算 | 如 Armor_Kin、Armor_Beam 等，與機體 Armor_Matrix 疊加 |

---

## 3. 配件清單 (可擴充)

### PT001 — 水流推進器 (HYDRO_TURBINE)

```yaml
ID: PT001
Name: Hydro Turbine
Name_TW: 水流推進器
Weight: 15
Price: 3800
Passive_Draw: 5

Stat_Modifiers:
  EN_Regen_Bonus: 0
Adaptability_Fix: {}
Special_Functions: [SEA_MOV_EN_BOOST]
```

- **SEA_MOV_EN_BOOST**（規則說明）：當單位所在格 Terrain == Sea 時，MOV +2、EN_Regen +10（當回合或常駐依實作而定）。

### PT002 — 裝甲襯板 (ARMOR_LINER)

```yaml
ID: PT002
Name: Armor Liner
Name_TW: 裝甲襯板
Weight: 20
Price: 2500
Passive_Draw: 0

Stat_Modifiers:
  HP_Bonus: 50
  Armor_Kin: 10
  Armor_Beam: 5
Adaptability_Fix: {}
Special_Functions: []
```

### PT003 — 高機動推進器 (HIGH_MOBILITY)

```yaml
ID: PT003
Name: High-Mobility Thruster
Name_TW: 高機動推進器
Weight: 18
Price: 4500
Passive_Draw: 12

Stat_Modifiers:
  MOV_Bonus: 2
  Evade_Bonus: 10
Adaptability_Fix:
  Air: 1
Special_Functions: []
```

- **Adaptability_Fix**：數值 +1 表示該地形適性提升一級（如 B→A），-1 表示降一級；工程需自訂等級順序 (S>A>B>C>D>E)。

### PT004 — 護盾電容 (SHIELD_CAPACITOR)

```yaml
ID: PT004
Name: Shield Capacitor
Name_TW: 護盾電容
Weight: 14
Price: 5200
Passive_Draw: 8

Stat_Modifiers:
  EN_Bonus: 30
  EN_Regen_Bonus: 5
  Armor_Beam: 15
  Armor_Elec: 10
Adaptability_Fix: {}
Special_Functions: []
```

### PT005 — 瞄準輔助 (TARGETING_ASSIST)

```yaml
ID: PT005
Name: Targeting Assist Unit
Name_TW: 瞄準輔助
Weight: 6
Price: 2800
Passive_Draw: 3

Stat_Modifiers:
  Accuracy_Bonus: 8
Adaptability_Fix: {}
Special_Functions: []
```

### PT006 — 輕量框架 (LIGHTWEIGHT_FRAME)

```yaml
ID: PT006
Name: Lightweight Frame
Name_TW: 輕量框架
Weight: 0
Price: 3500
Passive_Draw: 0

Stat_Modifiers:
  MOV_Bonus: 1
Adaptability_Fix: {}
Special_Functions: [REDUCE_EQUIP_WEIGHT]
```

- **REDUCE_EQUIP_WEIGHT**（規則說明）：裝備的武器與配件總重視為減少 10%（或固定值），僅用於裝配驗證；實際戰鬥重量是否減免依策劃與實作決定。

---

## 4. 工程實作備註

- **商店**：顯示 Name、Price、Weight、Passive_Draw、Stat_Modifiers 摘要；購買時檢查 `Balance >= Price`，扣款後加入庫存。
- **裝配**：
  - 數量：已裝配件數 < Mecha.Part_Slots。
  - 重量：Σ(Weapon.W + Part.W) <= Mecha.Weight_Limit。
  - EN：Σ Part.Passive_Draw <= Mecha.EN_Regen（可再加上 Part.EN_Regen_Bonus 做淨回復驗證）。
- **戰鬥**：Final_HP、Final_Adaptability、Armor 等依 `core/lobby_logic.md` § Stat_Stacking 與 Part 的 Stat_Modifiers、Adaptability_Fix、Special_Functions 合併計算。
- **Special_Functions**：建議在 `data/special_effects.md` 或 core 內維護 ID 與實際效果對照，供大廳與戰鬥共用。
