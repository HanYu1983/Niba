import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InstancePool')
export class InstancePool extends Component {
    @property(Node)
    public prefab: Node | null = null;

    public pool: Record<string, Node[]> = {};

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