import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CardUIController')
export class CardUIController extends Component implements IInstanceGame<ICard> {
    sync(game: IGame, relative: ICard): void {
        console.log(`Syncing Card UI for card: ${relative.id} - ${relative.name}`);
    }
    start() {

    }

    update(deltaTime: number) {

    }
}


