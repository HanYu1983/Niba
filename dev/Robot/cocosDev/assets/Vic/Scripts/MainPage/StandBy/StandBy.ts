import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import RobotListItem from "../RobotStore/RobotListItem";
import RobotDetail from "./RobotDetail";
import MenuButton from "../../MenuButton";

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

        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "robot_" + i, money: i * 200 });
        }

        this.robotList.setData(data);
    }

    setPilotList(){
        this.pilotList.open();

        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "pilot_" + i, money: i * 200 });
        }

        this.pilotList.setData(data);
    }

    openRobotDetail(){
        this.robotDetail.open();
    }

    closeRobotDetail(){
        this.robotDetail.close();
    }
}
