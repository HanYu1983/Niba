import { _decorator, Node, instantiate } from 'cc';

export class InstancePool {
    private prefab: Node | null = null;

    private pool: Record<string, Node[]> = {};

    constructor(prefab: Node | null) {
        this.prefab = prefab;
    }

    getInstance(key: string): Node | null {
        if (!this.prefab) {
            return null;
        }

        if (!this.pool[key]) {
            this.pool[key] = [];
        }

        if (this.pool[key].length > 0) {
            const node = this.pool[key].pop()!;
            node.active = true;
            return node;
        }

        return instantiate(this.prefab);
    }

    releaseInstance(key: string, instance: Node): void {
        if (!this.pool[key]) {
            this.pool[key] = [];
        }

        instance.removeFromParent();
        instance.active = false;
        this.pool[key].push(instance);
    }
}