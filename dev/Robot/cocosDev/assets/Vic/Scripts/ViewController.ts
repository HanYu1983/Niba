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
            // this.view.openGamePage();
        })
    }

    //#region helper
    // args example: 0_2
    // 第一個參數：0隨機副本；1陸副本；2海副本；3空副本
    // 第二個參數：難度：0~9
    notifyStartGame(args:any) {
        this.modelController.startGame(args);
    }

    notifyStartLobby() {
        this.modelController.startLobby();
    }

    notifyEndLobby(){
        this.modelController.endLobby();
    }

    // 讀取gameplay
    notifyLoadGame(){
        this.modelController.loadGame()
    }

    // 清空記憶
    notifyNewGame(cb:()=>void){
        this.modelController.talk("newGame", null, cb)
    }

    // 判斷gameplay有沒有記憶可以讀取
    // 先呼叫這個判斷讀取按鈕能不能按
    notifyCheckLoadGameplay(cb:(v:boolean)=>void){
        this.modelController.talk("checkLoadGameplay", null, cb)
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
}
