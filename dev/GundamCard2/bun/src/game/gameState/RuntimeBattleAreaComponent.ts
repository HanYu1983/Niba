import { BaKeyword, BattleAreaKeyword } from "../define/BaSyou";

export type RuntimeBattleAreaComponent = {

}

export function getRuntimeBattleArea(ctx: RuntimeBattleAreaComponent, kw: BaKeyword): BattleAreaKeyword {
    switch (kw) {
        case "戦闘エリア1":
            return "地球エリア"
        case "戦闘エリア2":
            return "宇宙エリア"
        default:
            throw new Error(`unknown :${kw}`)
    }
}