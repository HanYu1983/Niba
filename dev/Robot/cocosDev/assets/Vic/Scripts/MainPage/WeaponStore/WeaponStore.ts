import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import ViewController from "../../ViewController";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class WeaponStore extends BasicViewer {

    @property(MenuButtons)
    list: MenuButtons = null;

    private _pageId:number = 0;

    init() {
        this.list.updateItem = (btn, data) => {
        };
    }

    prevPage(){
        if(--this._pageId < 0) this._pageId = 0;
        this.setlist();
    }

    nextPage(){
        this._pageId++;
        this.setlist();
    }

    setlist() {
        this.list.open();
        ViewController.instance.model.getWeaponStoreList(this._pageId, 10, (err:any, data:any)=>{
            this.list.setData(data);
        });
    }

    
}
