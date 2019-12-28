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

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(View)
    view: View = null;

    static instance: NewClass;

    start() {
        NewClass.instance = this;

        window.startApp();
        window.viewOb.subscribe(e => {
            const [cmd, args] = e;
            switch (cmd) {
                case "setCamera":
                    {
                        const pos = args;
                        this.view.getGamePage().setCamera(pos);
                    }
                    break;
                case "setCursor":
                    {
                        const pos = args;
                        this.view.getGamePage().setCursor(pos);

                        this.view.getGamePage().units.shakeOneUnit("G__2");
                        this.view.getGamePage().effects.createExplode(3000, [10, 5]);
                        //this.view.getGamePage().effects.createBlade(3000, [10,5]);
                    }
                    break;
                case "unitState":
                    {
                        this.view.getGamePage().openUnitStatuMenu();
                    }
                    break;
                // 進入gameplay
                case "gameplayLoop":
                    {

                    }
                    break;
                // 玩家回合
                case "playerTurn":
                    {
                        this.onPlayerTurn();
                    }
                    break;
                // 敵方回合
                case "enemyTurn":
                    {
                        this.closeAllMenu();
                        this.view.getGamePage().removeListenser();
                    }
                    break;
                /**
                 * 這以上的指令不能回覆
                 */
                case "unitMove":
                    {
                        const [id, data] = args;
                        this.closeAllMenu();
                        this.view.getGamePage().map.clearRange();
                        this.view.getGamePage().units.moveUnitByID(data.unit, data.path, () => {
                            this.notifyAnswer(id);
                        });
                    }
                    break;
                case "selectPosition":
                    {
                        const [id, pos] = args;
                        this.closeAllMenu();
                        this.view.getGamePage().addListener();
                        this.view.getGamePage().node.on(GamePage.ON_GAMEPAGE_ENTER, (corsor) => {
                            this.notifyAnswer(id, corsor);
                        }, this);
                    }
                    break;
                case "setMap":
                    {
                        const map = args;
                        this.view.getGamePage().map.setMap(map);
                    }
                    break;
                case "setUnitPosition":
                    {
                        const {unit, position} = args;
                        this.view.getGamePage().units.setUnitPos(unit, position);
                    }
                    break;
                case "setMoveRange":
                    {
                        this.view.getGamePage().showMovableGrid(args);
                    }
                    break;
                case "playerTurnStart":
                    {
                        const [id] = args;
                        this.view.getGamePage().openTurnStart(true, (() => {
                            this.notifyAnswer(id);
                            this.onPlayerTurn();
                        }).bind(this));
                    }
                    break;
                case "enemyTurnStart":
                    {
                        const [id] = args;
                        this.view.getGamePage().openTurnStart(false, (() => {
                            this.notifyAnswer(id);
                        }).bind(this));

                        this.closeAllMenu();
                        this.view.getGamePage().removeListenser();
                    }
                    break;
                // 系統選單
                case "systemMenu":
                    {
                        const [id, menu] = args;
                        this.view.getGamePage().openSceneMenu(menu, ((key) => {
                            this.notifyAnswer(id, key);
                        }).bind(this));

                        this.view.getGamePage().removeListenser();
                    }
                    break;
                // 機體動作選單
                case "unitMenu":
                    {
                        const [id, menus] = args;
                        this.view.getGamePage().openUnitMenu(menus, ((key) => {
                            this.notifyAnswer(id, key);
                        }).bind(this));

                        this.view.getGamePage().removeListenser();
                    }
                    break;
                case "createUnits":
                    {
                        const [id, units] = args;
                        this.view.getGamePage().units.setUnits(units);
                        this.notifyAnswer(id);
                    }
                    break;
                case "createMap":
                    {
                        const [id, map] = args;
                        this.view.getGamePage().map.setMap(map);
                        this.notifyAnswer(id);
                    }
                    break;
            }
        })
    }

    closeAllMenu() {
        this.view.getGamePage().closeSceneMenu();
        this.view.getGamePage().closeUnitMenu();
    }

    onPlayerTurn() {
        this.closeAllMenu();
        this.view.getGamePage().map.clearRange();
        this.view.getGamePage().addListener();
        this.view.getGamePage().node.on(GamePage.ON_GAMEPAGE_ENTER, (corsor) => {
            this.notifySelectMap(corsor);
        }, this);
    }

    notifySetCursor(pos: number[]) {
        this.notifyCmd("setCursor", pos);
    }

    notifySetCamera(pos: number[]) {
        this.notifyCmd("setCamera", pos);
    }

    notifyStartGame() {
        this.notifyCmd("startGameplay");
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
