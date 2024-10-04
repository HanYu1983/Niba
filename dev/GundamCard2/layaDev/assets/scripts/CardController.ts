import { CardImageLoader } from "./CardImageLoader";
import { CardModel } from "./CardModel";

const { regClass, property } = Laya;

@regClass()
export class CardController extends Laya.Script {
    @property(Laya.MeshRenderer)
    public mesh: Laya.MeshRenderer = null;

    public model: CardModel = null;

    setModel(model:CardModel){
        this.model = model;
        this.loadImage();
    }

    private async loadImage(){
        const tex = await CardImageLoader.instance().getImage(this.model.uid, "https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/179030_11E_U_BL209R_blue.jpg");
        this.mesh.material.setTexture("Texture2D", tex.bitmap);
    }

    //组件被启用后执行，例如节点被添加到舞台后
    //onEnable(): void {}

    //组件被禁用时执行，例如从节点从舞台移除后
    //onDisable(): void {}

    //第一次执行update之前执行，只会执行一次
    onStart(): void {
        console.log(this.mesh);
        
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