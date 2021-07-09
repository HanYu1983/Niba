
import { _decorator, Component, Node, Label, SystemEventType, Sprite } from 'cc';
import { PlayerModel } from '../Type';
import { View } from '../View';
import { Item } from './Item';
const { ccclass, property } = _decorator;

@ccclass('PlayerInfo')
export class PlayerInfo extends Component {

    @property(Sprite)
    back:Sprite;
    
    @property(Label)
    playerName:Label;

    @property(Label)
    score:Label;

    @property(Label)
    money:Label;

    @property(Node)
    cover:Node;    

    @property(Node)
    items:Node[] = [];

    setInfo(info:PlayerModel){
        this.playerName.string = info.name;
        this.score.string = info.score + '';
        this.money.string = info.money + '';
        for(let i = 0; i < this.items.length; ++i){
            this.items[i].getComponent(Item)?.setValid(info.itemValids[i]);
            this.items[i].name = 'item_' + i;
        }
        this.back.color = View.getPlayerColor(info.id);
    }

    clearAllItemCover(){
        for(let i = 0; i < this.items.length; ++i){
            this.items[i].getComponent(Item)?.showOver(false);
            this.items[i].getComponent(Item)?.showSelect(false);
        }
    }

    addItemListener(click:(e:MouseEvent)=>void){
        this.offAllListener();
        for(let i = 0; i < this.items.length; ++i){
            if(this.items[i].getComponent(Item)?.isValidItem()){
                this.items[i].on(SystemEventType.MOUSE_UP, click);
                this.items[i].on(SystemEventType.MOUSE_ENTER, (e:MouseEvent)=>{
                    const item:Node | null = e.currentTarget;
                    item?.getComponent(Item)?.showOver(true);
                });
                this.items[i].on(SystemEventType.MOUSE_LEAVE, (e:MouseEvent)=>{
                    const item:Node | null = e.currentTarget;
                    item?.getComponent(Item)?.showOver(false);
                });
            }
        }
    }

    selectItem(id:number){
        for(let i = 0; i < this.items.length; ++i){
            this.items[i].getComponent(Item)?.showSelect(i == id);
        }
    }

    offAllListener(){
        for(let i = 0; i < this.items.length; ++i){
            this.items[i].off(SystemEventType.MOUSE_UP);
            this.items[i].off(SystemEventType.MOUSE_ENTER);
            this.items[i].off(SystemEventType.MOUSE_LEAVE);
        }
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
