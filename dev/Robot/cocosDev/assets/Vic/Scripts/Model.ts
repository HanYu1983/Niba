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
    setModelController(ctr: ModelController) {
        this.modelController = ctr;
    }
    getRobotStoreList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        console.log("getRobotStoreList")
        this.modelController.talk("getRobotStoreList", { offset: pageId * count, limit: count }, answer => {
            cb(answer);
        });
    }

    getPilotStoreList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        console.log("getPilotStoreList")
        this.modelController.talk("getPilotStoreList", { offset: pageId * count, limit: count }, answer => {
            cb(answer);
        });
    }

    getRobotList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        console.log("getRobotList")
        this.modelController.talk("getRobotList", { offset: pageId * count, limit: count }, answer => {
            console.log(answer)
            cb(answer);
        })
    }

    getPilotList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        console.log("getPilotList")
        this.modelController.talk("getPilotList", { offset: pageId * count, limit: count }, answer => {
            console.log(answer)
            cb(answer);
        });
    }

    buyRobotById(robotKey: string, cb: (data: any) => void) {
        cc.log("購買機器人");
        this.modelController.talk("buyRobotById", { robotKey: "test" }, answer => {
            console.log(answer)
            cb(answer);
        });
    }

    buyPilotById(pilotKey: string, cb: (data: any) => void) {
        cc.log("購買駕駛員");
        this.modelController.talk("buyPilotById", { pilotKey: "test" }, answer => {
            console.log(answer)
            cb(answer);
        });
    }

    setRobotPilot(robotKey: string, pilotKey: string, cb: (data: any) => void) {
        cc.log("設定駕駛員");
        this.modelController.talk("buyRobotById", { robotKey: "test", pilotKey: "test" }, answer => {
            console.log(answer)
            cb(answer);
        });
    }
}
