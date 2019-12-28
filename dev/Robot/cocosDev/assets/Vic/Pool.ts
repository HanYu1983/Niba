// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

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
            return cc.instantiate(this.instanceNode);
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
