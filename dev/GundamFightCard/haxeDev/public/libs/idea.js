
(function (module) {
    function test1() {
        function testAbility(ctx, testAbi, activeCardId, evt) {
            console.log(`招式名:${testAbi.title}`)
            for (key in testAbi.requires) {
                const script = testAbi.requires[key]
                eval(`var fn = ${script}`)
                const response = fn.bind(testAbi)(ctx, activeCardId)
                if (response) {
                    switch (response.type) {
                        case "unit":
                            if (response.values.length == 0) {
                                throw new Error("沒有可選的牌，這個招式不能用")
                            }
                            // 遊戲前端從提示中選一張，並設置值
                            testAbi.selection[key] = response.values[0]
                            // 然後支付
                            eval(`var fn = ${response.action}`)
                            ctx = fn.bind(testAbi)(ctx, activeCardId)
                    }
                }
            }
            eval(`var action = ${testAbi.action}`)
            ctx = action.bind(testAbi)(ctx, activeCardId)

            // 解發出擊事件
            eval(`var onEvent = ${testAbi.onEvent}`)
            ctx = onEvent.bind(testAbi)(ctx, evt, activeCardId)

            return ctx
        }
        const abi1 = {
            title: "出牌觀星",
            selection: {},
            requires: {
                "國力": function fn(ctx, cardId) {
                    if (ctx.level < 3) {
                        throw new Error(`國力不足3`)
                    }
                    return null
                }.toString(),
                "抽3選1": function fn(ctx, cardId) {
                    console.log("計算可選的牌")
                    return {
                        type: "unit",
                        values: [1, 3, 4, 5],
                        count: 1,
                        action: function fn(ctx) {
                            const select = this.selection["抽3選1"]
                            console.log("抽這張:" + select)
                            return ctx
                        }.toString()
                    }
                }.toString(),
            },
            action: function fn(ctx, cardId) {
                console.log("牌變成play中的卡並將效果放入堆疊")
                return {
                    ...ctx,
                    effectStack: [
                        ...ctx.effectStack,
                        {
                            ...this,
                            title: "觀星解決",
                            requires: {},
                            action: function () {
                                const select = this.selection["抽3選1"]
                                console.log("觀星解決:" + select)
                            }.toString()
                        }
                    ]
                }
            }.toString(),
            onEvent: function fn(ctx, evt, cardId) {
                // push to immediateEffect
                return ctx
            }.toString()
        }
        const abi2 = {
            title: "PS裝甲",
            selection: {},
            requires: {
            },
            action: function fn(ctx) {
                return ctx
            }.toString(),
            onEvent: function fn(ctx, evt, cardId) {
                if (evt == "onAttack") {
                    console.log(`標示卡${cardId}已經出擊，下一回合開始時回手`)
                }
                return ctx
            }.toString()
        }
        const abi3 = {
            title: "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",
            selection: {},
            requires: {},
            action: function fn(ctx) {
                return ctx
            }.toString(),
            onEvent: function fn(ctx, evt, cardId) {
                if (evt == "「ゲイン」の効果で戦闘修正を得た場合") {
                    return {
                        ...ctx,
                        effectStack: [
                            ...ctx.effectStack,
                            {
                                ...this,
                                title: "ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",
                                selection: {
                                    ...this.selection,
                                    "「ゲイン」の効果で戦闘修正を得た場合": [1, 1, 1]
                                },
                                requires: {
                                    "そのカードのセットグループ以外の自軍ユニット１枚": function fn(ctx, cardId) {
                                        return {
                                            type: "unit",
                                            values: [0],
                                            count: 1,
                                            action: function fn(ctx, cardId) {
                                                const selectedCard = this.selection["そのカードのセットグループ以外の自軍ユニット１枚"]
                                                const bonus = this.selection["「ゲイン」の効果で戦闘修正を得た場合"]
                                                console.log(`${selectedCard} get bonus ${bonus}`)
                                                return ctx
                                            }.toString(),
                                        }
                                    }.toString()
                                },
                                action: function fn(ctx, cardId) {
                                    return ctx
                                }.toString()
                            }
                        ]
                    }
                }
                return ctx
            }.toString()
        }

        const abi4 = {
            title: "（ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。",
            selection: {},
            requires: {},
            action: function fn(ctx) {
                return ctx
            }.toString(),
            onEvent: function fn(ctx, evt, cardId) {
                if (evt == "このカードが戦闘ダメージで破壊されている場合") {
                    return {
                        ...ctx,
                        effectStack: [
                            ...ctx.effectStack,
                            {
                                ...this,
                                title: "（ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。",
                                requires: {
                                    "ダメージ判定ステップ": function fn(ctx) {
                                        console.log("check step is ダメージ判定ステップ")
                                        return null
                                    }.toString(),
                                    "戦闘ダメージで破壊されている場合": function fn(ctx) {
                                        // 破壞中 = 確認效果堆疊中有沒有這張卡的破壞效果並且原因是戰鬥傷害
                                        console.log("check 戦闘ダメージで破壊されている場合")
                                        return null
                                    }.toString(),
                                    "2": function fn(ctx) {
                                        return {
                                            type: "G",
                                            values: [1, 2, 3],
                                            count: 2,
                                            action: function fn(ctx) {
                                                // tap card
                                                return ctx
                                            }.toString(),
                                        }
                                    },
                                },
                                action: function fn(ctx, cardId) {
                                    console.log("移除堆疊中這張卡的破壞效果")
                                    console.log("このカードを自軍Gにする。")
                                    return ctx
                                }.toString()
                            }
                        ]
                    }
                }
                return ctx
            }.toString()
        }

        let ctx = {
            level: 3,
            effectStack: []
        }
        const cardId = 0
        ctx = testAbility(ctx, abi4, cardId, "このカードが戦闘ダメージで破壊されている場合")
        console.log(ctx)
        if (ctx.effectStack.length) {
            ctx = testAbility(ctx, ctx.effectStack[0], cardId)
            console.log(ctx)
        }
    }
    function test2() {

        const runtime = {
            cardId: 0,
            ownerId: 0,
            controllerId: 0,
            cause: {
                id: "支付機體國力",
            }
        }

        const effect = {
            description: "獲得回合結束前速攻",
            selection: {},
            requires: null,
            action: function fn(ctx, runtime) {
                return {
                    ...ctx,
                    marks: [...ctx.marks, {
                        id: "回合結束前速攻",
                        textId: "回合結束前速攻",
                        type: "attach text",
                        attachCardId: runtime.cardId,
                        cause: {
                            id: "card effect",
                            cardId: runtime.cardId,
                        }
                    }]
                }
            }.toString(),
            onEvent: null
        }

        const effect2 = {
            description: "破壞效果",
            selection: {},
            requires: null,
            action: function fn() {
                // 廢棄這個卡
                // trigger卡片廢棄事件
            }.toString(),
            onEvent: null
        }

        const effect3 = {
            description: "換裝廢棄效果",
            selection: {},
            requires: null,
            action: function fn() {
                // 廢棄這個卡
                // trigger卡片換裝廢棄事件
            }.toString(),
            onEvent: null
        }

        const effect4 = {
            description: "",
            selection: {},
            requires: function fn(ctx) {
                return [
                    {
                        id: "",
                        type: "card",
                        tips: [],
                        values: [],
                        lengthMustInclude: [1],
                        action: function fn() {

                        }.toString()
                    },
                    {
                        id: "",
                        type: "field",
                        tips: [],
                        values: [],
                        lengthMustInclude: [1],
                        action: function fn() {

                        }.toString()
                    }
                ]
            }.toString(),
            action: function fn(ctx) {
                return ctx
            }.toString(),
            onEvent: function fn(ctx) {
                return ctx
            }.toString()
        }

        const marks = [
            {
                id: "1",
                textId: "+1/+1/+1 token",
                type: "token",
                attachCardId: 0,
                cause: {
                    id: "card effect",
                    cardId: 0
                },
            },
            {
                id: "2",
                textId: "回合結束前速攻",
                type: "attach text",
                attachCardId: 0,
                cause: {
                    id: "card effect",
                    cardId: 0,
                }
            }
        ]
        // 從各自的腳本查詢
        // eval(`var query = data.${mark.cause.cardId}.query`)
        function queryResult(mark) {
            if (mark.textId == "回合結束前速攻") {
                return [
                    {
                        type: "card text",
                        text: {
                            id: "速攻",
                            selection: {},
                            requires: null,
                            action: null,
                            onEvent: function (ctx) {
                                if (ctx.phase == "回合結束時") {
                                    return {
                                        ...ctx,
                                        marks: ctx.marks.filter(m => m.id != this._mark.id)
                                    }
                                }
                            }.toString(),
                            _markId: mark.id,
                        }
                    }
                ]
            }
            if (mark.textId == "+1/+1/+1 token") {
                return {
                    type: "battle point bonus",
                    value: [1, 1, 1]
                }
            }
        }
    }
    test2();
})()