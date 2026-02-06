import { _decorator, Button, Component, EventMouse, EventTouch, Input, input, Node } from 'cc';
import { HandController } from './HandController';
import { OrbitCamera } from './OrbitCamera';
import { CardController } from './CardController';
import { CardUIController } from './CardUIController';
import { startGameMockData } from './mockData/startGame';
import { callWeb } from './Helper';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component implements IInstanceGame<IGame> {
    @property({ type: HandController })
    public handControllers: IInstanceGame<string[]>[] = [];

    @property({ type: HandController })
    public deckControllers: IInstanceGame<string[]>[] = [];

    @property(Boolean)
    public debug: boolean = true;

    // @property({ type: OrbitCamera })
    // public camera: OrbitCamera | null = null;

    async sync(game: IGame, relative: IGame): Promise<void> {
        console.log("GameController syncing with game data:", game);

        await this.deckControllers[0].sync(game, game.model.gameState.table.cardStack['["PlayerA","本国"]']);
        await this.deckControllers[1].sync(game, game.model.gameState.table.cardStack['["PlayerB","本国"]']);

        if (game.localMemory.timing.toString().includes("リロールフェイズ,フェイズ開始")) {

            callWeb("onCocosGameFlow", { clientId: game.localMemory.clientId, flow: game.playerCommands['PlayerA'][0] });
            // callWeb("onCocosGameFlow", { clientId: game.localMemory.clientId, flow: game.playerCommands['PlayerA'][0] });
            // console.log("Syncing hand controller with active player's cards:", game.model.gameState.cards);
            // this.handController?.sync(game, game.model.gameState.playerStates[game.model.gameState.activePlayerID].cards);
        }
    }

    onLoad(): void {

        window['cocos'] = {
            receiveMessage: (msg: { type: string, data: any }) => {
                console.log("Received message from web:", msg);
                switch (msg.type) {
                    case 'onWebGameUpdate':
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

        callWeb('onCocosReady', null)
    }

    onCardButtonClick(event: EventTouch) {
        // console.log(event.currentTarget);

        const btnNode: Node = event.currentTarget as Node;
        // console.log(btnNode.parent);

        if (btnNode) {
            const cardController = btnNode.parent.getComponent(CardUIController)
            // console.log(cardController);
            callWeb("cardClicked", { cardId: '1' });
        }
    }

    // callWeb(type: string, data: any) {
    //     console.log("Calling web function via postMessage", { type, data });
    //     if (window['html']) {
    //         window['html'].callParent({ type: type, data: data });
    //     }
    // }

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