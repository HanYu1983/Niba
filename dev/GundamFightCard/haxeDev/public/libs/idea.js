(function (module) {
    function test1() {
        const abi1 = {
            title: "觀星",
            selection: {},
            requires: {
                "國力": function fn(ctx, cardId) {
                    if (ctx.level < 3) {
                        throw new Error(`國力不足3`)
                    }
                    return null
                }.toString(),
                "抽3選1": function fn(ctx, cardId) {
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
                const select = this.selection["抽3選1"]
                console.log("damage target:" + select)
                return ctx
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
        }
        const testAbi = abi1
        const activeCardId = 0
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
        // 解決招式效果(要先將效果放入堆疊)
        eval(`var action = ${testAbi.action}`)
        ctx = action.bind(testAbi)(ctx, activeCardId)

        // 解發出擊事件
        eval(`var onEvent = ${testAbi.onEvent}`)
        ctx = onEvent.bind(testAbi)(ctx, "onAttack", activeCardId)

        console.log(ctx)
    }
    test1();
})()