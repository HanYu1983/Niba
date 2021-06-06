
import { _decorator, Component, Node, CCInteger, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pool')
export class Pool extends Component {
    
    @property(Node)
    prefab:Node = null;

    @property(CCInteger)
    count:number = 0;

    @property(Boolean)
    log = false;

    // onGetNode:any;
    // onReleaseNode:any;

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
            // if(this.onGetNode) this.onGetNode(node);
            node.setScale(Vec3.ONE);
            if(!node.active) node.active = true;

            this._usingNodes.push(node);

            if(this.log) console.log('取得節點, 剩餘:', this._nodes.length, '使用中:', this._usingNodes.length);

            return node;
        }
    }

    releaseNode(node:Node){
        // if(this.onReleaseNode) this.onReleaseNode(node);

        node.setScale(Vec3.ZERO);
        this._nodes.push(node);
        this._usingNodes.splice(this._usingNodes.indexOf(node), 1);

        if(this.log) console.log('交還節點, 剩餘:', this._nodes.length, '使用中:', this._usingNodes.length);
    }

    releaseAllNodes(){
        for(let i = this._usingNodes.length - 1; i >= 0; --i){
            this.releaseNode(this._usingNodes[i]);
        }
        this._usingNodes = [];
    }

    addNode(){
        const node = instantiate(this.prefab);
        node.setParent(this.node);
        node.setScale(Vec3.ZERO);
        this._nodes.push(node);

        if(this.log) console.log('新增節點, 剩餘:', this._nodes.length, '使用中:', this._usingNodes.length);
    }

    getUsingNodes(){
        return this._usingNodes;
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
