import { ToolFn } from "../tool"
import { PlayerID } from "./PlayerID"
import { BattleBonus } from "./CardText"

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
    battleBonus(playerId:PlayerID, v: BattleBonus): Coin {
        return {
            id: ToolFn.getUUID("coin"),
            title: ["BattleBonus", v],
            ownerID: playerId
        }
    }
}