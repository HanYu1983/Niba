# 靈源界 - 小說世界觀展示網頁

這是一個精美的網頁應用，用於展示你的小說世界觀、人物、物品和小說內容。所有數據都從JSON文件讀取，方便你隨時擴充和修改。

## 📁 項目結構

```
novel-showcase/
├── index.html          # 主頁面
├── css/
│   └── style.css       # 樣式文件
├── js/
│   ├── data-loader.js  # 數據加載器
│   └── app.js          # 主應用程序
├── data/
│   ├── world.json      # 世界觀數據
│   ├── characters.json # 人物數據
│   ├── items.json      # 物品數據
│   └── novels.json     # 小說數據
└── images/             # 圖片文件夾
    ├── characters/     # 人物圖片
    ├── items/          # 物品圖片
    └── novels/         # 小說插圖
```

## 🚀 如何使用

### 1. 預覽網頁

直接在瀏覽器中打開 `index.html` 文件即可預覽。

或者使用本地服務器（推薦）：
```bash
# 使用 Python
cd novel-showcase
python -m http.server 8000

# 或使用 Node.js 的 http-server
npx http-server
```

然後在瀏覽器中訪問 `http://localhost:8000`

### 2. 添加圖片

將圖片放入 `images/` 文件夾的對應子文件夾中：
- 人物圖片：`images/characters/`
- 物品圖片：`images/items/`
- 小說插圖：`images/novels/`
- 世界觀圖片：`images/` 根目錄

### 3. 擴充內容

#### 添加新人物

編輯 `data/characters.json`，添加新的人物對象：

```json
{
  "id": "char_new_character",
  "name": "角色名稱",
  "title": "角色稱號",
  "region": "所屬區域",
  "race": "種族",
  "occupation": "職業",
  "image": "images/characters/角色圖片.jpg",
  "description": "角色簡介",
  "background": "背景故事",
  "abilities": [
    "能力1",
    "能力2",
    "能力3"
  ]
}
```

#### 添加新物品

編輯 `data/items.json`，添加新的物品對象：

```json
{
  "id": "item_new_item",
  "name": "物品名稱",
  "type": "物品類型（武器/防具/魔法材料/道具等）",
  "region": "所屬區域",
  "rarity": "稀有度（普通/稀有/史詩/傳說）",
  "image": "images/items/物品圖片.jpg",
  "description": "物品描述",
  "abilities": [
    "能力1",
    "能力2"
  ],
  "lore": "背景故事/傳說"
}
```

#### 添加新小說章節

編輯 `data/novels.json`，添加新的小說對象：

```json
{
  "id": "novel_ch9",
  "title": "第九章 - 章節標題",
  "chapter": "第九章",
  "summary": "章節摘要",
  "content": "章節內容（支持簡單的Markdown格式）",
  "image": "images/novels/章節插圖.jpg"
}
```

#### 修改世界觀

編輯 `data/world.json`：

- **世界概述**：修改 `overview` 字段
- **添加區域**：在 `regions` 數組中添加新區域
- **添加歷史事件**：在 `timeline` 數組中添加新事件

```json
{
  "id": "region_f",
  "name": "F區 - 新區域名稱",
  "image": "images/新區域圖片.jpg",
  "description": "區域描述"
}
```

## 🎨 功能特點

### 1. 響應式設計
- 支持桌面、平板、手機等多種設備
- 自動適應屏幕大小

### 2. 篩選功能
- 人物可以按區域篩選
- 物品可以按類型篩選

### 3. 模態框詳情
- 點擊卡片查看詳細信息
- 支持圖片、背景故事、能力等完整展示

### 4. Markdown支持
- 小說內容支持簡單的Markdown格式
- 支持標題、粗體、斜體、換行等

### 5. 現代化UI
- 漸變色導航欄
- 卡片懸浮效果
- 平滑動畫過渡
- 精美的模態框設計

## 📝 JSON數據格式說明

### 世界觀數據 (world.json)

```json
{
  "title": "世界名稱",
  "subtitle": "副標題",
  "overview": "世界概述（支持Markdown）",
  "regions": [
    {
      "id": "唯一標識",
      "name": "區域名稱",
      "image": "圖片路徑",
      "description": "區域描述（支持Markdown）"
    }
  ],
  "timeline": [
    {
      "period": "時期名稱",
      "description": "事件描述（支持Markdown）"
    }
  ]
}
```

### 人物數據 (characters.json)

```json
[
  {
    "id": "唯一標識",
    "name": "角色名稱",
    "title": "稱號（可選）",
    "region": "所屬區域",
    "race": "種族（可選）",
    "occupation": "職業（可選）",
    "image": "圖片路徑（可選）",
    "description": "簡介",
    "background": "背景故事（可選）",
    "abilities": ["能力列表"]
  }
]
```

### 物品數據 (items.json)

```json
[
  {
    "id": "唯一標識",
    "name": "物品名稱",
    "type": "物品類型",
    "region": "所屬區域",
    "rarity": "稀有度",
    "image": "圖片路徑（可選）",
    "description": "描述",
    "abilities": ["能力列表"],
    "lore": "背景故事（可選）"
  }
]
```

### 小說數據 (novels.json)

```json
[
  {
    "id": "唯一標識",
    "title": "章節標題",
    "chapter": "章節號",
    "summary": "摘要",
    "content": "內容（支持Markdown）",
    "image": "插圖路徑（可選）"
  }
]
```

## 🔧 自定義樣式

如果你想修改網頁的外觀，可以編輯 `css/style.css` 文件。主要顏色變量在文件開頭定義：

```css
:root {
    --primary-color: #2c3e50;      /* 主色 */
    --secondary-color: #3498db;    /* 輔助色 */
    --accent-color: #e74c3c;       /* 強調色 */
    --text-color: #333;            /* 文字顏色 */
    --bg-color: #f5f5f5;           /* 背景色 */
}
```

## 💡 使用建議

1. **圖片優化**：建議將圖片壓縮到合適大小，以提高加載速度
2. **內容組織**：保持JSON文件格式整潔，方便後續維護
3. **備份數據**：定期備份JSON文件，防止數據丟失
4. **測試預覽**：每次修改後都在瀏覽器中測試效果

## 🌟 未來擴展

你可以考慮添加以下功能：
- 搜索功能
- 收藏功能
- 深色模式
- 多語言支持
- 時間線視覺化
- 角色關係圖
- 地圖互動

## 📞 需要幫助？

如果你在使用過程中遇到問題，可以：
1. 檢查瀏覽器控制台是否有錯誤信息
2. 確認JSON文件格式正確
3. 確認圖片路徑正確

祝你使用愉快！🎉
