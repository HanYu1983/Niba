import { Vec2 } from "cc"

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
    player?:number, 
    score?:number,
    money?:number,
    table?:ChessModel[]
}

export type PlayerModel = {
    id:number,
    name:string,
    score:number,
    money:number,
    itemValids:boolean[]
}

export type ConfirmModel = {
    content:string,
    yes:()=>void;
    no:()=>void;
}

export enum ActionType {
	MoveChess = "MoveChess",
    KillChess = 'KillChess',
    ChangeTurn = 'ChangeTurn',
    Item = 'Item',
}

export enum DirectType {
    Horizontal = 'Horizontal',
    Vertical = 'Vertical'
}

export enum ItemName {
    '炸彈',
    '鐳射',
    '轟爆炸彈',
    '聚能光束'
}
