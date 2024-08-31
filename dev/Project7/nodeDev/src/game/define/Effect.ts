import { PlayerID } from "./PlayerID";
import { Text } from "./Text";
import { TextID } from "./TextID";

export type EffectReason = ["TEffectReasonUpdateCommand", TextID] | ["GameRule"];

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