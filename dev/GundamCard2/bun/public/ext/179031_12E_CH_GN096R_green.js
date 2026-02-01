export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このカードが場に出た場合、自軍セットグループ１つは、次の自軍ターン開始時まで、敵軍効果の対象にならない。",
            title: ["自動型", "起動"],
            testEnvs: [
                {
                    thisCard: ["自軍", "配備エリア", { id: "", protoID: "179031_12E_CH_GN096R_green" }, null],
                    eventTitle: ["このカードが場に出た場合"],
                    createCards: [["自軍", "戦闘エリア2", [["unit", 1]]]]
                }
            ],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const evt = DefineFn.EffectFn.getEvent(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const cardController = GameStateFn.getItemController(ctx, cardId);
                if (evt.title[0] == "このカードが場に出た場合" && evt.cardIds?.includes(cardId)) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        conditions: {
                            "自軍セットグループ１つ": {
                                title: ["Entity", {
                                        atBa: true,
                                        side: "自軍",
                                        isSetGroupRoot: true,
                                        count: 1,
                                    }]
                            }
                        },
                        logicTreeAction: {
                            actions: [
                                {
                                    title: function _(ctx, effect, { DefineFn, GameStateFn }) {
                                        const cardId = DefineFn.EffectFn.getCardID(effect);
                                        const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍セットグループ１つ", cardId);
                                        ctx = GameStateFn.mapItemState(ctx, cardId, is => ({
                                            ...is,
                                            flags: {
                                                ...is.flags,
                                                enabled: pairs.map(pair => pair[0]),
                                            }
                                        }));
                                        return ctx;
                                    }.toString()
                                }
                            ]
                        }
                    });
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                }
                if (evt.title[0] == "GameEventOnTiming" && evt.title[1][0] == "ドローフェイズ" && evt.title[1][1] == "フェイズ終了") {
                    ctx = GameStateFn.mapItemState(ctx, cardId, is => ({
                        ...is,
                        flags: {
                            ...is.flags,
                            enabled: [],
                        }
                    }));
                }
                return ctx;
            }.toString(),
            onSituation: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const situation = DefineFn.EffectFn.getSituation(effect);
                if (situation != null) {
                    return [];
                }
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const targetIds = GameStateFn.getItemState(ctx, cardId).flags.enabled || [];
                if (targetIds) {
                    return [
                        {
                            title: ["敵軍効果の対象にならない"],
                            cardIds: targetIds
                        }
                    ];
                }
                return [];
            }.toString()
        },
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
