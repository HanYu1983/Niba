
// 179026_08D_CH_BL085U_blue
// U
// Z
// エマ・シーン
// 女性　大人
// 『起動』：このカードが、場に出た、または場から離れる場合、このセットグループ以外の自軍ユニット１枚の上に＋１／＋１／＋１コイン１個を乗せる。

import { AbsoluteBaSyou } from "../../game/define/BaSyou";
import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { type Effect } from "../../game/define/Effect";
import { StrBaSyouPair } from "../../game/define/Tip";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが、場に出た、または場から離れる場合、このセットグループ以外の自軍ユニット１枚の上に＋１／＋１／＋１コイン１個を乗せる。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "配備エリア", { id: "thisCard", protoID: "179026_08D_CH_BL085U_blue" }, null],
          eventTitle: ["このカードが場に出た場合"],
          addCards: [
            ["自軍", "戦闘エリア1", [{ id: "unit", protoID: "unit" }]],
            ["自軍", "戦闘エリア2", [{ id: "unit2", protoID: "unit" }]]
          ],
          setGroupParent: { "thisCard": "unit" },
          checkFn(ctx: GameState, { GameStateFn, DefineFn, Options }: Bridge) {
            if (GameStateFn.getCoinIdsByCardId(ctx, "unit2").length != 1) {
              throw new Error()
            }
          }
        },
        {
          thisCard: ["自軍", "配備エリア", { id: "thisCard", protoID: "179026_08D_CH_BL085U_blue" }, null],
          eventTitle: ["カードが場から離れる場合"],
          addCards: [
            ["自軍", "戦闘エリア1", [{ id: "unit", protoID: "unit" }]],
            ["自軍", "戦闘エリア2", [{ id: "unit2", protoID: "unit" }]]
          ],
          setGroupParent: { "thisCard": "unit" },
          checkFn(ctx: GameState, { GameStateFn, DefineFn, Options }: Bridge) {
            if (GameStateFn.getCoinIdsByCardId(ctx, "unit2").length != 1) {
              throw new Error()
            }
          }
        },
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if ((event.title[0] == "このカードが場に出た場合" || event.title[0] == "カードが場から離れる場合")
          && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "このセットグループ以外の自軍ユニット１枚": {
                title: ["Entity", {
                  atBa: true,
                  isThisSetGroup: false,
                  side: "自軍",
                  is: ["ユニット"],
                  count: 1
                }]
              },
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_－１／－１／－１コイン_１個を乗せる", [1, 1, 1], 1],
                  vars: ["このセットグループ以外の自軍ユニット１枚"]
                },
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),

    }
  ],
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