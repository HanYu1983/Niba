import { ToolFn } from "../tool"
import { PlayerID } from "./PlayerID"
import { BattleBonus } from "./Text"

export type CoinTitle =
    | ["keyword", string]
    | ["BattleBonus", BattleBonus]
    | []

export type Coin = {
    id: string
    title: CoinTitle,
    ownerID?: PlayerID,
}

export const CoinFn = {
    battleBonus(v: BattleBonus): Coin {
        return {
            id: ToolFn.getUUID(),
            title: ["BattleBonus", v]
        }
    }
}