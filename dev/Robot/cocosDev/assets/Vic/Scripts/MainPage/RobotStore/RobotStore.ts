import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import RobotListItem from "./RobotListItem";
import ViewController from "../../ViewController";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RobotStore extends BasicViewer {

    @property(MenuButtons)
    robotList: MenuButtons = null;

    init() {
        this.robotList.updateItem = (btn, data) => {
            let robotItem = btn as RobotListItem;
            robotItem.setLabel(data.name);
            robotItem.money.string = data.money;
        };
    }

    setRobotList() {
        this.robotList.open();
        let data = ViewController.instance.model.getRobotStoreList(0);
        this.robotList.setData(data);
    }

    
}
