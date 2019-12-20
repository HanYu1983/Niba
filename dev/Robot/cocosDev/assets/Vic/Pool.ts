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
    private _cursor: number = 0;

    getNode(node: cc.Node) {
        if (this._pool.length > this.poolSize) {
            let node = this._pool[this._cursor];
            if (++this._cursor > this.poolSize - 1) {
                this._cursor = 0;
            }
            return node;
        }
        let newNode = cc.instantiate(node);
        this._pool.push(newNode);
        return newNode;
    }

    getNodes() {
        return this._pool;
        //return Object.assign([], this._pool);
    }

    clearPool() {
        this._pool = [];
    }
}
