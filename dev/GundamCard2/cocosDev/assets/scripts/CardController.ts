import { _decorator, Component, MeshRenderer, Node, Vec3 } from 'cc';
import { getImgSrc, getTexture, loadTextureFromURL } from './Helper';

const { ccclass, property } = _decorator;

@ccclass('CardController')
export class CardController extends Component implements IInstanceGame<ICard> {

    @property(Node)
    public front: Node | null = null;

    @property(Node)
    public back: Node | null = null;

    // protected async onLoad(): Promise<void> {
    //     if (this.back) {
    //         const backTexture = await getTexture('-1');
    //         const backMeshRenderer = this.back.getComponent(MeshRenderer);
    //         if (!backMeshRenderer) {
    //             console.warn('Back MeshRenderer not found on back node.');
    //             return;
    //         }
    //         backMeshRenderer.material.setProperty('mainTexture', backTexture);
    //     }
    // }

    async sync(game: IGame, relative: ICard): Promise<void> {

        // console.log('CardController sync called with card:', relative);
        if (this.front) {

            const imgTexture = await getTexture(relative.protoID);

            const frontMeshRenderer = this.front.getComponent(MeshRenderer);
            if (!frontMeshRenderer) {
                console.warn('Front MeshRenderer not found on front node.');
                return;
            }

            frontMeshRenderer.material.setProperty('mainTexture', imgTexture);

            this.node.setRotationFromEuler(relative.isFaceDown ? new Vec3(0, 0, 180) : new Vec3(0, 0, 0));

            // Debug: Log the current texture property after update
            // const updatedTexture = frontMeshRenderer.material.getProperty('mainTexture');
            // console.log('Updated texture after sync:', updatedTexture);
            // const texture = frontMeshRenderer.material.getProperty('mainTexture');
            // console.log('Current texture before update:', texture);
            // this.frontMeshRenderer.material.setProperty('mainTexture', imgURL);
            // convert url to texture and apply to material (pseudo-code)
            // const texture = await loadTextureFromURL(imgURL);
            // this.frontMeshRenderer.material.setProperty('mainTexture', texture);
        }

    }
}