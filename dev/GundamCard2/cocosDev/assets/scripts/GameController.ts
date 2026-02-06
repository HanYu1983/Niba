import { _decorator, Button, Component, EventMouse, EventTouch, Input, input, Node } from 'cc';
import { HandController } from './HandController';
import { OrbitCamera } from './OrbitCamera';
import { CardController } from './CardController';
import { CardUIController } from './CardUIController';
import { startGameMockData } from './mockData/startGame';
import { callWeb } from './Helper';
import { PlayerInfoController } from './PlayerInfoController';
import { PlayerCommandController } from './PlayerCommandController';
import { ButtonController } from './ButtonController';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component implements IInstanceGame<IGame> {
    @property({ type: HandController })
    public handControllers: IInstanceGame<string[]>[] = [];

    @property({ type: HandController })
    public deckControllers: IInstanceGame<string[]>[] = [];

    @property({ type: PlayerCommandController })
    public playerCommandControllers: IInstanceGame<any>[] = [];

    @property(Boolean)
    public debug: boolean = true;

    private lastGame: IGame | null = null;

    // @property({ type: OrbitCamera })
    // public camera: OrbitCamera | null = null;

    async sync(game: IGame, relative: IGame): Promise<void> {
        console.log("GameController syncing with game data:", game);

        await this.deckControllers[0].sync(game, game.model.gameState.table.cardStack['["PlayerA","本国"]']);
        await this.deckControllers[1].sync(game, game.model.gameState.table.cardStack['["PlayerB","本国"]']);

        this.playerCommandControllers[0].sync(game, game.playerCommands['PlayerA']);
        this.playerCommandControllers[1].sync(game, game.playerCommands['PlayerB']);

        // 只有一個命令時，自動出指令
        // if (game.playerCommands['PlayerA'] && game.playerCommands['PlayerA'].length === 1) {
        //     callWeb("onCocosGameFlow", { clientId: 'PlayerA', flow: game.playerCommands['PlayerA'][0] });
        // }

        // if (game.localMemory.timing.toString().includes("リロールフェイズ,フェイズ開始")) {

        //     callWeb("onCocosGameFlow", { clientId: 'PlayerA', flow: game.playerCommands['PlayerA'][0] });
        // }

        this.lastGame = game;
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

    onPlayerACommandButtonClick(event: EventTouch) {
        const btnNode: Node = event.currentTarget as Node;
        // console.log("Player command button clicked:", btnNode);

        if (btnNode) {
            const commandController = btnNode.getComponent(ButtonController);
            // console.log("Command controller:", commandController.buttonInfo);

            callWeb("onCocosGameFlow", { clientId: 'PlayerA', flow: commandController.buttonInfo, versionID: this.lastGame?.model.versionID });
        }
    }

    onPlayerBCommandButtonClick(event: EventTouch) {
        const btnNode: Node = event.currentTarget as Node;
        // console.log("Player command button clicked:", btnNode);

        if (btnNode) {
            const commandController = btnNode.getComponent(ButtonController);
            // console.log("Command controller:", commandController.buttonInfo);

            callWeb("onCocosGameFlow", { clientId: 'PlayerB', flow: commandController.buttonInfo });
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