import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import RobotListItem from "./RobotListItem";
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
export default class RobotStore extends StoreListPanel {

    updateItem(btn, data){
        const robotItem = btn as RobotListItem;
        robotItem.setLabel(data.title);
        robotItem.money.string = data.cost;
    }

    getData(pageId:number, cb:(err:any, data:any)=>void){
        ViewController.instance.model.getRobotStoreList(pageId, 10, (err:any, data:any)=>{
            const robotDetail = data.map(element=>{
                const [key, data] = element;
                let detail = ViewController.instance.getRobot(key);
                detail.key = key;
                return detail;
            });
            cb(err, robotDetail);
        });
    }
}
