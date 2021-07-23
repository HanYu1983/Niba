
import { _decorator, Component, Node } from 'cc';
const rxjs = (window as any).rxjs
const { ccclass, property } = _decorator;

@ccclass('EventCenter')
export class EventCenter extends Component {
    private static onClick = null
    static getOnClick(): any {
        if (EventCenter.onClick == null) {
            EventCenter.onClick = new rxjs.ReplaySubject()
        }
        return EventCenter.onClick
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
