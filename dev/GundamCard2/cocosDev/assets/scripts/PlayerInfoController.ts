import { _decorator, Component, Node } from 'cc';
import { PlayerCommandController } from './PlayerCommandController';
const { ccclass, property } = _decorator;

@ccclass('PlayerInfoController')
export class PlayerInfoController extends Component implements IInstanceGame<any> {


    @property({ type: PlayerCommandController })
    public playerInfo: IInstanceGame<IPlayerCommand[]> | null = null;

    sync(game: IGame, relative: any): Promise<void> {
        throw new Error('Method not implemented.');
    }


    update(deltaTime: number) {
        
    }
}


