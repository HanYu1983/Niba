
import { _decorator, Component, Node, CCInteger, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pool')
export class Pool extends Component {
    
    @property(Node)
    prefab:Node = null;

    @property(CCInteger)
    count:number = 10;

    private _nodes:Array<Node> = [];

    private _usingNodes:Array<Node> = [];

    start(){
        for(let i = 0; i < this.count; ++i){
            this.addNode();
        }
    }

    getNode(){
        if(this._nodes.length == 0){
            this.addNode();
        }
        let node = this._nodes.pop();
        if(node){
            node.setScale(Vec3.ONE);
            if(!node.active) node.active = true;

            this._usingNodes.push(node);
            return node;
        }
    }

    releaseNode(node:Node){
        node.setScale(Vec3.ZERO);
        this._nodes.push(node);
    }

    releaseAllNodes(){
        this._usingNodes.forEach(elem=>{
            this.releaseNode(elem);
        });
        this._usingNodes = [];
    }

    addNode(){
        const node = instantiate(this.prefab);
        node.setParent(this.node);
        node.setScale(Vec3.ZERO);
        this._nodes.push(node);
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
