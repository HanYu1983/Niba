import Pool from "./Pool";
import ViewController from "./ViewController";
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(Pool)
export default class NewClass extends cc.Component {

    private _pool: Pool;
    private _items: Array<cc.Node> = [];

    onLoad() {
        this._pool = this.node.getComponent(Pool);
    }

    showItems(poss: any[], onCreate?: (node: cc.Node) => void) {
        poss.forEach(pos => {
            this.showItem(pos, onCreate);
        });
    }

    showItem(pos: number[], onCreate?: (node: cc.Node) => void) {
        const item: cc.Node = this._pool.acquire();
        item.active = true;
        item.setParent(this.node);

        const gridPos: number[] = ViewController.instance.view.getGridPos(pos);
        item.x = gridPos[0];
        item.y = gridPos[1];

        cc.log(item.x, item.y);

        this._items.push(item);

        if (onCreate) onCreate(item);
    }

    clearItem() {
        this._items.forEach(item => {
            item.removeFromParent();
            this._pool.release(item);
        });
        this._items = [];
    }

}
