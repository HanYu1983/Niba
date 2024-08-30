import { TPlayerID } from "./PlayerID";
import { TText } from "./Text";
import { TTextID } from "./TextID";

export type TEffectReason = ["TEffectReasonUpdateCommand", TTextID] | ["GameRule"];

export type TEffect = {
    id: string,
    reason: TEffectReason
    text: TText
    playerID?: TPlayerID
    description?: string
    isOption?: boolean
    // TODO: delete
    requirePassed?: boolean
}