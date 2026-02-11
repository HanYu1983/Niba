import { _decorator, Component, Node } from 'cc';
import { InstancePool } from './InstancePool';
import { ButtonController } from './ButtonController';
const { ccclass, property } = _decorator;

@ccclass('PlayerCommandController')
export class PlayerCommandController extends Component implements IInstanceGame<string> {


    @property(Node)
    public buttonPrefab: Node = null;

    private buttons: ButtonController[] = [];
    private buttonPool: InstancePool | null = null;

    sync(game: IGame, relative: string): Promise<void> {
        const playerCommands = game.playerCommands[relative]
        this.buttons.forEach(button => {
            this.buttonPool?.releaseInstance(button.node);
        });
        this.buttons = [];
        playerCommands.forEach((command, index) => {
            const button: Node = this.buttonPool.getInstance(command.id);
            button.getComponent(ButtonController)?.sync(game, command);
            button.setParent(this.node);
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


