import { PlayerID } from ".";
import { TText } from "./Text";
import { TTextID } from "./TextID";

export type TEffectReason = ["TEffectReasonUpdateCommand", TTextID] | ["GameRule"];

export type TEffect = {
    id: string,
    reason: TEffectReason
    text: TText
    playerID?: PlayerID
    description?: string
    isOption?: boolean
    // TODO: delete
    requirePassed?: boolean
}