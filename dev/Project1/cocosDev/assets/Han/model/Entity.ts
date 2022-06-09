
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { getEventCenter } from '../Events';

@ccclass('Entity')
export class Entity extends Component {
    static idseq = 0
    @property
    entityID: string = ""

    start() {
        if (this.entityID == "") {
            this.entityID = Entity.idseq++ + ""
        }
        getEventCenter().onEntityCreate.next(this);
    }

    onDestroy() {
        getEventCenter().onEntityDestroy.next(this);
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
