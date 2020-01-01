import IViewController from "../Han/IViewController";
import IModel from "../Han/interface/IModel";
import ModelController from "../Han/ModelController";
import View from "./View";
import GamePage from "./Page/GamePage";
import Helper from "../Han/Helper";
import IUnit from "../Han/IUnit";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component implements IViewController {
    onPrepareForStart(callback: () => void): void {
        this.getModel().pushState("default", 0);
        this.refreshGameMap(callback);
    }

    @property(View)
    view: View = null;

    @property(ModelController)
    modelController: ModelController = null;

    static instance: NewClass;

    private _model: IModel;

    onLoad() {
        this.modelController.setViewController(this);
        NewClass.instance = this;
    }

    start() {
        this.view.openGamePage();
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
            this.getModel().pushState("unitMenu", 0);
        } else {
            this.getModel().pushState("sceneMenu", 0);
        }
    }

    onGamePageESCAPEClick() {
        this.getModel().popState();
    }


    setCursor(cursor) {
        this.getModel().setCursor(cursor, (newCursor) => {
            this.refreshCursor();
        });
    }

    setCamera(camera) {
        this.getModel().setCamera(camera, (newCamera) => {
            this.refreshGameMap();
        });
    }

    refreshCursor() {
        let global = Helper.projectPosition(this.getModel().getCamera(), this.getModel().getCursor());
        this.view.getGamePage().setCursor(global);

        if ( !this.getModel().getState() || this.getModel().getState() == "default") {
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
    }

    refreshGameMap(callback?: () => void) {
        // 不支援同時呼叫多個callback, 只能順序呼叫
        this._model.getLocalMap(map => {

            // 顯示地圖
            this.view.getGamePage().map.setMap(map);

            // 取得當前地圖的單位
            this._model.getUnitsByRegion(units => {

                // 取得單位的投影
                units = Helper.projectUnits(this._model.getCamera(), units);

                // 顯示單位
                this.view.getGamePage().units.setUnits(units);

                this.refreshCursor();

                if (callback) callback();
            })
        })
    }

    setModel(model: IModel): void {
        this._model = model;
    }

    getModel() {
        return this._model;
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

    onPlayerTurn() {
        this.closeAllMenu();
        this.view.getGamePage().map.clearRange();
        this.view.getGamePage().addListener();
    }

    removeGamePageExtraListener() {
        this.view.getGamePage().node.off(GamePage.ON_GAMEPAGE_ENTER);
        this.view.getGamePage().node.off(GamePage.ON_GAMEPAGE_ESCAPE);
    }

    closeAllMenu() {
        this.view.getGamePage().closeSceneMenu();
        this.view.getGamePage().closeUnitMenu();
    }

    notifyStartGame() {
        this._model.gameStart();
    }

    private _getUnitOnCursor(): IUnit {
        return Helper.checkIsUnit(this.getModel().getUnits(), this.getModel().getCursor());
    }
}
