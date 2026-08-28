# 修改需求 → 代碼位置速查表

> 用途：當被要求修改設定時，直接參照本檔，不必每次重新找程式碼。
> 所有行號以最新程式碼為準，若失效請以關鍵字重新搜尋。

## 1. AI 步驟失敗（onStepFailed）提示 UI 的顯示時長

- **檔名**：`mygame2/src/App.tsx`
- **位置**：`onStepFailed` 回呼（約 line 131）
- **關鍵字**：`onStepFailed: (_actorId, reason) => { message.warning(...) }`
- **設定值**：antd `message.warning` 傳組態物件帶 `duration`，單位為**毫秒（ms）**
  - `duration: 5000` = 5 秒
  - antd 預設為 3000（3 秒）
- **範例**：`onStepFailed: (_actorId, reason) => { message.warning({ content: reason, duration: 5000 }) }`
- **注意**：antd v5/v6 duration 單位是毫秒（不是秒）；若想全域調整所有 message，需改用 `<App>` + `useApp()` 並包 `ConfigProvider`（本專案目前未包）。

## 2. AI 預設命令類型（AI 用哪套決策引擎跑）

- **檔名**：`mygame2/src/game/worldSetup.ts`
- **位置**：建構 AI 初始訂單的 `.map(...)`（約 line 100-102）
- **關鍵字**：`id: `ai-order-graph-search-${p.id}`` 該行的 `type: 'decision-tree' as const`
- **目前值**：`type: 'decision-tree' as const`
- **可選值（AiOrderKind）**：`'protect-base' | 'support-player' | 'construction' | 'fuzzy' | 'decision-tree' | 'graph-search'`（定義於 `mygame2/src/game/ai/aiTurnScheduler.ts`）
- **改法**：把該行 `type: 'decision-tree' as const` 改為其他值（如 `'graph-search' as const`）
- **注意**：決策引擎的實際分派在 `aiTurnScheduler.ts` 的 `runStep`（窮盡 switch）；此處只是決定 AI 玩家開局採用哪一種命令類型。
