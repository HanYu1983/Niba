// 179003_01A_U_GN001R_green
// R
// GUNDAM
// シャア専用ザクⅡ［†］
// ザク系　MS　専用「シャア・アズナブル」
// クイック　戦闘配備　〔１〕：ゲイン
// 『起動』：このカードがプレイされて場に出た場合、戦闘エリアにいる敵軍ユニット１枚に３ダメージを与える。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このカードがプレイされて場に出た場合、戦闘エリアにいる敵軍ユニット１枚に３ダメージを与える。",
            title: ["自動型", "起動"],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const event = DefineFn.EffectFn.getEvent(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                if (event.title[0] == "プレイされて場に出た場合" && event.cardIds?.includes(cardId)) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        conditions: {
                            "戦闘エリアにいる敵軍ユニット１枚": {
                                title: ["Entity", {
                                        at: ["戦闘エリア1", "戦闘エリア2"],
                                        side: "敵軍",
                                        is: ["ユニット"],
                                        count: 1
                                    }],
                                actions: [
                                    {
                                        title: ["_１ダメージを与える", 3],
                                        vars: ["戦闘エリアにいる敵軍ユニット１枚"]
                                    }
                                ]
                            }
                        }
                    });
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                }
                return ctx;
            }.toString(),
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
