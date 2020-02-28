import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import PilotListItem from "./PilotListItem";
import ViewController from "../../ViewController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotStore extends BasicViewer {
    @property(MenuButtons)
    pilotList: MenuButtons = null;

    init() {
        this.pilotList.updateItem = (btn, data) => {
            let robotItem = btn as PilotListItem;
            robotItem.setLabel(data.title);
            robotItem.money.string = data.cost;
        };
    }

    setPilotList() {
        this.pilotList.open();
        ViewController.instance.model.getPilotStoreList(0, 10, (err:any, data:any[])=>{
            const detailData = data.map(element=>{
                const [key, data] = element;
                const detail = ViewController.instance.getPilot(key);
                detail.key = key;
                return detail;
            });
            this.pilotList.setData(detailData);
        });
    }
}
