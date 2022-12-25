(function (module) {
    function test1() {
        function testAbility(ctx, testAbi, activeCardId) {
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
            ctx = onEvent.bind(testAbi)(ctx, "onAttack", activeCardId)

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

        let ctx = {
            level: 3,
            effectStack: []
        }
        const cardId = 0
        ctx = testAbility(ctx, abi1, cardId)
        console.log(ctx)
        if(ctx.effectStack.length){
            ctx = testAbility(ctx, ctx.effectStack[0], cardId)
            console.log(ctx)
        }
    }
    test1();
})()