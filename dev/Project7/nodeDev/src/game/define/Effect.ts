import { PlayerID } from "./PlayerID";
import { Text } from "./Text";
import { TextID } from "./TextID";

export type EffectReason =
    | ["場に出る", string]
    | ["EffectReasonUpdateCommand", TextID]
    | ["EffectReasonPlayCard", string]
    | ["GameRule"];

export type Effect = {
    id: string,
    reason: EffectReason
    text: Text
    playerID?: PlayerID
    description?: string
    isOption?: boolean
    // TODO: delete
    requirePassed?: boolean
}

export type EffectRuntime = {
    getPlayerID(): PlayerID
    getCardID(): string
}