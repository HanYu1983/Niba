
import { _decorator, Component, Node, Label, EventKeyboard, systemEvent, SystemEventType, tween, Vec2, Vec3 } from 'cc';
import { DebugModel } from '../DebugModel';
import { MenuViewer } from '../lib/MenuViewer';
import { Tool } from '../lib/Tool';
import { ChessModel, DirectType, ItemName, ActionModel, ActionType, Items, PlayerModel } from '../Type';
import { View } from '../View';
import { ChessMenu } from './ChessMenu';
import { ConfirmMenu } from './ConfirmMenu';
import { Effects } from './Effects';
import { PlayerInfo } from './PlayerInfo';
import { Table } from './Table';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends Component {
    @property(DebugModel)
    model:DebugModel
    
    @property(Table)
    table:Table;

    @property(ChessMenu)
    chessMenu:ChessMenu;

    @property(MenuViewer)
    gridMenu:MenuViewer;

    @property(ConfirmMenu)
    confirmMenu:ConfirmMenu;

    @property(PlayerInfo)
    playerInfos:PlayerInfo[] = [];

    @property(Label)
    hint:Label;

    @property(Effects)
    effects:Effects;

    restartGame(count:number = 2){
        this.model.startGame(count);
        this.updateAll();

        this.gridMenu.close();
        this.onPlayerStartAnimation(this.model.getCurrentPlayerId());
    }

    private openBackToTitleDialog(){
        this.removeAllListener();
        this.gridMenu.close();
        this.confirmMenu.open({
            content:'確定要放棄這場游戲嗎?',
            yes:(e:SystemEventType.MOUSE_UP)=>{
                this.confirmMenu.close();
                View.inst.openTitlePage();
            },
            no:(e:SystemEventType.MOUSE_UP)=>{
                this.confirmMenu.close();
                this.onPlayerStartState();
            }
        })
    }

    private onPlayerStartAnimation(playerId:number){
        tween(this.node).call(()=>{
            const playerInfo = this.model.getPlayerInfoById(playerId);
            this.effects.createTurnChangeEffect(playerInfo);
        }).delay(1).call(()=>{
            this.onPlayerStartState();
        }).start();
    }

    private updateAll(chess?:ChessModel[]){
        this.updatePlayerInfo();
        this.updateChessed(chess);
    }

    private updatePlayerInfo(){
        for(let i = 0; i < this.playerInfos.length; ++i){
            const info = this.model.getPlayerInfoById(i);
            this.playerInfos[i].setInfo(info, info.id == this.model.getCurrentPlayerId());
        }
    }

    private updateChessed(chess?:ChessModel[]){
        console.log('更新目前所有棋子');
        
        this.table.chesses.releaseAllNodes();

        let usingChess:any[] = chess ? chess : this.model.getTable();
        usingChess.forEach(elem=>{
            this.table.chesses.create(elem, elem.player == this.model.getCurrentPlayerId());
        });
    }

    removeAllListener(){
        console.log('--移除所有監聽');

        this.hint.string = '';
        systemEvent.off(SystemEventType.KEY_UP);
        this.table.node.off(SystemEventType.MOUSE_MOVE);
        this.table.node.off(SystemEventType.MOUSE_UP);
        this.confirmMenu.offAllListener();
        this.chessMenu.offAllListener();
        this.clearAllPlayerInfoListener();
    }

    private clearAllPlayerInfoListener(){
        this.playerInfos.forEach(info=>{
            info.clearAllItemCover();
            info.offAllListener();
        });
    }

    private getPlayerInfo(id:number = 0){
        return this.playerInfos[id];
    }

    onPlayerStartState(){

        if(this.checkIsGameOver()) return;

        console.log('玩家回合開始');

        this.removeAllListener();

        this.hint.string = '點擊己方棋子來移動或者使用道具';
        this.effects.showCursor();

        this.getPlayerInfo(this.model.getCurrentPlayerId()).addItemListener((e:MouseEvent)=>{
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
                if(this.model.isCurrentPlayer(model.player)){
                    this.onPlayerClickSelfChessState(model);
                }else{
                    this.onPlayerClickEnemyChessState(model);
                }
            }else{
                this.onPlayerClickGridState(grid);
            }
        });
    }

    private onPlayerClickGridState(grid:Vec2){
        this.removeAllListener();
        this.effects.hideCursor();
        
        this.openMenuAt(this.gridMenu, grid);

        this.table.node.on(SystemEventType.MOUSE_UP, (e:any)=>{
            this.gridMenu.close();
            this.onPlayerStartState();
        });
    }

    private openMenuAt(menu:MenuViewer, grid:Vec2, offset:Vec3 = Vec3.ZERO){
        let pos = View.convertToPos(grid);
        menu.open();
        menu.node.setPosition(pos.add(offset));
    }

    private onPlayerClickItemState(itemId:number){
        console.log('玩家點自己的道具');
        
        this.removeAllListener();

        this.getPlayerInfo(this.model.getCurrentPlayerId()).selectItem(itemId);
        this.hint.string = '點擊地圖使用道具:R-旋轉道具使用方向';

        let director = DirectType.Horizontal;
        let lastGrid = new Vec2();

        this.getPlayerInfo(this.model.getCurrentPlayerId()).addItemListener((e:MouseEvent)=>{
            const item:Node | null = e.currentTarget as Node;
            const itemId:number = +item?.name[item?.name.length-1];
            this.onPlayerClickItemState(itemId);
        });

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

                const result = this.model.usingItemAtGrid(itemId, grid, director);
                this.updatePlayerInfo();
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
                this.onPlayerClickSelfChessState(chessModel);
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
        if(this.checkIsGameOver()) return;

        console.log('玩家回合結束');
        this.removeAllListener();

        // 改成呼叫model當前玩家結束回合
        const result:ActionModel[] = this.model.currentPlayerEndTurn();
        this.updateAll();
        this.playAnimations(result, ()=>{this.onPlayerStartState();});

        // 本來這邊是回合結束獲取敵人ai的行動
        // 現在改成沒有ai的版本, 這裏就先不需要呼叫
        // const result:ActionModel[] = this.model.playerEndTurn();
        // this.playAnimations(result, ()=>{this.onPlayerStartState();});
    }

    onGameOverState(){
        this.removeAllListener();

        tween(this.node).call(()=>{
            const currentPlayer = this.model.getCurrentPlayerId();
            const info = this.model.getPlayerInfoById(currentPlayer);
            this.effects.createVictoryEffect(info.name);
        }).delay(1).call(()=>{
            this.effects.createAgainEffect();
        }).delay(2).call(()=>{
            View.inst.openTitlePage();

            // this.confirmMenu.open({
            //     content:'游戲結束, ',
            //     yes:()=>{
            //         this.confirmMenu.close();
            //         this.restartGame();
            //     },
            //     no:()=>{
            //         this.confirmMenu.close();
            //     }
            // });
        }).start();
    }

    private checkIsGameOver(){
        const gameover = this.model.isGameOver();
        if(gameover){
            this.onGameOverState();
        }
        return gameover;
    }

    private playAnimations(animations:ActionModel[], cb:()=>void){
        this.effects.hideCursor();

        let sequence:any[] = [];
        animations.forEach(action=>{
            switch(action.action){
                case ActionType.MoveChess:
                    sequence.push(tween().call(()=>{
                        
                        console.log('播放移動', action);

                        const chessModel = this.model.getChessById(action.id);
                        this.effects.createChessMoveEffect(chessModel, action.from, action.to);
                    }).delay(1.5).call(()=>{this.updateAll(action.table);}));
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
                        
                        const playerInfo = this.model.getPlayerInfoById(action.player);
                        this.effects.createTurnChangeEffect(playerInfo);
                    }).delay(1.2));
                    break;
                case ActionType.Item:
                    console.log('播放道具效果', action);

                    if(action.hasOwnProperty('id')){
                        switch(Items[action.id]){
                            case ItemName.炸彈:
                                sequence.push(tween().call(()=>{
                                    if(action.to){
                                        this.effects.createItemExplode(action.to);
                                    }
                                }).delay(1.2));
                                break;
                            case ItemName.鐳射:
                                sequence.push(tween().call(()=>{
                                    if(action.to && action.dir){
                                        this.effects.createLaser(action.to, action.dir);
                                    }
                                }).delay(.8));
                                break;
                            case ItemName.轟爆炸彈:
                                sequence.push(tween().call(()=>{
                                    if(action.to){
                                        this.effects.createBigExplode(action.to);
                                    }
                                }).delay(1.8));
                                break;
                            case ItemName.聚能光束:
                                sequence.push(tween().call(()=>{
                                    if(action.to && action.dir){
                                        this.effects.createBigLaser(action.to, action.dir);
                                    }
                                }).delay(2));
                                break;
                        }
                    }
                    break;
                case ActionType.PlayerDead:
                    sequence.push(tween().call(()=>{
                        const info = this.model.getPlayerInfoById(action.player);
                        this.effects.createLoseEffect(info.name);
                    }).delay(1));
                    break;
                case ActionType.GameOver:
                    // sequence.push(tween().call(()=>{
                    //     if(action.hasOwnProperty('id')){
                    //         if(action.id){
                    //             this.effects.createVictoryEffect();
                    //         }else{
                    //             this.effects.createLoseEffect();
                    //         }
                    //     }
                    // }).delay(2.4));
                    break;
            }
        });
        Tool.playSequence(this.node, sequence, cb );
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
