export const prototype = {
    texts: [
        {
            id: "",
            description: "（ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。",
            title: ["使用型", ["ダメージ判定ステップ"]],
            conditions: {
                ...createRollCostRequire(2, null),
                "このカードが戦闘ダメージで破壊されている場合": {
                    actions: [
                        {
                            title: function _(ctx, effect, { DefineFn, GameStateFn }) {
                                const cardId = DefineFn.EffectFn.getCardID(effect);
                                const destoryEffect = GameStateFn.getCutInDestroyEffects(ctx)
                                    .find(e => e.reason[0] == "Destroy" && e.reason[3].id == "戦闘ダメージ" && DefineFn.EffectFn.getCardID(effect) == cardId);
                                if (destoryEffect == null) {
                                    throw new DefineFn.TipError(`このカードが戦闘ダメージで破壊されている場合`);
                                }
                                return ctx;
                            }.toString()
                        }
                    ]
                }
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx, effect, { DefineFn, GameStateFn }) {
                                ctx = GameStateFn.addStackEffect(ctx, DefineFn.EffectFn.fromEffectBasic(effect, {
                                    logicTreeAction: {
                                        actions: [
                                            {
                                                title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                                                    const cardId = DefineFn.EffectFn.getCardID(effect);
                                                    const cardController = GameStateFn.getItemController(ctx, cardId);
                                                    const pair = GameStateFn.createStrBaSyouPair(ctx, cardId);
                                                    ctx = GameStateFn.doItemSetDestroy(ctx, effect, null, pair, Options);
                                                    ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.of(cardController, "Gゾーン"), pair, Options);
                                                    return ctx;
                                                }.toString()
                                            }
                                        ]
                                    }
                                }));
                                return ctx;
                            }.toString()
                        }
                    ]
                }
            ]
        }
    ]
};
function createRollCostRequire(costNum, color) {
    let ret = {};
    for (let i = 0; i < costNum; ++i) {
        const key = `${i}[${color}]`;
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
    return ret;
}
