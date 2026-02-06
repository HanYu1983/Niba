import { _decorator, Component, MeshRenderer, Node } from 'cc';
import { getImgSrc, loadTextureFromURL } from './Helper';

const { ccclass, property } = _decorator;

@ccclass('CardController')
export class CardController extends Component implements IInstanceGame<ICard> {

    @property(Node)
    public front: Node | null = null;

    // private frontMeshRenderer: MeshRenderer | null = null;

    // protected onLoad(): void {
    //     if (this.front) {
    //         this.frontMeshRenderer = this.front.getComponent(MeshRenderer);

    //         console.log('CardController onLoad - frontMeshRenderer:', this.frontMeshRenderer);
    //     }
    // }

    async sync(game: IGame, relative: ICard): Promise<void> {

        console.log('CardController sync called with card:', relative);
        // TODO: bind card data to visuals
        if (this.front) {
            // Example: Update the material or texture of the frontMeshRenderer based on card data

            const imgURL = getImgSrc(relative.protoID);
            console.log(`CardController syncing card ID: ${relative.id}, ProtoID: ${relative.protoID}, Image URL: ${imgURL}`);

            const imgTexture = await loadTextureFromURL(imgURL);
            console.log('Loaded texture:', imgTexture);

            const frontMeshRenderer = this.front.getComponent(MeshRenderer);
            if (!frontMeshRenderer) {
                console.warn('Front MeshRenderer not found on front node.');
                return;
            }

            frontMeshRenderer.material.setProperty('mainTexture', imgTexture);

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