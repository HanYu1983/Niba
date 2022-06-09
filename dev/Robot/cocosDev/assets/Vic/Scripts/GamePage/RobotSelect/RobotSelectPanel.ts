// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import MenuButtons from "../../MenuButtons";
import BasicViewer from "../../BasicViewer";
import RobotSelectListItem from "./RobotSelectListItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotSelectPanel extends BasicViewer {

    @property(MenuButtons)
    robotSelectList: MenuButtons = null;

    init(){
        this.robotSelectList.updateItem = (btn, data)=>{
            let item = btn as RobotSelectListItem;
            item.setLabel(data.robotState.robotKey);
            item.setReady(data.selected);
        };
    }

    setRobotList(data:any){
        if (data.data.length == 0) return;
        this.robotSelectList.close();
        this.robotSelectList.open();
        let cursor;
        let subcursor = [];
        data.data.forEach(element => {
            if(element.focus){
                cursor = data.data.indexOf(element);
            }
            subcursor.push(0);
        });
        this.robotSelectList.setData(data.data, [cursor,subcursor]);
    }
}
