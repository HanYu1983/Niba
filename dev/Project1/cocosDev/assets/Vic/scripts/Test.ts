
import { _decorator, Component, Node } from 'cc';
import { ChangePage } from './tool/ChangePage';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property(ChangePage)
    change: ChangePage | null = null;

    start() {
        this.change?.openPage('TitlePage');
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
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
