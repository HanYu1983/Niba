# 駕駛基本資料 (Pilots) — 商店／編成用

> 對應 Schema：`data/entities.md` § Pilot_Profile_Schema

## 1. 欄位定義 (Schema)

| 欄位 | 型別 | 說明 | 商店／編成用途 |
|------|------|------|----------------|
| **ID** | string | 唯一識別碼 | 庫存、編成綁定 |
| **Name** | string | 顯示名稱 | 商店列表、小隊名單 |
| **Name_TW** | string | 中文名稱（選填） | 介面在地化 |
| **Rank** | string | 階級／稱號 | 敘事、解鎖條件（可選） |
| **Description** | string | 簡述 | 商店說明 |
| **Price** | int | 招募價格 | 商店扣款：Balance >= Price |
| **Melee** | int | 格鬥補正 | 近戰命中／傷害修正 |
| **Ranged** | int | 射擊補正 | 遠程命中／傷害修正 |
| **Reflex** | int | 反應補正 | 迴避、反擊判定 |
| **Technique** | int | 技術補正 | 暴擊、特殊武器效果（可擴） |
| **Max_Willpower** | int | 最大鬥志 | 精神指令資源上限 |
| **Spirit_Skills** | list | 精神指令 ID 列表 | 可使用的精神指令 |
| **Trait** | list | 被動能力 ID 列表 | 常駐被動效果 |

---

## 2. 駕駛清單 (可擴充)

### P001 — 蒼藍魚人專屬駕駛 (BLUE_ACE)

```yaml
ID: P001
Name: Blue Ace
Name_TW: 蒼藍王牌
Rank: Ace
Description: 擅長水域作戰的駕駛，與蒼藍魚人相性佳。
Price: 5000

Melee: 14
Ranged: 10
Reflex: 16
Technique: 12

Max_Willpower: 100
Spirit_Skills: [FOCUS, ACCEL, COUNTER]
Trait: [SEA_AFFINITY]
```

### P002 — 泛用兵 (LINE_PILOT)

```yaml
ID: P002
Name: Line Pilot
Name_TW: 泛用兵
Rank: Sergeant
Description: 標準訓練出身的量產駕駛。
Price: 2000

Melee: 10
Ranged: 10
Reflex: 10
Technique: 10

Max_Willpower: 80
Spirit_Skills: [FOCUS, TRUST]
Trait: []
```

### P003 — 狙擊手 (SNIPER_COLD)

```yaml
ID: P003
Name: Cold Eye
Name_TW: 冷眼
Rank: Specialist
Description: 專精遠距與定點射擊，適合 Overwatch／Snipe。
Price: 6500

Melee: 6
Ranged: 18
Reflex: 14
Technique: 16

Max_Willpower: 90
Spirit_Skills: [FOCUS, HIT, SPIRIT]
Trait: [SNIPE_ACCURACY]
```

### P004 — 突擊手 (ASSAULT_FIST)

```yaml
ID: P004
Name: Assault Fist
Name_TW: 突擊之拳
Rank: Ace
Description: 偏好近戰與高機動接敵。
Price: 5500

Melee: 18
Ranged: 8
Reflex: 14
Technique: 12

Max_Willpower: 95
Spirit_Skills: [ACCEL, STRIVE, COUNTER]
Trait: [MELEE_CRIT_BONUS]
```

---

## 3. 精神指令／特質 ID 對照（建議另開表）

以下為範例 ID，實際效果需在戰鬥系統中實作：

- **Spirit_Skills**: FOCUS, ACCEL, TRUST, HIT, SPIRIT, STRIVE, COUNTER 等。
- **Trait**: SEA_AFFINITY（海域適性加成）、SNIPE_ACCURACY（狙擊命中加成）、MELEE_CRIT_BONUS（格鬥暴擊加成）等。

工程可於 `data/spirit_skills.md`、`data/traits.md` 另行定義數值與觸發條件。

---

## 4. 工程實作備註

- **商店**：顯示 Name、Rank、Price、Description；購買時檢查 `Balance >= Price`，扣款後將駕駛加入玩家庫存。
- **編成**：小隊編成時可將駕駛與機體綁定；戰鬥時讀取該駕駛的 Combat_Stats、Mental、Trait 參與公式與事件（ref: systems.md、event_handler.md）。
