// 179009_03B_U_GN042R_green
// R
// 08MS小隊
// アプサラスⅢ［†］
// アプサラス系　MA　専用「アイナ・サハリン」
// 戦闘配備　（戦闘フェイズ）〔２〕：範囲兵器（７）
// （自軍戦闘フェイズ）〔緑１〕：このカードが戦闘エリアにいる場合、全ての自軍ユニットが持つ「範囲兵器」の対象部分は、ターン終了時まで、『X以下の防御力を持つ敵軍ユニット１枚』に変更される。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { StrBaSyouPair } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（自軍戦闘フェイズ）〔緑１〕：このカードが戦闘エリアにいる場合、全ての自軍ユニットが持つ「範囲兵器」の対象部分は、ターン終了時まで、『X以下の防御力を持つ敵軍ユニット１枚』に変更される。",
      title: ["使用型", ["自軍", "戦闘フェイズ"]],
      testEnvs: [
        {
          createCards: [
            ["自軍", "戦闘エリア1", [["179009_03B_U_GN042R_green", 1], ["unit", 2]]],
            ["自軍", "Gゾーン", [["179009_03B_U_GN042R_green", 1]]]
          ]
        }
      ],
      conditions: {
        ...createRollCostRequire(1, "緑"),
        "このカードが戦闘エリアにいる場合": {
          actions: [
            {
              title: ["このカードが_戦闘エリアにいる場合", ["戦闘エリア1", "戦闘エリア2"]]
            }
          ]
        },
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    ctx = GameStateFn.mapItemState(ctx, cardId, is => ({
                      ...is,
                      flags: { ...is.flags, enabled: true },
                      varNamesRemoveOnTurnEnd: { ...is.varNamesRemoveOnTurnEnd, enabled: true }
                    })) as GameState
                    return ctx
                  }.toString()
                }
              ]]
            }
          ]
        }
      ],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (GameStateFn.getItemState(ctx, cardId).flags.enabled) {
          const pairs = DefineFn.TipFn.getWant(GameStateFn.createTipByEntitySearch(ctx, cardId, {
            atBa: true,
            side: "自軍",
            is: ["ユニット"],
            max: 50,
            asMuchAsPossible: true,
          })) as StrBaSyouPair[]
          return [{ title: ["「範囲兵器」の対象部分は、『X以下の防御力を持つ敵軍ユニット１枚』に変更される",], cardIds: pairs.map(pair => pair[0]) }]
        }
        return []
      }.toString(),
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