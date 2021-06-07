
import { _decorator, Component, Node, Vec2 } from 'cc';
import { ActionModel, ActionType, ChessModel } from './Type';
const { ccclass, property } = _decorator;

@ccclass('DebugModel')
export class DebugModel extends Component {
    
    /**
     * 游戲開始,目前設定是20*20的格子
     */
    startGame(){
        console.log('start game');
        
    }

    /**
     * 取得目前場上所有的棋子
     * @returns 
     */
    getTable():ChessModel[]{
        return [
            {id:0, type:0, pos:new Vec2(5, 5), player:0},
            {id:1, type:1, pos:new Vec2(19, 19), player:1}
        ]
    }

    /**
     * 取得指定格子的棋子,如果沒有棋子,回傳null
     * @param x 格子的x
     * @param y 格子的y
     * @returns 
     */
    getGridModel(x:number, y:number):ChessModel | null{

        // if empty
        // return null;
        
        return {id:4, type:1, pos:new Vec2(x, y), player:0};
    }

    /**
     * 取得指定棋子的移動範圍
     * @param id 棋子id
     * @returns 
     */
    getChessMoveRangeById(id:number):Vec2[]{
        return [
            new Vec2(0, 0), new Vec2(0, 1), new Vec2(0, 2)
        ]
    }

    /**
     * 取得該玩家目前所有棋子的移動範圍
     * @param playerId 
     */
    getPlayerAllChessMoveRange(playerId:number):Vec2[]{
        return [
            new Vec2(0, 0), new Vec2(0, 1), new Vec2(0, 2)
        ]
    }

    /**
     * 指定玩家是否在x,y的位置可以合法移動或者攻擊
     * @param playerId 
     * @param x 
     * @param y 
     * @returns 
     */
    isValidMove(playerId:number, x:number, y:number):boolean{
        return true;
    }

    /**
     * 指定棋子是否在x,y的位置可以合法移動或者攻擊
     * @param chessId 
     * @param x 
     * @param y 
     */
    isValidMoveByChess(chessId:number, x:number, y:number):boolean{
        console.log('[isValidMoveByChess]幫補上方法,指定棋子是否在x,y的位置可以合法移動或者攻擊');
        return true;
    }

    /**
     * 檢查給定的id是否為玩家
     * @param id 
     * @returns 
     */
    isPlayer(id:number):boolean{
        return id == 0;
    }

    /**
     * 取得當前玩家id
     * @returns 
     */
    getCurrentPlayerId():number{
        return 0;
    }

    /**
     * 玩家移動或攻擊
     * @param id 棋子id
     * @param x 
     * @param y 
     * @returns 取得移動后的棋盤上的所有棋子
     */
    playerMoveChess(id:number, x:number, y:number):ChessModel[]{
        return this.getTable();
    }

    /**
     * 玩家確認回合結束
     * @returns 回傳敵人ai的動畫序列
     */
    playerEndTurn():ActionModel[]{
        return [
            // action 代表動作類型: 0是指棋子移動動畫, 1是指切換玩家的動畫
            // {action:1, player:1},
            {action:ActionType.MoveChess, id:0, from:new Vec2(4, 0), to:new Vec2(2, 2), player:1, table:[{id:0, type:0, pos:new Vec2(5, 5), player:0}]},
            // {action:1, player:2},
            {action:ActionType.MoveChess, id:2, from:new Vec2(8, 0), to:new Vec2(3, 1), player:2, table:[{id:1, type:1, pos:new Vec2(5, 6), player:1}]},
            {action:ActionType.ChangeTurn, player:0}
        ]
    }

    /**
     * 用id取得棋子
     * @param id 
     * @returns 棋子資料
     */
    getChessById(id:number):ChessModel{
        return {id:0, type:0, pos:new Vec2(5, 5), player:1}
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
