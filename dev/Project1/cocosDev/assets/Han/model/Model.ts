
import { _decorator, Component, Node } from 'cc';
import { getEventCenter } from '../Events';
const { ccclass, property } = _decorator;

@ccclass('Model')
export class Model extends Component {
    start() {
        getEventCenter().onModel.next(this)
        getEventCenter().onModel.complete()
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
