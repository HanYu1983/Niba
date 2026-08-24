import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component implements IInstanceGame<IPlayerCommand> {


    @property(Label)
    public lblName: Label | null = null;

    // @property(Button)
    // public button:Button;

    public buttonInfo: IPlayerCommand;

    sync(game: IGame, relative: IPlayerCommand): Promise<void> {
        this.lblName.string = relative.id;
        this.buttonInfo = relative;
        return null;
    }

    update(deltaTime: number) {

    }
}


