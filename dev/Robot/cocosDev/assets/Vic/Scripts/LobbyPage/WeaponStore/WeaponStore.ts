import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import ViewController from "../../ViewController";
import StoreListPanel from "../../StoreListPanel";
import MenuButton from "../../MenuButton";
import WeaponListItem from "./WeaponListItem";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class WeaponStore extends StoreListPanel {

    updateItem(btn:MenuButton, data:any){
        btn.setLabel(data.detail.title);
        // (btn as WeaponListItem).money = 
    }

    getData(pageId:number, cb:(err:any, data:any)=>void){
        ViewController.instance.model.getWeaponStoreList(pageId, 10, (err, data)=>{
            let usingData = data.map((item)=>{
                return {"key":item[0], "detail":item[1]};
            })
            cb(err, usingData);
        });
    }
}
