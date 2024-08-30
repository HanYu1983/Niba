export type TPlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

function getOpponentPlayerID(playerID: TPlayerID): TPlayerID {
    return playerID == PlayerA ? PlayerB : PlayerA;
}

export default {
    getOpponentPlayerID
}