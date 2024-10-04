const { regClass, property } = Laya;

@regClass()
export class UIFollow3D extends Laya.Script {

    declare owner: Laya.Sprite;

    @property(Laya.Camera)
    camera: Laya.Camera;

    @property(Laya.Sprite3D)
    follow: Laya.Sprite3D;

    private screenPos = new Laya.Vector4();
    
    //每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    onUpdate(): void {
        const worldPos = this.follow.transform.position;

        this.camera.viewport.project(worldPos, this.camera.projectionViewMatrix, this.screenPos);

        const stageX = this.screenPos.x / Laya.stage.clientScaleX;
        const stageY = this.screenPos.y / Laya.stage.clientScaleY;

        this.owner.pos(stageX, stageY);
    }
}