import { _decorator, Component, EventMouse, Input, input, Node } from 'cc';
import { HandController } from './HandController';
import { OrbitCamera } from './OrbitCamera';
import { HandUIController } from './HandUIController';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component implements IInstanceGame<IGame> {
    @property({ type: HandController })
    public handController: IInstanceGame<ICard[]> | null = null;

    @property({ type: HandUIController })
    public handUIController: IInstanceGame<ICard[]> | null = null;

    @property({ type: OrbitCamera })
    public camera: OrbitCamera | null = null;

    sync(game: IGame, relative: IGame): void {
        this.handController?.sync(game, relative.players[0].cards);
        this.handUIController?.sync(game, relative.players[0].cards);
    }

    onLoad(): void {
        const mockGame: IGame = {
            players: [
                {
                    id: 'player1',
                    name: 'Alice',
                    cards: [
                        { id: 'card1', name: 'Gundam' },
                        { id: 'card2', name: 'Zaku' }
                    ]
                }
            ]
        }
        this.sync(mockGame, mockGame);
        this.addListener();
    }

    addListener(): void {
        let lastX = 0;
        let lastY = 0;
        let isDragging = false;
        let isPanning = false;

        input.on(Input.EventType.MOUSE_DOWN, (e: EventMouse) => {
            lastX = e.getLocationX();
            lastY = e.getLocationY();
            isDragging = e.getButton() === EventMouse.BUTTON_LEFT;
            isPanning = e.getButton() === EventMouse.BUTTON_RIGHT;
        }, this);

        input.on(Input.EventType.MOUSE_MOVE, (e: EventMouse) => {
            if (!isDragging && !isPanning) return;

            const deltaX = e.getLocationX() - lastX;
            const deltaY = e.getLocationY() - lastY;

            if (isDragging) {
                this.camera?.rotate(deltaX, deltaY);
            } else if (isPanning) {
                this.camera?.pan(deltaX, deltaY);
            }

            lastX = e.getLocationX();
            lastY = e.getLocationY();
        }, this);

        input.on(Input.EventType.MOUSE_UP, () => {
            isDragging = false;
            isPanning = false;
        }, this);

        input.on(Input.EventType.MOUSE_WHEEL, (e: EventMouse) => {
            this.camera?.zoom(e.getScrollY());
        }, this);
    }
}