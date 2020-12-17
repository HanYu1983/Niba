// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, CCInteger } from 'cc';
import { GamePage } from './gamePage/GamePage';
import { View } from './lib/View';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {

    @property(View)
    view:View = null;

    @property(CCInteger)
    startPage:number = 0;

    start () {
        this.view.openByIndex(this.startPage);
    }
}
