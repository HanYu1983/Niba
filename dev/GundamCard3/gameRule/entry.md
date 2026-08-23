# 遊戲規則文件索引（由程式反推）

本目錄規則係根據 `bun/src/game`（狀態機、階段、戰鬥結算）與 `bun/src/script`（卡圖原型載入、牌面文字結構）**從實作反推**，不等同官方規則書；若與紙上規則衝突，以程式為準並於各文檔「衝突與實作備註」標出。

## 是否足以讓其他工程師「用另一種方法重寫」？

| 範圍 | 原先 01–06 | 加上 07–11 後 |
|------|------------|----------------|
| 回合／戰鬥主幹 | 足夠理解**在玩什麼** | 維持 |
| **狀態模型、存檔、同步** | **不足**（未寫 `table` 鍵、牌序、`flowMemory`） | **07** 補齊 |
| **移動與部隊** | 部分（戰鬥力） | **08** 補セット拖移、硬幣限制、TODO |
| **效果與 UI 協議** | 部分（堆疊概念） | **09** 補三佇列、`EffectReason`、**完整 Flow 枚舉**、`EventCenter` 鉤子 |
| **單卡能力如何執行** | **不足**（未說明 eval+Bridge） | **10** 說明 CardText DSL 與重寫選項 |
| **驗收／缺口** | 無 | **11** 檢核表 + 原始碼 TODO |

**結論**：僅 01–06 **不足以**架構級重寫同等引擎；**01–11 一併閱讀**可還原架構與協議，**單卡 100% 一致**仍取決於全量資料與原始碼中未完成的規則 TODO（見 **11**）。

## 專案對應（讀碼入口）

| 領域 | 主要路徑 |
|------|-----------|
| 階段列舉與順序 | `bun/src/game/define/Timing.ts`（`Phase`、`PhaseFn.getNext`） |
| 階段切換、規定效果排程 | `bun/src/game/gameStateWithFlowMemory/applyFlow.ts`（`FlowTriggerTextEvent`、`FlowNextTiming`） |
| 玩家可執行動作（宣告結束、切入、堆疊） | `bun/src/game/gameStateWithFlowMemory/queryFlow.ts` |
| 戰鬥力、部隊、出擊條件 | `bun/src/game/gameState/battleGroup.ts`、`player.ts` |
| 交戰與戰鬥區快照 | `bun/src/game/gameState/IsBattleComponent.ts` |
| 規定效果本體 | `createRerollPhaseRuleEffect.ts`、`createDrawPhaseRuleEffect.ts`、`createAttackPhaseRuleEffect.ts`、`createDamageRuleEffect.ts`、`createReturnRuleEffect.ts`、`createDiscardRuleEffect.ts` |
| 卡牌原型／關鍵字解析 | `bun/src/script/index.ts`（`loadPrototype`） |
| 狀態／牌桌／初始化 | `GameState.ts`、`GameStateWithFlowMemory.ts`、`tool/table/index.ts` |
| 效果與 Flow | `Effect.ts`、`EffectStackComponent.ts`、`Flow.ts`、`queryFlow.ts`、`applyFlow.ts` |
| CardText 執行 | `CardText.ts`、`doEffect.ts`、`script/bridge.ts` |
| 橫切事件 | `EventCenter.ts` |

## 規則分類（v2 玩家規則 + v4 重寫規格）

**玩家向（01–06）**：流程、場、戰鬥、效果時機、資料載入。  

**實作／重寫向（07–11）**：狀態模型、移動與セット、效果佇列與 Flow 協議、DSL、檢核與缺口。

1. **[01-turn-engine.md](./01-turn-engine.md)** — 回合結構、主被動切換、`GameEventOnTiming`、雙方宣告結束、立即效果優先權、遊戲結束條件  
2. **[02-board-and-zones.md](./02-board-and-zones.md)** — 場所關鍵字、戰鬥區與地球／宇宙對應、開局洗牌與起手六張、抽牌／リロール規定效果  
3. **[03-battle-snapshot-and-sortie.md](./03-battle-snapshot-and-sortie.md)** — 交戰判定、`battleSnapshot`、攻／防步驟的出擊（地球／宇宙）、部隊與戰鬥力合算、高機動篩選  
4. **[04-damage-destroy-and-return.md](./04-damage-destroy-and-return.md)** — 速度 1／2、速攻、ダメージ判定、溢傷打本國、強襲與交戰限制、破壞排程、帰還ステップ、ターン終了時（手札上限 7、切換主動玩家）  
5. **[05-effects-commands-and-timing.md](./05-effects-commands-and-timing.md)** — 配備フェイズ出牌、クイック、コマンド、G ゾーン `protectLevel`、堆疊與切入優先權、支付流程  
6. **[06-script-and-card-prototypes.md](./06-script-and-card-prototypes.md)** — JSON 資料、`CardPrototype`、牌面文字抽取與測試用 `script/ext`  
7. **[07-game-state-and-table-model.md](./07-game-state-and-table-model.md)** — `GameState`／`flowMemory`、`table.cardStack` 鍵與順序、初始化與先手、`ItemState`／`PlayerState`  
8. **[08-set-groups-and-moves.md](./08-set-groups-and-moves.md)** — セット親子、整組移動、硬幣不可移動、除外區改道、原始碼 TODO  
9. **[09-effects-stacks-and-flow-protocol.md](./09-effects-stacks-and-flow-protocol.md)** — `EffectReason`、三佇列、Flow 型別目錄、`EventCenterFn` 鉤子  
10. **[10-card-text-dsl-and-execution.md](./10-card-text-dsl-and-execution.md)** — CardText／Action／eval+Bridge、`GlobalEffect` 枚舉、重寫策略  
11. **[11-rewrite-spec-gaps-and-checklist.md](./11-rewrite-spec-gaps-and-checklist.md)** — 實作檢核表、已知不完整、與紙規關係說明  

## 第一階段摘要：遊戲大致樣貌

- **雙人對戰**，回合有明確的**日文階段名**（リロール → ドロー → 配備 → 戦闘），戦闘內再細分**攻撃／防御／ダメージ判定／帰還**各步驟，以及**ターン終了時**子階段。  
- **主動玩家**推進「非自由時機」的系統事件；**自由タイミング**需**兩位玩家都宣告該子階段結束**才進下一時機。  
- **場所**包含本国、手札、配備エリア、戦闘エリア1（地球）、戦闘エリア2（宇宙）、Gゾーン、捨て山、ジャンクヤード等；**ユニット**可與**キャラクター**等組成**セットグループ**並合算戰鬥力與 HP。  
- **交戰**由戰鬥區**快照**與對方區是否有單位決定；**ダメージ判定**依快照決定誰算「前衛／射擊」與能否對本國造成戰鬥傷害（含**強襲**例外）。  
- **卡牌能力**以效果物件與堆疊解析；**コマンド**與一般從場上出牌在程式上分開聚合；**script** 負責把卡包 JSON 轉成遊戲內原型。

## 已知實作與規則書可能差異（總表）

| 主題 | 程式行為 | 詳見 |
|------|-----------|------|
| 何時可リロール | `getItemIsCanReroll` 恆為 `true`，リロール規定效果會嘗試處理配備／G 上「所有」項目 | [02-board-and-zones.md](./02-board-and-zones.md) |
| 規則註解中的頁碼 | 程式註解引用規則書頁碼（如 p34、p70）僅供對照 | 各戰鬥相關文檔 |

## 修訂紀錄

- **v1**：初版分類（階段／場／戰鬥／效果／腳本五類）。  
- **v2**：合併「流程與堆疊」為可讀的引擎層與效果層；戰鬥拆成快照出擊與傷害帰還兩檔，與 `player.ts` 模組分工一致。  
- **v3（第二階段第二輪）**：補強「手牌調整與 `addImmediateEffectIfCanPayCost`」語意；在 `04` 加入與 `doPlayerAttack`／本國傷害門檻的原始碼對照段落。  
- **v4（重寫規格第一輪）**：新增 **07–09**（狀態／牌桌、セット與移動、效果與 Flow 協議）。  
- **v5（重寫規格第二輪）**：新增 **10–11**（CardText DSL、檢核表與缺口）；**09** 增補 `EventCenter` 鉤子清單；**entry** 增「是否足以重寫」判定表。

## 核心型別速覽（可點進原始碼）

```3:38:bun/src/game/define/Timing.ts
export type Phase =
    | ["リロールフェイズ", "フェイズ開始"]
    | ["リロールフェイズ", "規定の効果"]
    | ["リロールフェイズ", "フリータイミング"]
    | ["リロールフェイズ", "フェイズ終了"]
    | ["ドローフェイズ", "フェイズ開始"]
    | ["ドローフェイズ", "規定の効果"]
    | ["ドローフェイズ", "フリータイミング"]
    | ["ドローフェイズ", "フェイズ終了"]
    | ["配備フェイズ", "フェイズ開始"]
    | ["配備フェイズ", "フリータイミング"]
    | ["配備フェイズ", "フェイズ終了"]
    | ["戦闘フェイズ", "攻撃ステップ", "ステップ開始"]
    | ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]
    | ["戦闘フェイズ", "攻撃ステップ", "規定の効果"]
    | ["戦闘フェイズ", "攻撃ステップ", "フリータイミング2"]
    | ["戦闘フェイズ", "攻撃ステップ", "ステップ終了"]
    | ["戦闘フェイズ", "防御ステップ", "ステップ開始"]
    | ["戦闘フェイズ", "防御ステップ", "フリータイミング"]
    | ["戦闘フェイズ", "防御ステップ", "規定の効果"]
    | ["戦闘フェイズ", "防御ステップ", "フリータイミング2"]
    | ["戦闘フェイズ", "防御ステップ", "ステップ終了"]
    | ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"]
    | ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]
    | ["戦闘フェイズ", "ダメージ判定ステップ", "規定の効果"]
    | ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング2"]
    | ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ終了"]
    | ["戦闘フェイズ", "帰還ステップ", "ステップ開始"]
    | ["戦闘フェイズ", "帰還ステップ", "フリータイミング"]
    | ["戦闘フェイズ", "帰還ステップ", "規定の効果"]
    | ["戦闘フェイズ", "帰還ステップ", "フリータイミング2"]
    | ["戦闘フェイズ", "帰還ステップ", "ステップ終了"]
    | ["戦闘フェイズ", "ターン終了時", "ダメージリセット"]
    | ["戦闘フェイズ", "ターン終了時", "効果解決"]
    | ["戦闘フェイズ", "ターン終了時", "手札調整"]
    | ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"];
```

```12:21:bun/src/game/define/BaSyou.ts
export type BaSyouKeyword =
    | "本国"
    | "捨て山"
    | "Gゾーン"
    | "ジャンクヤード"
    | "手札"
    | "ハンガー"
    | "取り除かれたカード"
    | "プレイされているカード"
    | BaKeyword;
```
