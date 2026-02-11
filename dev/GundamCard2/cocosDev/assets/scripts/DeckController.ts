import { _decorator, Button, CCBoolean, CCString, Component, EventHandler, Node, Vec3 } from 'cc';
import { CardController } from './CardController';
import { InstancePool } from './InstancePool';
import { UIFollow3D } from './UIFollow3D';
import { AHandState } from './handState/AHandState';
import { CardUIController } from './CardUIController';
import { callWeb } from './PostMessageCallback';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('DeckController')
export class DeckController extends Component implements IInstanceGame<string> {
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

    // @property(CCString)
    // public playerID: string = '';

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

    // onStateA(){

    // }

    // onStawetB(){

    // }
    
    // onVisit(accept:IAccest){
    //     accept.accpet(this)
    // }

    async sync(game: IGame, relative: string): Promise<void> {

        this.cardInstances.forEach((instance) => {
            this.cardPool!.releaseInstance(instance);
        });

        this.cardUIInstances.forEach((instance) => {
            this.cardUIPool!.releaseInstance(instance);
        });

        const cards = game.model.gameState.table.cardStack[relative] || [];
        cards.forEach(async (card: string, index) => {

            const cardInfo = game.model.gameState.cards[card];
            // console.log("Processing card:", cardInfo);

            const cardInstance = (async () => {
                const inst = this.cardPool!.getInstance(card);

                const controller = inst.getComponent(CardController);
                controller?.sync(game, cardInfo);

                const centerOffset = (cards.length - 1) / 2;
                inst.setPosition(this.cardOffset.x * (index - centerOffset), this.cardOffset.y * index, this.cardOffset.z * index);

                // ((_closureController) => {
                //     callWeb('onMethodCall', { method: 'getItemController', args: [game.model.gameState, cardInfo.id] }, async (response: any) => {
                //         console.log('Received response for getItemController:', response);
                //         controller?.showForMe(response === this.playerID);
                //     });
                // })(controller)

                // callWeb('onMethodCall', { method: 'getItemController', args: [game.model.gameState, cardInfo.id] }, async (response: any) => {
                //     console.log('Received response for getItemController:', response);
                //     console.log('card controller', controller);
                //     console.log('playerID', this.playerID);
                //     console.log('response', response);
                //     console.log('response === playerID', response === this.playerID);
                //     controller?.showForMe(response === this.playerID);
                // });
                return inst
            })()
            this.cardContainer.addChild(await cardInstance);
            this.cardInstances.push(await cardInstance);

            // const cardUIInstance = (() => {
            //     const inst = this.cardUIPool!.getInstance(card.id);

            //     const uiController = inst.getComponent(CardUIController);
            //     uiController?.sync(game, card);

            //     const follow3D = inst.getComponent(UIFollow3D);
            //     follow3D!.target = cardInstance;

            //     return inst;
            // })()
            // this.cardUIContainer?.addChild(cardUIInstance);
            // this.cardUIInstances.push(cardUIInstance)
        });

        // const currentState = this.states[0];
        // currentState.setReference();
    }

    // onCardButtonClick(cardId: string) {
    //     console.log(`Card clicked: ${cardId}`);
    // }
}