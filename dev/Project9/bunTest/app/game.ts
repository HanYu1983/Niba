export { moveCard } from "./table"

export function doB(){
    console.log("doB")
}

export function doA(){
    doB()
    return "xxx aaa"
}