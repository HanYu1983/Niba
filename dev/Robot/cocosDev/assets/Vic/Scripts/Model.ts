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
            const [err, info] = answer;
            cb(info);
        });
    }

    getPilotStoreList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        console.log("getPilotStoreList")
        this.modelController.talk("getPilotStoreList", { offset: pageId * count, limit: count }, answer => {
            const [err, info] = answer;
            cb(info);
        });
    }

    getRobotList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        console.log("getRobotList")
        this.modelController.talk("getRobotList", { offset: pageId * count, limit: count }, answer => {
            console.log(answer)
            const [err, info] = answer;
            cb(info);
        })
    }

    getPilotList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        console.log("getPilotList")
        this.modelController.talk("getPilotList", { offset: pageId * count, limit: count }, answer => {
            console.log(answer)
            const [err, info] = answer;
            cb(info);
        });
    }

    buyRobotById(robotKey: string, cb: (data: any) => void) {
        cc.log("購買機器人");
        this.modelController.talk("buyRobotById", { key: "gaite_sky" }, answer => {
            console.log(answer)
            const [err, info] = answer;
            cb(info);
        });
    }

    buyPilotById(pilotKey: string, cb: (data: any) => void) {
        cc.log("購買駕駛員");
        this.modelController.talk("buyPilotById", { key: "amuro" }, answer => {
            console.log(answer)
            const [err, info] = answer;
            cb(info);
        });
    }

    setRobotPilot(robotKey: string, pilotKey: string, cb: (data: any) => void) {
        cc.log("設定駕駛員");
        this.modelController.talk("setRobotPilot", { robotKey: "test", pilotKey: "test" }, answer => {
            console.log(answer)
            const [err, info] = answer;
            cb(info);
        });
    }
}
