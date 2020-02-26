import ModelController from "../../Han/controller/ModelController";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Model extends cc.Component {

    private modelController: ModelController = null;
    setModelController(ctr:ModelController){
        this.modelController = ctr;
    }

    getRobotStoreList(pageId: number, count: number = 10):any[] {
        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "robot_" + i, money: i * 200 });
        }
        return data;
    }

    getPilotStoreList(pageId: number, count: number = 10) {
        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "pilot_" + i, money: i * 200 });
        }
        return data;
    }

    getRobotList(pageId: number, count: number = 10) {
        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "robot_" + i, money: i * 200 });
        }
        return data;
    }

    getPilotList(pageId: number, count: number = 10) {
        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "pilot_" + i, money: i * 200 });
        }
        return data;
    }

    buyRobotById(){
        cc.log("購買機器人");
    }

    buyPilotById(){
        cc.log("購買駕駛員");
    }

    setRobotPilot(){
        cc.log("設定駕駛員");
    }
}
