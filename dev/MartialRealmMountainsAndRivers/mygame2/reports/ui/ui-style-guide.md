# 遊戲 UI Style Guide

> 本文件為遊戲 UI 的統一視覺與互動規範。所有畫面、元件、彈窗皆須遵循本指南，確保風格一致、可讀性高、且能被工程師直接實作。
>
> **適用範圍**：所有 React + Ant Design (antd) 畫面與元件。
> **核心原則**：以 antd 為唯一 UI 來源，達成一致性。CSS 僅限於「地圖」與「封裝元件內部」，畫面層一律零 CSS。

---

## 0. 三層規則（本指南的核心）

> 這是本指南最重要的章節。所有 UI 決策都先判斷「屬於哪一層」，再決定做法。

| 層級 | 規則 | 允許 CSS？ | 例子 |
|---|---|---|---|
| **L1 地圖** | 唯一允許自訂 CSS 的畫面層 | ✅ 允許 | 地圖格、浮層、hover 動效、漸層 |
| **L2 互動 UI** | 一律使用 antd 原生元件 | ❌ 禁止 | `Button`、`Modal`、`Tag`、`Collapse`、`Input`、`Select`、`Progress` |
| **L3 資料顯示 UI** | 一律使用**封裝好的自訂元件**（畫面層零 CSS） | 僅限封裝元件內部 | `StatBar`、`StatValue`、`LevelBadge`、`SkillCard`、`LocationDetailsCard`、`OptionCard`、`ShopRow` |

### 0.1 判斷流程

```text
這個 UI 是地圖嗎？
├─ 是 → 進入 L1，可寫 CSS（引用 token）
└─ 否 → 是互動元件嗎？
        ├─ 是 → 進入 L2，用 antd，禁止 CSS
        └─ 否 → 進入 L3，用封裝元件，畫面層禁止 CSS
```

### 0.2 硬性規則

1. **畫面層（Component）一律零 CSS**：`PlayerPanel`、`BasePanel`、各 Modal 等畫面元件**不得**包含任何 `style={{}}` 或自訂 class 樣式。所有視覺由 antd 元件或封裝元件提供。
2. **禁止內聯樣式**：`style={{ color: '#xxx' }}` 一律禁止。顏色、間距、圓角等一律由 token 或封裝元件控制。
3. **antd 能表達的，就用 antd**：判斷標準為「這個樣式 antd 能否用 props / token 表達？能 → 用 antd；不能 → 才考慮封裝元件或 CSS」。
4. **CSS 只做裝飾，不碰結構**：即使在地圖或封裝元件內，CSS 也只處理 antd 無法表達的視覺（漸層、動效、層次），不得重寫 antd 的結構樣式。

### 0.3 例外清單（允許自訂 CSS 的完整清單）

> 只有以下情況允許寫 CSS。除此之外一律視為違規。

| 例外 | 說明 |
|---|---|
| 地圖格與地圖浮層 | `MapGrid`、`map-card__target-hint` 等 |
| 封裝元件內部 | `StatBar`、`LevelBadge` 等封裝元件的內部實作 |
| 全域背景 / 版面容器 | `app-shell`、`app-content` 等頁面級容器 |

---

## 1. 設計原則

- **一致性**：相同用途的元件必須使用相同樣式與行為，不得因畫面不同而改變。
- **可讀性**：文字對比度須足夠，重要資訊（數值、狀態）優先呈現。
- **即時反饋**：玩家每個操作都必須有明確的系統反饋（成功 / 失敗 / 等待）。
- **狀態明確**：每個元件都必須能清楚區分 enabled / disabled / active / inactive。
- **資訊分層**：主要資訊（數值、名稱）用強字體，次要資訊（說明、提示）用次要色。

---

## 2. 色彩系統

> 所有顏色一律透過 antd `ConfigProvider` theme token 設定，**禁止在元件中硬編碼色值**。

### 2.1 主色調（對應 antd token）

| 用途 | 色值 | antd token | 說明 |
|---|---|---|---|
| 主色（金） | `#d48806` | `colorPrimary` | 官階、聲望、重要獎勵 |
| 主色亮 | `#f0b429` | — | 漸層起點、強調 |
| 成功（綠） | `#52c41a` | `colorSuccess` | 成功、可執行、正面狀態 |
| 警告（橙） | `#fa8c16` | `colorWarning` | 警告、需注意 |
| 危險（紅） | `#ff4d4f` | `colorError` | 失敗、傷害、負面狀態 |
| 資訊（藍） | `#1677ff` | `colorInfo` | 資訊、靈氣、中性提示 |
| 文字主色 | `#1f1f1f` | `colorText` | 主要文字 |
| 文字次要 | `#8c8c8c` | `colorTextSecondary` | 次要說明文字 |

### 2.2 漸層規範

- 漸層**僅限於地圖與封裝元件內部**（L1 / L3），且僅作裝飾，不得影響文字可讀性。
- 範例：官階進度條 `strokeColor={{ from: '#f0b429', to: '#d97706' }}`。

### 2.3 背景與卡片

- 卡片背景使用淺色（`#fff` 或極淺暖色），避免深色背景影響文字閱讀。
- 重要區塊（如官階）可使用暖色漸層卡片，但須搭配 `inset` 白邊與陰影增加層次。

---

## 3. 字體與排版

> 字級、字重由 antd `Typography` 元件與 token 控制，禁止手寫 `font-size`。

| 元素 | 字級 | 字重 | 用途 |
|---|---|---|---|
| 頁面標題 | 20px | 700 | 畫面主標題 |
| 區塊標題 | 16px | 700 | 面板內區塊標題 |
| 主要數值 | 13–16px | 700 | 血量、內力、聲望等數值 |
| 標籤 | 10px | 700 | 欄位小標籤（如「官階」「聲望」） |
| 說明文字 | 12px | 400 | 描述、提示 |
| 次要提示 | 10px | 400 | 底部小提示 |

- 標籤使用 `letter-spacing: 0.08em` 增加辨識度（於封裝元件內設定）。
- 數值一律使用 `strong` 標籤強調。

---

## 4. 間距與佈局

> 間距一律使用 antd `Flex` / `Space` / `Grid` 的 `gap` 控制，**禁止手動 margin / padding**。

| 用途 | 數值 |
|---|---|
| 元件間距（gap） | 8px / 12px |
| 區塊內邊距（padding） | 12px |
| 卡片圓角 | 14px（`borderRadius` token） |
| 小元件圓角 | 9px |
| 徽章圓角 | 50%（圓形） |

- 使用 `Flex` 搭配 `gap` 控制間距，避免手動 margin。
- 響應式：窄螢幕時允許換行（`flex-wrap`），不得溢出。

---

## 5. 元件規範

> 每個元件皆須定義：**Component List → Properties → States → Interaction Flow → Error Handling**。
> 互動元件（L2）一律使用 antd 原生元件；資料顯示元件（L3）一律使用封裝元件。

### 5.1 按鈕（Button）— L2

#### Properties

| 屬性 | 值 |
|---|---|
| 類型 | primary / default / danger / text |
| 尺寸 | small / middle / large |
| 狀態 | enabled / disabled / loading |

#### States

- **enabled**：可點擊，正常配色。
- **disabled**：`disabled`，降低透明度，不可點擊。
- **loading**：顯示載入圖示，禁止重複點擊。

#### Interaction Flow

1. 玩家點擊按鈕。
2. 系統執行對應動作。
3. 成功 → 顯示成功反饋；失敗 → 顯示錯誤訊息。

#### Error Handling

- 動作失敗時，按鈕恢復 enabled，並顯示錯誤提示（見 §8）。
- 高成本動作（消耗資源）須有二次確認（見 §5.5）。

---

### 5.2 進度條（Progress）— L2 / L3

> 通用進度條用 antd `Progress`；遊戲數值條（血量、內力等）一律用封裝元件 `StatBar`。

#### Properties

| 屬性 | 值 |
|---|---|
| 數值 | current / max |
| 百分比 | 0–100 |
| 顏色 | 依狀態（成功綠 / 警告橙 / 危險紅） |
| 狀態 | normal / exception |

#### States

- **normal**：正常顯示。
- **exception**：數值低於閾值（如血量 < 30%），顯示紅色。
- **full**：達 100%，顯示完成狀態。

#### Interaction Flow

- 純展示元件，無互動。

#### Error Handling

- 數值不得超過 max；超過時以 100% 顯示並記錄異常。

---

### 5.3 標籤（Tag）— L2

#### Properties

| 屬性 | 值 |
|---|---|
| 顏色 | 依語意（綠=正面、橙=警告、紅=負面、藍=中性） |
| 內容 | 狀態文字 |

#### States

- **active**：顯示目前生效狀態。
- **inactive**：不顯示或顯示為灰色。

#### Interaction Flow

- 純展示元件。

#### Error Handling

- 無。

---

### 5.4 面板（Card / Collapse）— L2

#### Properties

| 屬性 | 值 |
|---|---|
| 標題 | 區塊標題（strong） |
| 額外說明 | 次要文字（extra） |
| 展開狀態 | 展開 / 收合 |

#### States

- **expanded**：顯示內容。
- **collapsed**：僅顯示標題。

#### Interaction Flow

1. 玩家點擊標題列。
2. 系統切換展開 / 收合狀態。

#### Error Handling

- 無。

---

### 5.5 彈窗（Modal）— L2

> 高成本 / 不可逆動作的二次確認，一律使用封裝元件 `ConfirmModal`；行動結果回饋一律使用 `ResultModal`。

#### Properties

| 屬性 | 值 |
|---|---|
| 標題 | 彈窗標題 |
| 訊息 | 主要內容 |
| 按鈕 | 確認 / 取消（或自訂） |
| 狀態 | 開啟 / 關閉 / 載入 |

#### States

- **open**：顯示彈窗，遮罩背景。
- **closed**：隱藏。
- **loading**：確認按鈕載入中，禁止重複提交。

#### Interaction Flow

1. 玩家觸發開啟條件。
2. 系統顯示彈窗。
3. 玩家點擊確認 → 執行動作；點擊取消 → 關閉。
4. 動作完成後關閉彈窗並顯示結果。

#### Error Handling

- 動作失敗：彈窗不關閉，顯示錯誤訊息，確認按鈕恢復可點。
- 高成本 / 不可逆動作（消耗資源、攻擊）必須使用確認彈窗。

---

## 6. 狀態定義總表

| 狀態 | 定義 | 視覺 |
|---|---|---|
| enabled | 可操作 | 正常配色 |
| disabled | 不可操作 | 降低透明度 |
| active | 目前生效 / 選中 | 高亮、強調色 |
| inactive | 未生效 / 未選中 | 灰階 |
| loading | 處理中 | 載入圖示 |
| error | 錯誤 | 紅色 + 錯誤訊息 |

---

## 7. 互動流程通用規範

- 每個互動必須遵循：**Player Action → System Response → State Change → Exception Handling**。
- 範例（攻擊）：

```text
玩家點擊攻擊
→ 系統驗證目標與資源
→ 成功：扣除內力、計算傷害、更新血量
→ 失敗：顯示錯誤訊息，狀態不變
```

---

## 8. 錯誤處理規範

- 所有錯誤必須以**明確訊息**呈現，不得靜默失敗。
- 錯誤訊息格式：`[動作] 失敗：原因`。
- 常見錯誤情境：
  - 資源不足（內力、體力、金錢）。
  - 目標無效（已死亡、距離過遠）。
  - 條件不符（未解鎖、等級不足）。
  - 重複操作（已使用過、回合已結束）。

---

## 9. 封裝元件清單（L3 官方入口）

> 資料顯示 UI 一律使用以下封裝元件。**畫面層不得自行拼湊這些呈現**，只能使用清單內的元件。

| 元件 | 用途 | 內部實作 |
|---|---|---|
| `StatBar` | 數值 + 進度條（血量、內力、聲望等） | antd `Progress` + 標籤 |
| `StatValue` | 標籤 + 純數值（金錢、體力、經驗等） | antd `Typography` |
| `StatLabel` | 欄位小標籤（官階、聲望等） | 統一標籤樣式 |
| `LevelBadge` | 等級徽章 | 圓形徽章 + 等級 |
| `SkillCard` | 功法技能卡（內功 / 外功） | 卡片 + 標籤 + 數值 |
| `LocationDetailsCard` | 地點詳情（據點 / 巢穴 / 資源點） | 身份 + 狀態 + 血量 |
| `PreviewStats` | 預覽數值格（攻擊 / 外功預覽） | `StatValue` 列表 |
| `OptionCard` | 可選擇動作卡片（探索事件 / 廢墟） | antd `Card` + `Button` |
| `ShopRow` | 商店商品列 | 商品資訊 + 操作區 |
| `ResultModal` | 行動結果回饋 | antd `Modal` |
| `ConfirmModal` | 高成本動作二次確認 | antd `Modal` + 確認/取消 |

> 新增封裝元件時，須先在此清單登記，並確保內部統一使用 token，對外提供一致 props。

---

## 10. CSS 命名規範（BEM）

> 僅適用於 L1 地圖與 L3 封裝元件內部。畫面層（L2）不使用自訂 class。

- 格式：`block__element--modifier`。
- 範例：
  - `map-grid__cell`（地圖格）
  - `map-grid__cell--selected`（選中狀態）
  - `stat-bar__label`（封裝元件內部）
- 規則：
  - 每個 component 使用獨立 block 前綴，避免樣式互相污染。
  - 樣式集中於 `App.css`，或 component 自帶 CSS。
  - 移除不再使用的 class，避免殘留樣式干擾。

---

## 11. 專案追蹤

### 11.1 Checklist

| Task Item | Owner | Status | Priority | Deadline |
|---|---|---|---|---|
| 建立 UI Style Guide（三層規則） | — | 進行中 | 高 | — |
| 設定 antd `ConfigProvider` theme token | — | 待辦 | 高 | — |
| 建立封裝元件（StatBar / LevelBadge / ConfirmModal） | — | 待辦 | 高 | — |
| 移除畫面層內聯樣式與自訂 class | — | 待辦 | 中 | — |
| 統一彈窗確認流程 | — | 待辦 | 中 | — |

### 11.2 Milestone

| Milestone | Acceptance Criteria | Test Method | Result |
|---|---|---|---|
| antd token 統一 | 所有 antd 元件使用金色主色、14px 圓角 | 手動檢視 + build | 待驗證 |
| 畫面層零 CSS | 畫面元件無 `style={{}}` 與自訂 class | 程式碼掃描 | 待驗證 |
| 封裝元件就緒 | 資料顯示一律使用封裝元件 | 逐項檢視 | 待驗證 |

---

## 12. 例外情境與注意事項

- 窄螢幕 / 手機：允許換行，禁止水平溢出。
- 大量數值：使用 `StatBar` 進度條輔助，避免純文字難以比較。
- 多語言：文字不得寫死在樣式中，須由元件 props 傳入。
- 效能：避免過度漸層與陰影，影響渲染效能。
- **審查重點**：Code Review 時優先檢查「畫面層是否出現 `style={{}}` 或自訂 class」，出現即視為違規。
