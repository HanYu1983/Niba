
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { ChangePage } from './tool/ChangePage';
import { getEventCenter } from '../../Han/Events';

@ccclass('ChangePageController')
export class ChangePageController extends Component {
    @property(ChangePage)
    change: ChangePage | null = null;
    start() {
        getEventCenter().onClick.subscribe((evt: any) => {
            switch (evt) {
                case "onClickStart":
                    this.change?.openPage("GamePage")
                    break
                case "onClickGamePageBack":
                    this.change?.openPage("TitlePage")
                    break
            }
        })
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
