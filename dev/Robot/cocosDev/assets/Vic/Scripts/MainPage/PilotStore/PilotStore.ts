import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import PilotListItem from "./PilotListItem";
import ViewController from "../../ViewController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotStore extends BasicViewer {
    @property(MenuButtons)
    robotList: MenuButtons = null;

    init() {
        this.robotList.updateItem = (btn, data) => {
            let robotItem = btn as PilotListItem;
            robotItem.setLabel(data.name);
            robotItem.money.string = data.money;
        };
    }

    setRobotList() {
        this.robotList.open();

        ViewController.instance.model.getPilotStoreList(0, 10, (data:any[])=>{
            this.robotList.setData(data);
        });
    }
}
