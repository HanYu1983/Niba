import { _decorator, Component, Node, Vec3 } from 'cc';
import { CardController } from './CardController';
import { InstancePool } from './InstancePool';
import { UIFollow3D } from './UIFollow3D';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('HandUIController')
@requireComponent(InstancePool)
export class HandUIController extends Component implements IInstanceGame<ICard[]> {
    @property({ type: Node })
    public container: Node | null = null;

    private instancePool: InstancePool | null = null;

    onLoad() {
        this.instancePool = this.instancePool ?? this.getComponent(InstancePool);
    }

    sync(game: IGame, relative: ICard[]): void {
        if (!this.container || !this.instancePool) {
            return;
        }

        const cards: ICard[] = relative;
        cards.forEach((card: ICard, index) => {
            const handInstance = this.instancePool!.getInstance(card.id);
            handInstance.active = true;

            if (!handInstance) {
                return;
            }

            const controller = handInstance.getComponent(CardController);
            if (controller) {
                controller.sync(game, card);
            }

            const follow3D = handInstance.getComponent(UIFollow3D);
            if (follow3D) {
                follow3D.target = handInstance;
            }

            this.container.addChild(handInstance);
        });
    }
}