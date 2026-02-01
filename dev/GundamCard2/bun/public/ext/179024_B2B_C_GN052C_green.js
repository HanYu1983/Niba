// 179024_B2B_C_GN052C_green
// C
// CCA
// スカウト
// 移動
// （戦闘フェイズ）：敵軍キャラ１枚を、自軍ハンガーに移す。
export const prototype = {
    texts: [
        {
            id: "",
            description: "（戦闘フェイズ）：敵軍キャラ１枚を、自軍ハンガーに移す。",
            title: ["使用型", ["戦闘フェイズ"]],
            testEnvs: [{
                    createCards: [
                        ["自軍", "配備エリア", [["179024_B2B_C_GN052C_green", 1]]],
                        ["敵軍", "配備エリア", [["charBlue", 1]]],
                    ]
                }],
            conditions: {
                "敵軍キャラ１枚を": {
                    title: ["Entity", {
                            atBa: true,
                            side: "敵軍",
                            is: ["キャラクター"],
                            count: 1
                        }]
                }
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: ["cutIn", [
                                    {
                                        title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                                        vars: ["敵軍キャラ１枚を"]
                                    }
                                ]]
                        }
                    ]
                }
            ]
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
