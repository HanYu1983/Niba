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
    model:Model = null;

    @property(ModelController)
    modelController: ModelController = null;

    @property(AudioController)
    audioController:AudioController = null;

    @property(ImagesAssets)
    imagesAssets:ImagesAssets = null;

    static instance: ViewController;

    onLoad() {
        this.modelController.setConsumer(this);
        this.model.setModelController(this.modelController);
        ViewController.instance = this;
    }

    start() {
        this.modelController.loadConfig(data=>{
            this.setData(data)
            this.view.openMainPage();
            // this.view.openGamePage();
        })
    }

    //#region helper
    notifyStartGame() {
        this.modelController.startGame();
    }

    notifyStartLobby() {
        this.modelController.startLobby();
    }
    
    private _data:any;

    setData(d){
        this._data = d;
    }

    getData(){
        return this._data;
    }

    getWeapon(key:string):any{
        return this.getData().weapon[key];
    }
    //#endregion


    //#region consumer
    playerTurnStart(data: any, cb: () => void) {
        this.view.playerTurnStart(data, cb)
    }
    enemyTurnStart(enemyName: any, cb: () => void) {
        this.view.enemyTurnStart(enemyName, cb)
    }
    unitMoveAnim(data: any, cb: () => void) {
        this.view.unitMoveAnim(data, cb)
    }
    unitBattleAnim(data: any, cb: () => void) {
        this.view.unitBattleAnim(data, cb)
    }
    unitDeadAnim(data: any, cb: ()=>void){
        this.view.unitDeadAnim(data, cb)
    }
    unitSkyAnim(data: any, cb: ()=>void){
        this.view.unitSkyAnim(data, cb)
    }
    unitGroundAnim(data: any, cb: ()=>void){
        this.view.unitGroundAnim(data, cb)
    }
    showMessage(data: any, cb: ()=>void){
        this.view.showMessage(data, cb)
    }
    paint(data: any, cb: () => void) {
        this.view.paint(data, cb)
    }
    //#endregion
}
