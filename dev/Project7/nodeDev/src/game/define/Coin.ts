import { ToolFn } from "../tool"
import { BattleBonus } from "./Text"

export type CoinTitle =
    | ["keyword", string]
    | ["BattleBonus", BattleBonus]
    | []

export type Coin = {
    id: string
    title: CoinTitle,
}

export const CoinFn = {
    battleBonus(v: BattleBonus): Coin {
        return {
            id: ToolFn.getUUID(),
            title: ["BattleBonus", v]
        }
    }
}