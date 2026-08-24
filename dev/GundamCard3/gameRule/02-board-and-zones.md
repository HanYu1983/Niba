# 02 — 場所、牌物件與開局／抽補

## 程式依據

- 場所枚舉：`bun/src/game/define/BaSyou.ts`（`BaSyouKeyword`、`AbsoluteBaSyou`）。  
- 戰鬥區域語意 vs 地球／宇宙：`bun/src/game/gameState/RuntimeBattleAreaComponent.ts`。  
- 開局：`applyFlow.ts` 中 `prepareDeck` → `whoFirst` → `draw6AndConfirm`。  
- 抽牌規定：`createDrawPhaseRuleEffect.ts`。  
- リロール規定：`createRerollPhaseRuleEffect.ts`。

## 場所（BaSyouKeyword）

程式中出現的場所包含（`BaSyouKeywordFn.getAll()`）：  

**本国**、**捨て山**、**取り除かれたカード**、**Gゾーン**、**ジャンクヤード**、**手札**、**ハンガー**、**戦闘エリア1**、**戦闘エリア2**、**配備エリア**。  

其中 **戦闘エリア1／2、配備エリア、Gゾーン** 被標為「場」（`isBa`）。

### 地球／宇宙與戰鬥區

- `getRuntimeBattleArea(ctx, "戦闘エリア1")` **固定**為 `地球エリア`。  
- `getRuntimeBattleArea(ctx, "戦闘エリア2")` **固定**為 `宇宙エリア`。  
- 出擊時會檢查ユニット原型 `battleArea` 是否包含當前區域關鍵字（見 `03`）。

## 開局流程（`flowMemory.state`）

1. **prepareDeck**：雙方本国洗牌（`shuffleItems`）。  
2. **whoFirst**：狀態轉換（實際先手可能在別處設定；此處僅狀態機一環）。  
3. **draw6AndConfirm**：自本国頂**各抽 6 張**到手札；`phase` 設為 **リロールフェイズ／フェイズ開始**；`state` 改為 `playing`。

## ドローフェイズ — 規定の効果

- `createDrawPhaseRuleEffect`：主動玩家從**本国**依序移 **1 張**到**手札**（`drawCount = 1`）。

## リロールフェイズ — 規定の効果

- 掃描主動玩家 **配備エリア** 與 **Gゾーン** 上的卡牌。  
- 對通過 `getItemIsCanReroll` 的項目執行 `doItemSetRollStateBasic(ctx, false, …)`（將橫置狀態設回非橫置語意上的「基本」狀態，實際以該函式為準）。

### 衝突與實作備註（重要）

- `bun/src/game/gameState/card.ts` 中 `getItemIsCanReroll` **恆回傳 `true`**。  
- 意即：只要卡在配備或 G，**規則引擎層面沒有排除**「不可リロール」的牌——若實卡規則有例外，目前**未在該函式表達**。  
- 與 **01** 無矛盾；與紙上規則可能不一致，已記於 `entry.md` 總表。

```307:309:bun/src/game/gameState/card.ts
export function getItemIsCanReroll(ctx: GameState, itemId: string): boolean {
  return true
}
```

## 與其它規則的橫向檢查

- **與 04**：本国牌移動至捨て山作為戰鬥傷害結算在 `doCountryDamage`；捨て山牌可因「負傷害」類邏輯回到本国（同檔 `damage < 0` 分支）。  
- **與 06**：卡片的 `battleArea`、類別來自原型／script 載入，不在本檔重複。

## 第二輪補遺

- **「プレイされているカード」** 出現在型別定義相關處，與列表 `getAll()` 略有差異；實際堆疊以 `ItemTable`／`cardStack` 為準，讀碼時以引用路徑為準。  
- **手札上限**：預設 **7**，在ターン終了時子階段處理（見 `04`）；全域效果可加上限（`createDiscardRuleEffect` 內 `自軍の手札の上限枚数に＋_１`）。
