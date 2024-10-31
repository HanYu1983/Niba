import { pipe, always, map, flatten } from "ramda"
import { logCategory } from "../../tool/logger"
import { createBridge } from "../bridge/createBridge"
import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { Effect } from "../define/Effect"
import { GlobalEffect } from "../define/GlobalEffect"
import { PlayerA, PlayerB } from "../define/PlayerID"
import { Situation, getOnSituationFn, OnSituationFn, CardText } from "../define/CardText"
import { ToolFn } from "../tool"
import { getCardIds, getCard } from "./CardTableComponent"
import { GameState } from "./GameState"
import { getItemIdsByBasyou, isCard, isChip, getItem, getItemPrototype, Item, getItemController } from "./ItemTableComponent"
import { getItemState, getItemStateValues } from "./ItemStateComponent"
import { ItemStateFn } from "../define/ItemState"
import { createTextsFromSpecialEffect } from "./createTextsFromSpecialEffect"
import { TipTitleTextRef } from "../define/Tip"
import { getCardTextFromCardTextRef } from "./card"

var __callGlobal: any = null
export function getGlobalEffects(ctx: GameState, situation: Situation | null): GlobalEffect[] {
  logCategory("getGlobalEffects", "")
  if (__callGlobal) {
    throw new Error()
  }
  __callGlobal = true
  const key = JSON.stringify(situation)
  const cached = ctx.globalEffectPool[key]
  if (cached) {
    __callGlobal = null
    logCategory("getGlobalEffects", "=======")
    return cached
  }
  const ret = getSituationEffects(ctx, situation)
  __callGlobal = null
  logCategory("getGlobalEffects", "=======")
  return ret
}

export function setGlobalEffects(ctx: GameState, situation: Situation | null, ges: GlobalEffect[]): GameState {
  const key = JSON.stringify(situation)
  return {
    ...ctx,
    globalEffectPool: {
      ...ctx.globalEffectPool,
      [key]: ges
    }
  }
}

export function clearGlobalEffects(ctx: GameState): GameState {
  return {
    ...ctx,
    globalEffectPool: {}
  }
}

export function updateGlobalEffects(ctx: GameState): GameState {
  ctx = clearGlobalEffects(ctx)
  ctx = setGlobalEffects(ctx, null, getGlobalEffects(ctx, null))
  return ctx
}

// globalEffects
function getSituationEffects(ctx: GameState, situation: Situation | null): GlobalEffect[] {
  const bridge = createBridge({})
  const ges = createAllCardTexts(ctx).flatMap(([item, texts]) => {
    const globalEffects = texts
      .map((text, i) => {
        const cardController = getItemController(ctx, item.id)
        const fn = getOnSituationFn(text)
        const effect: Effect = {
          id: ToolFn.getUUID("getSituationEffects"),
          reason: ["Situation", cardController, item.id, situation],
          text: text
        }
        return [fn, effect] as [OnSituationFn, Effect]
      })
      .flatMap(([fn, effect]) => {
        return fn(ctx, effect, bridge)
      })
    return globalEffects
  })
  const itemStateGes = getItemStateValues(ctx).flatMap(ItemStateFn.getGlobalEffects)
  const gGes = [AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), AbsoluteBaSyouFn.of(PlayerB, "Gゾーン")]
    .flatMap(basyou => getItemIdsByBasyou(ctx, basyou))
    .filter(itemId => getCard(ctx, itemId).isRoll != true)
    .map(itemId => {
      // 空陣列代表產生無色國力
      const colors = getItemPrototype(ctx, itemId).gsign?.[0] || []
      return { title: ["發生國力", colors], cardIds: [itemId] } as GlobalEffect
    })
  return [...ges, ...itemStateGes, ...gGes]
}


export function createAllCardTexts(ctx: GameState): [Item, CardText[]][] {
  // 常駐(只在戰區和配置區)
  const getTextGroup1 = pipe(
    always(AbsoluteBaSyouFn.getBaAll()),
    map(basyou => getItemIdsByBasyou(ctx, basyou)),
    flatten,
    itemIds => itemIds.filter(itemId => isCard(ctx, itemId) || isChip(ctx, itemId)),
    map(itemId => getItem(ctx, itemId)),
    map(item => {
      const proto = getItemPrototype(ctx, item.id)
      let texts = (proto.texts || []).flatMap(text => {
        if (text.title[0] == "特殊型") {
          return createTextsFromSpecialEffect(text, {})
        }
        return [text]
      })
      texts = texts.filter(text => text.title[0] == "自動型" && (text.title[1] == "常駐" || text.title[1] == "起動"))
      return [item, texts] as [Item, CardText[]]
    })
  )
  // 恒常 & 使用型 (只要是牌面向上的的地方, 這裡包含使用型是為了計算事件)
  const getTextGroup2 = pipe(
    always(AbsoluteBaSyouFn.getTextOn()),
    map(basyou => getItemIdsByBasyou(ctx, basyou)),
    flatten,
    itemIds => itemIds.filter(itemId => isCard(ctx, itemId) || isChip(ctx, itemId)),
    map(itemId => getItem(ctx, itemId)),
    map(item => {
      const proto = getItemPrototype(ctx, item.id)
      let texts = (proto.texts || []).flatMap(text => {
        if (text.title[0] == "特殊型") {
          return createTextsFromSpecialEffect(text, {})
        }
        return [text]
      })
      texts = texts.filter(text => (text.title[0] == "自動型" && text.title[1] == "恒常") || text.title[0] == "使用型")
      return [item, texts] as [Item, CardText[]]
    })
  )
  // Gゾーン常駐 (在G區的<>常駐內文)
  const getTextGroup3 = pipe(
    always([AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), AbsoluteBaSyouFn.of(PlayerB, "Gゾーン")]),
    map(basyou => getItemIdsByBasyou(ctx, basyou)),
    flatten,
    itemIds => itemIds.filter(itemId => isCard(ctx, itemId) || isChip(ctx, itemId)),
    map(itemId => getItem(ctx, itemId)),
    map(item => {
      const proto = getItemPrototype(ctx, item.id)
      let texts = (proto.texts || []).flatMap(text => {
        if (text.protectLevel == 2 && text.title[0] == "特殊型") {
          return createTextsFromSpecialEffect(text, {})
        }
        return [text]
      })
      texts = texts.filter(text => text.protectLevel == 2 && text.title[0] == "自動型" && (text.title[1] == "常駐" || text.title[1] == "起動"))
      return [item, texts] as [Item, CardText[]]
    })
  )
  // 指令. 為了計算事件
  const getTextGroup4 = pipe(
    always(getCardIds(ctx)),
    map(cardId => {
      const proto = getItemPrototype(ctx, cardId)
      if (proto.commandText?.onSituation) {
        return [getCard(ctx, cardId), [proto.commandText]] as [Item, CardText[]]
      }
      return null
    }),
    infos => infos.filter(v => v) as [Item, CardText[]][],
  )
  const allCardTexts = [...getTextGroup1(), ...getTextGroup2(), ...getTextGroup3(), ...getTextGroup4()]

  const bridge = createBridge({})
  const firstGlobalEffectsFromAllTexts = allCardTexts.flatMap(([item, texts]) => {
    const globalEffects = texts
      .flatMap((text, i) => {
        if (text.onSituation == null) {
          return []
        }
        const cardController = getItemController(ctx, item.id)
        logCategory("createAllCardTexts", "getOnSituationFn", text.onSituation)
        const fn = getOnSituationFn(text)
        const effect: Effect = {
          id: ToolFn.getUUID("getSituationEffects"),
          reason: ["Situation", cardController, item.id, { title: ["有沒有新增內文"] }],
          text: text
        }
        return fn(ctx, effect, bridge)
      })
    return globalEffects
  })

  const itemStateGes = getItemStateValues(ctx).flatMap(ItemStateFn.getGlobalEffects)

  const firstGes = [...firstGlobalEffectsFromAllTexts, ...itemStateGes]

  const textsByAddText = firstGes.filter(ge => ge.title[0] == "AddText")
    .map(ge => [ge.cardIds, ge.title[1]] as [string[], CardText])
    .flatMap(([itemIds, text]) => {
      return itemIds.flatMap(itemId => {
        const texts = text.title[0] == "特殊型" ? createTextsFromSpecialEffect(text, {}) : [text]
        return [[getItem(ctx, itemId), texts]] as [Item, CardText[]][]
      })
    })

  const textsByAddTextRef = firstGes.filter(ge => ge.title[0] == "AddTextRef")
    .map(ge => [ge.cardIds, ge.title[1]] as [string[], TipTitleTextRef])
    .flatMap(([itemIds, textRef]) => {
      return itemIds.flatMap(itemId => {
        const text = getCardTextFromCardTextRef(ctx, textRef)
        const texts = text.title[0] == "特殊型" ? createTextsFromSpecialEffect(text, {}) : [text]
        return [[getItem(ctx, itemId), texts]] as [Item, CardText[]][]
      })
    })

  let allTexts = [...allCardTexts, ...textsByAddText, ...textsByAddTextRef]


  // allTexts = allCardTexts.filter(([item, texts]) => {

  // })

  // TODO 重構計算順序, 把特殊效果移到最後面再轉換就行了
  // 179022_06C_C_RD053R_red
  // R
  // OO
  // 癒えない悔恨
  // 支配
  // （攻撃ステップ）：全ての敵軍ユニットが持つ、全ての特殊効果を、ターン終了時まで無効にする。

  // 179029_05C_C_RD047U_red
  // U
  // ZZ
  // 甘言
  // 支配
  // （常時）：プレイされている敵軍ユニット１枚が持つ全てのテキストは、ターン終了時まで無効になる。（注：対象が場に出た後も有効）


  // 179024_03B_C_RD028S_red
  // S
  // クロスボーン
  // 怒れるX3
  // 支配
  // ユニーク
  // ユニーク
  // 『恒常』：このカードのプレイは、３以下の合計国力を持つ敵軍コマンドの効果では無効にならない。
  // （戦闘フェイズ）：エリア１つにいる、全ての敵軍カードが持つ全てのテキストと、まだ未解決のその効果を、このターン、無効にする。


  // 179016_04B_C_RD037R_red
  // R
  // ZZ
  // 呪縛からの解放
  // 支配
  // （常時）：敵軍カード１枚が持つテキスト１つを、ターン終了時まで無効にする。その場合、対象１と同じ種類の自軍カード１枚は、ターン終了時まで、無効にしたテキストと同じテキストを得る。

  // 179013_S1B_C_RD022U_red
  // U
  // UC
  // 無気力
  // 対抗　支配
  // （戦闘フェイズ）：戦闘エリアにいる敵軍ユニットのテキストのプレイ１つを無効にする。その場合、その敵軍ユニットが持つ全てのテキストを、このターン、無効にする。

  return allTexts
}