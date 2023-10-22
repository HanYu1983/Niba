import { doA } from "./app/game"


function abc(){
    import("./app/card1").then(pkg => pkg.default.doA())
}

abc()