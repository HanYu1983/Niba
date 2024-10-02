
// 179024_03B_U_WT057U_white
// アストレイ ブルーフレーム セカンドL
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］　〔１〕：クロスウェポン［アストレイ系］
// （戦闘フェイズ）〔２〕：「特徴：アストレイ系」を持つ自軍ユニット１枚は、ターン終了時まで、戦闘力に＋４を振り分けて得る。
// （注：＋４／±０／±０や、＋１／±０／＋３のように振り分けできる）

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
import { Tip } from "../../game/define/Tip";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔２〕：「特徴：アストレイ系」を持つ自軍ユニット１枚は、ターン終了時まで、戦闘力に＋４を振り分けて得る。",
      title: ["使用型", ["戦闘フェイズ"]],
      conditions: {
        ...createRollCostRequire(2, null),
        "「特徴：アストレイ系」を持つ自軍ユニット１枚": {
          title: ["_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚", false, "アストレイ系", "自軍", "ユニット", 1]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                  conditions: {
                    "戦闘力に＋４を振り分けて": {
                      title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
                        return {
                          title: ["BattleBonus", [[4, 0, 0]], [[4, 0, 0]]],
                          count: 1
                        }
                      }.toString()
                    }
                  },
                  logicTreeAction: {
                    actions: [
                      {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                          const cardId = DefineFn.EffectFn.getCardID(effect)
                          const bonus = GameStateFn.getCardTipBattleBonus(ctx, "戦闘力に＋４を振り分けて", cardId)[0]
                          ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: ["＋x／＋x／＋xを得る", bonus], cardIds: [cardId] }], GameStateFn.createStrBaSyouPair(ctx, cardId))
                          return ctx
                        }.toString()
                      }
                    ]
                  }
                })
                ctx = GameStateFn.addStackEffect(ctx, newE) as GameState
                return ctx
              }.toString()
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