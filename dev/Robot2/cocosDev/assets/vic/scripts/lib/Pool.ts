// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, NodePool, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pool')
export class Pool extends Component {

    private poolDict:any = {};

    private outOfWorld:Vec3 = new Vec3(50000,0,0);

    aquire(prefab:Node, parent:Node){
        const poolId = prefab.uuid.toString();
        if (!this.poolDict.hasOwnProperty(poolId)){

            // 内建的nodepool不知道爲什麽很吃效能，先不用他
            // this.poolDict[poolId] = new NodePool();

            this.poolDict[poolId] = [];
        }
        let pool = this.poolDict[poolId];
        let node = pool.length > 0 ? pool.pop() : instantiate(prefab);

        // setParent以及active操作的過程也是蠻吃效能的，使用上，同一個pool的物件也不會給到不同的parent，所以只要設定一次就好
        if(!node.getParent()) node.setParent(parent);
        if(!node.active) node.active = true;

        // 把物件移到原點，用來代替active = true操作
        node.setPosition(Vec3.ZERO);

        // console.log("[獲取後-]數量:" + pool.length + ", 獲取:" + prefab.name);
        
        return node;
    }

    release(prefab:Node, node:Node){
        
        const poolId = prefab.uuid.toString();
        if(this.poolDict.hasOwnProperty(poolId)){
            let pool = this.poolDict[poolId];
            pool.push(node)

            // 把物件移到很遠的地方，用來代替active = false操作
            node.setPosition(this.outOfWorld);

            // console.log("[-釋放後]數量:" + pool.length + ", 釋放:" + prefab.name);
        }

        
    }
}
