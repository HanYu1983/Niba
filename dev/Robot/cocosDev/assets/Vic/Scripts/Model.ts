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

    //#region getList
    getList(cmd:string, pageId: number, count: number = 10, cb: (err: any, data: any[]) => void){
        this.modelController.talk(cmd, { offset: pageId * count, limit: count }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }


    getWeaponStoreList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.getList("getWeaponStoreList", pageId, count, cb);
    }

    getComponentStoreList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.getList("getComponentStoreList", pageId, count, cb);
    }

    getRobotStoreList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.getList("getRobotStoreList", pageId, count, cb);
    }

    getPilotStoreList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.getList("getPilotStoreList", pageId, count, cb);
    }

    getComponentList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.getList("getComponentList", pageId, count, cb);
    }

    getWeaponList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.getList("getWeaponList", pageId, count, cb);
    }

    getRobotList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.getList("getRobotList", pageId, count, cb);
    }

    getPilotList(pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        this.getList("getPilotList", pageId, count, cb);
    }

    getRobotComponentList(robotKey:string, pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        cb(null, [["",{title:"a"}],["",{title:"b"}]]);
    }

    getRobotWeaponList(robotKey:string, pageId: number, count: number = 10, cb: (err: any, data: any[]) => void) {
        cb(null, [["",{title:"a"}],["",{title:"b"}]]);
    }

    //#endregion

    //#region buy item
    buyItemById(cmd:string, componentKey: string, cb: (err: any, data: any) => void){
        this.modelController.talk(cmd, { key: componentKey }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }

    buyComponentById(componentKey: string, cb: (err: any, data: any) => void) {
        this.buyItemById("buyComponentById", componentKey, cb);
    }

    buyWeaponById(weaponKey: string, cb: (err: any, data: any) => void) {
        this.buyItemById("buyWeaponById", weaponKey, cb);
    }

    buyRobotById(robotKey: string, cb: (err: any, data: any) => void) {
        this.buyItemById("buyRobotById", robotKey, cb);
    }

    buyPilotById(pilotKey: string, cb: (err: any, data: any) => void) {
        this.buyItemById("buyPilotById", pilotKey, cb);
    }
    //#endregion

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

    removeUnitComponent(robotKey:string, componentKey:string, cb:(err:any, data:any) => void ){
        this.modelController.talk("removeRobotComponent", { robotKey: robotKey, componentKey: componentKey }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }

    addUnitComponent(robotKey:string, componentKey:string, cb:(err:any, data:any) => void ){
        this.modelController.talk("addRobotComponent", { robotKey: robotKey, componentKey: componentKey }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }

    removeUnitWeapon(robotKey:string, weaponKey:string, cb:(err:any, data:any) => void ){
        cc.log("removeUnitWeapon", robotKey, weaponKey);
        this.modelController.talk("removeRobotWeapon", { robotKey: robotKey, weaponKey: weaponKey }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }

    addUnitWeapon(robotKey:string, weaponKey:string, cb:(err:any, data:any) => void ){
        cc.log("removeUnitWeapon", robotKey, weaponKey);
        this.modelController.talk("addRobotWeapon", { robotKey: robotKey, weaponKey: weaponKey }, answer => {
            const [err, info] = answer;
            if (err) {
                ViewController.instance.view.getCommentUI().showAlert(err);
            } else {
                cb(err, info);
            }
        });
    }
}
