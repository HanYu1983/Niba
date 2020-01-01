import Helper from "../controller/Helper";
import IUnit from "../interface/IUnit";
import View from "../../Vic/View";
import StackViewControler from "./StackViewController";
import EmptyViewController from "./EmptyViewController";
import UnitMenuViewController from "./UnitMenuViewController";
import SceneMenuViewController from "./SceneMenuViewController";

export default class DefaultViewController extends EmptyViewController {
    private view: View;
    private stackMgr: StackViewControler;

    constructor(view: View, stackMgr: StackViewControler) {
        super();
        this.view = view;
        this.stackMgr = stackMgr;
    }

    onPrepareForStart(callback: () => void): void {
        this.refreshGameMap(callback);
    }

    onGamePageWClick() {
        let cursor = this.getModel().getCursor();
        cursor[1] -= 1;
        this.setCursor(cursor);
    }

    onGamePageAClick() {
        let cursor = this.getModel().getCursor();
        cursor[0] -= 1;
        this.setCursor(cursor);
    }

    onGamePageSClick() {
        let cursor = this.getModel().getCursor();
        cursor[1] += 1;
        this.setCursor(cursor);
    }

    onGamePageDClick() {
        let cursor = this.getModel().getCursor();
        cursor[0] += 1;
        this.setCursor(cursor);
    }

    onGamePageUPClick() {
        let camera = this.getModel().getCamera();
        camera[1] -= 1;
        this.setCamera(camera);
    }

    onGamePageDOWNClick() {
        let camera = this.getModel().getCamera();
        camera[1] += 1;
        this.setCamera(camera);
    }

    onGamePageLEFTClick() {
        let camera = this.getModel().getCamera();
        camera[0] -= 1;
        this.setCamera(camera);
    }

    onGamePageRIGHTClick() {
        let camera = this.getModel().getCamera();
        camera[0] += 1;
        this.setCamera(camera);
    }

    onGamePageENTERClick() {
        let isUnit: IUnit = this._getUnitOnCursor();
        if (isUnit) {
            // 打開單位選單
            let unit: IUnit = this._getUnitOnCursor();
            this.stackMgr.push(new UnitMenuViewController(this.view, this.stackMgr, unit));
        } else {
            this.stackMgr.push(new SceneMenuViewController(this.view, this.stackMgr));
        }
    }

    onGamePageESCAPEClick() {
        //this.getModel().popState();
    }

    onPlayerTurnStart(callback: () => void): void {
        this.view.getGamePage().openTurnStart(true, () => {
            this.onPlayerTurn();
            callback();
        });
    }

    onEnemyTurnStart(ai: string, callback: () => void): void {
        this.view.getGamePage().openTurnStart(false, callback);

        this.closeAllMenu();
        this.view.getGamePage().removeListenser();
    }

    onStateChange(state: string, data: any): void {
        switch (state) {
            case "default":
                {
                    // 打開地圖監聽
                    this.view.getGamePage().addListener();
                }
                break;
            case "unitMove":
                {
                    this.view.getGamePage().addListener();
                }
                break;
            case "unitMenu":
                {
                    // 關掉地圖監聽
                    this.view.getGamePage().removeListenser();

                    // 打開單位選單
                    let unit: IUnit = this._getUnitOnCursor();
                    this.getModel().getUnitMenu(unit.key, (info) => {
                        cc.log(info);
                        this.view.getGamePage().openUnitMenu(info, (key) => {
                            cc.log(key);

                            switch (key) {
                                case "move":
                                    this.getModel().pushState("unitMove", 0);
                                    this.view.getGamePage().closeUnitMenu();
                                    break;
                                case "cancel":
                                    this.getModel().popState();
                                    this.view.getGamePage().closeUnitMenu();
                                    break;
                                default:
                                    break;
                            }
                        });
                    });
                }
                break;
            case "sceneMenu":
                {
                    //data = data || {}

                    // 關掉地圖監聽
                    this.view.getGamePage().removeListenser();

                    // 打開地圖選單
                    this.view.getGamePage().openSceneMenu(['endTurn', 'cancel'], (key) => {
                        switch (key) {
                            case "endTurn":
                                {
                                    this.getModel().endTurn();
                                    this.view.getGamePage().removeListenser();
                                }
                                break;
                            case "cancel":
                                this.getModel().popState();
                                this.view.getGamePage().closeSceneMenu();
                                break;
                        }
                    });
                }
                break;
        }
    }

    notifyStartGame() {
        this.getModel().gameStart();
    }

    private setCamera(camera) {
        this.getModel().setCamera(camera, (newCamera) => {
            this.refreshGameMap();
        });
    }

    private setCursor(cursor) {
        this.getModel().setCursor(cursor, (newCursor) => {
            this.refreshCursor();
        });
    }

    private refreshCursor() {
        let global = Helper.projectPosition(this.getModel().getCamera(), this.getModel().getCursor());
        this.view.getGamePage().setCursor(global);

        let unit: IUnit = this._getUnitOnCursor();
        if (unit) {
            this.getModel().getUnitNormalState(unit.key, (info) => {
                let moveRange = info.moveRange;
                this.view.getGamePage().map.showMovableGrid(moveRange);
            });
        } else {
            this.view.getGamePage().map.clearRange();
        }
    }

    private refreshGameMap(callback?: () => void) {
        // 不支援同時呼叫多個callback, 只能順序呼叫
        this.getModel().getLocalMap(map => {

            // 顯示地圖
            this.view.getGamePage().map.setMap(map);

            // 取得當前地圖的單位
            this.getModel().getUnitsByRegion(units => {

                // 取得單位的投影
                units = Helper.projectUnits(this.getModel().getCamera(), units);

                // 顯示單位
                this.view.getGamePage().units.setUnits(units);

                this.refreshCursor();

                if (callback) callback();
            })
        })
    }

    private onPlayerTurn() {
        this.closeAllMenu();
        this.view.getGamePage().map.clearRange();
        this.view.getGamePage().addListener();
    }

    private closeAllMenu() {
        this.view.getGamePage().closeSceneMenu();
        this.view.getGamePage().closeUnitMenu();
    }

    private _getUnitOnCursor(): IUnit {
        return Helper.checkIsUnit(this.getModel().getUnits(), this.getModel().getCursor());
    }


}