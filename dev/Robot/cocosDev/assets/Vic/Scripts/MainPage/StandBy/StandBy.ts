import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import RobotListItem from "../RobotStore/RobotListItem";
import RobotDetail from "./RobotDetail";
import MenuButton from "../../MenuButton";
import ViewController from "../../ViewController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandBy extends BasicViewer {
    @property(MenuButtons)
    robotList: MenuButtons = null;

    @property(MenuButtons)
    pilotList: MenuButtons = null;

    @property(RobotDetail)
    robotDetail: RobotDetail = null;

    init() {
        this.robotList.updateItem = (btn, data) => {
            let robotItem = btn as RobotListItem;
            robotItem.setLabel(data.key);
            robotItem.money.string = "";
        };
        this.pilotList.updateItem = (btn, data) => {
            let pilotItem = btn as MenuButton;
            pilotItem.setLabel(data.key);
        };

        this.robotDetail.close();
    }

    setRobotList() {
        this.robotList.open();
        ViewController.instance.model.getRobotList(0, 10, (err: any, data: any[]) => {
            if (data.length > 0) {
                const notArray = data.map(element => {
                    const [standbyKey, key] = element;
                    return { standbyKey: standbyKey, key: key };
                });
                this.robotList.setData(notArray);
            }
        });
    }

    setPilotList() {
        this.pilotList.open();

        ViewController.instance.model.getPilotList(0, 10, (err:any, data: any[]) => {
            if (data.length > 0) {
                const notArray = data.map(element => {
                    const [standbyKey, key] = element;
                    return { standbyKey: standbyKey, key: key };
                });
                this.pilotList.setData(notArray);
            }
        });
    }

    openRobotDetail() {
        this.robotDetail.open();
    }

    closeRobotDetail() {
        this.robotDetail.close();
    }
}
