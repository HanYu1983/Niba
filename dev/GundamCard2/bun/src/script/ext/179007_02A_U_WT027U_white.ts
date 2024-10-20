// 179007_02A_U_WT027U_white
// アストレイ レッドフレーム
// アストレイ系　レッドフレーム系　MS　専用「ロウ・ギュール」
// 〔０〕：改装［レッドフレーム系］
// ＜（戦闘フェイズ）〔１〕：このカードが、Gである状態で、白のGサインを持つ自軍Gが２枚以上ある場合、このカードを、ユニットとして自軍配備エリアにリロール状態で出す＞

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "＜（戦闘フェイズ）〔１〕：このカードが、Gである状態で、白のGサインを持つ自軍Gが２枚以上ある場合、このカードを、ユニットとして自軍配備エリアにリロール状態で出す＞",
      title: ["使用型", ["戦闘フェイズ"]],
      protectLevel: 2,
      conditions: {
        ...createRollCostRequire(1, null),
        "Gである状態": {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const cardController = GameStateFn.getItemController(ctx, cardId)
                if (GameStateFn.getItemRuntimeCategory(ctx, cardId) == "グラフィック") {

                } else {
                  throw new DefineFn.TargetMissingError(`Gである状態`)
                }
                return ctx
              }.toString()
            }
          ]
        },
        "白のGサインを持つ自軍Gが２枚以上ある場合": {
          actions: [
            {
              title: ["Entity", {
                side: "自軍",
                at: ["Gゾーン"],
                min: 2,
              }]
            },
          ]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  description: "このカードを、ユニットとして自軍配備エリアにリロール状態で出す",
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const cardController = GameStateFn.getItemController(ctx, cardId)
                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "配備エリア"), GameStateFn.createStrBaSyouPair(ctx, cardId), { ges: Options.ges })
                    ctx = GameStateFn.doItemSetRollState(ctx, false, GameStateFn.createStrBaSyouPair(ctx, cardId), { isSkipTargetMissing: true })
                    return ctx
                  }.toString()
                }
              ]]
            }
          ]
        }
      ]
    }
  ]
};


function createRollCostRequire(
  costNum: number,
  color: CardColor | null
): { [key: string]: Condition } {
  let ret: { [key: string]: Condition } = {}
  for (let i = 0; i < costNum; ++i) {
    const key = `${i}[${color}]`
    ret = {
      ...ret,
      [key]: {
        title: ["RollColor", color],
        actions: [
          {
            title: ["_ロールする", "ロール"],
            vars: [key]
          }
        ]
      }
    };
  }
  return ret
}