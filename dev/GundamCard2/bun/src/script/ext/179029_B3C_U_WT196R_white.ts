// 179029_B3C_U_WT196R_white
// ジーラッハ［†］
// G-ラッハ系　MS　専用「マニィ・アンバサダ」
// 戦闘配備
// 『起動』：このカードが場に出た場合、自軍本国のカードを全て見て、その中にある「ルイン・リー」、または「マニィ・アンバサダ」1枚を自軍ハンガーに移す事ができる。その後、自軍本国をシャッフルする。
// 『常駐』：全ての自軍キャラは、＋２／＋２／＋２を得る。

import { title } from "process";
import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
import { GlobalEffect } from "../../game/define/GlobalEffect";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、自軍本国のカードを全て見て、その中にある「ルイン・リー」、または「マニィ・アンバサダ」1枚を自軍ハンガーに移す事ができる。その後、自軍本国をシャッフルする。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (evt.title[0] == "このカードが場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              "自軍本国のカードを全て見て、その中にある「ルイン・リー」、または「マニィ・アンバサダ」1枚": {
                title: ["Entity", {
                  see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 50],
                  title: ["ルイン・リー", "マニィ・アンバサダ"],
                  max: 1
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                  vars: ["自軍本国のカードを全て見て、その中にある「ルイン・リー」、または「マニィ・アンバサダ」1枚"]
                },
                {
                  title: ["_自軍_本国をシャッフルする", "自軍", "本国"]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString()
    },
    {
      id: "",
      description: "『常駐』：全ての自軍キャラは、＋２／＋２／＋２を得る。",
      title: ["自動型", "常駐"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GlobalEffect[] {
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const pairs = DefineFn.TipFn.getWant(GameStateFn.createTipByEntitySearch(ctx, effect, {
          at: ["戦闘エリア1", "戦闘エリア2", "配備エリア"],
          is: ["キャラクター"],
          side: "自軍",
          max: 50
        }, {ges: Options.ges})) as StrBaSyouPair[]
        return [{ title: ["＋x／＋x／＋xを得る", [2, 2, 2]], cardIds: pairs.map(pair => pair[0]) }]
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