// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, NodePool, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pool')
export class Pool extends Component {

    private poolDict:any = {};

    aquire(prefab:Node, parent:Node){
        const poolId = prefab.uuid.toString();
        if (!this.poolDict.hasOwnProperty(poolId)){
            this.poolDict[poolId] = new NodePool();
        }
        let pool = this.poolDict[poolId];
        let node = pool.size() > 0 ? pool.get() : instantiate(prefab);
        node.setParent(parent);
        node.active = true;
        return node;
    }

    release(prefab:Node, node:Node){
        
        const poolId = prefab.uuid.toString();
        if(this.poolDict.hasOwnProperty(poolId)){
            let pool = this.poolDict[poolId];
            this.node.active = false;
            node.removeFromParent();
            pool.put(node);
        }
    }
}
