// 179027_09D_O_BL024R_blue
// R
// Z
// 刻を超えて
// 展開
// 『起動』：このカードがプレイされて、キャラがセットされていないユニットにセットされた場合、自軍本国のカードを全て見て、その中にある、青のGサインを持つキャラ１枚を、そのユニットにセットできる。その後、自軍本国をシャッフルする。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { EffectFn, type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";
import { Tip } from "../../game/define/Tip";
import { GlobalEffect } from "../../game/define/GlobalEffect";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードがプレイされて、キャラがセットされていないユニットにセットされた場合、自軍本国のカードを全て見て、その中にある、青のGサインを持つキャラ１枚を、そのユニットにセットできる。その後、自軍本国をシャッフルする。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "配備エリア", { id: "char", protoID: "179027_09D_O_BL024R_blue" }, null],
          addCards: [
            ["自軍", "配備エリア", [{ id: "unit", protoID: "unit" }]],
          ],
          createCards: [
            ["自軍", "本国", [["charBlue", 2]]],
          ],
          setGroupParent: { "char": "unit" },
          eventTitle: ["このカードがプレイされて、キャラがセットされていないユニットにセットされた場合"],
          checkFn(ctx, { DefineFn, GameStateFn }: Bridge) {
            if (GameStateFn.getSetGroup(ctx, "unit").length != 3) {
              throw new Error()
            }
          },
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "このカードがプレイされて、キャラがセットされていないユニットにセットされた場合" && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              "自軍本国のカードを全て見て、その中にある、青のGサインを持つキャラ１枚": {
                title: ["Entity", {
                  see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 50],
                  is: ["キャラクター"],
                  hasGSignColor: ["青"],
                  max: 1
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn, Options }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const cardController = GameStateFn.getItemController(ctx, cardId)
                    const targetUnitId = GameStateFn.getSetGroupRoot(ctx, cardId)
                    if (targetUnitId == cardId) {
                      throw new Error("targetUnitId == cardId")
                    }
                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍本国のカードを全て見て、その中にある、青のGサインを持つキャラ１枚", DefineFn.EffectFn.getCardID(effect))
                    if (pairs.length == 0) {
                      throw new Error("pairs.length == 0")
                    }
                    const [charId, charBasyou] = pairs[0]
                    ctx = GameStateFn.doItemMoveBasic(ctx, GameStateFn.getItemBaSyou(ctx, targetUnitId), [charId, charBasyou], Options) as GameState
                    const isRoll = GameStateFn.getCard(ctx, targetUnitId).isRoll || false
                    ctx = GameStateFn.mapCard(ctx, charId, is => ({ ...is, isRoll: isRoll })) as GameState
                    ctx = GameStateFn.setSetGroupParent(ctx, targetUnitId, charId) as GameState
                    ctx = GameStateFn.shuffleItems(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "本国")) as GameState
                    return ctx
                  }.toString()
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString()
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