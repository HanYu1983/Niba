// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html



import LandMap from "./LandMap";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(LandMap)
    map: LandMap = null;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp);
    }

    start() {
        this.map.initPool();
    }

    onKeyUp(evt: cc.Event.EventKeyboard) {
        switch (evt.keyCode) {
            case cc.macro.KEY.w:
                cc.log("move up");
                break;
            case cc.macro.KEY.a:
                cc.log("move left");
                break;
            case cc.macro.KEY.s:
                cc.log("move bottom");
                break;
            case cc.macro.KEY.d:
                cc.log("move right");
                break;
            case cc.macro.KEY.enter:
                cc.log("enter");
                break;
            case cc.macro.KEY.escape:
                cc.log("esc");
                break;
        }
    }

    // update (dt) {}
}
