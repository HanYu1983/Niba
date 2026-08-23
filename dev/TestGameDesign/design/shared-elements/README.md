# 共用遊戲元素庫（Shared Game Elements）

本目錄存放**與具體遊戲無關**的通用設計元素，可在多款遊戲中直接引用或稍作覆寫後使用，減少重複設計並保持風格一致。

---

## 設計原則

1. **抽象優先**：只定義「類型、標籤、通用數值」，不綁定單一世界觀或劇情。
2. **標籤驅動**：用 `tags` 描述用途與特性（如 `melee`、`fire`、`consumable`），各專案依標籤篩選或擴充。
3. **可覆寫**：專案可複製一份並只改需要改的欄位（名稱、數值、描述），其餘沿用。
4. **人機皆讀**：以 JSON 為主，便於程式讀取；必要時可另做 Markdown 對照表給企劃閱讀。

---

## 目錄結構

```
shared-elements/
├── README.md                 # 本說明
├── schema.md                 # 通用屬性與分類定義（給人看）
├── schema.json               # 結構定義（可選，供驗證或工具用）
├── items/                    # 道具類
│   ├── consumables.json      # 消耗品（藥水、食物等）
│   ├── materials.json        # 材料（礦石、素材等）
│   └── keys.json             # 關鍵道具（鑰匙、任務物等）
├── equipment/                # 裝備類
│   ├── weapons.json          # 武器
│   └── armor.json            # 防具
├── classes/                  # 職業
│   └── classes.json          # 通用職業定義
├── skills/                   # 技能
│   └── skills.json           # 通用技能定義
└── effects/                  # 效果／狀態（可選擴充）
    └── status-effects.json
```

---

## 使用方式

- **新專案**：複製 `design/shared-elements` 到專案內，或透過 Git submodule / 共用套件引用。
- **引用時**：以 `id` 為唯一鍵；需要在地化時用 `nameKey` / `descKey` 對應語言表。
- **擴充**：在相同 `id` 下於專案內增加欄位（如 `gameSpecificStat`），不修改原始檔案即可。

---

## 版本與維護

- 新增元素時盡量保持向後相容：只新增欄位、不刪除或改名既有欄位。
- 若需破壞性變更，在 `schema.md` 或本 README 註記版本與遷移方式。
