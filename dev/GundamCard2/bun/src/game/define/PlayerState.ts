
export type PlayerState = {
    id: string;
    turn: number;
    playGCount: number;
    confirmPhase: boolean;
    textIdsUseThisTurn: { [key: string]: any }
};

export const PlayerStateFn = {
    identity(): PlayerState {
        return {
            id: '',
            turn: 0,
            playGCount: 0,
            confirmPhase: false,
            textIdsUseThisTurn: {}
        }
    },
    onTurnEnd(ps: PlayerState): PlayerState {
        return {
            ...ps,
            playGCount: 0,
            textIdsUseThisTurn: {}
        }
    }
}