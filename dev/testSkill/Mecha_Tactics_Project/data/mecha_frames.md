# 機體基本資料 (Mecha Frames) — 商店／裝配用

> 對應 Schema：`data/entities.md` § Mecha_Frame_Schema  
> 裝配驗證：`core/lobby_logic.md` § Assembly_Validation

## 1. 欄位定義 (Schema)

| 欄位 | 型別 | 說明 | 商店／裝配用途 |
|------|------|------|----------------|
| **ID** | string | 唯一識別碼 | 庫存、裝配綁定 |
| **Name** | string | 顯示名稱 | 商店列表、機庫顯示 |
| **Name_TW** | string | 中文名稱（選填） | 介面在地化 |
| **Size** | string | 體型 (S/M/L) | 影響被彈面積、部分地形 |
| **Description** | string | 簡述 | 商店說明、機庫說明 |
| **Price** | int | 購買價格 | 商店扣款：Balance >= Price |
| **Max_HP** | int | 最大耐久 | 戰鬥計算、顯示 |
| **Max_EN** | int | 最大 EN | 戰鬥、EN 消耗與回復 |
| **EN_Regen** | int | 每回合 EN 回復 | 裝配驗證：Σ Part.Passive_Draw <= 此值 |
| **Base_MOV** | int | 基礎移動力 | 地形適性換算後得實際 MC |
| **Weight_Limit** | int | 載重上限 | 裝配驗證：Σ(Weapon.W + Part.W) <= 此值 |
| **Weapon_Slots** | list | 武器槽定義 | 每槽含 Slot_Tag，見下 |
| **Part_Slots** | int | 配件槽數量 | 可裝配件數量上限 |
| **Adaptability** | object | 地形適性 | Land/Mountain/Sea/Air/Space，等級 S~E |
| **Armor_Matrix** | object | 五屬減傷 | Fire, Elec, Beam, Kin, Chem（數值為 flat 減傷） |

### Weapon_Slots 結構

每台機體的 `Weapon_Slots` 為陣列，每項一槽，需含：

- **Slot_Tag**: `Hand` | `Shoulder` | `Internal` — 武器裝備時必須符合此標籤（ref: lobby_logic Slot_Constraint）。

---

## 2. 地形適性等級 (MC 對照)

| 等級 | 移動係數 (MC) |
|------|----------------|
| S | 0.5 |
| A | 1.0 |
| B | 1.5 |
| C | 2.0 |
| D | 3.0 |
| E | ∞（不可進入） |

---

## 3. 機體清單 (可擴充)

### M001 — 蒼藍魚人 (BLUE_SQUUID)

```yaml
ID: M001
Name: Blue Squuid
Name_TW: 蒼藍魚人
Size: M
Description: 水陸兩用中型機，擅長海域作戰。
Price: 12000

Max_HP: 320
Max_EN: 180
EN_Regen: 25
Base_MOV: 6

Weight_Limit: 120
Weapon_Slots:
  - Slot_Tag: Hand
  - Slot_Tag: Shoulder
Part_Slots: 2

Adaptability:
  Land: B
  Sea: S
  Air: D
  Mountain: C
  Space: E

Armor_Matrix:
  Kin: 20
  Beam: 10
  Fire: 40
  Elec: 5
  Chem: 15
```

### M002 — 陸戰型 (LAND_GRUNT)

```yaml
ID: M002
Name: Land Grunt
Name_TW: 陸戰型
Size: M
Description: 泛用陸戰機體，成本低、易量產。
Price: 8000

Max_HP: 280
Max_EN: 120
EN_Regen: 15
Base_MOV: 5

Weight_Limit: 100
Weapon_Slots:
  - Slot_Tag: Hand
  - Slot_Tag: Hand
  - Slot_Tag: Shoulder
Part_Slots: 2

Adaptability:
  Land: A
  Sea: D
  Air: E
  Mountain: B
  Space: E

Armor_Matrix:
  Kin: 25
  Beam: 15
  Fire: 20
  Elec: 10
  Chem: 20
```

### M003 — 輕量斥候 (SCOUT_LITE)

```yaml
ID: M003
Name: Scout Lite
Name_TW: 輕量斥候
Size: S
Description: 高機動偵察用，載重與武裝槽較少。
Price: 6000

Max_HP: 200
Max_EN: 150
EN_Regen: 22
Base_MOV: 8

Weight_Limit: 60
Weapon_Slots:
  - Slot_Tag: Hand
  - Slot_Tag: Internal
Part_Slots: 1

Adaptability:
  Land: A
  Sea: C
  Air: B
  Mountain: A
  Space: D

Armor_Matrix:
  Kin: 10
  Beam: 8
  Fire: 12
  Elec: 8
  Chem: 10
```

---

## 4. 工程實作備註

- **商店**：僅列出 `Price` 與 Basic 欄位；購買時檢查 `Balance >= Price`，扣款後將機體加入玩家庫存。
- **裝配**：從庫存選機體後，用其 `Weapon_Slots`（Slot_Tag）與 `Part_Slots`、`Weight_Limit`、`EN_Regen` 做合法性驗證（ref: lobby_logic § 2、§ 3）。
- **戰鬥**：最終 HP/EN/MOV/Adaptability/Armor 依 `core/lobby_logic.md` § Stat_Stacking 與配件效果疊加。
