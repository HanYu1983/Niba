// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import View from "./View"
import GamePage from "./page/GamePage";
import IViewController from "../Han/IViewController";
import IModel from "../Han/IModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component implements IModel {

    // static instance: NewClass;
    // start() {
    //     NewClass.instance = this;
    //     this.bindModel();
    // }

    seqId: number = 0;
    viewNotifyOb: { next: (args: any) => void };
    viewOb: { subscribe: (args: any) => { unsubscribe: () => void } };

    talk(q: string, args: any, callback: (answer: any) => void) {
        const id = this.seqId++;
        this.viewNotifyOb.next([q, [id + "", args]]);
        const sub = this.viewOb.subscribe(e => {
            const [cmd, args] = e;
            if (cmd == "ok") {
                const [resId, resArgs] = args;
                if (resId == id) {
                    sub.unsubscribe();
                    callback(resArgs);
                } else {
                    console.log("[talk][wait]" + q);
                }
            }
        })
    }

    bindModel() {
        window.startApp();
        this.viewNotifyOb = window.viewNotifyOb;
        this.viewOb = window.viewOb;
    }

    pushState(state: string, save: any, callback: () => void) {
        this.talk("pushState", [state, save], callback);
    }

    popState(callback: () => void) {
        this.talk("popState", 0, callback);
    }

    viewController: IViewController;

    setViewController(ctr: IViewController) {
        this.bindModel();
        this.viewController = ctr;
        ctr.setModel(this);
        this.viewOb.subscribe(e => {
            const [cmd, args] = e;
            switch (cmd) {
                case "onStateChange":
                    {
                        const [state, data] = e;
                        this.viewController.onStateChange(state, data);
                    }
                    break;
                case "playerTurnStart":
                    {
                        const [id] = args;
                        this.viewController.onPlayerTurnStart(() => {
                            this.viewNotifyOb.next(["ok", [id, 0]]);
                        })
                    }
                    break;
                case "enemyTurnStart":
                    {
                        const [id, ai] = args;
                        this.viewController.onEnemyTurnStart(ai, () => {
                            this.viewNotifyOb.next([cmd, [id, 0]]);
                        })
                    }
                    break;
            }
        })
        this.notifyCmd("startGameplay");
    }

    // start2() {
    //     NewClass.instance = this;

    //     window.startApp();
    //     window.viewOb.subscribe(e => {
    //         //this.removeGamePageExtraListener();

    //         const [cmd, args] = e;
    //         switch (cmd) {
    //             case "setCamera":
    //                 {
    //                     const pos = args;
    //                     this.view.getGamePage().setCamera(pos);
    //                 }
    //                 break;
    //             case "setCursor":
    //                 {
    //                     const pos = args;
    //                     this.view.getGamePage().setCursor(pos);

    //                     this.view.getGamePage().units.shakeOneUnit("G__2");
    //                     this.view.getGamePage().effects.createExplode(3000, [10, 5]);
    //                     //this.view.getGamePage().effects.createBlade(3000, [10,5]);
    //                 }
    //                 break;
    //             case "unitState":
    //                 {
    //                     this.view.getGamePage().openUnitStatuMenu();
    //                 }
    //                 break;
    //             // 進入gameplay
    //             case "gameplayLoop":
    //                 {

    //                 }
    //                 break;
    //             // 玩家回合
    //             case "playerTurn":
    //                 {
    //                     this.onPlayerTurn();
    //                 }
    //                 break;
    //             // 敵方回合
    //             case "enemyTurn":
    //                 {
    //                     this.closeAllMenu();
    //                     this.view.getGamePage().removeListenser();
    //                 }
    //                 break;
    //             /**
    //              * 這以上的指令不能回覆
    //              */
    //             case "battleMenu":
    //                 {
    //                     const [id, data] = args;
    //                     this.notifyAnswer(id);
    //                 }
    //                 break;
    //             case "selectSingleUnit":
    //                 {
    //                     const [id, data] = args;
    //                     this.notifyAnswer(id);
    //                 }
    //                 break;
    //             case "unitMove":
    //                 {
    //                     const [id, data] = args;
    //                     this.closeAllMenu();
    //                     // this.view.getGamePage().map.clearRange();
    //                     this.view.getGamePage().units.moveUnitByID(data.unit, data.path, () => {
    //                         this.notifyAnswer(id);
    //                     });
    //                 }
    //                 break;
    //             case "selectPosition":
    //                 {
    //                     const [id, pos] = args;
    //                     this.closeAllMenu();
    //                     this.view.getGamePage().addListener();
    //                     this.view.getGamePage().node.on(GamePage.ON_GAMEPAGE_ENTER, (corsor) => {
    //                         this.notifyAnswer(id, corsor);
    //                     });
    //                     this.view.getGamePage().node.on(GamePage.ON_GAMEPAGE_ESCAPE, (corsor) => {
    //                         this.notifyCmd("cancel");
    //                     });
    //                 }
    //                 break;
    //             case "setMap":
    //                 {
    //                     const map = args;
    //                     this.view.getGamePage().map.setMap(map);
    //                 }
    //                 break;
    //             case "setUnitPosition":
    //                 {
    //                     const { unit, position } = args;
    //                     this.view.getGamePage().units.setUnitPos(unit, position);
    //                 }
    //                 break;
    //             case "setMoveRange":
    //                 {
    //                     this.view.getGamePage().map.showMovableGrid(args);
    //                 }
    //                 break;
    //             case "playerTurnStart":
    //                 {
    //                     const [id] = args;
    //                     this.view.getGamePage().openTurnStart(true, (() => {
    //                         this.notifyAnswer(id);
    //                         this.onPlayerTurn();
    //                     }).bind(this));
    //                 }
    //                 break;
    //             case "enemyTurnStart":
    //                 {
    //                     const [id] = args;
    //                     this.view.getGamePage().openTurnStart(false, (() => {
    //                         this.notifyAnswer(id);
    //                     }).bind(this));

    //                     this.closeAllMenu();
    //                     this.view.getGamePage().removeListenser();
    //                 }
    //                 break;
    //             // 系統選單
    //             case "systemMenu":
    //                 {
    //                     const [id, menu] = args;
    //                     this.view.getGamePage().openSceneMenu(menu, ((key) => {
    //                         this.notifyAnswer(id, key);
    //                     }).bind(this));

    //                     this.view.getGamePage().removeListenser();
    //                 }
    //                 break;
    //             // 機體動作選單
    //             case "unitMenu":
    //                 {
    //                     const [id, menus] = args;
    //                     this.view.getGamePage().openUnitMenu(menus, ((key) => {
    //                         this.notifyAnswer(id, key);
    //                     }).bind(this));

    //                     this.view.getGamePage().removeListenser();
    //                 }
    //                 break;
    //             case "createUnits":
    //                 {
    //                     const [id, units] = args;
    //                     this.view.getGamePage().units.setUnits(units);
    //                     this.notifyAnswer(id);
    //                 }
    //                 break;
    //             case "createMap":
    //                 {
    //                     const [id, map] = args;
    //                     this.view.getGamePage().map.setMap(map);
    //                     this.notifyAnswer(id);
    //                 }
    //                 break;
    //         }
    //     })
    // }

    // removeGamePageExtraListener() {
    //     this.view.getGamePage().node.off(GamePage.ON_GAMEPAGE_ENTER);
    //     this.view.getGamePage().node.off(GamePage.ON_GAMEPAGE_ESCAPE);
    // }

    // closeAllMenu() {
    //     this.view.getGamePage().closeSceneMenu();
    //     this.view.getGamePage().closeUnitMenu();
    // }

    // onPlayerTurn() {
    //     this.closeAllMenu();
    //     this.view.getGamePage().map.clearRange();
    //     this.view.getGamePage().addListener();
    //     this.view.getGamePage().node.on(GamePage.ON_GAMEPAGE_ENTER, (corsor) => {
    //         this.notifySelectMap(corsor);
    //     });
    // }

    notifySetCursor(pos: number[]) {
        this.notifyCmd("setCursor", pos);
    }

    notifySetCamera(pos: number[]) {
        this.notifyCmd("setCamera", pos);
    }

    notifyStartGame() {
        //this.notifyCmd("startGameplay");
    }

    notifyAnswer(id, args = 0) {
        this.notifyModel("ok", id, args);
    }

    notifySelectMap(pos: number[]) {
        this.notifyCmd("selectMap", pos);
    }

    notifyModel(cmd: string, id: number, data: any) {
        window.viewNotifyOb.next([cmd, [id, data]]);
    }

    notifyCmd(cmd: string, data: any = undefined) {
        window.viewNotifyOb.next([cmd, data]);
    }
}
