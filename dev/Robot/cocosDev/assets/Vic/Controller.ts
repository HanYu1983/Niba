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
                case "setCursor":
                    {
                        const pos = args;
                        this.view.getGamePage().setCursor(pos);
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
                        this.view.onPlayerTurn();
                    }
                    break;
                // 敵方回合
                case "enemyTurn":
                    {
                        this.view.getGamePage().closeSceneMenu();
                        this.view.getGamePage().closeUnitMenu();
                        this.view.getGamePage().removeListenser();
                    }
                    break;
                /**
                 * 這由以上的指令不能回覆
                 */
                case "unitMove":
                    {
                        const[id, data] = args;
                        this.view.getGamePage().map.clearRange();
                        this.view.getGamePage().units.moveUnitByID(data.unit, data.path, ()=>{
                            this.notifyAnswer(id);
                        });
                    }
                    break;
                case "selectPosition":
                    {
                        const [id, pos] = args;
                        this.view.getGamePage().closeUnitMenu();
                        this.view.getGamePage().addListener();
                        this.view.getGamePage().node.on(GamePage.ON_GAMEPAGE_ENTER, (corsor) => {
                            this.notifyAnswer(id, corsor);
                        }, this);
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
                            this.view.onPlayerTurn();
                        }).bind(this));
                    }
                    break;
                case "enemyTurnStart":
                    {
                        const [id] = args;
                        this.view.getGamePage().openTurnStart(false, (() => {
                            this.notifyAnswer(id);
                        }).bind(this));

                        this.view.getGamePage().closeSceneMenu();
                        this.view.getGamePage().closeUnitMenu();
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
                        const [id, menu] = args;
                        this.view.getGamePage().openUnitMenu(menu, ((key) => {
                            this.notifyAnswer(id, key);
                        }).bind(this));

                        this.view.getGamePage().removeListenser();
                    }
                    break;
                case "createUnits":
                    {
                        const [id, units] = args;
                        this.view.getGamePage().units.setUnits(units);
                        this.notifyModel("ok", id, 0);
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

    notifySetCursor(pos: number[]) {
        this.notifyCmd("setCursor", pos);
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
