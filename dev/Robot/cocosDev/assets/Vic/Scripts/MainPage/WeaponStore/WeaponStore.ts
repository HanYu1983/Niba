import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import ViewController from "../../ViewController";
import StoreListPanel from "../../StoreListPanel";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class WeaponStore extends StoreListPanel {

    updateItem(btn, data){

    }

    getData(pageId:number, cb:(err:any, data:any)=>void){
        ViewController.instance.model.getWeaponStoreList(pageId, 10, cb);
    }
}
