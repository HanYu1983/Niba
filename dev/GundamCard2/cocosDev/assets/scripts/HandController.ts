import { _decorator, Component, Node, Vec3 } from 'cc';
import { CardController } from './CardController';
import { InstancePool } from './InstancePool';
import { UIFollow3D } from './UIFollow3D';
import { AHandState } from './handState/AHandState';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('HandController')
export class HandController extends Component implements IInstanceGame<ICard[]> {
    @property(Node)
    public cardContainer: Node | null = null;

    @property(Node)
    public cardUIContainer: Node | null = null;

    @property(Node)
    public cardPrefab: Node | null = null;

    @property(Node)
    public cardUIPrefab: Node | null = null;

    @property(Vec3)
    public cardOffset: Vec3 = new Vec3(12, 1, 0);

    private cardPool: InstancePool | null = null;
    private cardUIPool: InstancePool | null = null;
    private cardInstances: Node[] = [];
    private cardUIInstances: Node[] = [];

    private states: AHandState[] = [
        new AHandState()
    ];

    onLoad() {
        this.cardPool = new InstancePool(this.cardPrefab);
        this.cardUIPool = new InstancePool(this.cardUIPrefab);
    }

    sync(game: IGame, relative: ICard[]): void {
        if (!this.cardContainer || !this.cardPool) {
            return;
        }

        this.cardInstances.forEach((instance) => {
            this.cardPool!.releaseInstance(instance);
        });

        const cards: ICard[] = relative;
        cards.forEach((card: ICard, index) => {
            const cardInstance = (() => {
                const inst = this.cardPool!.getInstance(card.id);

                const controller = inst.getComponent(CardController);
                controller?.sync(game, card);

                const centerOffset = (cards.length - 1) / 2;
                inst.setPosition(this.cardOffset.x * (index - centerOffset), this.cardOffset.y * index, this.cardOffset.z * index);
                return inst
            })()
            this.cardContainer.addChild(cardInstance);
            this.cardInstances.push(cardInstance);

            const cardUIInstance = (() => {
                const inst = this.cardUIPool!.getInstance(card.id);

                const uiController = inst.getComponent(CardController);
                uiController?.sync(game, card);

                const follow3D = inst.getComponent(UIFollow3D);
                follow3D!.target = cardInstance;
                return inst;
            })()
            this.cardUIContainer?.addChild(cardUIInstance);
            this.cardUIInstances.push(cardUIInstance)
        });

        // const currentState = this.states[0];
        // currentState.setReference();
    }
}