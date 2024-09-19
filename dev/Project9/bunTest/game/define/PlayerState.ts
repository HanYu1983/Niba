
export type PlayerState = {
    id: string;
    turn: number;
    playGCount: number;
    confirmPhase: boolean;
};

export const PlayerStateFn = {
    identity():PlayerState{
        return {
            id: '',
            turn: 0,
            playGCount: 0,
            confirmPhase: false,
        }
    }
}