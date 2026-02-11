import { _decorator, CCBoolean, CCString, Component, MeshRenderer, Node, Vec3 } from 'cc';
import { getImgSrc, getTexture, loadTextureFromURL } from './Helper';
import { callWeb, callWebPromise } from './PostMessageCallback';
import { getView } from './System';

const { ccclass, property } = _decorator;

@ccclass('CardController')
export class CardController extends Component implements IInstanceGame<ICard> {

    @property(Node)
    public front: Node | null = null;

    @property(Node)
    public back: Node | null = null;

    async sync(game: IGame, relative: ICard): Promise<void> {
        if (this.front) {
            await this.setTexture(relative);
            await this.showForMe(game, relative);
        }
    }

    private async setTexture(relative: ICard) {
        const imgTexture = await getTexture(relative.protoID);
        const frontMeshRenderer = this.front.getComponent(MeshRenderer);
        if (!frontMeshRenderer) {
            console.warn('Front MeshRenderer not found on front node.');
            return;
        }
        frontMeshRenderer.material.setProperty('mainTexture', imgTexture);
    }

    private async showForMe(game: IGame, relative: ICard) {
        const itemState = await callWebPromise('onMethodCall', { method: 'getItemState', args: [game.model.gameState, relative.id] });
        let showForMe = relative.isFaceDown != true
        if (itemState.isCheat) {
            showForMe = true
        }
        if (relative.isFaceDown) {
            const baSyou = await callWebPromise('onMethodCall', { method: 'getItemBaSyou', args: [game.model.gameState, relative.id] });
            switch (baSyou.value[1]) {
                case "手札": {
                    const controller = await callWebPromise('onMethodCall', { method: 'getItemController', args: [game.model.gameState, relative.id] });
                    if (controller == getView()) {
                        showForMe = true
                    }
                    break
                }
                default:
                    break;
            }
        }
        this.node.setRotationFromEuler(showForMe ? new Vec3(0, 0, 0) : new Vec3(0, 0, 180));
    }
}