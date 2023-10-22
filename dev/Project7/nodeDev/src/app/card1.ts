
import {doA} from "./game"

export default {
    doA: ()=>{
        doA()
    },
    payments: [["select 3 card", "pay cost"], ["select 1 card", "tap"]],
    condition: "1 or 2",
    action: (ctx, selection)=>{
        
    },
    onEvent: (ctx, evt)=>{
        addBlock(ctx, {
            action: (ctx)=>{
                evt.power
            }
        })
    }
}