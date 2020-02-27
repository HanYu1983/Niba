// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Model extends cc.Component {

    getRobotStoreList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "robot_" + i, money: i * 200 });
        }
        cb(data);
    }

    getPilotStoreList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "pilot_" + i, money: i * 200 });
        }
        cb(data);
    }

    getRobotList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "robot_" + i, money: i * 200 });
        }
        cb(data);
    }

    getPilotList(pageId: number, count: number = 10, cb: (data: any[]) => void) {
        let data = [];
        for (let i = 0; i < 10; ++i) {
            data.push({ name: "pilot_" + i, money: i * 200 });
        }
        cb(data);
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
