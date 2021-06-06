
import { _decorator, Component, Node, SystemEventType, Vec2, Vec3, tween } from 'cc';
import { DebugModel } from './DebugModel';
import { Chess } from './game/Chess';
import { ChessMenu } from './game/ChessMenu';
import { ConfirmMenu } from './game/ConfirmMenu';
import { Effects } from './game/Effects';
import { Table } from './game/Table';
import { Pool } from './lib/Pool';
import { Tool } from './lib/Tool';
const { ccclass, property } = _decorator;

@ccclass('View')
export class View extends Component {

    @property(DebugModel)
    model:DebugModel

    @property(Table)
    table:Table;

    @property(ChessMenu)
    chessMenu:ChessMenu;

    @property(ConfirmMenu)
    confirmMenu:ConfirmMenu;

    @property(Effects)
    effects:Effects;

    start(){
        this.model.startGame();
        this.updateChessed();
        this.onPlayerStartState();
    }

    private updateChessed(chess?:any[]){
        console.log('更新目前所有棋子');
        
        this.table.chesses.releaseAllNodes();

        let usingChess:any[] = chess ? chess : this.model.getTable();
        usingChess.forEach(elem=>{
            this.table.chesses.create(elem);
        });
    }

    private removeAllListener(){
        console.log('--移除所有監聽');

        this.table.node.off(SystemEventType.MOUSE_MOVE);
        this.table.node.off(SystemEventType.MOUSE_UP);
        this.confirmMenu.offAllListener();
        this.chessMenu.offAllListener();
    }

    onPlayerStartState(){
        console.log('玩家回合開始');

        this.removeAllListener();
        this.effects.showCursor();

        this.table.node.on(SystemEventType.MOUSE_MOVE, (e:any)=>{
            const localPos = Tool.getLocal(e.getUILocation(), e.currentTarget);
            const grid = View.convertToGrid(localPos);
        
            this.table.setCursorByGrid(grid);
        });

        this.table.node.on(SystemEventType.MOUSE_UP, (e:any)=>{
            const localPos = Tool.getLocal(e.getUILocation(), e.currentTarget);
            const grid = View.convertToGrid(localPos);
            const model = this.model.getGridModel(grid.x, grid.y);
            
            if(model){
                // this.chessMenu.open();
                // let pos = View.convertToPosByArray(model.pos);
                // this.chessMenu.node.setPosition(pos.add(new Vec3(30, 0, 0)));

                if(this.model.isPlayer(model.player)){
                    this.onPlayerClickSelfChessState(model);
                }else{
                    // this.chessMenu.setButtonEnable([1]);
                    this.onPlayerClickEnemyChessState(model);
                }
            }
        });
    }

    private showPlayerChessMoveRange(player:number){
        console.log('顯示玩家' + player +'移動範圍');

        const moveRange = this.model.getPlayerAllChessMoveRange(player);   
        moveRange.forEach(elem=>{
            const node = this.table.colorRanges.getNode();
            if(node){
                node.setPosition(View.convertToPosByArray(elem));
            }
        });
    }

    private showChessMoveRange(chessId:number){
        const moveRange = this.model.getChessMoveRangeById(chessId);   
        moveRange.forEach(elem=>{
            const node = this.table.colorRanges.getNode();
            if(node){
                node.setPosition(View.convertToPosByArray(elem));
            }
        });
    }

    onPlayerClickEnemyChessState(chessModel:any){
        console.log('玩家點擊敵人的棋子');

        this.removeAllListener();

        this.table.colorRanges.releaseAllNodes();
        this.showPlayerChessMoveRange(chessModel.player);

        this.table.node.on(SystemEventType.MOUSE_UP, (e:any)=>{
            this.table.colorRanges.releaseAllNodes();
            this.onPlayerStartState();
            // this.chessMenu.close();
        });
    }

    onPlayerClickSelfChessState(chessModel:any){
        console.log('玩家點擊自己的棋子');

        this.removeAllListener();

        this.table.colorRanges.releaseAllNodes();
        this.showChessMoveRange(chessModel.id);

        this.table.node.on(SystemEventType.MOUSE_MOVE, (e:any)=>{
            const localPos = Tool.getLocal(e.getUILocation(), e.currentTarget);
            const grid = View.convertToGrid(localPos);
        
            this.table.setCursorByGrid(grid);
        });

        this.table.node.on(SystemEventType.MOUSE_UP, (e:any)=>{
            const localPos = Tool.getLocal(e.getUILocation(), e.currentTarget);
            const grid = View.convertToGrid(localPos);

            if(this.model.isValidMoveByChess(chessModel.id, grid.x, grid.y)){
                this.confirmMenu.open();
                this.onPlayerMoveConfirmState(chessModel, grid);
            }else{
                this.table.colorRanges.releaseAllNodes();
                this.onPlayerStartState();
                // this.chessMenu.close();
            }
        });
    }

    onPlayerMoveConfirmState(chessModel:any, grid:Vec2){
        console.log('玩家確認移動');
        this.removeAllListener();
        
        this.confirmMenu.btns[0].node.on(SystemEventType.MOUSE_UP, (e:any)=>{
            this.confirmMenu.close();
            this.table.colorRanges.releaseAllNodes();

            const from = chessModel.pos;
            try{
                this.model.playerMoveChess(chessModel.id, grid.x, grid.y);
            }catch(e){
                this.onPlayerStartState();
                return;
            }
            this.onPlayerMoveState(chessModel, new Vec2(from[0], from[1]), grid);
        });

        this.confirmMenu.btns[1].node.on(SystemEventType.MOUSE_UP, (e:any)=>{
            this.confirmMenu.close();
            this.onPlayerStartState();
            this.table.colorRanges.releaseAllNodes();
        });
    }

    onPlayerMoveState(chessModel:any, from:Vec2, to:Vec2){
        console.log('播放移動動畫');
        this.removeAllListener();

        this.effects.hideCursor();
        this.effects.createChessMoveEffect(chessModel, from, to);
        
        tween(this.node).delay(1.5).call(()=>{
            this.updateChessed();
            this.onPlayerEndState();
        }).start();
    }

    onPlayerEndState(){
        console.log('玩家回合結束');
        this.removeAllListener();

        const result:any[] = this.model.playerEndTurn();
        let sequence:any[] = [];
        result.forEach(action=>{
            switch(action.action){
                case 0:
                    sequence.push(tween().call(()=>{
                        
                        console.log('播放ai' + action.player + '移動');

                        const chessModel = this.model.getChessById(action.id);
                        this.effects.createChessMoveEffect(chessModel, new Vec2(action.from[0], action.from[1]), new Vec2(action.to[0], action.to[1]));
                    }).delay(1.5).call(()=>{this.updateChessed(action.table);}));
                    break;
                case 1:
                    sequence.push(tween().call(()=>{
                        console.log('播放切換玩家' + action.player + '動畫');
                        
                        this.effects.createTurnChangeEffect();
                    }).delay(1.1));
                    break;
            }
        });
        Tool.playSequence(this.node, sequence, ()=>{this.onPlayerStartState();} );
    }

    static convertToGrid(local:Vec2){
        const offset = new Vec2(local.x + 300, local.y + 300);
        return new Vec2(Math.floor(offset.x / 30), Math.floor(offset.y / 30))
    }

    static convertToPos(grid:Vec2){
        const offset = new Vec2(grid.x * 30 - 300 + 15, grid.y * 30 - 300 + 15);
        return new Vec3(offset.x, offset.y, 0);
    }

    static convertToPosByArray(pos:Array<number>){
        return View.convertToPos(new Vec2(pos[0], pos[1]));
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
