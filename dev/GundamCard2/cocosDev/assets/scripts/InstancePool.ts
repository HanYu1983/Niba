import { _decorator, Node, instantiate } from 'cc';

export class InstancePool {
    private prefab: Node | null = null;

    private pool: Record<string, Node> = {};

    constructor(prefab: Node | null) {
        this.prefab = prefab;
    }

    getInstance(key: string): Node | null {
        if (!this.prefab) {
            return null;
        }
        if (this.pool[key]) {
            this.pool[key].active = true;
            return this.pool[key];
        }
        const instance = instantiate(this.prefab);
        instance.active = true;
        this.pool[key] = instance;
        return instance;
    }

    releaseInstance(instance: Node): void {
        const key = Object.keys(this.pool).find((k) => this.pool[k] === instance);
        if (key) {
            instance.active = false;
        }
    }
}