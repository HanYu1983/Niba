import { HandController } from "./HandController";
import { OrbitCamera } from "./OrbitCamera";

const { regClass, property } = Laya;

@regClass()
export class GameController extends Laya.Script implements IInstanceGame<IGame> {
    @property(HandController)
    public handController: IInstanceGame<ICard[]>;

    @property(OrbitCamera)
    public camera: OrbitCamera;

    sync(game: IGame): void {
        this.handController.sync(game.players[0].cards);
    }

    onAwake(): void {
        this.sync({
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
        });
        this.addListener();
    }

    addListener(): void {
        let lastX = 0;
        let lastY = 0;
        let isDragging = false;
        let isPanning = false;

        // add mouse listener for camera control
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, (e: Laya.Event) => {
            lastX = e.stageX;
            lastY = e.stageY;

            isDragging = true;
            isPanning = false
        });

        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, (e: Laya.Event) => {
            lastX = e.stageX;
            lastY = e.stageY;

            isPanning = true;
            isDragging = false;
        });

        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, (e: Laya.Event) => {
            if (!isDragging && !isPanning) return;

            const deltaX = e.stageX - lastX;
            const deltaY = e.stageY - lastY;

            if (isDragging) {
                this.camera.rotate(deltaX, deltaY);
            } else if (isPanning) {
                this.camera.pan(deltaX, deltaY);
            }

            lastX = e.stageX;
            lastY = e.stageY;
        });

        Laya.stage.on(Laya.Event.MOUSE_UP, this, () => {
            isDragging = false;
            isPanning = false;
        });

        Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, () => {
            isDragging = false;
            isPanning = false;
        });


        // add mouse wheel listener for zoom control
        Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, (e: Laya.Event) => {
            const delta = e.delta
            this.camera.zoom(delta);
        });
    }
}