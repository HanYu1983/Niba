# 專案健康度結案報告

## 1. 報告目的

- 總結目前 `mygame2` 專案的程式碼健康度。
- 記錄近期大量功能開發後的架構狀態、測試狀態與主要風險。
- 提供後續優化優先順序，作為下一階段工程規劃依據。

## 2. 目前驗證基準

截至 2026-08-08：

- 測試檔案：32 個通過
- 測試案例：246 個通過
- TypeScript diagnostics：無錯誤
- `npm run build`：成功
- 建置輸出：約 978 KB
- 既有警告：bundle 超過 500 KB 警告門檻

## 3. 整體健康度評估

| 維度 | 評分 | 說明 |
|---|---:|---|
| 功能完整度 | 7.5 / 10 | 核心遊戲循環、Creature、巢穴、事件、建設與勝利判定已可運作。 |
| 程式碼結構 | 6 / 10 | 已拆出 catalogs、rules、actions，但 `gameStore.ts` 與 `GameOverlays.tsx` 仍過大。 |
| 測試覆蓋 | 8 / 10 | 單元測試與規則測試充足，但缺少更多跨系統端對端場景測試。 |
| 效能 | 6.5 / 10 | 目前可正常運作，但地圖渲染與全局狀態訂閱仍有優化空間。 |
| 型別安全 | 7 / 10 | 主要 action 已收斂，但部分 UI 與 preview 協議仍可統一。 |
| 文件同步 | 5 / 10 | 近期功能增加速度快，部分設計文件尚未完全同步。 |
| 可擴充性 | 6.5 / 10 | 新功能可接入，但常需要回流修改大型 store 或 overlay 檔案。 |

整體評分：

```text
6.6 / 10
```

結論：

> 專案目前功能完整且測試穩定，但近期功能快速增加後，主要風險已從「功能不足」轉為「大型檔案、狀態散佈、隨機邏輯分散與文件滯後」。

## 4. 已完成的重要功能

### 4.1 Creature 系統

- 五種巢穴 Creature 行為類型。
- 開局游蕩型 Creature。
- Creature 流派映射。
- Creature 五維屬性修正。
- Creature 等級成長。
- Creature 流派 Icon。
- Creature 血量顯示。
- Creature 目標優先級。
- 攻城型據點攻擊。
- 掠奪型資源點與玩家 fallback。
- Creature 巢穴生成。
- Creature 巢穴不可重疊。
- Creature 等級掉落經驗與金錢。
- Creature 低機率掉落。

### 4.2 玩家與戰鬥

- 玩家初始五維全部為 8。
- 初始外功破空掌直接裝備。
- 普通攻擊暴擊率。
- 普通攻擊體力成本 5。
- 外功體力成本 3。
- 悟性超限時功法效果衰減。
- 玩家頭像體力顯示。
- 玩家指令面板體力顯示。

### 4.3 互動點與探索

- 道具點同格觸發。
- 探索事件同格觸發。
- 道具點自動拾取與結果彈窗。
- 探索事件自動開啟。
- Creature 到達互動點時清除互動點。
- 探索事件結果依實際 effects 顯示。
- 探索點數量設定可正確帶入遊戲。

### 4.4 建設與治理

- 建造建築聲望。
- 建築升級聲望。
- 防禦建築建造聲望。
- 防禦建築結果彈窗顯示聲望。
- 資源點取消採集次數限制。
- 巢穴每 10 回合生成 Creature。
- 巢穴全部摧毀後玩家勝利。

## 5. 主要風險

### 5.1 `gameStore.ts` 過大

目前 `gameStore.ts` 仍同時負責：

- 初始地圖生成
- 玩家與 Creature 建立
- Store API
- Preview 狀態
- 結果彈窗 continuation
- 存檔與讀檔
- 多個 action 編排

風險：

- 新功能容易回流修改同一檔案。
- 回歸測試成本高。
- 新工程師難以定位邏輯。

### 5.2 `GameOverlays.tsx` 責任過重

目前 GameOverlays 集中管理大量 Modal 與互動流程，包括：

- 戰鬥
- 建築
- 商店
- 倉庫
- 政策
- 傳送
- 總管府
- 探索事件
- 道具點
- 資源點
- 防禦建築

風險：

- 新增 Modal 會持續膨脹。
- UI 流程與 action 編排混雜。
- 測試與維護成本增加。

### 5.3 隨機邏輯分散

目前 `Math.random()` 分散於：

- Creature 掉落
- 普通攻擊暴擊
- Creature 巡邏
- 技能學習
- 道具掉落

風險：

- 難以重放遊戲流程。
- 難以統一平衡。
- 測試需要大量 mock。

### 5.4 地圖渲染效能

`MapGrid.tsx` 在渲染時重複計算：

- reachable cells
- attackable targets
- blocked positions
- visibility

風險：

- 大地圖與多 Creature 時可能出現卡頓。
- Creature 移動時容易觸發全畫面 re-render。

### 5.5 文件滯後

近期新增功能很多，但部分文件尚未完全同步，包括：

- Creature 系統
- 游蕩怪
- 互動點同格觸發
- 勝利判定
- 體力成本
- 玩家與 Creature 頭像顯示
- 探索點數量生成規則

## 6. 優先優化建議

### 6.0 已確認的優化範圍

以下項目確定納入下一階段；本階段不新增大型遊戲功能，優先改善可維護性、可測試性與效能：

| 項目 | 優先級 | 狀態 | 完成條件 |
|---|---|---|---|
| 隨機與掉落邏輯集中 | P0 | 進行中 | 已建立 `randomRules.ts`，並完成游蕩等級、掉落、暴擊的 random provider；巡邏與技能學習待接入。 |
| `MapGrid` 計算快取 | P0 | 已完成 | 已以 `useMemo` 快取 blocked、reachable、attackable 集合；功能測試維持通過。 |
| 補強端對端場景測試 | P0 | 已確認 | 覆蓋開局游蕩怪、互動點、戰鬥、巢穴生成與勝利流程。 |
| 文件同步 | P0 | 已確認 | 同步 Creature、事件、體力、勝利與互動點規則文件。 |
| 拆分 `GameOverlays` | P1 | 已確認 | 依戰鬥、建設、互動、治理拆分，維持既有 UI 行為。 |
| 拆分 `gameStore` | P1 | 已確認 | 移出世界生成、角色工廠、preview 與 lifecycle 編排。 |
| 統一 action 回傳協議 | P1 | 已確認 | 新增與修改 action 使用統一 success／failure 結構。 |
| selector-based subscription | P2 | 暫緩 | 先完成 `useMemo` 與 overlay 拆分後再評估。 |
| bundle code splitting | P2 | 暫緩 | 目前只保留既有 bundle warning，不在本輪優化範圍。 |

### P0：集中隨機與掉落邏輯（已確認）

建議新增：

```text
src/game/rules/randomRules.ts
src/game/rules/lootRules.ts
```

目標：

- 統一掉落機率
- 統一暴擊判定
- 統一 Creature 巡邏隨機
- 統一技能學習隨機
- 支援可測試 random provider

### P1：拆分 `gameStore.ts`（已確認）

建議優先拆出：

```text
src/game/worldGeneration.ts
src/game/characterFactory.ts
src/game/actions/previewActions.ts
src/game/actions/lifecycleActions.ts
```

目標：

- `gameStore.ts` 只保留 store wiring 與 public API
- 初始地圖生成與角色建立不再混在 store 中

### P1：拆分 `GameOverlays.tsx`（已確認）

建議拆為：

```text
src/components/overlays/CombatOverlays.tsx
src/components/overlays/BuildingOverlays.tsx
src/components/overlays/InteractionOverlays.tsx
src/components/overlays/GovernanceOverlays.tsx
```

目標：

- 每個 overlay 只負責一類互動
- 新增功能不再持續膨脹主控制器

### P0：改善地圖效能（已確認）

建議先將以下內容加入 `useMemo`：

- `blockedPositions`
- `reachableCellIds`
- `attackableTargetCellIds`

後續再考慮：

- selector-based subscription
- 分區渲染
- 減少 Creature 移動時的全畫面 re-render

### P1：統一 action 回傳協議

建議統一為：

```ts
type ActionResponse<T> =
  | { ok: true; data: T }
  | { ok: false; reason: string }
```

目標：

- 減少不同 action 使用不同失敗格式
- 簡化 UI 錯誤處理

### P0：補強端對端場景測試（已確認）

建議新增完整流程測試：

- 開局生成游蕩怪
- 玩家移動到道具點
- 自動拾取並顯示結果
- 玩家攻擊 Creature
- 回合結束
- 巢穴生成 Creature
- Creature 移動與攻擊
- 摧毀全部巢穴後勝利

### P0：同步設計文件（已確認）

建議更新：

- `creature-system-design.md`
- `exploration-events-design.md`
- `game-design-master-plan.md`
- 互動點同格觸發規則
- 勝利判定
- 體力成本表
- 游蕩怪規則
- 玩家與 Creature 頭像顯示規則

## 7. 建議下一階段順序

本節已由「建議」改為已確認執行順序。

### 第一階段：基礎穩定化（已確認）

1. `MapGrid.tsx` 增加 `useMemo`（已完成）
2. 集中掉落、暴擊與技能學習隨機邏輯
3. 更新主要設計文件

### 第二階段：架構整理（已確認）

1. 拆分 `GameOverlays.tsx`
2. 拆分 `gameStore.ts`
3. 統一 action 回傳協議

### 第三階段：品質與效能強化（已確認）

1. 補強端對端場景測試
2. 建立可重放 random provider
3. 優化 bundle 與渲染效能

## 8. 結案結論

目前專案已具備完整可玩的核心循環：

```text
探索 → 戰鬥 → 建設 → 治理 → 巢穴威脅 → 勝利
```

近期功能開發速度較快，但測試與建置仍保持穩定。下一階段不建議優先增加大型新系統，而應先進行：

- 隨機邏輯集中
- 大型檔案拆分
- 地圖效能優化
- 文件同步
- 端對端測試補強

完成上述項目後，預期專案健康度可提升至：

```text
7.2 / 10
```
