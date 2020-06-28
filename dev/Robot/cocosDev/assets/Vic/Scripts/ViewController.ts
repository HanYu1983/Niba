import View from "./View";
import ModelController from "../../Han/controller/ModelController";
import AudioController from "./AudioController";
import ImagesAssets from './ImagesAssets';
import Model from "./Model";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewController extends cc.Component {
    @property(View)
    view: View = null;

    @property(Model)
    model: Model = null;

    @property(ModelController)
    modelController: ModelController = null;

    @property(AudioController)
    audioController: AudioController = null;

    @property(ImagesAssets)
    imagesAssets: ImagesAssets = null;

    static instance: ViewController;

    onLoad() {
        this.modelController.setConsumer(this.view);
        this.model.setModelController(this.modelController);
        ViewController.instance = this;
    }

    start() {
        this.modelController.loadConfig(data => {
            this.setData(data)
            this.view.openMainPage();
            this.notifyStartLobby()
            // this.view.openGamePage();
        })
    }

    //#region helper
    // args example: 0_2
    // 第一個參數：0隨機副本；1陸副本；2海副本；3空副本
    // 第二個參數：難度：0~9
    notifyStartGame(args:any) {
        cc.log(args)
        this.modelController.endLobby();
        this.modelController.startGame(args);
    }

    notifyStartLobby() {
        this.modelController.startLobby();
    }

    private _data: any;

    setData(d) {
        this._data = d;
    }

    getData() {
        return this._data;
    }

    getWeapon(key: string): any {
        return this.getData().weapon[key];
    }
    getRobot(key: string): any {
        return this.getData().robot[key];
    }
    getPilot(key: string): any {
        return this.getData().pilot[key];
    }
    //#endregion


    //#region consumer
    /*
    playerTurnStart(data: any, cb: () => void) {
        this.view.playerTurnStart(data, cb)
    }
    enemyTurnStart(enemyName: any, cb: () => void) {
        this.view.enemyTurnStart(enemyName, cb)
    }
    unitMoveAnim(data: any, cb: () => void) {
        this.view.unitMoveAnim(data, cb)
    }
    unitTargetingAnim(data: any, cb: () => void) {
        this.view.unitTargetingAnim(data, cb);
    }
    unitBattleAnim(data: any, cb: () => void) {
        this.view.unitBattleAnim(data, cb)
    }
    unitDeadAnim(data: any, cb: () => void) {
        this.view.unitDeadAnim(data, cb)
    }
    unitSkyAnim(data: any, cb: () => void) {
        this.view.unitSkyAnim(data, cb)
    }
    unitGroundAnim(data: any, cb: () => void) {
        this.view.unitGroundAnim(data, cb)
    }
    unitGetAwardAnim(data: any, cb: () => void) {
        this.view.unitGetAwardAnim(data, cb)
    }
    showMessage(data: any, cb: () => void) {
        this.view.showMessage(data, cb)
    }
    paint(data: any, cb: () => void) {
        this.view.paint(data, cb)
    }
    */
    //#endregion
}
