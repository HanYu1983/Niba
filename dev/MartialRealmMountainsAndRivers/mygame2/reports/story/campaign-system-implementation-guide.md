# 劇情系統實作進度與測試指南（Campaign System Implementation & Testing Guide）

本文件記錄《武行山河》劇情系統（對話、任務目標、勝利判定、編輯器整合）的**實際實作狀態**，並提供**逐步測試方法**，供開發者驗證已完成的功能。

---

## 一、實作進度總覽

### 1.1 已完成模組

| 模組 | 檔案 | 狀態 |
| :--- | :--- | :--- |
| **對話型別擴充** | `src/game/types.ts` | ✅ |
| **對話佇列操作** | `src/game/actions/dialogueActions.ts` | ✅ |
| **觸發條件比對** | `src/game/rules/dialogueTriggerRules.ts` | ✅ |
| **對話文本 Catalog** | `src/game/catalogs/storyDialogueCatalog.ts` | ✅ |
| **對話彈窗 UI** | `src/components/StoryDialogueModal.tsx` | ✅ |
| **對話佇列消費** | `src/game/gameStore.ts`（`advanceDialogue` / `skipDialogue`） | ✅ |
| **敵人行動暫存協調** | `src/game/gameStore.ts`（`endPlayerTurn` / `flushPendingCreatureTurn`） | ✅ |
| **勝利/失敗對話協調** | `src/components/overlays/SystemOverlays.tsx` | ✅ |
| **目標推進與勝利判定** | `src/game/rules/campaignRules.ts` | ✅ |
| **劇本編譯器** | `src/editor/rules/scenarioCompiler.ts` | ✅ |
| **關卡驗證器** | `src/editor/rules/scenarioValidator.ts` | ✅ |
| **官方劇本 Catalog** | `src/game/catalogs/campaignScenarioCatalog.ts` | ✅ |
| **載入 Scenario** | `src/game/gameStore.ts`（`loadScenario`） | ✅ |
| **測試用劇情入口** | `src/game/gameStore.ts`（`startTestCampaign`） | ✅ |
| **任務/對話編排器** | `src/editor/components/QuestSequencerModal.tsx`、`DialogueEditorModal.tsx` | ✅ |
| **一鍵試玩** | `src/editor/EditorApp.tsx` + `src/App.tsx` | ✅ |

### 1.2 勝利目標類型接入狀態

| 目標類型 | 掛鉤位置 | 狀態 |
| :--- | :--- | :--- |
| `defeat-creature` | `applyTargetDefeat` | ✅ |
| `destroy-nest` | `applyTargetDefeat` | ✅ |
| `build-building` | `constructBuilding` | ✅ |
| `reconstruct-ruin` | `reconstructRuin` | ✅ |
| `learn-skill` | `learnSkillAtSectGate` / `learnSkillAtMartialHall` | ✅ |
| `reach-prestige` | `checkVictory`（集中判定） | ✅ |
| `survive-rounds` | `checkVictory`（回合結束時） | ✅ |
| `build-defense-structure` | `constructDefenseStructure` | ✅ |

### 1.3 尚未實作（待補）

| 項目 | 說明 |
| :--- | :--- |
| **失敗條件判定** | `failConditions`（據點失守、玩家陣亡、超回合）尚未接入失敗判定 |
| **`endsChapter` 旗標** | 勝利對話播畢後自動觸發章節結算尚未處理 |
| **`on-objective-complete` 對話** | 目標達成時觸發對話的掛鉤點尚未接入 |

### 1.4 已實作（近期新增）

| 項目 | 說明 |
| :--- | :--- |
| **任務追蹤 HUD** | `QuestTrackerPanel`（顯示主線/支線目標進度）已實作並掛載於 `App.tsx` |
| **`on-enter-region` 對話** | `movePlayer` 移動後檢查玩家進入指定座標（`triggerParam = "row,column"`）並觸發對話 |

---

## 二、自動測試

### 2.1 執行全部測試

```bash
npm run test
```

### 2.2 劇情系統相關測試檔

| 測試檔 | 涵蓋內容 | 測試數 |
| :--- | :--- | :--- |
| `src/game/dialogueActions.test.ts` | 對話佇列推入/取出/標記/跳過 | 5 |
| `src/game/dialogueTriggerRules.test.ts` | 觸發條件比對（on-start / on-victory / 不重複） | 5 |
| `src/game/campaignRules.test.ts` | 目標推進（綁定/不綁定）、勝利判定、聲望/回合目標 | 12 |
| `src/editor/rules/scenarioCompiler.test.ts` | Scenario → GameState 編譯（地圖/實體/隱藏欄位/對話） | 6 |
| `src/editor/rules/scenarioValidator.test.ts` | 關卡合法性檢查（起點/目標/座標/衝突） | 6 |

**目前總測試數**：626 個（全數通過）

### 2.3 單獨執行某測試檔

```bash
npx vitest run src/game/campaignRules.test.ts
```

---

## 三、手動測試（瀏覽器）

### 3.1 啟動開發伺服器

```bash
npm run dev
```

### 3.2 測試流程 A：劇情模式端對端（序章）

1. **主選單** → 點「📜 劇情模式」
2. **開局對話**：應彈出村長趙無極 × 2 句
   - `Enter` / `Space`：推進下一句
   - `Esc`：跳過全部
3. **序章地圖**：10×10，左下青石村據點、右上妖物巢穴與青石妖王
4. **穿越森林帶**（中央 row 4-5 森林）前往右上
5. **擊敗青石妖王**（Boss，Lv.3）
6. **勝利對話**：村長感謝 → 播畢後顯示 `GameOverModal`

### 3.3 測試流程 B：編輯器一鍵試玩

1. **主選單** → 點「🗺️ 場景編輯器」
2. 繪製地形、放置物件（玩家、據點、怪物、巢穴）
3. 左側「📋 關卡編排」→「🎯 任務與勝敗條件」設定勝利目標
4. 左側「📋 關卡編排」→「💬 劇情對話」設定對話
5. 點頂部「▶️ 一鍵試玩」
   - 若關卡合法 → 載入遊戲並觸發開局對話
   - 若關卡不合法（無玩家/無勝利目標）→ 顯示錯誤訊息
6. 遊戲畫面頂部「⏹️ 結束試玩」→ 返回編輯器（保留編輯狀態）

### 3.4 測試流程 C：目標判定語意

在編輯器設定勝利目標後試玩：

| 目標設定 | 預期行為 |
| :--- | :--- |
| `defeat-creature` + 綁定 `targetId` | 只有擊敗指定那隻怪物才完成 |
| `defeat-creature` + 不綁定 | 擊敗任意怪物都累計數量 |
| `destroy-nest` + 綁定 | 只有摧毀指定巢穴才完成 |
| `destroy-nest` + 不綁定 | 摧毀任意巢穴都累計 |
| `reach-prestige` | 玩家聲望達標即完成 |
| `survive-rounds` | 到達指定回合即完成 |

---

## 四、資料流架構

### 4.1 資料驅動閉環

```
ScenarioDefinition（編輯器產出 / campaignScenarioCatalog）
   │
   ├─ validateScenario()      → 合法性檢查
   ├─ buildGameStateFromScenario() → 編譯為 GameState（含 campaignState）
   └─ gameStore.loadScenario() → 注入 + 觸發開局對話
```

### 4.2 目標推進與勝利

```
遊戲動作（擊敗怪物/摧毀巢穴/建造/修復/學習）
   │
   ├─ progressObjectives(state, event) → 更新目標進度
   ├─ checkVictory(state)              → 自動完成聲望/回合目標 + 判定勝利
   └─ 勝利 → 觸發 on-victory 對話 → GameOverModal
```

### 4.3 對話觸發

```
觸發事件（on-start / on-defeat-boss / on-victory）
   │
   ├─ collectTriggeredDialogues(state, trigger) → 收集符合且未觸發的對話
   ├─ enqueueDialogue(state, steps)            → 填入佇列
   └─ updateGameState 自動顯示 → StoryDialogueModal
```

---

## 五、關鍵設計決策

1. **對話資料驅動**：`collectTriggeredDialogues` 優先讀取 `campaignState.dialogues`（由 compiler 注入），fallback 到 `storyDialogueCatalog`。編輯器產出的對話 JSON 可直接觸發。
2. **勝利判定統一**：所有主線目標完成即勝利（`checkVictory`），支援多目標組合，不再只認 Boss。
3. **目標語意**：綁定 `targetId` = 指定物件才算；不綁定 = 同類型事件累計。
4. **沙盒相容**：所有劇情邏輯皆在 `campaignState` 存在時才生效，沙盒模式（無 `campaignState`）完全不受影響。
5. **敵人行動協調**：回合結束時對話佇列非空 → 暫存敵人行動 → 對話播畢後 `flushPendingCreatureTurn`。