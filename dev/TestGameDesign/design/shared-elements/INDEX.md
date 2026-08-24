# 共用元素速查索引

各檔案內元素數量與用途一覽，方便企劃或程式快速找到要引用的 id。

| 檔案 | 數量 | 說明 |
|------|------|------|
| `items/consumables.json` | 8 | 藥水（HP/MP）、食物、解毒劑、增益劑 |
| `items/materials.json` | 10 | 礦石（鐵銅銀金）、藥草、皮革、布料、寶石 |
| `items/keys.json` | 6 | 鑰匙、信、識別證、地圖等任務/關鍵道具 |
| `equipment/weapons.json` | 12 | 短劍、長劍、大劍、斧、錘、槍、弓、法杖、魔杖 |
| `equipment/armor.json` | 16 | 頭/身/手/腳/盾/飾品，布/皮/金屬 |
| `classes/classes.json` | 5 | 戰士、盜賊、法師、牧師、弓箭手 |
| `skills/skills.json` | 22 | 主動／被動／大招，對應各職業（含普通攻擊、治癒、火球等） |

**引用範例**（依專案實作）：

- 程式：讀取 JSON，以 `id` 作為唯一鍵建立道具表或裝備表。
- 企劃：在 GDD 或關卡表裡直接寫 `consumable_potion_hp_small`、`weapon_long_sword`、`class_warrior`、`skill_fire_ball` 等 id。
- 在地化：若有 `nameKey` / `descKey`，在語言檔中對應翻譯即可。
