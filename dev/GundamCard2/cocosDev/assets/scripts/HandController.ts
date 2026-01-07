import { _decorator, Component, Node, Vec3 } from 'cc';
import { CardController } from './CardController';
import { InstancePool } from './InstancePool';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('HandController')
@requireComponent(InstancePool)
export class HandController extends Component implements IInstanceGame<ICard[]> {
    @property({ type: Node })
    public container: Node | null = null;

    private instancePool: InstancePool | null = null;

    onLoad() {
        this.instancePool = this.instancePool ?? this.getComponent(InstancePool);
    }

    sync(game: ICard[]): void {
        if (!this.container || !this.instancePool) {
            return;
        }

        game.forEach((card: ICard, index) => {
            const handInstance = this.instancePool!.getInstance(card.id);
            handInstance.active = true;

            if (!handInstance) {
                return;
            }

            const controller = handInstance.getComponent(CardController);
            if (controller) {
                controller.sync(card);
            }

            handInstance.setPosition(index * 15, 0, 0);
            this.container.addChild(handInstance);
        });
    }
}