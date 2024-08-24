
import type { CardProto, Model } from "./define/type"

const a: CardProto = {
    texts: {
        doA: {
            action: `function action (ctx) {
                const value = moveCard(ctx)
                console.log("impl action executed");
                return \`function action(ctx){
                    console.log("\`+value+\`");
                }\`;
            }`
        }
    }
}

export default a