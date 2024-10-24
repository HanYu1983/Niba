// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class InputSensor extends cc.Component {

    static CURSOR_UP: string = "CURSOR_UP";
    static CURSOR_DOWN: string = "CURSOR_DOWN";
    static CURSOR_LEFT: string = "CURSOR_LEFT";
    static CURSOR_RIGHT: string = "CURSOR_RIGHT";

    static SCREEN_UP: string = "SCREEN_UP";
    static SCREEN_DOWN: string = "SCREEN_DOWN";
    static SCREEN_LEFT: string = "SCREEN_LEFT";
    static SCREEN_RIGHT: string = "SCREEN_RIGHT";

    static ENTER: string = "ENTER";
    static ESCAPE: string = "ESCAPE";

    start() {
        this.onDestroy();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyUp, this);
    }

    onKeyUp(evt: cc.Event.EventKeyboard) {
        window.viewNotifyOb.next(["KEY_DOWN", evt.keyCode]);
        switch (evt.keyCode) {
            case cc.macro.KEY.w:
                this.node.emit(InputSensor.CURSOR_UP);
                break;
            case cc.macro.KEY.a:
                this.node.emit(InputSensor.CURSOR_LEFT);
                break;
            case cc.macro.KEY.s:
                this.node.emit(InputSensor.CURSOR_DOWN);
                break;
            case cc.macro.KEY.d:
                this.node.emit(InputSensor.CURSOR_RIGHT);
                break;
            case cc.macro.KEY.up:
                this.node.emit(InputSensor.SCREEN_UP);
                break;
            case cc.macro.KEY.left:
                this.node.emit(InputSensor.SCREEN_LEFT);
                break;
            case cc.macro.KEY.down:
                this.node.emit(InputSensor.SCREEN_DOWN);
                break;
            case cc.macro.KEY.right:
                this.node.emit(InputSensor.SCREEN_RIGHT);
                break;
            case cc.macro.KEY.enter:
                this.node.emit(InputSensor.ENTER);
                break;
            case cc.macro.KEY.quote:
                this.node.emit(InputSensor.ESCAPE);
                break;
        }
    }
}
