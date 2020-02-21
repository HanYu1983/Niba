import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import PilotListItem from "./PilotListItem";

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

        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "pilot_" + i, money: i * 200 });
        }

        this.robotList.setData(data);
    }
}
