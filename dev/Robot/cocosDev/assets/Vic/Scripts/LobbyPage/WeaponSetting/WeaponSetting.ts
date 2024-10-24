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
import RobotListItem from "../RobotStore/RobotListItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponSetting extends BasicViewer {

    @property(MenuButtons)
    titleMenu:MenuButtons = null;

    @property(ListPageController)
    componentList:ListPageController = null;

    @property(ListPageController)
    robotList:ListPageController = null;

    @property(ListPageController)
    robotEquipList:ListPageController = null;

    robotPageId:number = 0;

    init(){
        this.componentList.list.updateItem = (btn:MenuButton, data:any) => {
            // cc.log(data);
            btn.setLabel(data.title);
            (btn as RobotListItem).money.string = data.powerCost;
        };

        this.robotList.list.updateItem = (btn:MenuButton, data:any) => {
            // cc.log(data);
            btn.setLabel(data.robotState.title);
            (btn as RobotListItem).money.string = data.robotState.power;
        };

        this.robotEquipList.list.updateItem = (btn:MenuButton, data:any) => {
            // cc.log(data);
            btn.setLabel(data.title);
            (btn as RobotListItem).money.string = data.powerCost;
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
        this.titleMenu.setData(["機體列表","裝備列表","武器列表"]);
    }

    close(){
        super.close();

        this.componentList.close();
        this.robotList.close();
        this.robotEquipList.close();
    }

    prevFocus(){
        this.titleMenu.onPrevClick();
    }

    nextFocus(){
        this.titleMenu.onNextClick();
    }

    upComponentList(){
        this.componentList.list.onPrevClick();
    }

    downComponentList(){
        this.componentList.list.onNextClick();
    }

    upRobotList(){
        this.robotList.list.onPrevClick();
        this.setRobotEquipList();
    }

    downRobotList(){
        this.robotList.list.onNextClick();
        this.setRobotEquipList();
    }

    upRobotEquipList(){
        this.robotEquipList.list.onPrevClick();
    }

    downRobotEquipList(){
        this.robotEquipList.list.onNextClick();
    }


    setCompnentList(){
        ViewController.instance.model.getWeaponList(this.componentList.pageId, 10, (err, data)=>{
            let items = data.map((data)=>{
                return data[1];
            });
            items.unshift({title:"拆除", powerCost:""})
            this.componentList.list.open();
            this.componentList.list.setData(items);
        });
    }

    setRobotList(){
        let focusId = this.robotList.list.getFocusId()[0];
        ViewController.instance.model.getRobotList(this.robotList.pageId, 10, (err, data)=>{
            let items = data.map((data)=>{
                return data[1];
            });

            this.robotList.list.open();
            this.robotList.list.setData(items);
            while(this.robotList.list.getFocusId()[0] < focusId) this.robotList.list.onNextClick();

            this.setRobotEquipList();
        });
    }

    setRobotEquipList(){
        let robot = this.robotList.list.getFocus();
        let items = robot.robotState.weapons.slice();
        items.push({title:"新增", powerCost:""});
        this.robotEquipList.list.close()
        this.robotEquipList.list.open();
        this.robotEquipList.list.setData(items);
    }
}
