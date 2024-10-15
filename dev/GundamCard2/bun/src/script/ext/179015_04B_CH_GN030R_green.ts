// 179015_04B_CH_GN030R_green
// R
// GUNDAM
// ララァ・スン
// 女性　子供　NT
// （防御ステップ）〔緑１〕：敵軍ユニット１枚は、ステップ終了時まで、戦闘エリアにいる自軍ユニットの「サイコミュ」の効果において、交戦中として扱う。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（防御ステップ）〔緑１〕：敵軍ユニット１枚は、ステップ終了時まで、戦闘エリアにいる自軍ユニットの「サイコミュ」の効果において、交戦中として扱う。",
      title: ["使用型", ["防御ステップ"]],
      conditions: {
        ...createRollCostRequire(1, "緑"),
        "敵軍ユニット１枚": {
          title: ["Entity", {
            side: "敵軍",
            atBa: true,
            is: ["ユニット"],
            count: 1
          }]
        }
      },
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (GameStateFn.getItemState(ctx, cardId).textIdsUseThisTurn?.includes(effect.text.id)) {
          const targets = GameStateFn.getCardTipStrBaSyouPairs(ctx, "敵軍ユニット１枚", cardId)
          const pairs = DefineFn.TipFn.getWant(GameStateFn.createTipByEntitySearch(ctx, effect, {
            at: ["戦闘エリア1", "戦闘エリア2"],
            side: "自軍",
            is: ["ユニット"],
            max: 50,
            asMuchAsPossible: true,
          })) as StrBaSyouPair[]
          return [{ title: ["_ユニットは、「サイコミュ」の効果において、交戦中として扱う。", targets.map(pair => pair[0])], cardIds: pairs.map(pair => pair[0]) }]
        }
        return []
      }.toString(),
    },
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