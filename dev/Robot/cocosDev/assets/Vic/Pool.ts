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

    private _pool: Array<cc.Node> = [];

    private _initPool(node: cc.Node) {
        if (this._pool.length > 0) return;
        for (let i = 0; i < this.poolSize; ++i) {
            this._pool.push(cc.instantiate(node));
        }
    }

    acquire(node: cc.Node):cc.Node {
        this._initPool(node);
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
