// 179031_12E_U_BL219N_blue
// N
// 08MS小隊
// ガンダムEz8［†］［∞］
// 陸戦型ガンダム系　MS　レジェンド　専用「シロー・アマダ」
// 戦闘配備　〔１〕：改装［陸戦型ガンダム系］
// 『起動』：このカードが場に出た場合、カード２枚を引く。その後、自軍手札１枚を選んで、持ち主の本国の上か下に移す。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このカードが場に出た場合、カード２枚を引く。その後、自軍手札１枚を選んで、持ち主の本国の上か下に移す。",
            title: ["自動型", "起動"],
            testEnvs: [
                {
                    thisCard: ["自軍", "配備エリア", { id: "", protoID: "179031_12E_U_BL219N_blue" }, null],
                    eventTitle: ["このカードが場に出た場合"],
                    createCards: [["自軍", "本国", [["unit", 2]]]],
                    checkFn: function _(ctx, { DefineFn, GameStateFn }) {
                        if (GameStateFn.getPlayerHandIds(ctx, "PlayerA").length != 1) {
                            throw new Error();
                        }
                        if (GameStateFn.getPlayerCountrytIds(ctx, "PlayerA").length != 1) {
                            throw new Error();
                        }
                    }
                }
            ],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const evt = DefineFn.EffectFn.getEvent(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const cardController = GameStateFn.getItemController(ctx, cardId);
                if (evt.title[0] == "このカードが場に出た場合" && evt.cardIds?.includes(cardId)) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        logicTreeAction: {
                            actions: [
                                {
                                    title: ["カード_１枚を引く", 2]
                                },
                                {
                                    title: function _(ctx, effect, { DefineFn, GameStateFn }) {
                                        const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                                            conditions: {
                                                "自軍手札１枚": {
                                                    title: ["Entity", {
                                                            side: "自軍",
                                                            at: ["手札"],
                                                            count: 1
                                                        }]
                                                },
                                                "上か下": {
                                                    title: function _(ctx, effect, { DefineFn, GameStateFn }) {
                                                        return {
                                                            title: ["StringOptions", ["上", "下"], ["上"]],
                                                            count: 1
                                                        };
                                                    }.toString()
                                                }
                                            },
                                            logicTreeAction: {
                                                actions: [
                                                    {
                                                        title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                                                            const cardId = DefineFn.EffectFn.getCardID(effect);
                                                            const opt = GameStateFn.getCardTipStrings(ctx, "上か下", cardId)[0];
                                                            if (opt == null) {
                                                                throw new Error();
                                                            }
                                                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍手札１枚", cardId);
                                                            if (opt == "上") {
                                                                for (const pair of pairs) {
                                                                    const playerId = GameStateFn.getCardOwner(ctx, pair[0]);
                                                                    ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.of(playerId, "本国"), pair, { ges: Options.ges, insertId: 0 });
                                                                }
                                                            }
                                                            else {
                                                                for (const pair of pairs) {
                                                                    const playerId = GameStateFn.getCardOwner(ctx, pair[0]);
                                                                    ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.of(playerId, "本国"), pair, { ges: Options.ges });
                                                                }
                                                            }
                                                            return ctx;
                                                        }.toString()
                                                    }
                                                ]
                                            }
                                        });
                                        ctx = GameStateFn.addImmediateEffect(ctx, newE);
                                        return ctx;
                                    }.toString()
                                }
                            ]
                        }
                    });
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                }
                return ctx;
            }.toString()
        },
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
