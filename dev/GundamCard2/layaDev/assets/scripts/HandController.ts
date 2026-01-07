import { CardController } from "./CardController";
import { InstancePool } from "./InstancePool";

const { regClass, classInfo, property } = Laya;

@regClass()
export class HandController extends Laya.Script implements IInstanceGame<ICard[]> {

    @property(Laya.Sprite3D)
    public container: Laya.Sprite3D;

    @property(InstancePool)
    public instancePool: InstancePool;

    sync(game: ICard[]): void {
        game.forEach((hand, index) => {
            const handInstance = this.instancePool.getInstance(hand.id);
            handInstance.active = true;
            handInstance.getComponent(CardController)!.sync(hand);
            // handInstance.name = hand.name;
            // handInstance.transform.localRotationEulerX = 90;
            handInstance.transform.position = new Laya.Vector3(index * 1.2, 0, 0);
            this.container.addChild(handInstance);
        })
    }

}