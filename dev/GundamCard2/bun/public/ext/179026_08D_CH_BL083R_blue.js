export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このカードの部隊が戦闘ダメージを与えた場合、自軍本国を５回復する。",
            title: ["自動型", "起動"],
            testEnvs: [
                {
                    thisCard: ["自軍", "配備エリア", { id: "", protoID: "179026_08D_CH_BL083R_blue" }, null],
                    eventTitle: ["このカードの部隊が戦闘ダメージを与えた場合"]
                }
            ],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const event = DefineFn.EffectFn.getEvent(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                if (event.title[0] == "このカードの部隊が戦闘ダメージを与えた場合" && event.cardIds?.includes(cardId)) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        logicTreeAction: {
                            actions: [
                                {
                                    title: ["_敵軍本国に_１ダメージ", "自軍", -5]
                                }
                            ]
                        }
                    });
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE, { isSkipLimitCheck: true });
                }
                return ctx;
            }.toString(),
        }
    ],
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
