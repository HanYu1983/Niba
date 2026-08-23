# mygame2 遊戲內容擴充指示文件（Content Expansion Playbook）

> 建立日期：2026-08-23
> 目的：規範「擴充遊戲內容」時的標準三階段流程——**研究 → 構思 → 聯關補漏**。
> 配套文件：`handev/mygame2-architecture.md`（骨架）、`handev/catalogs-extension.md`（catalog 擴充手法）。

## 總原則

1. **風格一致優先於數量**：新內容必須像「原本就存在於這個世界」，而不是外來資料。
2. **先故事後數值**：每件新事物都要能回答「它在哪個故事或事件裡被發現？」——沒有敘事依托的數值不加入。
3. **只加不改不刪**：GameState 只存 id，改動既有 id 會破壞玩家存檔。
4. 文字使用繁中書面語與武俠語感；程式 id 用英文 kebab-case。

---

## 第一步：研究目標內容的文件、命名風格與成長曲線

### 1.1 必讀文件地圖（依擴充目標選擇）

| 擴充目標 | reports/ 必讀 | 原始碼必讀 |
|---|---|---|
| 道具／裝備 | `item-depth-design.md`、`combat-balance-report.md` | `itemCatalog.ts`、`equipmentCatalog.ts` |
| 功法 | `insight-utility-skills-design.md` | `skillProgressionCatalog.ts`、`functionalSkillRegistry.ts` |
| Buff | `buff-system-design.md` | `buffCatalog.ts`、`rules/playerDerivedRules.ts` |
| 探索事件 | `exploration-events-design.md`（注意文末未完成清單） | `events/eventCatalog.ts`、`eventSpawner.ts`、`eventResolver.ts` |
| 劇情章節 | `five-chapter-story-design.md`、`campaign-system-implementation-guide.md` | `campaignScenarioCatalog.ts`、`storyDialogueCatalog.ts` |
| 建築／防禦 | `defense-structures-design.md` | `buildingCatalog.ts`、`defenseStructureCatalog.ts`、`buildingActionRegistry.ts` |
| 地形／世界 | `terrain-depth-system-design.md`、`fog-of-war-design.md` | `worldGeneration.ts`、`terrainLootCatalog.ts` |

另瀏覽 `reports/development-log.md` 最後幾篇，確認該系統目前進度與待驗收項目，避免做出已被否決的方向。

### 1.2 命名風格萃取

方法：把目標 catalog 既有條目的「中文名 ↔ 英文 id」並排抄成對照表，歸納後綴規律後套用到新條目。已觀察到的慣例：

| 類別 | 中文命名模式 | id 模式 | 例 |
|---|---|---|---|
| 恢復道具 | X丹／X丸／X藥 | 效果英文名 | 九轉回天丹 = `nine-turn-return-heaven-pill` |
| 符類（爆發/偵查/陷阱） | X符／X索 | 元素+功能+`talisman`/`rope` | 太白破軍符 = `taibai-break-army-talisman` |
| 特殊道具 | X玉／X珠 | 意象英文名 | 回光玉 = `return-light-jade` |
| Buff 名 | 二至四字意境詞 | 描述性 kebab-case | 背水 = `back-to-water` |
| 主場 Buff | 四字名＋依地形 | `home-turf-{terrain}` | 林隱狼性 |
| 門派 | 五行意象＋「流」 | golden-body / swift-wind / scarlet-flame / frost-water / earth-mountain / void-spirit | 金剛流 |
| 門派功法 id | 取流派名字表名稱 | `{schoolId}-inner` / `-external-damage` / `-external-functional` / `-external-light-foot` | 金剛拳 |
| 輕功名 | 動詞＋地形意象 | 同上 `-light-foot` | 破壁功、草上飛、踏水功 |
| 江湖功法 | 一律以「功」結尾 | `jianghu-{effect}` | 血飲功 |
| 門派裝備 id | 四五字兵器名 | `sect-{schoolId}-{slot}` | 九天追風刃 |
| 地名 | 實感中國城鎮名 | —（僅中文） | 洛陽、青石村 |
| 事件型別 | 敘事短語 | kebab-case | `lost-caravan`、`wandering-merchant` |
| 章節 id | `{章別}-{地點}` | kebab-case | `prologue-village` |

### 1.3 參數成長曲線萃取

方法：把同系列既有條目按等級排序成表，找出「等級 → 數值／價格」的規律曲線，新內容沿同一條曲線外插。已量測的曲線（詳見附錄 A）：

- 商店道具價格階梯：Lv1=20、Lv2=40、Lv3=70、Lv4=110（各資源類通用）
- 裝備：每級 +2 屬性點、每級 30 金、耐久隨級成長
- 掉落權重：怪物掉落 `20 ÷ 2^(tier−1)`；地形特產 `max(1, 12 − level×2)`
- 功法成本：悟性需求 5（內功）/ 2（外功）；內力消耗依類型 3~6

### 1.4 第一階段產出物

寫下「擴充規格表」（暫不動程式碼），每欄包含：
id、中文名、出處故事一句話、所屬 catalog 與分類、關鍵參數（對齊既有曲線）、取得途徑（商店等級／地形掉落／事件獎勵）、交叉引用需求（需連動的其他檔案）。

---

## 第二步：構思虛擬故事與新事件

### 2.1 世界觀錨點（不可違背）

出自 `reports/story/five-chapter-story-design.md`，所有新內容都必須相容於：

- **五行即地形**：金=山嶽、木=森林、水=水域、火=荒漠、土=草地（另有道路/城牆為人工地形）。
- **山河靈氣 vs 妖氣**：五行平衡則萬物興盛；妖氣侵蝕導致靈氣失衡、據點失守——這是「保衛據點」玩法的敘事根基。
- **守護者一脈**：主角師父封印妖王「玄冥」而犧牲；主角的功法是守護者傳承。
- **玄冥的悲劇性**：原是守護山河的靈獸，因人類破壞五行而被妖氣侵蝕——反派不是純粹邪惡。
- **六章派並立**：金剛/追風/赤炎/寒水/厚土/太虛六流各有武館；「江湖」是無門派的散修文化。
- **章節獨立沙盒**：每章能力從頭開始，敘事上串成同一主角的旅程。

### 2.2 故事發想方法：矩陣組合

用以下軸線交叉組合產生點子，再挑選與現有內容互補的：

```
地形（5 種）× 門派或江湖（7 個文化圈）× 內容載體（道具/功法/建築/事件/地名/對話）
```

輔助問題清單：
1. 這個地方的地形會孕育什麼特產？（對照 `terrainLootCatalog` 的地形特產邏輯）
2. 誰曾在這裡生活或戰鬥？留下什麼？（廢墟、遺跡、古井、戰場）
3. 妖氣在這裡以什麼形式侵蝕？（巢穴行為、主場 Buff、污染事件）
4. 江湖上誰需要幫助或想交易？（事件型別：商隊、藥師、學者、傷者、難民）
5. 守護者一脈能在這裡留下什麼線索？（伏筆道具、傳承功法、封印痕跡）

### 2.3 從故事推導內容

每個虛擬故事應自然長出多層內容。示範推導鏈：

> 「荒漠古城曾是封印之地」
> → 地點：古城廢墟名稱（placeNameCatalog 或場景實體）
> → 發現：封印殘片道具（itemCatalog，特殊分類）、守護者手札（觸發對話的事件）
> → 功法：守護者一脈失傳外功（functionalSkillRegistry 新效果或 jianghu 目錄）
> → 敵人：被妖氣扭曲的守護者亡靈（creature，攜帶主場 Buff home-turf-desert）
> → 獎勵曲線：依第四章（25×25 後期章）定位取 Lv4~5 曲線

一個故事至少要覆蓋「發現物 + 取得途徑 + 使用情境」三件事，缺一件就先不實作。

### 2.4 可利用的既有鉤子（文件已規劃但未實作）

優先從這些缺口構思，CP 值最高：

1. 六級稀有事件制度僅部分落地——中階事件「古墓尋寶」「失傳武學傳承」設計過但未實作（見 exploration-events-design.md 未完成清單）。
2. 第二章至第五章場景尚未製作（目前只有 prologue-village）——五章表格中的地點（獵人村落、湖畔村落、荒漠古城、古城深處）都是空白畫布。
3. `EventEffect.type: 'equipment'` 已定義未接通事件系統。
4. `lootCatalog`（怪物掉落功法池）已被清空待重新設計江湖功法。
5. NPC 商隊/護送/掠奪、區域控制/中立地標在 master-plan 中標記 Planned。

---

## 第三步：配合現有內容聯關補漏

### 3.1 實作順序（依 catalogs-extension.md 的手法執行）

1. **純資料層**：先加 catalog 條目（道具/裝備/Buff/功法），確認用現有 effect 欄位即可表達。
2. **引用層**：把新 id 接進掉落與取得管線——`terrainLootCatalog` 地形分配、商店 `requiredShopLevel`、事件效果 `item` / `learn-skill`。
3. **敘事層**：需要時補 `storyDialogueCatalog` 對話步驟或探索事件定義，讓新事物「被發現」的過程有戲。
4. **規則層**（僅當發明新機制）：擴 effect union → 補 handler → 補 scaling。這是最後手段。

### 3.2 缺漏檢查清單（每批新內容逐項打勾）

- [ ] 新 buff 類道具的 `buffDefinitionId` 在 buffCatalog 存在（`itemCatalog.test.ts` 會驗）
- [ ] 功能外功的 effect → descriptions → buffBindings 三處同步（`skillProgressionCatalog.test.ts` 會驗）
- [ ] 新道具/裝備已分配地形特產池或刻意排除
- [ ] 商店等級與掉落階級符合既有曲線，不會污染低等級掉落池
- [ ] 劇情實體引用的 itemId/skillId 都存在（目前無自動測試，人工核對）
- [ ] 編輯器下拉選單會自動收錄（editorOptions 讀 catalog，無需改動，但需目視確認）
- [ ] UI 文字分組（`components/itemGroups.ts`）與 highlightTerms 是否需要涵蓋新類別
- [ ] 沒有更動任何既有 id 或 `itemCatalog[0]` 順序

### 3.3 驗證工作流

⚠️ 本機未安裝 Node.js——所有 node/npm 指令一律透過 Docker 執行（`mygame2/docker-compose.yml` 提供 `node:22` 服務，工作目錄掛載為 `/workspace`）：

```powershell
docker compose run --rm node npx tsc -b --pretty false    # 型別（union 改動最容易漏）
docker compose run --rm node npx vitest run               # 全量回歸；重點: itemCatalog / skillProgressionCatalog / equipmentCatalog / lootFactory / eventCatalog
docker compose run --rm node npm run analyze:combat       # 動了傷害數值後跑平衡分析
docker compose run --rm -p 5173:5173 node npm run dev     # 手動冒煙：開一局拿到新內容走一遍流程
```

若相依套件有異動，先 `docker compose run --rm node npm i`。

為跨目錄的新引用補存在性測試（仿 `itemCatalog.test.ts` 對 buff 的檢查）。

### 3.4 文件回寫義務

完成後依專案慣例更新：
1. `reports/development-log.md` 新增一篇（本次完成／影響檔案／驗證結果／待驗收項目）。
2. 若該系統有對應設計文件，把新內容併入該文件而非另開新檔（reports 已有同名重複檔問題，勿再加劇）。

---

## 附錄 A：已量測成長曲線速查表

| 系列 | Lv1 | Lv2 | Lv3 | Lv4 | 備註 |
|---|---|---|---|---|---|
| 回氣血道具 | +20 / $20 | +50 / $40 | +80 / $70 | +120 / $110 | 九轉回天丹為頂階 |
| 回內力道具 | +15 / $20 | +35 / $40 | +60 / $70 | +100 / $110 | 同上價格階梯 |
| 回體力道具 | +6 / $15 | +14 / $40 | +25 / $70 | +40 / $110 | 體力數值級距較小 |
| 元素爆發符 | 15 / $20 | 30 / $40 | 50 / $70 | 75 / $110 | 六元素×四階＋無元素爆破線 |
| 屬性丸 | 永久+1 / $70 | — | — | — | 五維各一顆，Lv1 即售 |
| 戰場操控 | $25~45 | — | — | — | 陷阱/偵查類，Lv1~2 |
| 門派裝備 | 2 點屬性 / $30 | 4 點 / $60 | 6 點 / $90 | — | buyPrice=門派等級×30；耐久固定 24 |
| 一般裝備 | ~2 點 / $30 | ~4 點 / $60 | ~6 點 / $90 | ~8 點 / $120 | 耐久 14→42 隨級成長 |

其他常數：
- 怪物掉落權重 = `round(20 ÷ 2^(tier−1))`（tier 取 requiredShopLevel / requiredHallLevel）
- 道具點混合 = 通用池 20% ＋ 地形特產 80%；通用池只含 ≤Lv2 物品（物品權重 20、裝備權重 10）
- 功法：內功悟性需求 5；外功悟性成本 2；內力消耗 base=3 / damage=4 / functional=6 / light-foot=5
- 序章 Boss 參考值：level 3、五維約 10/10/9/8/8、巢穴血量 40

## 附錄 B：單次擴充的最小交付定義

一次合格的內容擴充 PR 必須同時包含：

1. catalog 資料（含 id 命名遵循第 1.2 節）
2. 至少一條取得途徑（商店/掉落/事件/劇情）
3. 至少一段敘事依托（事件文字、對話或描述欄位講得出故事）
4. 交叉引用測試更新或新增
5. development-log 一篇

