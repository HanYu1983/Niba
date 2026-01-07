import { _decorator, Component, Node, Vec3 } from 'cc';
import { CardController } from './CardController';
import { InstancePool } from './InstancePool';
import { UIFollow3D } from './UIFollow3D';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('HandController')
export class HandController extends Component implements IInstanceGame<ICard[]> {
    @property({ type: Node })
    public cardContainer: Node | null = null;

    @property({ type: Node })
    public cardUIContainer: Node | null = null;

    @property({ type: Node })
    public cardPrefab: Node | null = null;

    @property({ type: Node })
    public cardUIPrefab: Node | null = null;

    private cardPool: InstancePool | null = null;
    private cardUIPool: InstancePool | null = null;

    onLoad() {
        this.cardPool = new InstancePool(this.cardPrefab);
        this.cardUIPool = new InstancePool(this.cardUIPrefab);
    }

    sync(game: IGame, relative: ICard[]): void {
        if (!this.cardContainer || !this.cardPool) {
            return;
        }

        const cards: ICard[] = relative;
        cards.forEach((card: ICard, index) => {
            const cardInstance = (() => {
                const inst = this.cardPool!.getInstance(card.id);
                inst.active = true;

                const controller = inst.getComponent(CardController);
                if (controller) {
                    controller.sync(game, card);
                }

                inst.setPosition(index * 15, 0, 0);
                return inst
            })()
            this.cardContainer.addChild(cardInstance);

            const cardUIInstance = (() => {
                const inst = this.cardUIPool!.getInstance(card.id);
                inst.active = true;

                const uiController = inst.getComponent(CardController);
                if (uiController) {
                    uiController.sync(game, card);
                }

                const follow3D = inst.getComponent(UIFollow3D);
                if (follow3D) {
                    follow3D.target = cardInstance;
                }
                return inst;
            })()
            this.cardUIContainer?.addChild(cardUIInstance);
        });
    }
}