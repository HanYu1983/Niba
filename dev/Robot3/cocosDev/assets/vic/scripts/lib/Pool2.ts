// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, NodePool, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pool2')
export class Pool2 extends Component {

    @property(Node)
    prefab:Node = null;

    private pool:NodePool = new NodePool();

    aquire(parent:Node){
        let node:Node = this.pool.size() > 0 ? this.pool.get() : instantiate(this.prefab);
        node.setParent(parent);
        node.active = true;
        return node;
    }

    release(node:Node){
        node.active = false;
        node.removeFromParent();
        this.pool.put(node);
    }
}
