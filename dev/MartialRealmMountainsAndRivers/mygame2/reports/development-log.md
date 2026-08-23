# 開發日誌

## 2026-08-23｜功能外功等級縮放補齊（淬毒／影匿）與減益乘數方向修正

### 本次完成

- 驗收追查百毒流／幽影流待驗收項目時，確認底層機制全部接通（目標／自我 Buff 掛載、回合遞減、每回合掉血、五維乘數、迴避加總、破壁可通行），但 `functionalSkillScaling` 有兩處問題：
  1. **淬毒與影匿沒有等級成長**——燃燒等既有效果隨功法等級強化，新效果缺席。現補上：淬毒隨等級提高中毒比例＋加深五維減益＋延長持續（與燃燒同曲線）；影匿每級迴避 +3%。
  2. **既有 bug**：`attribute-reduction` 的 `attributeMultiplier` 誤用 `scaledPercent` 放大乘數（寒毒 0.8 → Lv2 變 0.92＝減益反而變弱）。新增 `deepenedMultiplier`（放大削減幅度使乘數趨近 0）修正方向：0.8 → Lv2 變 0.77。

### 影響檔案

- `src/game/rules/functionalSkillScaling.ts`、`functionalSkillScaling.test.ts`

### 驗證結果

- TypeScript：通過。測試：67 檔 / 700 項全數通過（新增 4 項縮放案例）。

## 2026-08-23｜新增第八門派「幽影流」與其三式功法

### 本次完成

- 新增隱世刺客一脈**幽影流**（id：`ghost-shadow`，無屬性）：定位「不見經傳的小門派」，與百毒流同屬六章派之外的在野勢力。
- 嚴格遵循門派功法三式限制，三式組合：
  - **內功**「幽影藏息」（`ghost-shadow-inner`），公式：身法 × 0.5 + 內息 × 0.5（補上無人使用的屬性組合）。
  - **傷害外功**「魅影刺」（`-external-damage`）。
  - **功能外功**「幽影流·影匿」（`-external-functional`）＝全新效果 `evasion`：自身 3 回合回避率 +15%（新 Buff `ghost-shadow-veil`，僅用既有 `evasionRateBonus` 欄位，零規則層改動；目標為自身）。
  - **輕功**「遁形步」（`-external-light-foot`）＝沿用既有 `wall-step` 效果（影子貼牆而行），不新增地形步。
- 週邊註冊全數補齊：`martialSchoolCatalog`、幽影武館、三件門派裝備（面紗／勁裝／影刃）、妖物圖示 🦇 與屬性修正、debug 地圖第 8 山門與幽影妖、武館／山門彈窗圖示。主場刻意省略（同太虛流，呼應隱世設定）；元素走 `getSchoolElement` default 'none'，無需新 case。

### 影響檔案

- `src/game/catalogs/martialSchoolCatalog.ts`、`skillProgressionCatalog.ts`、`functionalSkillRegistry.ts`、`buffCatalog.ts`
- `src/game/catalogs/buildingCatalog.ts`、`equipmentCatalog.ts`
- `src/game/rules/creatureBehaviorRules.ts`
- `src/components/MartialHallModal.tsx`、`SectGateDetailsModal.tsx`
- `src/game/worldSetup.ts`＋測試更新（skillProgressionCatalog / debugMap / worldGeneration）

### 驗證結果

- TypeScript：通過。測試：67 檔 / 696 項全數通過。
- `npm run analyze:combat` 已執行並寫出 `reports/combat-balance-report.md`。

### 待驗收項目

1. 於幽影武館／山門學習三式，確認「影匿」施放後自身迴避提升且持續 3 回合。
2. 「遁形步」啟動後進入牆壁地形，確認移動消耗降為 2 且獲得幻影步迴避。
3. 確認編輯器下拉選單自動收錄幽影流條目（catalog 驅動，理論免改）。

## 2026-08-23｜新增第七門派「百毒流」與其三式功法

### 本次完成

- 新增南疆小派**百毒流**（id：`hundred-poison`，木屬性）：世界觀定位為「名不經傳的小門派，卻也各家爭鳴，不能小看」，六章派並立敘事不變。
- 嚴格遵循門派功法三式限制（傷害外功／功能外功／輕功），且三式皆為全新內容：
  - **內功**「百毒納氣」（`hundred-poison-inner`），公式：臂力 × 0.5 + 身法 × 0.5（補上此前無人使用的屬性組合）。
  - **傷害外功**「腐骨爪」（`-external-damage`）。
  - **功能外功**「百毒流·淬毒」（`-external-functional`）＝全新效果 `poison`：目標中毒 3 回合，每回合損失最大生命 10% 且五維 -15%（新 Buff `hundred-poison-rot`，僅組合既有解譯欄位，零規則層改動）。
  - **輕功**「驛路步」（`-external-light-foot`）＝全新效果 `road-step`：官道移動消耗降為 1（`road` 是唯一未被六步涵蓋的地形；新 Buff `road-step`）。
- 週邊註冊全數補齊：`martialSchoolCatalog`、百毒武館建築、三件門派裝備（蠱囊／軟甲／毒爪）、妖物圖示 🐍 與屬性修正、森林主場 Buff 映射、`getSchoolElement` 木行對應、debug 地圖第七座山門與百毒妖、武館／山門彈窗圖示。
- 順手重構：`skillProgressionCatalog` 的機能效果三元鏈改為 `schoolFunctionalLabels` / `schoolFunctionalEffects` / `SELF_TARGETED_FUNCTIONAL_EFFECTS` 映射表，未來再加門派不必增長鏈條。

### 影響檔案

- `src/game/catalogs/martialSchoolCatalog.ts`（union＋清單）
- `src/game/catalogs/skillProgressionCatalog.ts`（學校定義＋映射重構）
- `src/game/catalogs/functionalSkillRegistry.ts`（`poison` / `road-step` 型別、描述、綁定）
- `src/game/catalogs/buffCatalog.ts`（`hundred-poison-rot`、`road-step`）
- `src/game/catalogs/buildingCatalog.ts`（百毒武館）、`equipmentCatalog.ts`（三件裝備）
- `src/game/rules/creatureBehaviorRules.ts`、`playerDerivedRules.ts`、`skillRules.ts`
- `src/components/MartialHallModal.tsx`、`SectGateDetailsModal.tsx`
- `src/game/worldSetup.ts`＋測試更新（skillProgressionCatalog / debugMap / worldGeneration）

### 驗證結果

- TypeScript：通過。測試：67 檔 / 696 項全數通過。
- `npm run analyze:combat` 已執行並寫出 `reports/combat-balance-report.md`。

### 待驗收項目

1. 開局前往百毒武館／山門學習三式，確認淬毒命中後目標每回合掉血且五維下降、持續 3 回合。
2. 裝備「驛路步」於官道移動，確認體力消耗降為 1 且獲得幻影步迴避。
3. 確認編輯器下拉選單與詞彙高亮自動收錄百毒流條目（catalog 驅動，理論免改）。
4. 後續可選：地圖上中毒妖物的視覺標記（MapGrid 的 buff class 過濾清單未納入 `hundred-poison-rot`）。

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
