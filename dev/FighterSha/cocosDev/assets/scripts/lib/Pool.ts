const { ccclass, property } = cc._decorator;

@ccclass
export default class Pool extends cc.Component {

    @property(cc.Integer)
    poolSize: number = 30;

    @property(cc.Node)
    instanceNode:cc.Node = null;

    private _pool: Array<cc.Node> = [];

    private _init(){
        for (let i = 0; i < this.poolSize; ++i) {
            this._pool.push(cc.instantiate(this.instanceNode));
        }
    }
    
    onLoad(){
        this._init();
    }

    onDestroy(){
        this.clearPool();
    }

    acquire():cc.Node {
        if(this._pool.length == 0){
            this._pool.push(cc.instantiate(this.instanceNode));
        }
        return this._pool.pop();
    }

    release(node:cc.Node){
        this._pool.unshift(node);
    }

    clearPool() {
        this._pool.forEach(node => {
            node.destroy();
        });
        this._pool = [];
    }
}
