
import { _decorator, Component, macro, systemEvent, SystemEvent, EventKeyboard } from 'cc';
import { getEventCenter } from '../Events';
import { PlayerBody } from '../model/PlayerBody';
const { ccclass, property } = _decorator;
const rxjs = (window as any).rxjs

@ccclass('PlayerController')
export class PlayerController extends Component {
    playerBody: PlayerBody | null = null
    start() {
        getEventCenter().onEntityCreate.pipe(
            rxjs.operators.filter((entity: Component) => entity.getComponent(PlayerBody) != null && entity.getComponent(PlayerBody)?.isPlayerControl)
        ).subscribe((entity: Component) => {
            this.playerBody = entity.getComponent(PlayerBody)
        })
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown.bind(this))
    }
    onKeyDown(e: EventKeyboard) {
        console.log(e)
        if (this.playerBody == null) {
            console.log("playerBody not found")
            return
        }
        switch (e.keyCode) {
            case macro.KEY.w:
                {
                    //console.log("UP")
                    // update
                    this.playerBody?.forward(1000)
                }
                break
            case macro.KEY.s:
                {
                    // update
                    this.playerBody?.forward(-1000)
                }
                break
            case macro.KEY.a:
                {
                    // update
                    this.playerBody?.rotate(10)
                }
                break
            case macro.KEY.d:
                {
                    // update
                    this.playerBody?.rotate(-10)
                }
                break
        }
    }
    update(deltaTime: number) {
        if (this.playerBody == null) {
            return
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
