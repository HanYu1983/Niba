// 179013_S1B_U_BL065C_blue
// C
// UC
// ジェガン（エコーズ仕様）
// ジェガン系　MS
// （自軍ダメージ判定ステップ）〔１〕：このカードが戦闘エリアにいる場合、敵軍オペ１枚を破壊する。
export const prototype = {
    texts: [
        {
            id: "",
            description: "（自軍ダメージ判定ステップ）〔１〕：このカードが戦闘エリアにいる場合、敵軍オペ１枚を破壊する。",
            title: ["使用型", ["自軍", "ダメージ判定ステップ"]],
            testEnvs: [
                {
                    createCards: [
                        ["自軍", "戦闘エリア1", [["179013_S1B_U_BL065C_blue", 1]]],
                        ["自軍", "Gゾーン", [["unit", 1]]],
                        ["敵軍", "配備エリア", [["179003_01A_O_WT001C_white", 1]]]
                    ]
                }
            ],
            conditions: {
                ...createRollCostRequire(1, null),
                "このカードが戦闘エリアにいる場合": {
                    actions: [
                        {
                            title: ["Entity", {
                                    isThisCard: true,
                                    at: ["戦闘エリア1", "戦闘エリア2"],
                                    count: 1
                                }]
                        },
                    ]
                },
                "敵軍オペ１枚": {
                    title: ["Entity", {
                            side: "敵軍",
                            atBa: true,
                            is: ["オペレーション", "オペレーション(ユニット)"],
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
                                        title: ["_ロールする", "破壞"],
                                        vars: ["敵軍オペ１枚"]
                                    }
                                ]]
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
