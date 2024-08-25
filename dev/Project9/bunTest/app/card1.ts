
import type { CardProto, Model } from "./define/type"
import type { Game } from "./define/type";


const a: CardProto = {
    texts: {
        // gameEffects: [
        //     function _(ctx:Model, runtime:any, game:Game){
        //         game.doA(ctx)
                
        //     }.toString()
        // ],
        doA: {
            action: function _(ctx: Model) {
                let Game: Game = eval("_Game")
                let value = Game.doA(ctx)
                console.log("impl action executed");
                return function _(ctx: Model) {
                    let Game: Game = eval("_Game")
                    let { value, name } = { value: 0, name: "" }
                    console.log(value)
                    Game.doA(ctx)
                }.toString().replace(`{ value: 0, name: "" }`, JSON.stringify({ value, name: "wow" }))
            }.toString()
            // `function _(ctx) {
            //     const value = _Game.doA(ctx)
            //     console.log("impl action executed");
            //     return \`function _(ctx){
            //         console.log("\`+value+\`");
            //         _Game.doA(ctx)
            //     }\`;
            // }`
        }
    }
}

export default a