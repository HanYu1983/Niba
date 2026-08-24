# 共用元素 — 通用屬性與分類（Schema）

以下為「與遊戲無關」的通用欄位定義。各專案可依需求**省略**或**擴充**欄位，但建議至少保留 `id`、`name`、`category`、`tags`。

---

## 一、所有元素共用欄位（Common）

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | string | 唯一識別碼，建議格式：`類別_名稱`（如 `consumable_potion_hp_small`） |
| `name` | string | 預設顯示名稱（可作為 fallback，實際遊戲可用 nameKey 做多語系） |
| `nameKey` | string | 選填。對應語言表的 key，若存在則優先使用 |
| `description` | string | 預設描述 |
| `descKey` | string | 選填。描述的多語系 key |
| `category` | string | 大類：見下方「分類樹」 |
| `tags` | string[] | 標籤陣列，用於篩選與行為（如 `melee`, `fire`, `quest`） |
| `rarity` | string | 選填。常見值：`common`, `uncommon`, `rare`, `epic`, `legendary` |
| `value` | number | 選填。基礎買賣價或權重，遊戲可自行解讀為金幣/點數等 |
| `weight` | number | 選填。重量或負重值 |
| `stackable` | boolean | 選填。是否可堆疊，預設 true（道具類通常 true，裝備通常 false） |
| `maxStack` | number | 選填。堆疊上限，僅當 stackable 為 true 時有效 |

---

## 二、道具類（Items）擴充欄位

| 欄位 | 型別 | 說明 |
|------|------|------|
| `useEffect` | object | 選填。使用時觸發的效果代碼或效果 id，由遊戲實作解讀 |
| `consumable` | boolean | 是否為消耗品（用一次即消失） |

---

## 三、武器（Weapons）擴充欄位

| 欄位 | 型別 | 說明 |
|------|------|------|
| `slot` | string | 裝備槽位，如 `weapon_main`, `weapon_sub`, `ranged` |
| `damageType` | string | 傷害類型：`physical`, `slash`, `pierce`, `blunt`, `fire`, `ice`, `lightning`, `dark`, `holy` 等 |
| `attack` | number | 基礎攻擊／傷害值（遊戲可改為公式或區間） |
| `range` | string | 選填。`melee`, `short`, `medium`, `long` |
| `speed` | string | 選填。攻擊速度或冷卻：`slow`, `normal`, `fast` |

---

## 四、防具（Armor）擴充欄位

| 欄位 | 型別 | 說明 |
|------|------|------|
| `slot` | string | 裝備槽位：`head`, `body`, `hands`, `feet`, `accessory`, `shield` 等 |
| `defense` | number | 基礎防禦值 |
| `resistance` | object | 選填。屬性抗性，如 `{ "fire": 0.2, "ice": -0.1 }`（比例） |

---

## 五、分類樹（Taxonomy）

```
item
├── consumable     # 消耗品（藥水、食物）
├── material       # 材料（礦石、素材、合成用）
├── key            # 關鍵／任務道具
└── other          # 其他

equipment
├── weapon         # 武器
│   ├── melee
│   └── ranged
└── armor          # 防具
    ├── head / body / hands / feet / accessory / shield

class               # 職業（獨立大類）
skill               # 技能（獨立大類）
```

---

## 六、標籤建議（Tags）

- **武器**：`melee`, `ranged`, `one-handed`, `two-handed`, `slash`, `pierce`, `blunt`, `fire`, `ice`, `lightning`, `magic`
- **防具**：`light`, `heavy`, `cloth`, `leather`, `metal`, `shield`
- **道具**：`heal`, `mana`, `buff`, `debuff`, `quest`, `key`, `craft`, `trade`

遊戲可依需要新增專屬 tag，不影響共用庫。

---

## 七、職業（Class）欄位

職業沿用共用欄位 `id`、`name`、`description`、`nameKey`、`descKey`、`tags`，並可省略 `value`、`weight`、`stackable` 等與裝備/道具相關欄位。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `role` | string | 選填。定位：`tank`, `dps`, `healer`, `support`, `hybrid` 等 |
| `allowedWeaponTags` | string[] | 選填。可裝備的武器標籤（如 `melee`, `one-handed`, `magic`），遊戲依 tag 篩選 |
| `allowedArmorTags` | string[] | 選填。可裝備的防具標籤（如 `light`, `heavy`, `cloth`, `leather`, `metal`） |
| `baseStats` | object | 選填。基礎屬性，key 由遊戲自訂（如 `power`, `defense`, `speed`, `magic`, `vitality`），值為數值 |
| `statGrowth` | object | 選填。每級成長（同上 key），遊戲用於升級計算 |
| `resourceType` | string | 選填。主要消耗資源：`mp`, `stamina`, `energy`, `rage` 等 |
| `skillIds` | string[] | 選填。此職業可學習／使用的技能 id 列表 |

---

## 八、技能（Skill）欄位

技能沿用共用欄位 `id`、`name`、`description`、`tags`。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `category` | string | 技能類型：`active`（主動）, `passive`（被動）, `ultimate`（必殺／大招） |
| `targetType` | string | 目標類型：`self`, `single_ally`, `single_enemy`, `aoe_ally`, `aoe_enemy`, `all_ally`, `all_enemy` |
| `range` | string | 選填。施放距離：`melee`, `short`, `medium`, `long` |
| `cost` | object | 選填。消耗資源，如 `{ "type": "mp", "amount": 10 }` 或 `{ "type": "stamina", "amount": 5 }` |
| `cooldown` | number | 選填。冷卻時間（秒或回合，由遊戲定義單位） |
| `effect` | object | 選填。效果描述，由遊戲解讀。例：`{ "type": "damage", "element": "fire", "power": 1.2 }`、`{ "type": "heal", "power": 0.8 }` |
| `classIds` | string[] | 選填。可使用此技能的職業 id；空陣列或不填表示通用／全職業 |
| `learnLevel` | number | 選填。習得等級或解鎖條件數值 |

---

## 九、職業與技能分類／標籤建議

- **職業 role**：`tank`, `dps`, `healer`, `support`, `hybrid`
- **職業 tags**：`melee`, `ranged`, `magic`, `physical`, `light_armor`, `heavy_armor`
- **技能 category**：`active`, `passive`, `ultimate`
- **技能 tags**：`damage`, `heal`, `buff`, `debuff`, `physical`, `fire`, `ice`, `lightning`, `holy`, `dark`, `aoe`, `single_target`
