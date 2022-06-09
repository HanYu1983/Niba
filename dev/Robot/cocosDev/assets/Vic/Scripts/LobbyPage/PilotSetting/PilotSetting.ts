// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import MenuButton from "../../MenuButton";
import ViewController from "../../ViewController";
import ListPageController from "../../ListPageController";
import UnitStatuInfo from "../../GamePage/UnitStatuInfo";
import PilotStateInfo from "../../GamePage/PilotStatuInfo";
import ComponentListItem from "../ComponentStore/ComponentListItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotSetting extends BasicViewer {

    @property(MenuButtons)
    titleMenu:MenuButtons = null;

    @property(ListPageController)
    componentList:ListPageController = null;

    @property(ListPageController)
    robotList:ListPageController = null;

    @property(ListPageController)
    robotEquipList:ListPageController = null;

    @property(UnitStatuInfo)
    robotInfo:UnitStatuInfo = null;

    @property(PilotStateInfo)
    pilotInfoCurrent:PilotStateInfo = null;

    @property(PilotStateInfo)
    pilotInfoReplace:PilotStateInfo = null;

    robotPageId:number = 0;

    init(){
        this.componentList.list.updateItem = (btn:MenuButton, data:any) => {
            cc.log(data);
            btn.setLabel(data.title);
        };

        this.robotList.list.updateItem = (btn:MenuButton, data:any) => {
            cc.log(data);
            btn.setLabel(data.robotState.title);
        };

        this.robotEquipList.list.updateItem = (btn:MenuButton, data:any) => {
            cc.log(data);
            btn.setLabel(data.title);
        };

        this.titleMenu.updateItem = (btn:MenuButton, data:any) => {
            btn.setLabel(data);
        };
    }

    open(){
        super.open();

        this.componentList.open();
        this.robotList.open();
        this.robotEquipList.open();
        
        this.setCompnentList();
        this.setRobotList();

        this.titleMenu.open();
        this.titleMenu.setData(["機體列表","搭乘駕駛","駕駛列表"]);
    }

    close(){
        super.close();

        this.componentList.close();
        this.robotList.close();
        this.robotEquipList.close();
    }

    prevFocus(){
        this.titleMenu.onPrevClick();
        this.updateInfo();
    }

    nextFocus(){
        this.titleMenu.onNextClick();
        this.updateInfo();
    }

    upComponentList(){
        this.componentList.list.onPrevClick();
        this.updateInfo();
    }

    downComponentList(){
        this.componentList.list.onNextClick();
        this.updateInfo();
    }

    upRobotList(){
        this.robotList.list.onPrevClick();
        this.setRobotEquipList();
        this.updateInfo();
    }

    downRobotList(){
        this.robotList.list.onNextClick();
        this.setRobotEquipList();
    }

    upRobotEquipList(){
        this.robotEquipList.list.onPrevClick();
        this.updateInfo();
    }

    downRobotEquipList(){
        this.robotEquipList.list.onNextClick();
        this.updateInfo();
    }


    setCompnentList(){
        ViewController.instance.model.getPilotList(this.componentList.pageId, 10, (err, data)=>{
            let items = data.map((data)=>{
                let item = data[1];
                item.key = data[0];
                return item;
            });
            items.unshift({title:"拆除"})
            this.componentList.list.open();
            this.componentList.list.setData(items);
        });
    }

    setRobotList(){
        let focusId = this.robotList.list.getFocusId()[0];
        ViewController.instance.model.getRobotList(this.robotList.pageId, 10, (err, data)=>{
            let items = data.map((data)=>{
                let item = data[1];
                item.key = data[0];
                return item;
            });

            this.robotList.list.open();
            this.robotList.list.setData(items);
            while(this.robotList.list.getFocusId()[0] < focusId) this.robotList.list.onNextClick();

            this.setRobotEquipList();
            this.updateInfo();
        });
    }

    setRobotEquipList(){
        let robot = this.robotList.list.getFocus();
        let pilot = robot.robotState.pilotState;
        if (pilot == null){
            pilot = {title:"新增"}
        }
        this.robotEquipList.list.close()
        this.robotEquipList.list.open();
        this.robotEquipList.list.setData([pilot]);
    }

    updateInfo(){
        const robot = this.robotList.list.getFocus();
        this.robotInfo.setUnit(robot);

        const pilotCurrent = this.robotEquipList.list.getFocus();
        this.pilotInfoCurrent.setPilot(pilotCurrent);

        const pilotReplace = this.componentList.list.getFocus();
        this.pilotInfoReplace.setPilot(pilotReplace);
    }
}
