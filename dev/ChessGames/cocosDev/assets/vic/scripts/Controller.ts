// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

enum GameType {
    ChineseXiangQi
}

import { _decorator, Component, Node } from 'cc';
import { View } from '../lib/View';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {

    @property(View)
    public view:View = null;

    start () {
        // Your initialization goes here.

        this.view.openByIndex(0);
    }

    onMainPageChineseXiangQiClick(){
        this.view.openByIndex(1, GameType.ChineseXiangQi);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
