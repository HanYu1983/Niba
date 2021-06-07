import { Vec2 } from "cc"

// export type View = {
// 	Render: (ui: UI) => void,
// 	Alert: (msg: string) => void,
// }

// export type Model = {
// 	OnKeyDown: (evt: any) => void,
// 	OnKeyUp: (evt: any) => void,
// 	Flush: () => void,
// }



export type ChessModel = {
    id: number, 
    type: number, 
    pos: Vec2, 
    player: number
}

export type ActionModel = {
    action:ActionType, 
    id?:number, 
    from?:Vec2, 
    to?:Vec2, 
    player:number, 
    table?:ChessModel[]
}

export enum ActionType {
	MoveChess = "MoveChess",
    ChangeTurn = 'ChangeTurn'
}
