import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import RobotListItem from "../RobotStore/RobotListItem";
import RobotDetail from "./RobotDetail";
import MenuButton from "../../MenuButton";
import ViewController from "../../ViewController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StandBy extends BasicViewer {
    @property(MenuButtons)
    robotList: MenuButtons = null;

    @property(MenuButtons)
    pilotList:MenuButtons = null;

    @property(RobotDetail)
    robotDetail:RobotDetail = null;

    init() {
        this.robotList.updateItem = (btn, data) => {
            let robotItem = btn as RobotListItem;
            robotItem.setLabel(data.name);
            robotItem.money.string = data.money;
        };
        this.pilotList.updateItem = (btn, data) => {
            let pilotItem = btn as MenuButton;
            pilotItem.setLabel(data.name);
        };

        this.robotDetail.close();
    }

    setRobotList() {
        this.robotList.open();

        let data = ViewController.instance.model.getRobotList(0);
        this.robotList.setData(data);
    }

    setPilotList(){
        this.pilotList.open();

        let data = ViewController.instance.model.getPilotList(0);
        this.pilotList.setData(data);
    }

    openRobotDetail(){
        this.robotDetail.open();
    }

    closeRobotDetail(){
        this.robotDetail.close();
    }
}
