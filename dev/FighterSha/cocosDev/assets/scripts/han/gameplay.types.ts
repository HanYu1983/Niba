
export type Card = {
    "card-id": string,
    "card-proto-id": string,
    "card-state": string,
    "card-face": string,
    "player-id"?: string,
}
export type CardStack = Card[]

export type Player = {
    "player-id": string,
}
export type Gameplay = {
    "card-stacks": {[key:string]: CardStack}
    "players":  {[key:string]: Player}
}
export type AskCommandAnswer = {
    CmdUseCard: (string)=>void,
    CmdEndTurn: ()=>void,
}