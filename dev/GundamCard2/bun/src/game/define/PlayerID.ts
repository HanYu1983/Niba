import { RelatedPlayerSideKeyword } from ".";

export type PlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

function getOpponent(playerID: PlayerID): PlayerID {
    return playerID == PlayerA ? PlayerB : PlayerA;
}

export const PlayerIDFn = {
    getAll: () => [PlayerA, PlayerB],
    getOpponent: getOpponent,
    fromRelatedPlayerSideKeyword(kw: RelatedPlayerSideKeyword, playerID: PlayerID): PlayerID {
        return kw == "自軍" ? playerID : getOpponent(playerID)
    }
}