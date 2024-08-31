export type PlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

export function getOpponentPlayerID(playerID: PlayerID): PlayerID {
    return playerID == PlayerA ? PlayerB : PlayerA;
}