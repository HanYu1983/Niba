import { PlayerID } from "./PlayerID";
import { Text } from "./Text";
import { TextID, TextIDFns } from "./TextID";

export type EffectReason =
    | ["場に出る", PlayerID, string]
    | ["PlayCard", PlayerID, string]
    | ["PlayText", PlayerID, TextID]
    | ["GameRule", PlayerID | null];

export type Effect = {
    id: string,
    reason: EffectReason
    text: Text
    description?: string
    isOption?: boolean
    // TODO: delete
    requirePassed?: boolean
}

export const EffectFn = {
    getCardID(ctx: Effect): string {
        switch (ctx.reason[0]) {
            case "GameRule":
                throw new Error("GameRule no playerID");

            case "PlayCard":
                return ctx.reason[2]

            case "PlayText":
                return TextIDFns.getCardID(ctx.reason[2])

            case "場に出る":
                return ctx.reason[2]
        }
    },

    getPlayerID(ctx: Effect): PlayerID {
        switch (ctx.reason[0]) {
            case "GameRule":
                if (ctx.reason[1] == null) {
                    throw new Error("this GameRule not playerID");
                }
                return ctx.reason[1]

            case "PlayCard":
                return ctx.reason[1]

            case "PlayText":
                return TextIDFns.getCardID(ctx.reason[2])

            case "場に出る":
                return ctx.reason[1]
        }
    }
}