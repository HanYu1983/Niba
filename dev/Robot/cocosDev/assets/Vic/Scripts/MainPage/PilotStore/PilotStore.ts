import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import PilotListItem from "./PilotListItem";
import ViewController from "../../ViewController";
import StoreListPanel from "../../StoreListPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotStore extends StoreListPanel {

    updateItem(btn, data){
        let robotItem = btn as PilotListItem;
        robotItem.setLabel(data.title);
        robotItem.money.string = data.cost;
    }

    getData(pageId:number, cb:(err:any, data:any)=>void){
        ViewController.instance.model.getPilotStoreList(pageId, 10, (err:any, data:any[])=>{
            const detailData = data.map(element=>{
                const [key, data] = element;
                const detail = ViewController.instance.getPilot(key);
                detail.key = key;
                return detail;
            });
            cb(err, detailData)
        });
    }
}
