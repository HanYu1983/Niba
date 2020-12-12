enum Word {
    PendingWord,
    // King 帥
    King,
    // Assistant 仕
    Assistant,
    // Elephant 象
    Elephant,
    // Horse 馬
    Horse,
    // Rock 車
    Rock,
    // Cannon 炮
    Cannon,
    // Pawn 兵
    Pawn,
}

enum Color {
    PendingFace,
    // Up 朝上
    Up,
    // Down 朝下
    Down,
}

enum Face {
    PendingColor,
    Red,
    Black,
}


export type ChessID = {
    Color: Color
    Word: Word
    Info: string
}

export type Chess = {
    ID: ChessID,
    Face: Face,
}

export type Gameplay = {
    Board: Chess[][],
    ActivePlayer: number
}

export function isNoChess(chess: Chess) {
    return chess.ID.Word == 0
}

export type Position = number[]

export type QueryModel = {
    QueryMoveRange: (x: number, y: number) => any,
    Query: () => Gameplay
}

export type App = {
    StartGame: () => void,
}

export type AskCommandAnswer = {
    CmdMoveChess: (x1: number, y1: number, x2: number, y2: number) => void,
    CmdCancel: () => void,
}

export type View = {
    AskCommand: (player: number, answer: AskCommandAnswer) => void
    MoveChess: (gameplay: Gameplay, chess: Chess, from: Position, to: Position, done: () => void) => void
}