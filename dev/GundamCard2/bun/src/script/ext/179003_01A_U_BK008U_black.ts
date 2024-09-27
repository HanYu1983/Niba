// 179003_01A_U_BK008U_black
// U
// V
// シャッコー
// シャッコー系　MS
// （ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。
import { CardPrototype } from "../../game/define/CardPrototype";
import { createRollCostRequire } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      title: ["使用型", ["ダメージ判定ステップ"]],
      description: "（ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。",
      conditions: {
        ...createRollCostRequire(2, null),
        "このカードが戦闘ダメージで破壊されている場合": {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const destoryEffect = GameStateFn.getCutInDestroyEffects(ctx)
                  .find(e => e.reason[0] == "Destroy" && e.reason[3].id == "戦闘ダメージ" && DefineFn.EffectFn.getCardID(effect) == cardId)
                if (destoryEffect == null) {
                  throw new DefineFn.TipError(`このカードが戦闘ダメージで破壊されている場合`)
                }
                return ctx
              }.toString()
            }
          ]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                ctx = GameStateFn.addStackEffect(ctx, DefineFn.EffectFn.fromEffectBasic(effect, {
                  logicTreeAction: {
                    actions: [
                      {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                          const cardId = DefineFn.EffectFn.getCardID(effect)
                          const cardController = GameStateFn.getItemController(ctx, cardId)
                          const pair = GameStateFn.createStrBaSyouPair(ctx, cardId)
                          ctx = GameStateFn.doItemSetDestroy(ctx, null, pair, { isSkipTargetMissing: true })
                          ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "Gゾーン"), pair, { isSkipTargetMissing: true })
                          return ctx
                        }.toString()
                      }
                    ]
                  }
                })) as GameState
                return ctx
              }.toString()
            }
          ]
        }
      ]
    }
  ]
};
