
/*
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
*/

export type Face = {
    ID: string
}

export type CardType = {
    ID: string
}

export type CardPrototypeID = {
    ID: string
    CardType: CardType
}

export type Card = {
    ID: string,
    CardPrototypeID: CardPrototypeID,
    Face: Face,
    Player: string,
}
export type CardStack = Card[]

export type Player = {
    ID: string,
    GroupID: string,
    Order: number
}

export type PlayerBasicCom = any
export type CharacterCardCom = {
    Life: number,
    Money: number
}

export type Desktop = {
    CardStacks: { [key: string]: CardStack },
}

export type Gameplay = {
    Desktop: Desktop,
    Players: { [key: string]: Player }
    ActivePlayerID: string,
    PlayerBasicComs: { [key: string]: PlayerBasicCom },
    CharacterCardComs: { [key: string]: CharacterCardCom }
}

export type AskCommandAnswer = {
    CmdUseCard: (string) => void,
    CmdEndTurn: () => void,
    CmdByItem: (string) => void,
    CmdExit: () => void,
    Cancel(): () => void,
}

export type AppView = {
    AskCommand: (player: Player, answer: AskCommandAnswer) => void,
    AskOneCard: (player: Player, cs: CardStack, cb: (ret: string | null) => void) => void
    AskOnePlayer: (player: Player, players: Player[], cb: (ret: string | null) => void) => void,
    AskOption: (player: Player, title: string, options: string[], cb: (ret: string | null) => void) => void,
    Alert: (msg: string) => void,
    Render: (gameplay: Gameplay) => void,
}

export type AppModel = {
    StartGameplay: ()=>void
}