# 開發日誌

## 2026-08-24｜五行補全：新增五門派，每屬性兩派

### 本次完成

- 依「**每個五行元素應有 2 個門派**」的設計目標，一次新增五派（此前金/水/火/土/無各僅一派，木有兩派）：
  - **銳鋒流**（`sharp-edge`，金）：新興鑄劍世家的快劍搶攻之道。內功「銳鋒淬芒」（臂力 ×0.7＋身法 ×0.3，補上無人使用的組合）；傷害外功「銳鋒斬」；靈氣外功「劍心明鑑」（視野 +1）、「凌厲劍勢」（普攻傷害 +10%）。
  - **煙雨流**（`misty-rain`，水）：江南煙雨樓的養生綿掌。內功「煙雨養元」（內息 ×0.5＋悟性 ×0.5）；傷害外功「煙雨掌」；靈氣「雨潤回春」（每回合回血 5%）、「雨幕遮身」（減傷 10%）。
  - **烈陽流**（`blazing-sun`，火）：西域烈陽教遺部的血性武學。內功「烈陽戰體」（根骨 ×0.6＋臂力 ×0.4）；傷害外功「烈陽轟」；靈氣「烈陽戰意」（臂根 +1）、「烈目凝芒」（暴擊 ×1.25）。
  - **黃土流**（`yellow-earth`，土）：黃土溝壑獵戶自衛武團。內功「黃土紮根」（根骨 ×0.5＋身法 ×0.5）；傷害外功「裂石棍」；靈氣「夯土工事」（建材消耗 −15%）、「負重健行」（最大體力 +2）。
  - **幽影流**（`ghost-shadow`，無）：playbook 世界觀既有的隱世幽影流落地。內功「幽影藏形」（身法 ×0.5＋悟性 ×0.5）；傷害外功「影襲」；靈氣「幽影蔽身」（迴避 +10%）、「孤影決絕」（血量 <25% 時五維 ×1.6）。
- 每派嚴守三式限制（1 內功＋1 基礎傷害＋2 靈氣）；**零新規則層改動**——10 個新 Buff 全部只組合既有解譯欄位（visionRadiusBonus／damageDealtPercent／healthRegenPercent／damageReductionPercent／attributeModifiers／criticalRateMultiplier／buildingMaterialCostReduction／maxStaminaBonus／evasionRateBonus／conditional），未新增 `FunctionalExternalSkillEffect` 型別（31 種 effect 不變）。
- 新門派刻意不佔用移動技位：七種地形 step 技已由原七派配滿，避免重複輕功。
- 週邊註冊補齊：`MartialSchoolId` union、`getSchoolElement` 四行對應（幽影流走 default 'none'）、妖物圖示（🦂🐬🦁🐗🦇）與屬性修正、主場 Buff 映射（幽影流比照太虛流無主場）、武館／山門彈窗圖示鏈（⚔️🌧️☀️🧱🌑）。山門生成與編輯器下拉為 catalog 驅動，自動收錄 12 派。
- 測試同步：流派數 7→12、外功總數 21→36；新增「**五行元素各由兩個門派守護**」防回退測試。

### 影響檔案

- `src/game/catalogs/martialSchoolCatalog.ts`、`skillProgressionCatalog.ts`、`buffCatalog.ts`
- `src/game/rules/skillRules.ts`、`creatureBehaviorRules.ts`、`playerDerivedRules.ts`
- `src/components/MartialHallModal.tsx`、`SectGateDetailsModal.tsx`（圖示鏈）
- `src/game/catalogs/skillProgressionCatalog.test.ts`
- 文件：`handev/effects-taxonomy.md`（Buff 45→55、功法 54→74）

### 已知留白（後續可選）

- ~~五個新門派暫無**武館建築**與**門派裝備**~~ → 同日稍後已補齊，見下一篇日誌。
- debug 地圖維持 7 座山門／7 隻妖物（測試夾具未強制含全派）。

### 驗證結果

- TypeScript：通過。ESLint：通過。測試：68 檔 / 721 項全數通過。

## 2026-08-24｜補上五新派的武館建築與門派裝備

### 本次完成

- **武館建築 ×5**（`buildingCatalog.ts`）：銳鋒／煙雨／烈陽／黃土／幽影武館，id `building-type-martial-hall-{schoolId}`、造價 30、官階 1，與既有六派格式一致。玩家可在自建據點蓋對應武館學功法（`buildingActions` 依 `martialSchoolId` 過濾門派建築的機制自動生效）。
- **門派裝備 ×15**（`equipmentCatalog.ts` 的 `sectEquipmentCatalog` tuple 表）：每派武器／防具／配件各一，id 自動為 `sect-{schoolId}-{slot}`，屬性總和與價格由既有平衡公式規範（每級 2 點／$30），解鎖順序刻意交錯（銳鋒 W→A→Ac、煙雨 A→Ac→W、烈陽 Ac→A→W、黃土 W→Ac→A、幽影 Ac→W→A）：
  - 銳鋒流：銳鋒疾影劍 ⚔️／薄刃軟鱗甲 🦺／凝鋒劍心佩 📿
  - 煙雨流：煙雨羅衣 👘／雨潤青玉佩 💧／煙波傘中劍 ☂️
  - 烈陽流：烈陽血玉佩 ☀️／炎陽戰甲 🛡️／焚天重拳 👊
  - 黃土流：裂石開山棍 🪵／負重行囊 🎒／溝壑獵皮甲 🧥
  - 幽影流：夜行蔽影墜 🌑／無蹤暗影刃 🗡️／幽冥蟬翼衣 🕴️
- 測試同步：debug 據點預建築數 17→22（debug 夾具本就收錄全 catalog 建築，12 座武館全數可用於測試）。
- 文件回寫：`handev/effects-taxonomy.md`（裝備 45→60、建築 20→25）。

### 影響檔案

- `src/game/catalogs/buildingCatalog.ts`、`src/game/catalogs/equipmentCatalog.ts`
- `src/game/debugMap.test.ts`
- 文件：`handev/effects-taxonomy.md`

### 驗證結果

- TypeScript：通過。ESLint：通過。測試：68 檔 / 721 項全數通過（含 equipmentCatalog 數值規則對 15 件新裝備的自動驗證）。

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
