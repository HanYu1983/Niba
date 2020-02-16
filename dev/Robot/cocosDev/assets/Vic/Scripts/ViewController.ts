import View from "./View";
import ModelController from "../../Han/controller/ModelController";
import AudioController from "./AudioController";
import ImagesAssets from './ImagesAssets';


const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewController extends cc.Component {
    @property(View)
    view: View = null;

    @property(ModelController)
    modelController: ModelController = null;

    @property(AudioController)
    audioController:AudioController = null;

    @property(ImagesAssets)
    imagesAssets:ImagesAssets = null;

    static instance: ViewController;

    private _data:any;

    getData(){
        return this._data;
    }

    getWeapon(key:string):any{
        return this.getData().weapon[key];
    }

    onLoad() {
        this.modelController.setView(this.view);
        ViewController.instance = this;
    }

    start() {
        this.modelController.loadConfig(data=>{
            this._data = data;
            this.view.openGamePage();
        })
    }

    notifyStartGame() {
        this.modelController.startGame();
    }
}
