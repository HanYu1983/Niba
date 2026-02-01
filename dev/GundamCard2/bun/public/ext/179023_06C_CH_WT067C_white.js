// 179023_06C_CH_WT067C_white
// スウェン・カル・バヤン
// 男性　大人
// 速攻
// （戦闘フェイズ）〔０〕：敵軍部隊がいる場合、このカードをリロールする。
export const prototype = {
    texts: [
        {
            id: "",
            description: "（戦闘フェイズ）〔０〕：敵軍部隊がいる場合、このカードをリロールする。",
            title: ["使用型", ["戦闘フェイズ"]],
            testEnvs: [
                {
                    addCards: [
                        ["自軍", "配備エリア", [{ id: "", protoID: "179023_06C_CH_WT067C_white", isRoll: true }]],
                    ],
                    createCards: [
                        ["敵軍", "戦闘エリア1", [["unit", 1]]]
                    ]
                }
            ],
            conditions: {
                "敵軍部隊がいる場合": {
                    actions: [
                        {
                            title: ["Entity", {
                                    at: ["戦闘エリア1", "戦闘エリア2"],
                                    side: "敵軍",
                                    is: ["ユニット"],
                                    min: 1
                                }]
                        }
                    ]
                }
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: ["cutIn", [
                                    {
                                        title: ["_ロールする", "リロール"]
                                    }
                                ]]
                        }
                    ]
                }
            ]
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
