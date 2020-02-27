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
        this.modelController.talk("getRobotStoreList", { offset: pageId * count, limit: count }, answer => {
            cb(answer);
        });
    }

    getPilotStoreList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        this.modelController.talk("getPilotStoreList", { offset: pageId * count, limit: count }, answer => {
            cb(answer);
        });
    }

    getRobotList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        this.modelController.talk("getRobotList", { offset: pageId * count, limit: count }, answer => {
            cb(answer);
        })
    }

    getPilotList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        this.modelController.talk("getPilotList", { offset: pageId * count, limit: count }, answer => {
            cb(answer);
        });
    }

    buyRobotById(cb: (data: any) => void) {
        cc.log("購買機器人");
    }

    buyPilotById(cb: (data: any) => void) {
        cc.log("購買駕駛員");
    }

    setRobotPilot(cb: (data: any) => void) {
        cc.log("設定駕駛員");
    }
}
