// 179027_09D_C_BK063R_black
// 覚悟の戦い
// 破壊
// 『恒常』：自軍セットカードがある場合、このカードは、合計国力－２、ロールコスト－２してプレイできる。
// （ダメージ判定ステップ）：戦闘エリアにいる、セットカードがセットされていない敵軍ユニット１枚を破壊する。その場合、カード１枚を引く。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
import { CardText, CardTextFn } from "../../game/define/CardText";
import { LogicTree } from "../../tool/logicTree";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（ダメージ判定ステップ）：戦闘エリアにいる、セットカードがセットされていない敵軍ユニット１枚を破壊する。その場合、カード１枚を引く。",
    title: ["使用型", ["ダメージ判定ステップ"]],
    conditions: {
      "戦闘エリアにいる、セットカードがセットされていない敵軍ユニット１枚": {
        title: ["Entity", {
          at: ["戦闘エリア1", "戦闘エリア2"],
          hasSetCard: false,
          side: "敵軍",
          is: ["ユニット"],
          count: 1
        }]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_ロールする", "破壞"],
            vars: ["戦闘エリアにいる、セットカードがセットされていない敵軍ユニット１枚"]
          },
          {
            title: ["カード_１枚を引く", 1],
          }
        ]
      }
    ]
  },
  texts: [
    {
      id: "",
      description: "『恒常』：自軍セットカードがある場合、このカードは、合計国力－２、ロールコスト－２してプレイできる。",
      title: ["自動型", "恒常"],
      createPlayEffect: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Effect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const tip = GameStateFn.createTipByEntitySearch(ctx, effect, {
          side: "自軍",
          at: DefineFn.BaSyouKeywordFn.getBaAll(),
          hasSetCard: true,
          min: 1
        })
        const enabled = DefineFn.TipFn.getWant(tip).length > 0
        if (enabled == false) {
          return []
        }
        const ges = GameStateFn.getGlobalEffects(ctx, null)
        const prototype = GameStateFn.getItemPrototype(ctx, cardId)
        const playEffect = GameStateFn.createPlayCommandText(ctx, cardId, {ges: ges})
        const playText = playEffect.text
        let originRollCostConditions = GameStateFn.createRollCostConditions(ctx, prototype, prototype.rollCost || [], 0)
        // 取得原始條件
        let copyOriginCondition = { ...playText.conditions }

        // 將原始條件的橫置費用清除
        for (const rollCostKey of Object.keys(originRollCostConditions)) {
          delete copyOriginCondition[rollCostKey]
        }
        // 重新計算橫置費用減免
        const newRollCostConditions = GameStateFn.createRollCostConditions(ctx, prototype, prototype.rollCost || [], -2)
        copyOriginCondition = {
          ...copyOriginCondition,
          ...newRollCostConditions,
        }
        // 重新計算合計國力減免
        const originCardRollCostLength = prototype.totalCost != "X" ? (prototype.totalCost || 0) : 0
        copyOriginCondition = {
          ...copyOriginCondition,
          [DefineFn.TipFn.createTotalCostKey()]: {
            actions: [
              {
                title: ["合計国力〔x〕", originCardRollCostLength - 2]
              }
            ]
          }
        }
        // 重寫條件
        let totalCostPlusPlayText: CardText = JSON.parse(JSON.stringify(playText))
        totalCostPlusPlayText = {
          ...totalCostPlusPlayText,
          conditions: copyOriginCondition,
        }

        if (totalCostPlusPlayText.logicTreeActions?.[0] == null) {
          throw new Error(`morePlayCardEffect.text.logicTreeActions?.[0] == null`)
        }

        // 重算LogicTree
        const logicLeafs: LogicTree[] = Object.keys(copyOriginCondition).map(k => {
          const ret: LogicTree = {
            type: "Leaf",
            value: k
          }
          return ret
        })
        const logicTree: LogicTree = {
          type: "And",
          children: logicLeafs
        }
        totalCostPlusPlayText.logicTreeActions[0].logicTree = logicTree
        return [{
          ...playEffect,
          description: effect.text.description,
          text: totalCostPlusPlayText
        }]
      }.toString()
    }
  ]
};
