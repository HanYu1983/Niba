# AI 策略整併分析文件（AI Strategy Consolidation Analysis）

本文件分析現有五種 AI 的**架構、覆蓋範圍、擴充性與差異化潛力**，評估「只保留一種通用 AI」的選型建議。
本文件僅為分析與決策依據，**不涉及任何程式碼修改**。

---

## 一、現況盤點

### 1.1 五種 AI 總覽

| AI 類型 | 指令 id | 架構 | 性質 |
|---------|---------|------|------|
| 決策樹 | `decision-tree` | 無狀態分層 if-else（小樹→中樹→大樹） | 自主決策 |
| 跟隨保護玩家 | `support-player` | 命令驅動（目標玩家 + 距離 + 威脅攔截） | 行為指令 |
| 保護據點 | `protect-base` | 命令驅動（據點 + 半徑 + 威脅評分） | 行為指令 |
| 模糊策略 | `fuzzy` | 感知 → 17 目標隸屬度評分 → 排序選最佳 | 自主決策 |
| 圖搜索 | `graph-search` | DFS 貪婪最長路徑（深度 3） | 自主決策 |

### 1.2 分類說明

- **行為指令**（`support-player` / `protect-base`）：不是「大腦」，而是玩家下達的**戰術命令**。AI 只負責執行「跟誰、守哪、打什麼」，不做全局判斷。
- **自主決策**（`decision-tree` / `fuzzy` / `graph-search`）：AI 自己決定每一步做什麼。真正的選型範圍是這三者。

---

## 二、三種自主決策 AI 深度分析

### 2.1 決策樹（`decisionTree/decideNextAction.ts`）

**架構**：方案 C「無狀態分層」——小樹（保命、即時戰鬥）先 return，中樹（撿道具、採集、建造）中段 return，大樹（探索）最後 return。每個條件成立 → 生成 candidate → `validateAiAction` → return。

**覆蓋範圍**（約 17 個分支）：
- 屬性分配、裝備穿戴、內功切換、學習外功
- 使用回血道具、據點醫療（蓋醫院／用醫院）、執行任務、買回血道具
- 血量極低撤退、攻擊鄰近怪、撿道具、探索

**優點**：
- 行為**可預測**、易除錯（每步都有明確 reason）
- 計算量最低
- 已覆蓋大部分遊戲行動

**缺點**：
- **優先級是硬編碼的**：無法依情境調整（例如「血 60% 且旁邊有寶物」時，決策樹永遠先撿道具，不會權衡）
- **擴充 = 改樹的結構**：新增行為需決定插入位置，容易破壞既有優先級
- **難以做差異化**：所有 AI 走同一棵樹，無法有「個性」

### 2.2 模糊策略（`fuzzy/`）

**架構**：四階段管線——
1. **Perceive**：`computeFuzzyInputs` 計算約 40 項情境輸入（血量比、體力比、可扛攻擊數、到最近威脅距離、可達道具數、建料比、未探索格數……）
2. **Evaluate**：17 個**獨立目標評估器**（`evaluateSelfPreservation`、`evaluateEngageCombat`、`evaluateConstruction`、`evaluateExploration`……）各自用隸屬函數（trapezoid、fuzzyAnd、fuzzyOr）算分
3. **加權**：距離衰減（每格 -0.05，10 格歸零）＋ tie-breaking 優先序＋覆寫規則（selfPreservation > 0.6 時 engageCombat 歸零）
4. **Select**：`rankGoals` 取最高分且 ≥ MIN_THRESHOLD(0.2) 的目標執行

**覆蓋範圍**（17 個目標）：
selfPreservation、collectItems、positioning、construction、exploration、engageCombat、allocateAttributes、useItem、equipEquipment、attackNest、equipInnerSkill、useInnerSkillAttack、learnMartialSkill、practiceSkill、executeMission、repairEquipment、buildDefense

**優點**：
- **目標彼此獨立、模組化**：新增行為 = 新增一個 evaluator，不動其他目標
- **情境加權**：同一情境下不同狀態會有不同選擇（這正是決策樹做不到的）
- **天然的差異化機制**：調整各目標的**權重／門檻／隸屬函數**即可做出「個性」（見 §4.2）
- 已內建覆寫與優先序規則，行為合理性有保障

**缺點**：
- 計算量較高（每步重算 40 項輸入 + 17 個目標）
- 隸屬函數調參需要經驗，初期 tuning 成本高
- 行為不如決策樹直觀可預測

### 2.3 圖搜索（`graphSearch/`）

**架構**：`makeRoot` 建根節點 → `greedyLongestPath` DFS（MAX_DEPTH = 3）→ 取累計分數最高的葉節點 → `extractPath` 提取行動序列。

**優點**：
- 唯一能產出**多步行動序列**的 AI（規劃未來 3 步）

**缺點**：
- **深度只有 3**，規劃能力實際很淺
- 使用 **stub combat deps**（`STUB_COMBAT_DEPS`：不實際結算掉落／升級），模擬結果與真實執行有偏差
- 「最長路徑」啟發式（最大化累計 cost）語義可疑，容易選出繞路的行為
- 每步展開子節點的計算成本最高
- 覆蓋的行動種類依賴 `actionGenerators`，成熟度最低

---

## 三、選型評估

### 3.1 評估矩陣

| 評估維度 | 決策樹 | 模糊策略 | 圖搜索 |
|----------|:------:|:--------:|:------:|
| 汎用性（行為覆蓋廣度） | ★★★★ | ★★★★★ | ★★ |
| 擴充性（新增行為成本） | ★★（改樹結構） | ★★★★★（加 evaluator） | ★★ |
| 差異化潛力（做個性） | ★ | ★★★★★ | ★★ |
| 行為可預測性 | ★★★★★ | ★★★ | ★★ |
| 計算成本 | ★★★★★（最低） | ★★★ | ★（最高） |
| 實作成熟度 | ★★★★ | ★★★★ | ★★ |
| 多步規劃能力 | ★ | ★ | ★★★ |

### 3.2 選型結論

> **建議保留：模糊策略（fuzzy）作為唯一通用 AI。**

**核心理由**：

1. **「好做出功能差異性」是明確需求，而 fuzzy 是唯一天然支援的架構。**
   17 個目標評估器彼此獨立，差異化 = 給不同 AI 不同的目標權重／門檻設定檔（見 §4.2），完全不需要改架構。

2. **「汎用」要求行為覆蓋廣，fuzzy 的 17 個目標覆蓋最完整。**
   決策樹的分支大致是 fuzzy 目標的子集，且 fuzzy 還多了 attackNest、useInnerSkillAttack、practiceSkill、repairEquipment、buildDefense 等決策樹沒有的行為。

3. **「擴充」要求新增功能不破壞既有行為，fuzzy 的模組化最佳。**
   新增行為 = 新增一個 `evaluateXxx`，註冊進 `evaluateAllGoals` 即可；決策樹則要考慮插入位置對整棵樹優先級的影響。

4. **圖搜索的淺深度 + stub 模擬，使其目前不具備實戰價值。**
   深度 3 的規劃收益不足以抵銷其計算成本與 stub 偏差。

---

## 四、整併設計建議

### 4.1 保留與移除清單

| AI | 處置 | 說明 |
|----|------|------|
| 模糊策略 | **保留（升級為唯一通用 AI）** | 更名為預設 AI，承接所有自主行為 |
| 決策樹 | **留存為參考代碼（不接入遊戲）** | 行為已由 fuzzy 目標涵蓋；程式碼保留供參考，不註冊進 scheduler |
| 圖搜索 | **留存為參考代碼（不接入遊戲）** | 深度 3 + stub 無實戰價值；程式碼保留供未來多步規劃參考 |
| 跟隨保護玩家 | **保留（作為命令層）** | 不是大腦，是玩家指令；可與 fuzzy 共存（見 4.3） |
| 保護據點 | **保留（作為命令層）** | 同上 |

> **標記說明**：決策樹與圖搜索的程式碼**保留於版本控制中作為參考**，但**不註冊進 AI scheduler、不提供指令型別、不接入遊戲流程**。僅供未來設計參考，不參與任何實際對局。

### 4.2 差異化機制：AI 個性設定檔（Personality Profile）

fuzzy 架構下，差異化的實作路徑：

```ts
type AiPersonalityProfile = {
  /** 各目標的分數乘數（>1 偏好、<1 抑制） */
  goalWeights: Partial<Record<GoalName, number>>
  /** 各目標的最低啟動門檻覆寫 */
  goalThresholds?: Partial<Record<GoalName, number>>
}
```

預設個性範例：

| 個性 | 設定方向 |
|------|----------|
| 好戰型 | `engageCombat` ×1.5、`attackNest` ×1.3、`selfPreservation` 門檻調低 |
| 謹慎型 | `selfPreservation` ×1.5、`useItem` ×1.2、`engageCombat` ×0.6 |
| 建設型 | `construction` ×1.5、`buildDefense` ×1.3、`executeMission` ×1.2 |
| 探索型 | `exploration` ×1.5、`collectItems` ×1.2、`engageCombat` ×0.7 |

- 個性可掛在 `PlayerState`（如 `aiPersonality`）或劇本 `data.aiType` 擴充字串（如 `"fuzzy:aggressive"`）。
- 第四章雲霓可設定「謹慎型」——貼身保護時不輕易暴衝，符合角色設定。

### 4.3 命令層與通用 AI 的共存模式

`support-player` / `protect-base` 是**戰術命令**，與 fuzzy（**戰略大腦**）不衝突，建議的分層：

```
命令層（玩家指令）         決策層（唯一通用 AI）
─────────────────         ─────────────────
support-player  ──────►   fuzzy + 個性設定檔
protect-base    ──────►   fuzzy + 個性設定檔
（無命令）       ──────►   fuzzy + 個性設定檔
```

- **有命令時**：命令約束 fuzzy 的目標集合（例如 support-player 時，`exploration`、`construction` 等目標分數歸零，只保留 selfPreservation / engageCombat / positioning）。
- **無命令時**：fuzzy 全目標自由決策。
- 這讓「命令」從「另一種 AI」變成「fuzzy 的情境約束」，架構上只剩一個大腦。

### 4.4 決策樹行為遷移清單

決策樹**留存為參考代碼、不接入遊戲**。其行為已由 fuzzy 目標涵蓋（皆為 fuzzy 既有目標），確認如下：

| 決策樹分支 | fuzzy 對應目標 |
|------------|----------------|
| 屬性分配 | `allocateAttributes` |
| 裝備穿戴 | `equipEquipment` |
| 內功切換 | `equipInnerSkill` |
| 學習外功 | `learnMartialSkill` |
| 使用回血道具 | `useItem` / `selfPreservation` |
| 據點醫療 | `selfPreservation`（return-to-base-heal） |
| 執行任務 | `executeMission` |
| 買回血道具 | `useItem`（buy-item target） |
| 撤退 | `selfPreservation` |
| 攻擊鄰近怪 | `engageCombat` |
| 撿道具 | `collectItems` |
| 探索 | `exploration` |

> 結論：決策樹無 fuzzy 缺漏的行為，可安全停用（留存為參考代碼）。

---

## 五、風險與例外情境

| 風險 | 說明 | 緩解措施 |
|------|------|----------|
| fuzzy 行為不可預測 | 玩家可能覺得 AI「亂動」 | 保留 `MIN_THRESHOLD` 與 tie-breaking；行動日誌（`actionEvents`）已記錄每步 reason |
| 計算成本上升 | 每步重算 40 輸入 + 17 目標 | 單一 AI 每回合最多 ~20 步，實測影響有限；必要時快取 `FuzzyInputs` |
| 舊存檔相容 | 存檔中的 `decision-tree` / `graph-search` 指令 | 載入時將未知指令 type 映射為 fuzzy |
| 個性調參成本 | 隸屬函數 tuning 需要反覆測試 | 先提供 4 種預設個性；後續依玩家反饋微調 |
| 未來需要多步規劃 | 例如「規劃 3 步逃離包圍」 | `graphSearch/` 已留存為參考代碼；必要時以 fuzzy goal 形式重實作 |

---

## 六、驗收標準 / 拆分任務

- [ ] 確認選型：fuzzy 為唯一通用 AI（本文件 §3.2）。
- [ ] 設計 `AiPersonalityProfile` 型別與 4 種預設個性。
- [ ] 實作命令層 → fuzzy 目標約束的轉接（support-player / protect-base）。
- [ ] 將 `decision-tree` 與 `graph-search` 標記為**參考代碼**：不註冊進 scheduler、不提供指令型別、不接入遊戲（程式碼保留）。
- [ ] 舊存檔指令 type 載入時映射為 fuzzy。
- [ ] 編輯器「AI 類型」下拉選單改為：通用 AI（fuzzy）＋ 個性選擇 ＋ 命令（跟隨／守點）。
- [ ] 第四章雲霓改用「fuzzy + 謹慎型 + support-player 命令」。
- [ ] 全量測試：AI step runner、scheduler、scenario compiler、存檔載入。
- [ ] 手動驗收：雲霓貼身保護行為與移除前一致；無命令 AI 行為合理。