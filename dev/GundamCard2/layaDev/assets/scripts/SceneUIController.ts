import { RuntimeScript } from "../../src/RuntimeScript";
import { WebController } from "./WebController";

const { regClass, property } = Laya;

@regClass()
export class SceneUIController extends Laya.Script {
    private ui: RuntimeScript;

    @property(WebController)
    webController: WebController;

    //第一次执行update之前执行，只会执行一次
    onStart(): void {

        this.ui = this.owner.scene as RuntimeScript;

        this.ui.BtnCallWeb.on(Laya.Event.MOUSE_DOWN, this, this.onBtnCallWebClick);
    }

    private onBtnCallWebClick(): void {
        this.webController.callWeb("doA", "msgA");
    }

    //手动调用节点销毁时执行
    //onDestroy(): void {}

    //每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onUpdate(): void {}

    //每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onLateUpdate(): void {}

    //鼠标点击后执行。与交互相关的还有onMouseDown等十多个函数，具体请参阅文档。
    //onMouseClick(): void {}
}