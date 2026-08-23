# 開發日誌

## 2026-08-23｜移除門派進階傷害外功，確立門派功法三式限制

### 本次完成

- 依新的設計約束「**門派功法僅限三式**」（傷害外功／功能外功／輕功，見 `handev/content-expansion-playbook.md` 總原則 5），移除同日稍早新增的六門派進階傷害外功（`{schoolId}-external-damage-2`：撼山拳／踏雲掌／赤焰指／凝霜指／崩山掌／空明掌）。
- 每個門派的功法組成回歸固定三式：`-external-damage`、`-external-functional`、`-external-light-foot`（後者 `lootExcluded`）。
- 流派名字表（`externalNames` 等）維持不動，名稱留作未來等級擴充素材。

### 影響檔案

- `src/game/catalogs/skillProgressionCatalog.ts`
  - 刪除 `advancedDamageSkill` 定義；`progressionExternalSkills` 每派回傳三式（24 → 18），並註解標記三式限制來源。
- `src/game/catalogs/skillProgressionCatalog.test.ts`
  - 總量斷言 24 → 18；移除「四級武館進階外功」相關斷言與同源對照測試。
  - 武館販售目錄太虛流外功數 4 → 3。
- 文件：`handev/content-expansion-playbook.md`（新約束＋檢查清單）、`handev/effects-taxonomy.md`（功法統計同步）。

### 驗證結果

- TypeScript：`docker compose run --rm node npx tsc -b --pretty false` 通過。
- 測試：67 個檔案 / 696 項全數通過。

### 待驗收項目

1. 開一局加入任一門派，確認武館僅販售該派三式功法，無第四式。
2. 確認 Lv.4 掉落池不再出現 `-external-damage-2` 功法。

## 2026-08-23｜六門派二層傳承傷害外功

### 本次完成

- 為六個門派各新增一個進階傷害型外功，取流派名字表第二個名稱（此前從未使用）：
  - 金剛流「撼山拳」、追風流「踏雲掌」、赤炎流「赤焰指」、寒水流「凝霜指」、厚土流「崩山掌」、太虛流「空明掌」。
- 定位為「二層傳承」：同源公式威力 ×2（使用既有 `school.calculate(attributes, 2)` 等級參數），成長曲線對齊既有外功階梯——
  - 悟性成本 3（基礎外功 2 +1）、內力消耗 6（基礎 4 → 6）、需武館 Lv.4（基礎外功 Lv.2、功能外功 Lv.3 的下一階）。
- 自動接入所有消費端：`allExternalSkillCatalog` 掉落池（Lv.4 以上怪物才會掉落）、各門派武館貨源（`getMartialHallSkills`）、編輯器選單與詞彙高亮。

### 影響檔案

- `src/game/catalogs/skillProgressionCatalog.ts`
  - `progressionExternalSkills` 生成流程新增 `advancedDamageSkill`（id：`{schoolId}-external-damage-2`）。
- `src/game/catalogs/skillProgressionCatalog.test.ts`
  - 更新總量斷言（18 → 24）與各流派組成斷言。
  - 新增測試：每流派進階外功與基礎外功同名不同招、成本更重、威力更高、元素一致。

### 驗證結果

- TypeScript：`npx tsc -b --pretty false` 通過。
- 測試：67 個檔案 / 697 項全數通過。

### 待驗收項目

1. 在太虛武館將建築升級至 Lv.4，確認可學習「空明掌」且價格為 45 金（悟性成本 3 × 15）。
2. 確認 Lv.4 以下怪物不掉落進階外功。
3. 實戰施放任一進階外功，確認傷害約為基礎版兩倍。

## 2026-08-20｜地形深度系統收尾階段

### 本次完成

- 完成戰鬥結果的天地共鳴資訊流：
  - 普通攻擊結果保留攻擊預覽中的地形共鳴來源。
  - 外功結果依技能元素與目標地形計算並保留共鳴來源。
  - 攻擊結果彈窗與外功結果彈窗顯示 `天地共鳴：<共鳴名稱>`。
  - 不符合地形共鳴條件時不顯示共鳴提示。
- 補充結果格式化測試：
  - 普通攻擊共鳴提示。
  - 外功共鳴提示。
  - 保留原有傷害、擊敗、經驗與掉落資訊順序。

### 影響檔案

- `src/game/types.ts`
  - `AttackExecutionResult` 新增可選欄位 `terrainResonance`。
  - `ExternalDamageExecutionResult` 新增可選欄位 `terrainResonance`。
- `src/game/actions/combatActions.ts`
  - 普通攻擊執行結果帶入預覽共鳴來源。
  - 外功執行結果帶入技能元素與目標地形的共鳴來源。
- `src/game/actionResultFormatters.ts`
  - 攻擊與外功結果格式化時顯示天地共鳴提示。
- `src/game/actionResultFormatters.test.ts`
  - 新增普通攻擊與外功共鳴結果驗證。

### 驗證結果

- 重點測試：`3` 個測試檔案通過。
- 測試案例：`117` 項通過。
- TypeScript：`npx tsc -b --pretty false` 通過。
- 相關檔案診斷：無錯誤。

### 目前狀態

- 地形深度系統的核心功能已完成，可進入遊戲內手動冒煙測試。
- 尚未完成本階段的人工驗收，因此仍需確認實際彈窗顯示與非共鳴情境。

### 待驗收項目

1. 在草地使用土元素普通攻擊，確認顯示 `天地共鳴：厚土共鳴`。
2. 在森林使用木元素外功，確認顯示對應的追風共鳴提示。
3. 在荒漠、水域與山嶽分別驗證火、水、金元素共鳴。
4. 在不匹配地形施放功法，確認結果彈窗不顯示天地共鳴。
5. 確認怪物主場 Buff 在對應地形生效，離開主場後消失。

### 後續開發順序

1. 完成遊戲內手動冒煙測試並記錄結果。
2. 執行完整 `npx vitest run`，確認沒有跨模組回歸。
3. 依手動測試結果修正 UI 或數值問題。
4. 若核心系統穩定，再補齊尚未完整實作的地形專屬事件內容。
