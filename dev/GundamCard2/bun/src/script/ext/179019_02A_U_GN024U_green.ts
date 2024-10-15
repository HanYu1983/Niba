// 179019_02A_U_GN024U_green
// U
// 08MS小隊
// アプサラスⅠ
// アプサラス系　MA　専用「アイナ・サハリン」
// 〔１〕：ゲイン　〔０〕：改装［アプサラス系］
// （戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。
import { AbsoluteBaSyou } from "../../game/define/BaSyou";
import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { LogicTree } from "../../tool/logicTree";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
      title: ["使用型", ["戦闘フェイズ"]],
      testEnvs: [
        {
          basicCards: [
            ["自軍", "戦闘エリア1", [["179019_02A_U_GN024U_green", 1]]],
            ["自軍", "Gゾーン", [["unit", 2]]]
          ],
        },
      ],
      isEachTime: true,
      conditions: {
        ...createRollCostRequire(2, null),
        "このカードが戦闘エリアにいる場合": {
          actions: [
            {
              title: ["このカードが_戦闘エリアにいる場合", ["戦闘エリア1", "戦闘エリア2"]]
            }
          ]
        },
        "自軍部隊１つ": {
          title: ["_交戦中の_敵軍部隊_１つ", null, "自軍", 1],
        },
        "敵軍部隊１つ": {
          title: ["_交戦中の_敵軍部隊_１つ", null, "敵軍", 1]
        },
      },
      logicTreeActions: [
        {
          logicTree: {
            type: "And",
            children: [
              ...Object.keys(createRollCostRequire(2, null)).map(key => {
                return {
                  type: "Leaf",
                  value: key
                } as LogicTree
              }),
              {
                type: "Leaf",
                value: "このカードが戦闘エリアにいる場合"
              },
              {
                type: "Or",
                children: [
                  {
                    type: "Leaf",
                    value: "自軍部隊１つ"
                  },
                  {
                    type: "Leaf",
                    value: "敵軍部隊１つ"
                  }
                ]
              },
            ]
          },
          actions: [
            {
              title: ["cutIn", [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const tip1 = GameStateFn.getItemState(ctx, cardId).tips["自軍部隊１つ"]
                    if (tip1) {
                      const basyous = DefineFn.TipFn.getSelection(tip1) as AbsoluteBaSyou[]
                      if (basyous.length == 0) {
                        throw new Error()
                      }
                      const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0])
                      if (targetIds.length == 0) {
                        throw new DefineFn.TargetMissingError("")
                      }
                      const targetId = targetIds[0]
                      ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{
                        title: ["このカードの部隊の部隊戦闘力を_＋３する", 2],
                        cardIds: [targetId]
                      }], GameStateFn.createStrBaSyouPair(ctx, targetId))
                    }
                    const tip2 = GameStateFn.getItemState(ctx, cardId).tips["敵軍部隊１つ"]
                    if (tip2) {
                      const basyous = DefineFn.TipFn.getSelection(tip1) as AbsoluteBaSyou[]
                      if (basyous.length == 0) {
                        throw new Error()
                      }
                      const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0])
                      if (targetIds.length == 0) {
                        throw new DefineFn.TargetMissingError("")
                      }
                      const targetId = targetIds[0]
                      ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{
                        title: ["このカードの部隊の部隊戦闘力を_＋３する", -2],
                        cardIds: [targetId]
                      }], GameStateFn.createStrBaSyouPair(ctx, targetId))
                    }
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