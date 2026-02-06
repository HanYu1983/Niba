import { _decorator, Button, Component, EventMouse, EventTouch, Input, input, Node } from 'cc';
import { HandController } from './HandController';
import { OrbitCamera } from './OrbitCamera';
import { CardController } from './CardController';
import { CardUIController } from './CardUIController';
import { startGameMockData } from './mockData/startGame';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component implements IInstanceGame<IGame> {
    @property({ type: HandController })
    public handController: IInstanceGame<string[]> | null = null;

    @property({ type: HandController })
    public deckController: IInstanceGame<string[]> | null = null;

    @property(Boolean)
    public debug: boolean = true;

    // @property({ type: OrbitCamera })
    // public camera: OrbitCamera | null = null;

    sync(game: IGame, relative: IGame): void {
        console.log("GameController syncing with game data:", game);

        this.deckController?.sync(game, game.model.gameState.table.cardStack['["PlayerA","本国"]']);
        // this.handController?.sync(game, relative.players[0].cards);
    }

    onLoad(): void {

        window['cocos'] = {
            receiveMessage: (msg: { type: string, data: any }) => {
                console.log("Received message from web:", msg);
                switch (msg.type) {
                    case 'update viewModel':
                        const gameData: IGame = msg.data;
                        this.sync(gameData, gameData);
                        break;
                    default:
                        console.warn("Unknown message type:", msg.type);
                }
            }
        }

        if (this.debug) {
            const mockGame: IGame = startGameMockData
            this.sync(mockGame, mockGame);
        }

        this.callWeb('cocos ready', null)
    }

    onCardButtonClick(event: EventTouch) {
        // console.log(event.currentTarget);

        const btnNode: Node = event.currentTarget as Node;
        // console.log(btnNode.parent);

        if (btnNode) {
            const cardController = btnNode.parent.getComponent(CardUIController)
            // console.log(cardController);
            this.callWeb("cardClicked", { cardId: '1' });
        }
    }

    callWeb(name: string, data: any) {
        console.log("Calling web function via postMessage", { name, data });
        if (window['html']) {
            window['html'].callParent({ name: name, data: data });
        }
    }

    // addListener(): void {
    //     let lastX = 0;
    //     let lastY = 0;
    //     let isDragging = false;
    //     let isPanning = false;

    //     input.on(Input.EventType.MOUSE_DOWN, (e: EventMouse) => {
    //         lastX = e.getLocationX();
    //         lastY = e.getLocationY();
    //         isDragging = e.getButton() === EventMouse.BUTTON_LEFT;
    //         isPanning = e.getButton() === EventMouse.BUTTON_RIGHT;
    //     }, this);

    //     input.on(Input.EventType.MOUSE_MOVE, (e: EventMouse) => {
    //         if (!isDragging && !isPanning) return;

    //         const deltaX = e.getLocationX() - lastX;
    //         const deltaY = e.getLocationY() - lastY;

    //         if (isDragging) {
    //             this.camera?.rotate(deltaX, deltaY);
    //         } else if (isPanning) {
    //             this.camera?.pan(deltaX, deltaY);
    //         }

    //         lastX = e.getLocationX();
    //         lastY = e.getLocationY();
    //     }, this);

    //     input.on(Input.EventType.MOUSE_UP, () => {
    //         isDragging = false;
    //         isPanning = false;
    //     }, this);

    //     input.on(Input.EventType.MOUSE_WHEEL, (e: EventMouse) => {
    //         this.camera?.zoom(e.getScrollY());
    //     }, this);
    // }
}