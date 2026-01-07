import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

@ccclass('CardController')
export class CardController extends Component implements IInstanceGame<ICard> {
    sync(game: IGame, relative: ICard): void {
        // TODO: bind card data to visuals
    }
}