const { regClass, property } = Laya;

@regClass('InstancePool')
export class InstancePool extends Laya.Script {

    @property(Laya.Sprite3D)
    public prefab: Laya.Sprite3D;

    public pool: Record<string, Laya.Sprite3D[]> = {};

    getInstance(key: string): Laya.Sprite3D {
        if (!this.pool[key]) {
            this.pool[key] = [];
        }
        if (this.pool[key].length > 0) {
            return this.pool[key].pop()!;
        }
        return this.prefab.clone() as Laya.Sprite3D;
    }

    releaseInstance(key: string, instance: Laya.Sprite3D): void {
        if (!this.pool[key]) {
            this.pool[key] = [];
        }
        this.pool[key].push(instance);
    }
}