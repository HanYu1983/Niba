const { regClass, property } = Laya;

@regClass()
export class UIFollow3D extends Laya.Script {

    @property(Laya.Sprite3D)
    public target: Laya.Sprite3D = null;

    @property(Laya.Camera)
    public camera: Laya.Camera = null;

    onUpdate(): void {
        if (this.target) {
            const pos3D = this.target.transform.position;
            const pos2D = new Laya.Vector4();
            this.camera.worldToViewportPoint(pos3D, pos2D);

            const owner = this.owner as Laya.Sprite;
            owner.x = pos2D.x;
            owner.y = pos2D.y;
        }

    }
}