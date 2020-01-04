import Pool from "./Pool";
import ViewController from "./ViewController";
const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(Pool)
export default class NewClass extends cc.Component {

    private _pool:Pool;
    private _items:Array<cc.Node> = [];

    onLoad(){
        this._pool = this.node.getComponent(Pool);
    }

    showItems(poss:any[]){
        //poss.forEach(pos:number[])
    }

    showItem(pos:number[]){
        const item:cc.Node = this._pool.acquire();
        item.setParent(this.node);

        const gridPos:number[] = ViewController.instance.view.getGridPos(pos);
        item.x = gridPos[0];
        item.y = gridPos[1];

        this._items.push(item);
    }

    clearItem(){
        this._items.forEach(item=>{
            item.destroy();
        });
        this._items = [];
    }

}
