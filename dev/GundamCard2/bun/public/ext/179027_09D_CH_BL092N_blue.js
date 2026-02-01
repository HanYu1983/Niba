// 179027_09D_CH_BL092N_blue
// N
// Z
// ハヤト・コバヤシ
// 男性　大人
// 『起動』：敵軍ユニットが出撃した場合、自軍ユニット１枚は、ターン終了時まで＋１／＋１／＋１を得る。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：敵軍ユニットが出撃した場合、自軍ユニット１枚は、ターン終了時まで＋１／＋１／＋１を得る。",
            title: ["自動型", "起動"],
            testEnvs: [
                {
                    thisCard: [
                        "自軍", "配備エリア", { id: "", protoID: "179027_09D_CH_BL092N_blue" }, null,
                    ],
                    addCards: [
                        ["敵軍", "戦闘エリア1", [{ id: "unit", protoID: "unit" }]],
                        ["自軍", "戦闘エリア2", [{ id: "unit2", protoID: "unit" }]],
                    ],
                    event: {
                        title: ["ユニットが出撃した場合"], cardIds: ["unit"]
                    },
                    checkFn(ctx, { DefineFn, GameStateFn, Options }) {
                        if (Options.ges == null) {
                            throw new Error();
                        }
                        if (Options.ges.find(ge => ge.title[0] == "＋x／＋x／＋xを得る" && ge.cardIds.includes("unit2")) == null) {
                            throw new Error();
                        }
                    },
                }
            ],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                const evt = DefineFn.EffectFn.getEvent(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const cardController = GameStateFn.getItemController(ctx, cardId);
                if (evt.title[0] == "ユニットが出撃した場合"
                    && evt.cardIds?.map(cardId => GameStateFn.getItemController(ctx, cardId)).some(playerId => playerId != cardController)) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        conditions: {
                            "自軍ユニット１枚": {
                                title: ["Entity", {
                                        atBa: true,
                                        side: "自軍",
                                        is: ["ユニット"],
                                        count: 1,
                                    }]
                            }
                        },
                        logicTreeAction: {
                            actions: [
                                {
                                    title: ["ターン終了時まで「速攻」を得る。", [{ title: ["＋x／＋x／＋xを得る", [1, 1, 1]], cardIds: [] }]],
                                    vars: ["自軍ユニット１枚"]
                                }
                            ]
                        }
                    });
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                }
                return ctx;
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
