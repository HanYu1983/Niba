# 劇情模式企劃與系統架構設計文件（Story Campaign System Design）

本文件規範《武行山河》劇情模式（Campaign Mode）的整體系統架構、章節推進機制、UI/彈窗規範、與既有沙盒系統之相容方案，以及技術實現路徑。

---

## 一、設計目標與架構定位

### 1.1 設計目標
1. **漸進式引導（Onboarding）**：以情境式主線引導新手逐步掌握五行相剋、天地共鳴、據點建設、怪物生態與防禦設施。
2. **武俠沈浸敘事（Narrative Immersion）**：將隨機探索點與回合隨機事件提升為「有因果鏈、有角色動機」的江湖篇章。
3. **保留沙盒底層（Sandbox Compatibility）**：完全復用既有戰鬥、移動、視野、據點、NPC 探索事件與怪物 AI 結算體系，避免分支代碼庫。
4. **目標導向與多重結局（Goal-Driven & Multiple Endings）**：以主線里程碑（Milestone Objectives）取代單純的無止境防守，提供明確的通關成就感與評價。

### 1.2 既有系統相容原則
- **資料驅動（Data-Driven）**：劇情劇本（Scenario）、任務目標（Quest Goal）、劇情對話（Dialogue）全數以結構化 Catalog 定義。
- **純狀態推進（Pure State Transition）**：劇情進度（CampaignState）作為 `GameState` 的可選擴充欄位，不影響沙盒模式運行。
- **無縫切換（Game Mode Isolation）**：`gameSettings.mode` 區分為 `'sandbox' | 'campaign'`，同一套 UI 元件依模式顯示對應面板。

---

## 二、模式與章節規劃

### 2.1 劇情模式三階段設計

```text
┌─────────────────────────────────────────────────────────────┐
│ 第一階段：序章・初入江湖（Tutorial Scenario: 10×10 小型地圖） │
│ 學習重點：移動體力、五行相剋、基礎據點建設、初遇游蕩怪物     │
└──────────────────────────────┬──────────────────────────────┘
                               │ 通關解鎖
┌──────────────────────────────▼──────────────────────────────┐
│ 第二階段：第一章・山河動盪（Main Campaign 1: 20×20 標準地圖） │
│ 學習重點：五行天地共鳴、怪物巢穴威脅、廢墟重建、驛站交通網   │
└──────────────────────────────┬──────────────────────────────┘
                               │ 通關解鎖
┌──────────────────────────────▼──────────────────────────────┐
│ 第三階段：第二章・宗門合縱（Main Campaign 2: 30×30 大型地圖） │
│ 學習重點：門派據點修習、全局靈氣搭配、區域治理、高階防禦設施 │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 劇本章節詳細設定範例

| 章節 ID | 章節名稱 | 地圖規格 | 起始配置 | 核心勝利目標 | 失敗條件 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prologue-village` | 序章：青石遺恨 | 10×10，草地/森林為主 | 1 座基礎據點、1 名游蕩妖物 | 1. 擊敗指定首領妖物<br>2. 建設醫療室與告示牌 | 任一據點被摧毀 或 玩家陣亡 |
| `act1-five-elements` | 第一章：五行逆流 | 20×20，五大地形齊全 | 1 座主據點、2 座廢墟、2 處巢穴 | 1. 重建 2 處廢墟小型驛站<br>2. 摧毀所有侵蝕巢穴 | 據點失守 或 超過 40 回合 |
| `act2-sect-alliance` | 第二章：萬象歸宗 | 30×30，全地形+門派據點 | 2 座據點、4 處門派據點、4 處巢穴 | 1. 於三處門派修得專屬輕功<br>2. 治理官階達到「鄉鎮主事」<br>3. 殲滅進階攻城首領 | 核心據點失守 |

---

## 三、劇情任務與目標推進系統（Quest Engine）

### 3.1 任務目標結構定義

```ts
export type QuestObjectiveType =
  | 'defeat-creature'       // 擊敗特定怪物/首領 (targetId / creatureType)
  | 'destroy-nest'          // 摧毀指定數量或特定巢穴 (count / nestId)
  | 'build-building'        // 在據點建造特定建築 (baseId, buildingType, level)
  | 'reconstruct-ruin'      // 修復廢墟設施 (count / ruinId)
  | 'learn-skill'           // 習得特定功法 (skillId / element / type)
  | 'reach-prestige'        // 累積聲望/官階門檻 (amount / rank)
  | 'reach-position'        // 抵達特定座標或地形 (position / terrain)
  | 'resolve-story-event'   // 完成特定劇情事件選擇 (eventId, choiceId)

export type QuestObjective = {
  id: string
  title: string
  description: string
  type: QuestObjectiveType
  targetValue: number
  currentValue: number
  completed: boolean
  isOptional?: boolean     // 是否為支線目標（影響評分）
}

export type ChapterStoryQuest = {
  id: string
  chapterId: string
  title: string
  background: string
  objectives: QuestObjective[]
  rewards: {
    money?: number
    prestige?: number
    items?: Array<{ itemId: string; quantity: number }>
    skills?: string[]
  }
}
```

### 3.2 流程生命週期（Quest Lifecycle）

```text
Stage 1: 劇本載入（Scenario Init）
  └─ Player Action: 進入劇情模式並選擇章節
  └─ System Response: 依 ScenarioTemplate 初始化地圖、固定據點、指定怪物與主線任務
  └─ State Change: GameState.campaignState = { currentChapter, activeQuests, dialogueQueue }
  └─ Exception Handling: 存檔損壞時退回章節選擇頁，保留已解鎖章節紀錄

Stage 2: 探索與行動觸發（Gameplay Trigger）
  └─ Player Action: 移動、戰鬥、建造、對話或結束回合
  └─ System Response: 觸發 checkQuestProgression(state, actionOutcome)
  └─ State Change: Objective.currentValue 更新；達標時 completed = true
  └─ Exception Handling: 若目標物件已不存在（如首領被環境異常清除），執行 fallback 容錯判定

Stage 3: 階段推進與劇情對話（Dialogue Cutscene）
  └─ Player Action: 達成關鍵目標
  └─ System Response: 凍結地圖交互，彈出劇情對話彈窗（StoryDialogueModal）
  └─ State Change: blockingModal = { type: 'story-dialogue', ... }
  └─ Exception Handling: 支援「跳過對話（Skip）」按鈕，直接套用後續狀態

Stage 4: 章節結算（Chapter Resolution）
  └─ Player Action: 完成所有必要主線目標
  └─ System Response: 顯示章節勝利結算彈窗，呈現評級（S/A/B/C）與通關戰績
  └─ State Change: CampaignProgress.unlockedChapters 寫入 LocalStorage
  └─ Exception Handling: 失敗時提供「重新開始本章」或「讀取本章自動存檔」
```

---

## 四、UI 與彈窗互動規範

### 4.1 劇情對話彈窗規範（Story Dialogue Modal）

- **Title**: 章節名稱與說話者名稱（例：`序章：青石遺恨 · 村長 趙無極`）
- **Component List**:
  - `SpeakerAvatar`: 說話者立繪／Icon（如 👴、🧙、🥋、🐺）
  - `DialogueText`: 對話主文（支援打字機效果與專有名詞高亮）
  - `ObjectiveUpdateBox`: （選填）目標變更或新任務提示
- **Buttons**:
  - `下一句 / 繼續 (Space / Enter)`: active (default primary)
  - `跳過對話 (Esc)`: active (default text/ghost)
- **Error Handling**: 若劇本資料遺失對話文本，自動 fallback 顯示「【劇情推進中...】」並提供關閉按鈕。

### 4.2 劇情任務面板規範（Story Quest HUD Panel）

- **Component List**:
  - `QuestTrackerCard`: 固定於畫面左上或右上角，可折疊（Collapse）
  - `MainObjectiveList`: 主線目標清單（核取方塊樣式、進度條如 `2/3 處巢穴`）
  - `OptionalObjectiveList`: 支線目標清單（金色或灰色標記）
- **States**:
  - `idle`: 正常半透明浮動展示。
  - `updated`: 目標數值變更時觸發金色高亮閃爍動畫（3 秒）。
  - `completed`: 達成時播放核取勾選效果。
- **Interaction Flow**: 點擊任務目標可觸發地圖鏡頭移動（PanTo）至相關目標位置（若目標已被探索揭示）。

---

## 五、資料結構與目錄劃分規劃

```
src/game/
├── catalogs/
│   ├── campaignScenarioCatalog.ts   # [新增] 各章節地圖模板、初始物件、解鎖條件
│   └── storyDialogueCatalog.ts      # [新增] 劇情對話文本、說話者、分支對話
├── rules/
│   ├── campaignRules.ts             # [新增] 劇情目標檢驗、評級計算、解鎖判定純函式
│   └── campaignProgressionRules.ts  # [新增] 任務狀態轉移與獎勵發放
├── actions/
│   └── campaignActions.ts           # [新增] 章節開始、推進、對話確認、章節結算行動
├── types.ts                         # [擴充] CampaignState, QuestObjective, StoryScenario
src/components/
├── StoryDialogueModal.tsx           # [新增] 劇情對話彈窗
├── QuestTrackerPanel.tsx            # [新增] 地圖常駐任務追蹤面板
└── ChapterSummaryModal.tsx          # [新增] 章節通關結算彈窗
reports/
└── story-campaign-system-design.md  # 本設計規格文件
```

---

## 六、開發階段規劃（Milestones）

| 階段 | 重點任務 | 驗收標準 | 優先級 |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **核心資料模型與 Quest Engine** | 定義 `campaignScenarioCatalog` 與 `campaignRules.ts`，單元測試覆蓋目標計數與完成判定。 | P1 |
| **Phase 2** | **劇情對話與任務追蹤 UI** | 實作 `StoryDialogueModal` 與 `QuestTrackerPanel`，支援鍵盤快捷推進與跳過。 | P1 |
| **Phase 3** | **序章劇本（青石遺恨）完整串接** | 製作 10×10 引導關卡，串接移動、戰鬥、建造、首領擊殺到通關結算全流程。 | P1 |
| **Phase 4** | **第一章與多目標分支** | 實作廢墟修復、五行共鳴引導與多重勝利目標，支援通關存檔記錄。 | P2 |
| **Phase 5** | **劇情評價與成就回饋** | 根據通關回合數、傷亡度計算 S/A/B/C 評級，解鎖沙盒特殊起始天賦或外觀。 | P3 |

---

## 七、驗收與測試標準（Definition of Done）

- [ ] `campaignRules.test.ts` 覆蓋所有 8 種 `QuestObjectiveType` 的判定邏輯。
- [ ] 劇情模式下所有原有功能（戰鬥結算、探索事件、建造、商店）正常運行無回歸錯誤。
- [ ] 完整執行 `npm run test` 與 `npm run build` 全數通過。
- [ ] 序章手動冒煙測試：開局對話 → 建造醫療室 → 擊敗首領 → 彈出通關結算彈窗，流程無卡頓。
