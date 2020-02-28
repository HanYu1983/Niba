import ModelController from "../../Han/controller/ModelController";
import ViewController from "./ViewController";

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
    getRobotStoreList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.modelController.talk("getRobotStoreList", { offset: pageId * count, limit: count }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }

    getPilotStoreList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.modelController.talk("getPilotStoreList", { offset: pageId * count, limit: count }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }

    getRobotList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.modelController.talk("getRobotList", { offset: pageId * count, limit: count }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        })
    }

    getPilotList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.modelController.talk("getPilotList", { offset: pageId * count, limit: count }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }

    buyRobotById(robotKey: string, cb: (err: any, data: any) => void) {
        this.modelController.talk("buyRobotById", { key: robotKey }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }

    buyPilotById(pilotKey: string, cb: (err: any, data: any) => void) {
        this.modelController.talk("buyPilotById", { key: pilotKey }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }

    setRobotPilot(robotKey: string, pilotKey: string, cb: (err: any, data: any) => void) {
        this.modelController.talk("setRobotPilot", { robotKey: robotKey, pilotKey: pilotKey }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }
}
