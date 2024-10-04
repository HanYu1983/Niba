import { CardImageLoader } from "./CardImageLoader";
import { CardModel } from "./CardModel";
import { DeckController } from "./DeckController";

const { regClass, property } = Laya;

@regClass()
export class Controller extends Laya.Script {
    //declare owner : Laya.Sprite3D;
    //declare owner : Laya.Sprite;

    @property(DeckController)
    public myHand: DeckController = null;

    private allModel: Map<string, CardModel> = new Map();

    //第一次执行update之前执行，只会执行一次
    onStart(): void {
        this.buildEnvironment();
    }

    async buildEnvironment() {
        for (let i = 0; i < 10; ++i) {
            const model = new CardModel();
            model.uid = i + "";
            this.allModel.set(model.uid, model);
        }

        for (const [key, cardModek] of this.allModel.entries()) {
            await CardImageLoader.instance().getImage(key, "https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/179030_11E_U_BL209R_blue.jpg");
        }

        this.allModel.forEach((cardModel, key, map)=>{
            this.myHand.addCard(cardModel);
        });
        this.myHand.stack();
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