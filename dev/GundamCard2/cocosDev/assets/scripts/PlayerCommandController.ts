import { _decorator, Component, Node } from 'cc';
import { InstancePool } from './InstancePool';
import { ButtonController } from './ButtonController';
const { ccclass, property } = _decorator;

@ccclass('PlayerCommandController')
export class PlayerCommandController extends Component implements IInstanceGame<IPlayerCommand[]> {


    @property(Node)
    public buttonPrefab: Node = null;

    private buttons: ButtonController[] = [];
    private buttonPool: InstancePool | null = null;

    sync(game: IGame, relative: IPlayerCommand[]): Promise<void> {
        // throw new Error('Method not implemented.');

        // console.log("Syncing player commands:", relative);

        this.buttons.forEach(button => {
            this.buttonPool?.releaseInstance(button.node);
        });
        this.buttons = [];

        relative.forEach((command, index) => {
            const button: Node = this.buttonPool.getInstance(command.id);
            button.getComponent(ButtonController)?.sync(game, command);
            button.setParent(this.node);
            // console.log("Created button for command:", command);
            this.buttons.push(button.getComponent(ButtonController));
        })

        return null;
    }

    protected onLoad(): void {
        this.buttonPool = new InstancePool(this.buttonPrefab);
    }

    update(deltaTime: number) {

    }
}


