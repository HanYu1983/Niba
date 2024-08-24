
import type { CardProto, Model } from "./define/type"

const a: CardProto = {
    texts: {
        doA: {
            action: `function _(ctx) {
                const value = _Game.doA(ctx)
                console.log("impl action executed");
                return \`function _(ctx){
                    console.log("\`+value+\`");
                    _Game.doA(ctx)
                }\`;
            }`
        }
    }
}

export default a