# 武器基本資料 (Weapons) — 商店／裝配用

> 對應 Schema：`data/entities.md` § Weapon_Profile_Schema  
> 裝配驗證：`core/lobby_logic.md` § Slot_Constraint — 武器 Slot_Tag 須符合機體 Weapon_Slots  
> 攻擊架勢：`data/attributes.md` § Attack_Stances

## 1. 欄位定義 (Schema)

| 欄位 | 型別 | 說明 | 商店／裝配用途 |
|------|------|------|----------------|
| **ID** | string | 唯一識別碼 | 庫存、裝配綁定 |
| **Name** | string | 顯示名稱 | 商店列表、戰鬥選單 |
| **Name_TW** | string | 中文名稱（選填） | 介面在地化 |
| **Slot_Tag** | enum | 裝備槽類型 | 必須等於機體該槽的 Slot_Tag：Hand / Shoulder / Internal |
| **Weight** | int | 重量 | 裝配驗證：Σ Weapon.W <= Mecha.Weight_Limit |
| **Price** | int | 購買價格 | 商店扣款：Balance >= Price |
| **Atk_Vector** | object | 傷害屬性 | Fire, Elec, Beam, Kin, Chem（可多屬並存） |
| **Stance** | enum | 攻擊架勢 | Melee / Assault / Direct_Fire / Snipe（影響行動邏輯與反擊／Overwatch） |
| **RNG_Min** | int | 最小射程（格） | 距離判定 |
| **RNG_Max** | int | 最大射程（格） | 距離判定；Snipe 用於 Overwatch_Zone |
| **Accuracy_Mod** | int | 命中修正（%） | 最終命中率加減 |
| **EN_Cost** | int | 每次使用 EN 消耗 | 0 表示不耗 EN |
| **Max_Ammo** | int | 彈藥數（可選） | -1 或 0 表示無限彈藥 |

---

## 2. 攻擊架勢 (Attack_Stances) — 細則

完整定義見 `data/attributes.md` § 2。此處為對照與狙擊觸發條件的低熵摘要。

### 2.1 架勢對照表

| Stance | 可攻擊時機 | 反擊 | 備註 |
|--------|-------------|------|------|
| Melee | 目標在 RNG 內即可 | 可觸發 Counter_Menu | 防禦加成依實作 |
| Assault | 可移動後再攻擊 | 預設不可；Counter_Expert 除外 | 移動後攻擊 |
| Direct_Fire | 通常需靜止／未移動 | 預設不可 | 精準直射 |
| Snipe | 主動攻擊同一般；另可於敵方移動完成時觸發中斷 | 預設不可 | 見 §2.2 |

### 2.2 Snipe 狙擊觸發條件（供 AI／實作解析）

- **事件**：敵方機體完成一次「移動」；即敵方單位狀態變為 Move_Complete，且其位置已更新為**移動目的地格**（Final_Coord）。
- **條件 1**：存在己方單位 U，U 已設定 Overwatch（結束回合時裝備 Stance == Snipe 的武器並進入 Overwatch 狀態）。
- **條件 2**：該敵方單位的 **Final_Coord** 落在 U 的 **Overwatch_Zone** 內。Overwatch_Zone = 以 U 為原點、U 當前 Snipe 武器 RNG_Min～RNG_Max 所涵蓋之格子集合。
- **條件 3**：U 在本回合尚未執行過狙擊（即 U.Snipe_Triggered_This_Round == False）。
- **滿足後**：暫停 → 詢問 U 是否狙擊 → 若執行，則對該敵方單位做一次攻擊，並設 U.Snipe_Triggered_This_Round = True。
- **重置**：U.Snipe_Triggered_This_Round 在「下一回合開始」或「回合輪替時」設回 False（每台機體每回合最多觸發一次狙擊）。

---

## 3. 武器清單 (可擴充)

### W001 — 離子三叉戟 (ION_TRIDENT)

```yaml
ID: W001
Name: Ion Trident
Name_TW: 離子三叉戟
Slot_Tag: Hand
Weight: 18
Price: 4200

Atk_Vector:
  Kin: 50
  Elec: 30
Stance: Melee
RNG_Min: 1
RNG_Max: 1
Accuracy_Mod: 5

EN_Cost: 15
Max_Ammo: -1
```

### W002 — 突擊步槍 (ASSAULT_RIFLE)

```yaml
ID: W002
Name: Assault Rifle
Name_TW: 突擊步槍
Slot_Tag: Hand
Weight: 12
Price: 2800

Atk_Vector:
  Kin: 45
Stance: Assault
RNG_Min: 2
RNG_Max: 5
Accuracy_Mod: 0

EN_Cost: 0
Max_Ammo: 24
```

### W003 — 肩載光束砲 (SHOULDER_BEAM)

```yaml
ID: W003
Name: Shoulder Beam Cannon
Name_TW: 肩載光束砲
Slot_Tag: Shoulder
Weight: 22
Price: 5500

Atk_Vector:
  Beam: 55
Stance: Direct_Fire
RNG_Min: 3
RNG_Max: 7
Accuracy_Mod: -5

EN_Cost: 35
Max_Ammo: -1
```

### W004 — 長程狙擊 (LONG_SNIPE)

```yaml
ID: W004
Name: Long-Range Sniper
Name_TW: 長程狙擊
Slot_Tag: Shoulder
Weight: 20
Price: 7200

Atk_Vector:
  Kin: 70
Stance: Snipe
RNG_Min: 4
RNG_Max: 10
Accuracy_Mod: 10

EN_Cost: 20
Max_Ammo: 8
```

### W005 — 內藏機槍 (INTERNAL_MG)

```yaml
ID: W005
Name: Internal Machine Gun
Name_TW: 內藏機槍
Slot_Tag: Internal
Weight: 8
Price: 1500

Atk_Vector:
  Kin: 25
Stance: Assault
RNG_Min: 1
RNG_Max: 3
Accuracy_Mod: 5

EN_Cost: 0
Max_Ammo: 40
```

### W006 — 熱能軍刀 (HEAT_SABER)

```yaml
ID: W006
Name: Heat Saber
Name_TW: 熱能軍刀
Slot_Tag: Hand
Weight: 10
Price: 3200

Atk_Vector:
  Kin: 35
  Fire: 25
Stance: Melee
RNG_Min: 1
RNG_Max: 1
Accuracy_Mod: 10

EN_Cost: 8
Max_Ammo: -1
```

---

## 4. 工程實作備註

- **商店**：依 Slot_Tag 篩選（可選）；顯示 Name、Price、Weight、Stance、RNG、Atk 摘要；購買時檢查 `Balance >= Price`，扣款後加入庫存。
- **裝配**：玩家選擇武器裝上機體時，檢查該機體任一大於 0 的武器槽的 Slot_Tag 是否等於此武器的 Slot_Tag，且總重不超過 Weight_Limit。
- **戰鬥**：當前裝備武器決定 Stance、RNG、Atk_Vector、EN_Cost、Max_Ammo；Snipe 架勢需參與 Overwatch_Interrupt（ref: systems.md § 3、event_handler.md）。
