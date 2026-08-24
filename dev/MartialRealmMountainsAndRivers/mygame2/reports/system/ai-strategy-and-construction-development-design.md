# AI 戰略命令與據點建設開發文件

- 文件狀態：Draft
- 文件版本：v0.8
- 目前進度：Milestone 1～3 已完成；Milestone 4 防守 AI 已接入自動回合；Milestone 5 支援 AI 已接入自動回合
- 目前限制：逐步動畫、全域行動日誌與建設自動執行仍待開發
  - 可設定規劃中、建造中、已完成、阻塞與取消狀態。
  - 可移除佇列項目。
  - 建設佇列與 blocked 原因會保存到 `GameState` 與遊戲存檔。
  - `paused` 方針不主動建造，但仍可執行採集等其他行動。
 Verification：
  - `npx tsc -b` 通過。
  - 建設佇列焦點測試 83 項全部通過。
  - `npm run build` 通過。
| 建設決策純函式測試 | Engineering | Todo | Medium | TBD |
---

## 1. 設計目標

### 1.1 核心原則

- 玩家負責戰略決策：指定 AI 的任務、目標、優先級與限制。
- AI 負責戰術執行：依據戰略命令選擇移動、攻擊、支援、撤退與建設行動。
- 遊戲規則負責合法性：AI 不得直接修改 `GameState`，所有行動必須通過既有 action / `gameStore` 驗證。
- AI 玩家屬於玩家陣營，與人類玩家共享視野。
- 戰略命令具備持續性，不因每回合短期事件而任意切換。
- 緊急事件可以暫停低優先級命令，但危機解除後應恢復原命令。
- 每一位 AI 玩家可分別設定自己的戰略目標，互不共用、互不覆蓋。
- AI 自保屬於隱藏的系統級優先級，高於玩家設定的戰略命令；玩家命令不得要求 AI 忽略基本生存規則。

### 1.1.1 AI 自保優先級

```text
AI 回合
└── 系統級優先級
  ├── AI 已死亡或無法行動
  │   └── 結束回合
  ├── 自保條件成立
  │   ├── 生命值低於撤退門檻
  │   ├── 即將被包圍
  │   ├── 預估戰鬥必敗
  │   ├── 行動後無法安全返回
  │   └── 撤退或脫離危險
  ├── 玩家設定的 active 戰略命令
  │   ├── 保護據點
  │   ├── 支援玩家
  │   └── 建設方針
  └── 待命或結束回合
```

規則：

- 自保不是玩家可編輯的命令，不顯示在戰略命令列表中。
- `retreatHealthPercent` 是玩家針對命令設定的撤退門檻；自保條件仍可因包圍、必敗或無法安全返回而提前觸發。
- AI 可因自保暫停或中斷當前戰術行動，但不修改玩家設定的戰略命令。
- 自保條件解除後，AI 恢復原本的 active 戰略命令。
- AI 不得為了完成玩家命令而進入確定會導致死亡的行動。

### 1.2 第一階段範圍

- 玩家可對 AI 指定「保護據點」命令。
- 玩家可對 AI 指定「支援玩家」命令。


- 支援據點建設方針：防守優先、經濟優先、戰鬥支援、均衡發展、暫停建設。
- 支援建設佇列與建設優先級。
- 支援威脅評估與緊急防守覆蓋。
- Milestone 1（資料模型與命令保存）已完成；AI 自動移動、攻擊、功法與建設執行仍暫不實作；
  Milestone 4/5 以後才開始實作實際戰術行動。

> 已確認：此處「暫不實作」只限 Milestone 1，不影響 Milestone 4/5 的驗收標準。

### 1.3 非目標

- 不在第一階段實作 AI 自主戰略規劃。
- 不在第一階段實作多 AI 角色協同分工。
- 不在第一階段讓 AI 自動使用所有玩家功能。
- 不允許 AI 繞過體力、距離、地形、回合與前置條件規則。

---

## 2. 分層架構

```text
玩家戰略命令
    ↓
戰略狀態與優先級
    ↓
威脅評估 / 據點狀態 / 玩家狀態
    ↓
戰術行為樹
    ↓
AI 行動意圖
    ↓
既有 GameStore / Action 規則驗證
    ↓
GameState 狀態變化
```

### 2.1 戰略層

- 決定 AI「守哪裡」或「支援誰」。
- 保存長期命令、優先級、命令狀態與撤退限制。
- 不直接決定每一步移動。

### 2.2 戰術層

- 讀取目前戰略命令。
- 評估威脅、距離、體力、生命值與可執行行動。
- 選擇下一個單一行動。
- 每次行動後重新分析，不預先鎖死整回合路徑。

### 2.3 行動層

- 將 AI 意圖轉換為既有遊戲 action。
- 驗證行動結果。
- 行動失敗時記錄原因並重新決策。
- 連續失敗或沒有合法行動時結束 AI 回合。

---

## 3. 核心資料模型

### 3.1 AI 玩家標記

目前 `PlayerState` 已支援：

```ts
isAI?: boolean
```

規則：

- `isAI !== true` 視為人類玩家。
- `isAI === true` 視為 AI 玩家。
- AI 玩家加入 `players` 陣列。
- AI 玩家與人類玩家共享玩家陣營視野。

### 3.2 戰略命令（以 AI 玩家為單位）

每一位 AI 玩家各自擁有一份獨立的戰略命令，互不共用、互不覆蓋。

```ts
type AiOrder =
  | {
      id: string
      type: 'protect-base'
      aiPlayerId: string
      baseId: string
      radius: number
      priority: number
      retreatHealthPercent: number // 低於此百分比（0～100）時觸發撤退
      status: 'active' | 'paused' | 'completed' | 'failed'
    }
  | {
      id: string
      type: 'support-player'
      aiPlayerId: string
      playerId: string
      maxDistance: number
      priority: number
      retreatHealthPercent: number // 低於此百分比（0～100）時觸發撤退
      status: 'active' | 'paused' | 'completed' | 'failed'
    }
```

欄位規則：

- `aiPlayerId` 必須指向 `isAI === true` 的玩家。
- 每位 AI 玩家同一時間只能有一個 `active` 命令；建立新命令時，舊的 active 命令自動改為 `paused` 或 `completed`。
- `baseId` 或 `playerId` 必須存在。
- `radius`、`maxDistance` 必須為大於等於 0 的有限數值。
- `priority` 建議範圍為 `0～100`。
- `retreatHealthPercent` 建議範圍為 `0～100`。
- `status = failed` 時必須保存失敗原因。

> ✅ 已修復：`AiOrder` 已補上 `id: string`。

> ✅ 已修復：`retreatHealthPercent` 補註為百分比（0～100）。

> ✅ 已確認：此處兩條規則同時成立：
> - 建立「不同類型」新命令時，舊 active 命令自動降級為 paused。
> - 建立「完全相同」（同 AI + 同據點）的命令時，拒絕建立並提示重複。
> 兩者分別處理不同情境，不衝突。已同步更新 4.1 Exception 說明。

### 3.2.1 命令索引

- 以 `aiPlayerId` 為索引，可快速取得每位 AI 的目前命令。
- 同一 AI 的命令清單依建立時間排序。
- 修改或刪除命令時，只影響該 AI 玩家，不影響其他 AI。
- 每位 AI 可設定一個據點建設方針（方案 A：一位 AI 管理一個據點）。

> ✅ 已確認：一位 AI 只能管理一個據點，透過 `AiConstructionPlan.baseId` 指定目標據點。
> `AiConstructionPlan` 本身已含 `queue`，不需要陣列。

### 3.3 據點建設方針

```ts
type AiConstructionPolicy =
  | 'defense'
  | 'economy'
  | 'frontline'
  | 'balanced'
  | 'paused'
```

```ts
type AiConstructionPlan = {
  baseId: string
  policy: AiConstructionPolicy
  allowUpgrade: boolean
  queue: AiConstructionPlanItem[]
}

type AiConstructionPlanItem = {
  buildingType: string
  priority: number
  status: 'planned' | 'building' | 'completed' | 'blocked' | 'cancelled'
  blockedReason?: string
}
```

### 3.4 戰略狀態存放原則

- 玩家指定的命令與建設計畫屬於正式遊戲狀態，應可存檔與讀檔。
- 當回合威脅、候選目標、臨時路徑、失敗行動記錄屬於 AI 黑板，不必全部寫入 `GameState`。
- 所有正式狀態變更必須經過不可變更新。

---

## 4. 玩家戰略命令流程

### 4.1 流程：建立「保護據點」命令

#### Stage

- 玩家開啟戰略 Modal。
- 系統載入所有 AI 玩家與可選據點。

#### Player Action

- 選擇一名 AI 玩家（每位 AI 分別設定）。
- 選擇目標據點，例如「洛陽」。
- 設定防守半徑、優先級與撤退血量。
- 按下「建立命令」。

#### 多位 AI 分別設定

- 玩家可依序為不同 AI 建立不同命令。
- 例如：AI 1 保護洛陽、AI 2 支援玩家、AI 3 保護另一據點。
- 每位 AI 的命令獨立顯示、獨立暫停、獨立修改、獨立刪除。

#### System Response

- 驗證 AI 玩家、據點與數值範圍。
- 建立 `AiOrder(type = 'protect-base')`。
- 顯示命令摘要與目前狀態。

#### State Change

- `aiOrders` 新增一筆命令；若該 AI 已有不同類型的 active 命令，舊命令自動降級為 paused。
- AI 玩家獲得目前戰略目標。
- 不立即執行 AI 行動，等待 AI 回合。

#### Exception Handling

- 選取玩家不是 AI：顯示「只能指派 AI 玩家」。
- 目標據點不存在：拒絕建立命令。
- 已存在完全相同（同 AI + 同據點）的 active 命令：拒絕建立，顯示重複命令提示，避免無意義覆蓋。
- 已存在不同類型的 active 命令：舊命令自動降級為 paused，新命令設為 active。
- 數值超出範圍：停用確認按鈕並顯示欄位錯誤。

### 4.2 流程：建立「支援玩家」命令

#### Stage

- 玩家在戰略 Modal 選擇支援命令。

#### Player Action

- 選擇 AI 玩家。
- 選擇人類或 AI 目標玩家。
- 設定最大支援距離、優先級與撤退血量。
- 按下「建立命令」。

#### System Response

- 驗證 AI 玩家與目標玩家不是同一人。
- 建立支援命令並顯示在命令列表。

#### State Change

- `aiOrders` 新增 `support-player` 命令。
- AI 戰術層在回合中以目標玩家的位置與威脅作為決策依據。

> ✅ 已確認：此處規則與 4.1 一致—建立新命令時，若與舊 active 命令類型不同則自動降級，完全相同則拒絕建立。

#### Exception Handling

- AI 玩家與支援目標相同：拒絕建立。
- 目標玩家死亡或不存在：命令標記為 `failed`，等待玩家修改。
- 距離設定不合法：拒絕保存。

### 4.3 流程：暫停、修改與刪除命令

#### Stage

- 玩家在命令列表選擇一筆命令。

#### Player Action

- 選擇「暫停」、「修改」或「刪除」。

#### System Response

- 暫停：保留命令內容，狀態改為 `paused`。
- 修改：先驗證新設定，再替換命令內容。
- 刪除：移除命令並清理對應 AI 暫存目標。

#### State Change

- 命令狀態與 AI 戰略目標同步更新。
- AI 下一次決策不得使用已暫停或刪除的命令。

#### Exception Handling

- AI 正在執行行動時不可直接中斷該 action；應在該 action 結束後套用新命令。
- 修改後目標不存在：保留原命令，不套用無效內容。

---

## 5. 保護據點的戰術行為樹

```text
ProtectBase
└── Selector
    ├── EmergencyDefense
    │   ├── 據點正在被攻擊
    │   ├── 立即威脅存在
    │   └── 攻擊最高威脅目標或回防
    ├── Retreat
    │   ├── AI 生命值低於撤退門檻
    │   └── 朝據點或安全位置移動
    ├── Intercept
    │   ├── 威脅可在限定回合內抵達據點
    │   └── 前往攔截位置
    ├── DefendRadius
    │   ├── AI 位於防守半徑外
    │   └── 返回防守區域
    ├── Patrol
    │   ├── 防守區域內存在可處理敵人
    │   └── 攻擊或巡邏
    └── EndTurn
```

### 5.1 洛陽守城規則

- 洛陽被攻擊時，保護洛陽命令暫時提高為最高優先級。
- 敵人距離洛陽越近，威脅分數越高。
- AI 不得為了低優先級資源或探索目標離開防守區域。
- AI 追擊敵人不得超過命令設定的防守半徑，除非洛陽正在遭受直接攻擊。
- AI 生命值低於撤退門檻時，優先返回洛陽或最近安全據點。
- 威脅解除後，AI 回到原本的防守或巡邏狀態。

---

## 6. 支援玩家的戰術行為樹

```text
SupportPlayer
└── Selector
    ├── Retreat
    │   ├── AI 生命值低於撤退門檻
    │   └── 返回安全據點
    ├── ImmediateSupport
    │   ├── 目標玩家正在被攻擊
    │   └── 朝目標玩家或威脅移動
    ├── FollowTarget
    │   ├── 與目標距離超過最大支援距離
    │   └── 朝目標玩家移動
    ├── AssistCombat
    │   ├── 目標玩家附近存在敵人
    │   └── 攻擊最高威脅目標
    └── HoldPosition
```

### 6.1 支援規則

- 支援命令不得讓 AI 忽略自身撤退門檻。
- AI 不得攻擊人類玩家或同陣營 AI。
- 目標玩家死亡時，支援命令自動改為 `paused`，AI 不受此命令影響。
- 目標玩家進入據點後，AI 可選擇跟隨、守在據點附近或恢復待命。

---

## 7. 據點建設決策

### 7.1 建設決策優先級

```text
1. 緊急防守與修復
2. 玩家指定的建設佇列
3. 據點核心功能補足
4. 據點戰略方針
5. 建築升級與長期最佳化
```

### 7.2 建築效用評分

```text
建築分數 =
  戰略方針需求
  + 當前威脅需求
  + 據點缺少功能
  + 建築協同效果
  + 佇列優先級
  - 建造成本壓力
  - 前置條件阻塞
```

### 7.3 方針對應

| 建設方針 | 優先方向 |
|---|---|
| `defense` | 瞭望塔、城牆、防禦設施、兵營 |
| `economy` | 倉庫、資源收益、材料上限 |
| `frontline` | 瞭望塔、兵營、醫館、防禦設施 |
| `balanced` | 依缺少功能與威脅平均分配 |
| `paused` | 不主動建造，但可執行採集等其他行動 |

### 7.4 建料使用規則

- AI 不保留建料，所有可用建料皆可投入建設。
- 建設行動因材料不足失敗時，必須標記 `blocked` 並保存原因。

### 7.5 洛陽防守建設範例

```text
戰略方針：防守優先

1. 修復已受損防禦設施
2. 建造瞭望塔
3. 提升城牆或核心防禦
4. 建造兵營
5. 建造醫館
6. 依剩餘材料建造倉庫
```

若洛陽遭受攻擊：

- 暫停倉庫、經濟與非必要升級。
- 優先修復防禦設施與城牆。

---

## 8. 戰略 Modal UI 規範

### 8.1 Component List

- `StrategicCommandModal`
- `AiPlayerSelector`
- `StrategicOrderForm`
- `AiOrderList`
- `ConstructionPolicySection`
- `ConstructionQueueList`
- `ThreatSummary`

`ThreatSummary` 顯示所選 AI 玩家或目標據點周邊的威脅摘要，僅供資訊參考，不可操作。

```ts
type ThreatSummaryProps = {
  targetBaseId?: string
  targetPlayerId?: string
  threats: {
    creatureId: string
    creatureName: string
    level: number
    distance: number
    threatScore: number
  }[]
}
```

### 8.2 Properties

```ts
type StrategicCommandModalProps = {
  open: boolean
  aiPlayers: PlayerState[]
  humanAndAiPlayers: PlayerState[]
  bases: BaseState[]
  ordersByAiPlayer: Record<string, AiOrder[]>
  constructionPlanByAiPlayer: Record<string, AiConstructionPlan>
  onClose: () => void
  onCreateOrder: (aiPlayerId: string, order: AiOrder) => void
  onUpdateOrder: (aiPlayerId: string, order: AiOrder) => void
  onDeleteOrder: (aiPlayerId: string, orderId: string) => void
  onUpdateConstructionPlan: (aiPlayerId: string, plan: AiConstructionPlan) => void
}
```

- `ordersByAiPlayer` 以 AI 玩家為索引，每位 AI 顯示自己的命令。
- `constructionPlanByAiPlayer` 以 AI 玩家為索引，每位 AI 只能有一個建設計畫（方案 A：一位 AI 管理一個據點）。

> ✅ 已確認：採用方案 A，一位 AI 管理一個據點，因此 `AiConstructionPlan` 是單數而非陣列。

### 8.3 States

- `open = false`：元件不可見，快捷鍵恢復。
- `open = true`：彈窗可見，全域快捷鍵停用。
- `editing`：表單可修改。
- `invalid`：顯示欄位錯誤，確認按鈕 disabled。
- `empty`：所有 AI 玩家都沒有 active 命令，顯示建立引導。

命令與建設計畫的資料來自遊戲狀態（`GameState`），直接同步讀取，不涉及非同步載入或遠端提交，因此 Modal 不包含 `loading` 與 `saving` 狀態。

### 8.4 Interaction Flow

1. 玩家開啟戰略 Modal。
2. 系統列出每位 AI 玩家與其各自的目前命令、據點與建設計畫。
3. 玩家選擇一位 AI 玩家，建立或修改該 AI 的命令。
4. 系統即時驗證目標、優先級、範圍與重複命令。
5. 玩家確認後，命令寫入該 AI 玩家的遊戲狀態。
6. Modal 顯示該 AI 玩家的成功提示與最新命令狀態。
7. 玩家可繼續為其他 AI 玩家設定不同命令。
8. 玩家關閉 Modal，快捷鍵恢復。

### 8.5 Error Handling

- 沒有 AI 玩家：顯示「目前沒有可指揮的 AI 玩家」。
- 沒有可用據點：保護據點命令不可建立。
- 命令重複：顯示已有相同目標的 active 命令。
- 目標被移除：命令顯示 `failed` 與失敗原因。
- AI 回合執行中：允許修改命令，但新命令於下一個決策節點生效。
- 所有彈窗開啟期間停用遊戲快捷鍵。

---

## 9. AI 決策流程

### Stage 1：讀取戰略命令

- 取得該 AI 玩家自己的目前 active 命令。
- 每位 AI 只讀取自己的命令，不讀取其他 AI 的命令。
- 若沒有命令，使用 `hold-position` 或 `end-turn` 安全策略。

### Stage 2：建立戰略黑板

- 計算目標據點或目標玩家位置。
- 搜尋共享視野中的敵人。
- 計算敵人對據點、玩家與資源點的威脅。
- 取得 AI 生命、體力、內力與可用行動。

### Stage 3：選擇戰術節點

- 先處理緊急威脅。
- 再處理撤退條件。
- 再執行玩家指定命令。
- 最後才考慮巡邏、建設或結束回合。

### Stage 4：執行單一行動

- 產生 `AiAction`。
- 交由既有 action / `gameStore` 驗證。
- 記錄成功或失敗結果。

### Stage 5：重新評估

- 行動成功後重新計算位置、體力、敵人與命令狀態。
- 行動失敗時避免在同一回合重複相同失敗行動。
- 沒有合法行動時結束回合。

---

## 10. 錯誤處理與例外情境

- AI 玩家不存在（執行階段）：命令標記 `failed`，不得執行。
- 目標據點被摧毀或移除：命令標記 `failed`，提示玩家重新指定。
- 目標玩家死亡時，支援命令自動改為 `paused`，AI 不受此命令影響。
- AI 被阻塞：重新計算路徑；連續失敗達上限後待命。
- 行動所需體力不足：轉入撤退或結束回合。
- 自保條件成立時：暫停或中斷玩家命令，優先撤退或脫離危險；不得修改玩家命令內容。
- 自保條件解除後：恢復原本的 active 玩家命令。
- 目標超出共享視野：不得假設未知敵人位置，使用最後已知位置並標記資訊過期。
- 建築前置條件不滿足：建設項目標記 `blocked`，保留原因。
- 建料不足時：建設項目標記 `blocked`，保留原因。
- AI 回合重入：同一 AI 回合不可同時啟動兩個 Controller。
- 生物回合或阻塞彈窗期間：AI 行動必須停止或延後。
- 存檔／讀檔：戰略命令、建設計畫與命令狀態必須保持一致。

---

## 11. 開發分期與追蹤清單

### Milestone 1：資料模型與命令保存

- Acceptance Criteria：
  - 可保存 `AiOrder`。
  - 可保存 `AiConstructionPlan`。
  - 舊存檔缺少欄位時使用安全預設值。
- Test Method：
  - 單元測試建立、修改、刪除、讀取命令。
  - 舊格式存檔相容測試。
- Result：已完成（2026-08-15）。
- 實作內容：
  - `GameState` 支援 `aiOrders` 與 `aiConstructionPlans`。
  - `AiOrder`、`AiConstructionPlan` 與相關狀態型別已建立。
  - `gameStore` 支援建立、刪除 AI 命令與更新建設計畫。
  - 舊存檔讀取時缺少 AI 欄位會補成空集合。
  - AI 命令與建設計畫可透過 `localStorage` 遊戲存檔保存與讀取。
- Verification：
  - `npx tsc -b` 通過。
  - 焦點測試 85 項全部通過。
  - 完整測試 40 個測試檔、365 項全部通過。

### Milestone 2：戰略 Modal

- Acceptance Criteria：
  - 可選 AI 玩家。
  - 可建立「保護據點」與「支援玩家」。
  - 可設定優先級、範圍與撤退門檻。
  - 無效設定不可提交。
- Test Method：
  - UI interaction test。
  - Modal 開啟時快捷鍵停用測試。
- Result：已完成（2026-08-15）。
- 實作內容：
  - 系統指令中新增「AI 戰略指揮」入口。
  - 可分別選擇 AI 玩家。
  - 可建立、更新、刪除「保護據點」與「支援玩家」命令。
  - 可設定防守半徑（預設 6 格）、支援距離、玩家手動優先級與撤退生命百分比。
  - 可設定單一 AI 的單一據點建設方針與升級許可。
  - Modal 開啟時沿用全域快捷鍵停用規則。
  - 命令與建設計畫直接同步寫入 `GameState`，並可由遊戲存檔保存。
- Verification：
  - `npx tsc -b` 通過。
  - 完整測試 40 個測試檔、365 項全部通過。
  - `npm run build` 通過。

### Milestone 3：建設方針與佇列

- Acceptance Criteria：
  - 可為據點設定建設方針。
  - 可新增、排序、暫停、刪除建設項目。
  - 可顯示 blocked 原因。
- Test Method：
  - 建設決策純函式測試。
  - 建料保留與前置條件測試。
- Result：已完成（2026-08-15）。
- 實作內容：
  - 戰略 Modal 可為每位 AI 編輯單一據點建設方針與建設佇列。
  - 可新增建築、調整優先級、修改狀態、移除項目。
  - 建設佇列與 blocked 原因會保存到 `GameState` 與遊戲存檔。
  - `paused` 方針不主動建造，但仍可執行採集等其他行動。
- Verification：
  - `npx tsc -b` 通過。
  - 建設佇列焦點測試 83 項全部通過。
  - `npm run build` 通過。

### Milestone 4：防守戰術 AI

- Acceptance Criteria：
  - AI 能依「保護據點」命令產生戰術意圖。
  - AI 優先處理直接威脅。
  - AI 不會離開防守範圍追擊低價值目標。
  - 行動全部通過既有規則。
- Test Method：
  - 固定地圖情境測試。
  - 威脅距離、撤退與回防測試。
- Result：部分完成（2026-08-15）。
- 已完成：
  - 建立 `aiDefenseRules` 威脅評估模組。
  - 建立保護據點單步決策：相鄰攻擊、返回防守半徑、攔截威脅、待命與暫停命令結束回合。
  - AI 決策只產生行動意圖，不直接修改 `GameState`。
- 已完成：AI 自動回合執行、既有移動／攻擊 action 串接。
- 尚未完成：逐步動畫與全域遊戲日誌。
- Verification：防守固定地圖測試 4 項全部通過；`npx tsc -b` 通過。

### Milestone 5：支援戰術 AI

- Acceptance Criteria：
  - AI 能靠近指定玩家。
  - AI 能支援附近戰鬥。
  - 目標死亡或消失時能安全處理。

- Test Method：
  - 支援距離與目標狀態測試。
  - AI 不攻擊同陣營玩家測試。
- Result：部分完成（2026-08-15）。
- 已完成：
  - 建立 `aiSupportRules` 支援目標威脅評估與單步決策。
  - AI 距離支援目標過遠時靠近目標。
  - AI 與目標附近威脅相鄰時優先攻擊。
  - 支援目標死亡時，命令自動改為 `paused`，AI 不再受命令影響。
  - 接入自動 AI 回合執行器。
- 尚未完成：逐步動畫、全域遊戲行動日誌與更完整的支援戰術。
- Verification：支援固定地圖測試 3 項全部通過；完整測試與 build 通過。

### Task Checklist

| Task Item | Owner | Status | Priority | Deadline |
|---|---|---|---|---|
| 定義 `AiOrder` 與狀態欄位 | Engineering | Done | High | 2026-08-15 |
| 定義 `AiConstructionPlan` | Engineering | Done | High | 2026-08-15 |
| 建立戰略 Modal UI 規格原型 | UI / Engineering | Done | High | 2026-08-15 |
| 建立命令保存與讀檔測試 | Engineering | Done | High | 2026-08-15 |
| 建設佇列編輯與保存測試 | Engineering | Done | High | 2026-08-15 |
| 建立防守威脅評估純函式 | AI Engineering | Done | High | 2026-08-15 |
| 建立建築效用評分純函式 | AI Engineering | Todo | Medium | TBD |
| 實作防守行為樹 | AI Engineering | Done | High | 2026-08-15 |
| 實作建設決策行為樹 | AI Engineering | Todo | Medium | TBD |
| 補充 AI 回合鎖定與防重入 | Engineering | Done | High | 2026-08-15 |
| 建立固定地圖 AI 情境測試 | QA / Engineering | In Progress | High | TBD |
| 建立支援玩家決策純函式 | AI Engineering | Done | High | 2026-08-15 |

### 目前開發狀態

- 已完成：Milestone 1「資料模型與命令保存」、Milestone 2「戰略 Modal」、Milestone 3「建設方針與佇列」。
- 已部分完成：Milestone 4「防守戰術 AI」、Milestone 5「支援戰術 AI」與隱藏自保優先級。
- 進行中：AI 行動動畫與全域遊戲行動日誌。
- 下一步：建設自動執行與完整支援玩家戰術。
- 尚未實作：建設自動執行、完整逐步動畫、全域遊戲日誌的正式 UI。

### Milestone 2 可測試項目

- 沒有 AI 玩家時，戰略 Modal 顯示空狀態。
- 可切換不同 AI 玩家，且每位 AI 顯示自己的 active 命令與建設方針。
- 建立保護據點命令時，防守半徑預設為 6 格。
- 建立支援玩家命令時，可選擇人類或 AI 目標玩家，但不可選自己。
- 優先級與撤退生命百分比可由玩家手動設定並保存。
- 相同命令建立第二次時，顯示錯誤且不覆蓋原命令。
- 不同類型命令建立後，原 active 命令變成 `paused`。
- 刪除命令只影響目前選定的 AI 玩家。
- 每位 AI 只能保存一個建設計畫，重新保存時替換原計畫。
- Modal 開啟時全域快捷鍵不應觸發移動、攻擊、背包或結束回合。

### Milestone 4 防守決策可測試項目

- 相鄰威脅時優先產生攻擊意圖。
- AI 位於防守半徑外且體力足夠時，產生返回防守範圍的移動意圖。
- 沒有威脅時產生待命意圖。
- 命令為 `paused` 時產生結束回合意圖。
- 威脅評估依據點距離、AI 距離及是否直接攻擊據點排序。
- AI 低於撤退門檻時，自保優先於玩家設定的防守或支援命令。
- AI 被兩名以上敵人包圍時，優先產生脫離危險的移動意圖。
- AI 自保不會修改玩家設定的命令，自保結束後恢復原命令。
- 輪到有 active「保護據點」命令的 AI 時，系統每次只執行一個 AI 行動。
- AI 移動或攻擊失敗時，不會卡住回合，會安全結束 AI 回合。
- 沒有 active 防守命令的 AI 不會被自動 AI 執行器接管。
- 生命值低於撤退門檻時，自保優先於保護據點命令。
- 即使玩家命令優先級較高，確定會導致死亡的攻擊也必須被自保規則阻止。
- 自保完成後，AI 能恢復原本的 active 命令。

### Milestone 5 支援決策可測試項目

- 支援目標距離超過限制時，AI 產生靠近目標玩家的移動意圖。
- 支援目標附近存在威脅且 AI 相鄰時，AI 優先產生攻擊意圖。
- 支援目標死亡時，命令改為 `paused`，AI 不再執行該命令。
- 支援 AI 自動回合使用既有移動與攻擊規則。
- 支援命令不能覆蓋 AI 的自保行為。

### Milestone 3 可測試項目

- 可新增建築到指定 AI 的建設佇列。
- 可調整佇列項目的優先級。
- 可將佇列項目標記為規劃中、建造中、已完成、阻塞或取消。
- 可移除佇列項目。
- 同一建築不可重複加入未取消的佇列。
- 保存後重新開啟 Modal，佇列內容與狀態保持一致。
- 建設方針為 `paused` 時，不主動建造但仍可執行採集等其他行動。

---

## 12. 討論決策點

後續討論前，需確認以下規則：

- 每位 AI 是否允許同時擁有多個 active 命令？✅ 已確認：每位 AI 同一時間只有一個 active 命令。
- 多個命令的優先級相同時，採用建立順序還是距離決定？✅ 已確認：優先級由玩家手動設定，不做自動比較。
- 「保護據點」的防守半徑由玩家設定，預設為 6 格。✅ 已確認：玩家可手動調整，預設值為 6。
- 洛陽被攻擊時，是否允許支援玩家命令自動暫停？✅ 已確認：不安裝自動暫停，由玩家自行手動修改戰略。
- AI 建設是否需要玩家明確批准，還是半自動方針即可直接執行？✅ 已確認：AI 直接執行，不需玩家批准。但每次建築完成時彈窗提醒玩家建造結果。
- AI 行動是否需要顯示逐步動畫與行動日誌？✅ 已確認：AI 行動需要逐步動畫，讓玩家觀察 AI 的移動與戰鬥過程。行動日誌改為全域遊戲日誌，記錄所有玩家（人類與 AI）的重要行動，而非僅限 AI。日誌可在遊戲介面中查閱。
- AI 是否可以使用共享倉庫與共享裝備？✅ 已確認：AI 可使用共享倉庫與共享裝備，與人類玩家共用同一套公共倉庫與裝備倉庫，不區分 AI 專用或人類專用空間。
- AI 是否可以修改或接管其他 AI 的命令？✅ 已確認：不可以。所有 AI 的命令設定、暫停、修改與刪除，只能由人類玩家透過戰略 Modal 執行。AI 本身無權修改自己或其他 AI 的命令。

---

## 13. 第一個建議實作情境

### 情境：玩家外出打怪，AI 守住洛陽

- 人類玩家：離開洛陽探索或攻擊生物。
- AI 玩家：被指派 `protect-base(Luoyang)`。
- 洛陽：建設方針設定為 `defense`。

預期流程：

1. AI 讀取保護洛陽命令。
2. AI 搜尋共享視野內接近洛陽的敵人。
3. 若敵人正在攻擊洛陽，AI 優先支援洛陽。
4. 若敵人距離洛陽較遠但可在短時間抵達，AI 前往攔截。
5. 若沒有威脅，AI 留在防守半徑內巡邏或待命。
6. 若 AI 生命值低於撤退門檻，AI 返回洛陽或安全據點。
7. AI 建設決策依洛陽的防守方針與材料保留規則執行。
8. AI 所有行動完成後結束回合，不影響人類玩家下一回合。

驗收條件：

- AI 不會因發現遠方資源而永久離開洛陽。
- AI 不會攻擊人類玩家或同陣營 AI。
- 洛陽遭遇直接威脅時，防守命令優先於低優先級建設。
- 行動失敗不會造成 AI 回合卡死。
- 玩家可以在戰略 Modal 暫停、修改或刪除命令。
