export const prototype = {
    texts: [
        {
            id: "",
            description: "『常駐』：本来の名称が、「コア・ファイター（ΖΖ）」、「コア・トップ」、「コア・ベース」である自軍Gが、それぞれ１枚以上ある場合、このカードは、＋３／＋３／＋３を得る。",
            title: ["自動型", "常駐"],
            testEnvs: [
                {
                    createCards: [
                        ["自軍", "戦闘エリア1", [["179029_B3C_U_BL207N_blue", 1]]],
                        ["自軍", "Gゾーン", [["179029_05C_U_BL104C_blue", 1], ["179029_05C_U_BL103C_blue", 1], ["179029_05C_U_BL105C_blue", 1]]]
                    ],
                    checkFn: function _(ctx, { DefineFn, GameStateFn, Options }) {
                        if (Options.ges?.find(ge => ge.title[0] == "＋x／＋x／＋xを得る") == null) {
                            throw new Error();
                        }
                    }
                }
            ],
            onSituation: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const situation = DefineFn.EffectFn.getSituation(effect);
                if (situation) {
                    return [];
                }
                const cardController = GameStateFn.getItemController(ctx, cardId);
                const has1 = GameStateFn.getPlayerGIds(ctx, cardController).filter(id => GameStateFn.getItemPrototype(ctx, id).title == "コア・ファイター（ΖΖ）").length >= 1;
                const has2 = GameStateFn.getPlayerGIds(ctx, cardController).filter(id => GameStateFn.getItemPrototype(ctx, id).title == "コア・トップ").length >= 1;
                const has3 = GameStateFn.getPlayerGIds(ctx, cardController).filter(id => GameStateFn.getItemPrototype(ctx, id).title == "コア・ベース").length >= 1;
                if (has1 && has2 && has3) {
                    return [
                        {
                            title: ["＋x／＋x／＋xを得る", [3, 3, 3]], cardIds: [cardId]
                        }
                    ];
                }
                return [];
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
