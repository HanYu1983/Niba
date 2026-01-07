import { _decorator, Camera, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIFollow3D')
export class UIFollow3D extends Component {
    @property({ type: Node })
    public target: Node | null = null;

    @property({ type: Camera })
    public camera: Camera | null = null;

    private _worldPos: Vec3 = new Vec3();
    private _uiPos: Vec3 = new Vec3();

    update(): void {
        if (!this.target || !this.camera) {
            return;
        }

        this.target.getWorldPosition(this._worldPos);

        const uiParent = this.node.parent;
        if (!uiParent) {
            return;
        }

        this.camera.convertToUINode(this._worldPos, uiParent, this._uiPos);
        this.node.setPosition(this._uiPos);
    }
}