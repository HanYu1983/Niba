
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
const rxjs = (window as any).rxjs
import { getEventCenter } from '../Events';
import { Model } from '../model/Model';

@ccclass('Debug')
export class Debug extends Component {
    start() {
        // inject Model
        rxjs.combineLatest(getEventCenter().onModel).subscribe(([model]: [Model]) => {
            console.log(model)
        })
        // inject event
        getEventCenter().onClick.subscribe((evt: any) => {
            console.log("onNext:", evt)
        })
        getEventCenter().onClick.next("test event")
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
