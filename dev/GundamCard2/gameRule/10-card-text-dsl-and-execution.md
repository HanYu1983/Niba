# 10 — CardText DSL、Bridge 與動作執行（重寫核心）

## 為何這份文件關鍵

本專案**不是**把規則寫死在少數函式里；大量規則在 **卡牌文字的結構化表示** + **可執行片段** 中。重寫若只還原 `player.ts` 戰鬥公式，**無法**還原多數單卡能力。

## `CardText` 形狀（概觀）

定義於 `bun/src/game/define/CardText.ts`（節錄概念）：

- **特殊能力關鍵字** `TextSpeicalEffect`：高機動、速攻、強襲、クイック、改装、ゲイン、クロスウェポン…（與 `script` 解析呼應）。  
- **文字標題** `TextTitle`：區分 使用型／起動型／常駐型／特殊型 等。  
- **條件** `Condition`：多為字串儲存的函式本體（與 Bridge 一起 eval）。  
- **動作** `Action`：`title` 可為字串或結構化 `ActionTitle`（移動、抽牌、triggerEvent、cutIn…）。  
- **邏輯樹** `logicTreeActions: LogicTreeAction[]`：巢狀執行順序。

## 動作標題如何變成程式

`ActionFn.getTitleFn`：

- 要求 `action.title` 為 **string**，內容是 **JavaScript 函式原始碼**（`function _(ctx, effect, bridge){...}` 形式），以 **`eval`** 還原成可呼叫函式。

**重寫選項**：

1. **相容模式**：保留「字串存 JS」模型，實作相同 `Bridge` API（`bun/src/script/bridge.ts`、`createBridge.ts`）。  
2. **安全重寫**：把既有字串逐步遷移到 **opcode 陣列** 或 WASM／沙箱；需重建所有 `createPlayCardEffects` 產物與資料檔。  
3. **半自動**：解析 `CardText` 僅支援子集，其餘 fallback 舊引擎。

## Bridge（`Bridge` 型別）

效果執行時注入 `DefineFn`（型別／純函式）、`GameStateFn`（狀態操作）、`Options`（如 `ges` 全域效果列表）。  
卡牌腳本與規則共用此介面，**路徑**：`bun/src/script/bridge.ts`（匯出型別與命名空間）。

## 條件與提示 `Tip`

- `Tip` 描述玩家要選什麼（卡列表、數量、旗標如去地球／去宇宙）。  
- 選取結果寫入 `ItemState.tips[conditionKey]`，再由 `FlowSetTipSelection` 提交。

## 全域效果 `GlobalEffect`

`bun/src/game/define/GlobalEffect.ts` 的 `GlobalEffectTitle` 是 **封閉枚舉**；戰鬥與出牌邏輯各處以 `ge.title[0] == "…"` 分支處理。  
重寫時：

- 要嘛 **完整移植枚舉與所有分支**，  
- 要嘛明確列出「本引擎僅支援子集」並拒載未支援卡。

### `GlobalEffectTitle` 現有分支（重寫掃描 grep 用）

```7:30:bun/src/game/define/GlobalEffect.ts
export type GlobalEffectTitle =
    | ["合計国力_＋１してプレイできる", number]
    | ["合計国力_＋１", number]
    | ["AddText", CardText]
    | ["AddTextRef", TipTitleTextRef]
    | ["このカードを自軍Gとしてロールできる"]
    | ["＋x／＋x／＋xを得る", BattleBonus]
    | ["發生國力", CardColor[]]
    | ["SpecialEffectBonus", TextSpeicalEffect]
    | ["場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる"]
    | ["自軍手札にあるかのようにプレイできる"]
    | ["3以下の合計国力を持つ敵軍コマンドの効果では無効にならない"]
    | ["このカードの部隊の部隊戦闘力を_＋３する", number]
    | ["このカードと交戦中の敵軍部隊の部隊戦闘力を_－３する", number]
    | ["_白のGサインを持つ_自軍_Gとして扱う事ができる", CardColor[], RelatedPlayerSideKeyword, CardCategory]
    | ["このカードが受ける全ての_通常ダメージは、_２減殺される", DamageTypeKeyword, number]
    | ["「範囲兵器」の対象部分は、『X以下の防御力を持つ敵軍ユニット１枚』に変更される"]
    | ["_ユニットは、「サイコミュ」の効果において、交戦中として扱う。", string[]]
    | ["敵軍効果の対象にならない"]
    | ["敵軍ユニットの効果の対象にならない"]
    | ["このセットグループは、_緑のロールコストを持つ、敵軍カードの効果の対象にならない", CardColor[]]
    | ["自軍の手札の上限枚数に＋_１", number]
    | ["このカードは、戦闘エリアにいる自軍ユニットにもセットできる"]
    | ["このセットグループのユニットは、ロール状態でも防御に出撃できる"]
```

新增卡效果若出現**字串不相等**的新標題，舊引擎會**靜默不生效**，重寫時建議改為**顯式註冊**或型別安全路由。

## `createPlayEffects` / `createPlayCardEffects`

- 配備與自由時機如何「掃場上卡 → 產生 Effect 列表」見 `createPlayEffects.ts`（與 `05` 重疊；本檔強調 **產物是 Effect 圖**，不是規則一句話）。  
- 單卡打出時的費用、目標、進場事件在 `createPlayCardEffects.ts` 與相關檔（重寫需系統性閱讀）。

## 橫向檢查

- **與 06**：`loadPrototype` 決定進入 `CardText` 的素材；解析錯 = 規則錯。  
- **與 09**：每個 Effect 必須能走通 `createCommandEffectTips` →（可選）`FlowDoEffect` → `doEffect`。

## 已知限制

- 依賴 `eval`：**安全性與可移植性**差；重寫為其他語言時必替換為等價 DSL。  
- `SetGroupComponent` 註解中的複雜互動（對抗、改装複數等）代表 **DSL 與引擎仍不完整**。
