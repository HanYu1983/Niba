---
name: ui-style
user-invocable: true
description: '**UI STYLE SKILL** — 撰寫或修改任何 React + Ant Design (antd) 畫面、元件、彈窗時，必須參照 `reports/ui-style-guide.md` 的三層規則（L1 地圖 / L2 互動 UI / L3 資料顯示 UI），確保 UI 一致性。'
---

# UI Style Skill

## Role
確保所有 React + Ant Design (antd) UI 遵循 `reports/ui-style-guide.md` 的規範，達成視覺與互動一致性。

## 觸發時機
撰寫或修改任何以下內容時，**必須先閱讀 `reports/ui-style-guide.md`**：
- 畫面元件（`PlayerPanel`、`BasePanel`、各 Modal 等）
- 互動元件（按鈕、彈窗、表單、標籤、進度條）
- 資料顯示元件（數值、徽章、狀態標籤）
- 地圖與地圖浮層

## 核心規則（三層規則）

| 層級 | 規則 | 允許 CSS？ |
|---|---|---|
| **L1 地圖** | 唯一允許自訂 CSS 的畫面層 | ✅ 允許 |
| **L2 互動 UI** | 一律使用 antd 原生元件 | ❌ 禁止 |
| **L3 資料顯示 UI** | 一律使用封裝元件（畫面層零 CSS） | 僅限封裝元件內部 |

### 判斷流程
```text
這個 UI 是地圖嗎？
├─ 是 → L1，可寫 CSS（引用 token）
└─ 否 → 是互動元件嗎？
        ├─ 是 → L2，用 antd，禁止 CSS
        └─ 否 → L3，用封裝元件，畫面層禁止 CSS
```

## 硬性規則
1. **畫面層一律零 CSS**：不得包含 `style={{}}` 或自訂 class 樣式。
2. **禁止內聯樣式**：`style={{ color: '#xxx' }}` 一律禁止，顏色由 token 控制。
3. **antd 能表達的，就用 antd**：能用 props / token 表達就不用 CSS。
4. **CSS 只做裝飾，不碰結構**：僅處理 antd 無法表達的視覺（漸層、動效、層次）。

## 色彩與 Token
- 所有顏色透過 antd `ConfigProvider` theme token 設定，禁止硬編碼色值。
- 主色（金）`#d48806` → `colorPrimary`；成功綠 → `colorSuccess`；警告橙 → `colorWarning`；危險紅 → `colorError`；資訊藍 → `colorInfo`。
- 完整對應表見 `reports/ui-style-guide.md` §2。

## 間距與排版
- 間距一律用 antd `Flex` / `Space` / `Grid` 的 `gap`，禁止手動 margin / padding。
- 字級、字重由 antd `Typography` 與 token 控制，禁止手寫 `font-size`。
- 數值一律使用 `strong` 標籤強調。

## 封裝元件清單（L3 官方入口）
資料顯示 UI 一律使用以下封裝元件，**不得在畫面層自行拼湊**：

| 元件 | 用途 |
|---|---|
| `StatBar` | 數值 + 進度條（血量、內力、聲望等） |
| `StatValue` | 標籤 + 純數值（金錢、體力、經驗等） |
| `StatLabel` | 欄位小標籤 |
| `LevelBadge` | 等級徽章 |
| `SkillCard` | 功法技能卡（內功 / 外功） |
| `LocationDetailsCard` | 地點詳情（據點 / 巢穴 / 資源點） |
| `PreviewStats` | 預覽數值格（攻擊 / 外功預覽） |
| `OptionCard` | 可選擇動作卡片（探索事件 / 廢墟） |
| `ShopRow` | 商店商品列 |
| `ResultModal` | 行動結果回饋 |
| `ConfirmModal` | 高成本動作二次確認 |

## 彈窗規範
- 高成本 / 不可逆動作（消耗資源、攻擊）必須使用 `ConfirmModal` 二次確認。
- 行動結果一律使用 `ResultModal` 回饋。
- 動作失敗：彈窗不關閉，顯示錯誤訊息，確認按鈕恢復可點。

## 錯誤處理
- 所有錯誤必須以明確訊息呈現，格式：`[動作] 失敗：原因`。
- 不得靜默失敗。

## 輸出前檢查清單
- [ ] 已閱讀 `reports/ui-style-guide.md`
- [ ] 畫面層無 `style={{}}` 與自訂 class
- [ ] 互動元件使用 antd 原生元件
- [ ] 資料顯示使用封裝元件
- [ ] 顏色使用 token，無硬編碼色值
- [ ] 間距使用 `Flex` / `Space` / `Grid` 的 `gap`
- [ ] 高成本動作有二次確認彈窗
