export type PlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";
export const PlayerIDFn = {
    getAll: () => [PlayerA, PlayerB],
    getOpponent(playerID: PlayerID): PlayerID {
        return playerID == PlayerA ? PlayerB : PlayerA;
    }
}