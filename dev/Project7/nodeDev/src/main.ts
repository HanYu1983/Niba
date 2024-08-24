import { doA } from "./app/game"


async function main(){
    const card1 = (await import("./app/card1")).default
    const script1 = card1.texts.doA.action
    console.log(script1)

    const moveCard = doA;
    const fn = eval(script1+"action")
    console.log(fn)
    const fn2str = fn()
    console.log(fn2str)
    const fn2 = eval(fn2str+"action")
    fn2()
}

main().catch(console.error)