
import { _decorator, Component, Node, SystemEventType, Vec2, Vec3, tween, systemEvent, EventKeyboard, Label } from 'cc';
import { DebugModel } from './DebugModel';
import { Chess } from './game/Chess';
import { ChessMenu } from './game/ChessMenu';
import { ConfirmMenu } from './game/ConfirmMenu';
import { Effects } from './game/Effects';
import { PlayerInfo } from './game/PlayerInfo';
import { Table } from './game/Table';
import { Pool } from './lib/Pool';
import { Tool } from './lib/Tool';
import { ActionModel, ActionType, ChessModel, DirectType, ItemName, PlayerModel } from './Type';
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

    @property(PlayerInfo)
    playerInfos:PlayerInfo[] = [];

    @property(Label)
    hint:Label;

    @property(Effects)
    effects:Effects;

    start(){
        this.model.startGame();
        this.updateAll();
        this.onPlayerStartState();
    }

    private updateAll(chess?:ChessModel[]){
        this.updatePlayerInfo();
        this.updateChessed(chess);
    }

    private updatePlayerInfo(){
        for(let i = 0; i < this.playerInfos.length; ++i){
            this.playerInfos[i].setInfo(this.model.getPlayerInfoById(i));
        }
    }

    private updateChessed(chess?:ChessModel[]){
        console.log('更新目前所有棋子');
        
        this.table.chesses.releaseAllNodes();

        let usingChess:any[] = chess ? chess : this.model.getTable();
        usingChess.forEach(elem=>{
            this.table.chesses.create(elem);
        });
    }

    private removeAllListener(){
        console.log('--移除所有監聽');

        this.hint.string = '';
        systemEvent.off(SystemEventType.KEY_UP);
        this.table.node.off(SystemEventType.MOUSE_MOVE);
        this.table.node.off(SystemEventType.MOUSE_UP);
        this.confirmMenu.offAllListener();
        this.chessMenu.offAllListener();
        this.getPlayerInfo().offAllListener();
    }

    private getPlayerInfo(){
        return this.playerInfos[0];
    }

    onPlayerStartState(){
        console.log('玩家回合開始');

        this.removeAllListener();

        this.hint.string = '點擊己方棋子來移動或者使用道具';
        this.effects.showCursor();

        this.getPlayerInfo().addItemListener((e:MouseEvent)=>{
            const item:Node | null = e.currentTarget as Node;
            const itemId:number = +item?.name[item?.name.length-1];
            this.onPlayerClickItemState(itemId);
        });

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

    private onPlayerClickItemState(itemId:number){
        console.log('玩家點自己的道具');
        
        this.removeAllListener();

        this.hint.string = '點擊地圖使用道具:R-旋轉道具使用方向';

        let director = DirectType.Horizontal;
        let lastGrid = new Vec2();

        const showAttackRange = ()=>{
            const attackRange:Vec2[] = this.model.getItemAttackRangeById(itemId, lastGrid, director);
            this.showRange(attackRange);
        }

        systemEvent.on(SystemEventType.KEY_UP, (e:EventKeyboard)=>{
            director = (director == DirectType.Horizontal) ? DirectType.Vertical : DirectType.Horizontal;
            showAttackRange();
        });
        
        this.table.node.on(SystemEventType.MOUSE_MOVE, (e:any)=>{
            const localPos = Tool.getLocal(e.getUILocation(), e.currentTarget);
            const grid = View.convertToGrid(localPos);
            lastGrid = grid;
            
            this.table.setCursorByGrid(grid);
            showAttackRange();
        });

        this.table.node.on(SystemEventType.MOUSE_UP, (e:any)=>{
            const localPos = Tool.getLocal(e.getUILocation(), e.currentTarget);
            const grid = View.convertToGrid(localPos);

            this.onPlayerUseItemClickMapConfirmState(itemId, grid, director);
        });
    }

    private onPlayerUseItemClickMapConfirmState(itemId:number, grid:Vec2, director:DirectType){
        this.removeAllListener();

        const itemName = ItemName[itemId];
        const itemCost = this.model.getItemCostById(itemId);
        this.confirmMenu.open({
            content:'確定要支付 ' + itemCost + ' 以使用 ' + itemName + ' 嗎?',
            yes:(e:SystemEventType.MOUSE_UP)=>{
                this.confirmMenu.close();
                this.effects.showCursor();
                this.playerInfos[0].clearAllItemCover();
                this.table.colorRanges.releaseAllNodes();

                this.updatePlayerInfo();
                const result = this.model.usingItemAtGrid(itemId, grid, director);
                this.removeAllListener();
                this.playAnimations(result, ()=>{
                    this.onPlayerStartState();
                });
            },
            no:(e:SystemEventType.MOUSE_UP)=>{
                this.confirmMenu.close();
                this.effects.showCursor();
                this.playerInfos[0].clearAllItemCover();
                this.table.colorRanges.releaseAllNodes();

                this.onPlayerStartState();
            }
        });
    }

    private showPlayerChessMoveRange(player:number){
        console.log('顯示玩家' + player +'移動範圍');

        const moveRange = this.model.getPlayerAllChessMoveRange(player);   
        moveRange.forEach(elem=>{
            const node = this.table.colorRanges.getNode();
            if(node){
                node.setPosition(View.convertToPos(elem));
            }
        });
    }

    private showChessMoveRange(chessId:number){
        const moveRange = this.model.getChessMoveRangeById(chessId); 
        this.showRange(moveRange);
    }

    private showRange(range:Vec2[]){
        this.table.colorRanges.releaseAllNodes();
        range.forEach(elem=>{
            const node = this.table.colorRanges.getNode();
            node?.setPosition(View.convertToPos(elem));
        });
    }

    onPlayerClickEnemyChessState(chessModel:ChessModel){
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

    onPlayerClickSelfChessState(chessModel:ChessModel){
        console.log('玩家點擊自己的棋子');

        this.removeAllListener();

        this.hint.string = '點擊地圖來進行移動或者攻擊';

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
                this.onPlayerMoveConfirmState(chessModel, grid);
            }else{
                this.table.colorRanges.releaseAllNodes();
                this.onPlayerStartState();
                // this.chessMenu.close();
            }
        });
    }

    onPlayerMoveConfirmState(chessModel:ChessModel, grid:Vec2){
        console.log('玩家確認移動');
        this.removeAllListener();
        
        this.confirmMenu.open({
            content:'確定要移動到[' + grid.x + ',' + grid.y + ']嗎?',
            yes:(e:SystemEventType.MOUSE_UP)=>{
                this.confirmMenu.close();
                this.table.colorRanges.releaseAllNodes();
    
                const from = chessModel.pos;
                let result:ActionModel[];
                try{
                    result = this.model.playerMoveChess(chessModel.id, grid.x, grid.y);
                    this.onPlayerMoveState(result);
                }catch(e){
                    this.onPlayerStartState();
                    return;
                }
            },
            no:(e:SystemEventType.MOUSE_UP)=>{
                this.confirmMenu.close();
                this.onPlayerStartState();
                this.table.colorRanges.releaseAllNodes();
            }
        });
    }

    onPlayerMoveState(result:ActionModel[]){
        console.log('播放移動動畫');
        this.removeAllListener();
        this.playAnimations(result, ()=>{
            this.updateAll();
            this.onPlayerEndState();
        });
    }

    onPlayerEndState(){
        console.log('玩家回合結束');
        this.removeAllListener();

        const result:ActionModel[] = this.model.playerEndTurn();
        this.playAnimations(result, ()=>{this.onPlayerStartState();});
    }

    private playAnimations(animations:ActionModel[], cb:()=>void){
        this.effects.hideCursor();

        let sequence:any[] = [];
        animations.forEach(action=>{
            switch(action.action){
                case ActionType.MoveChess:
                    sequence.push(tween().call(()=>{
                        
                        console.log('播放ai移動', action);

                        const chessModel = this.model.getChessById(action.id);
                        this.effects.createChessMoveEffect(chessModel, action.from, action.to);
                    }).delay(1).call(()=>{this.updateAll(action.table);}));
                    break;
                case ActionType.KillChess:
                    sequence.push(tween().call(()=>{
                        console.log('播放殺棋動畫', action);
                        
                        if(action.to){
                            this.effects.createExplode(action.to, action);
                        }
                    }).delay(.5).call(()=>{this.updateAll(action.table);}));
                    break;
                case ActionType.ChangeTurn:
                    sequence.push(tween().call(()=>{
                        console.log('播放切換玩家動畫', action);
                        
                        this.effects.createTurnChangeEffect();
                    }).delay(1.1));
                    break;
                case ActionType.Item:
                    sequence.push(tween().call(()=>{
                        
                        console.log('播放道具效果', action);

                    }).delay(1.5));

            }
        });
        Tool.playSequence(this.node, sequence, cb );
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
