// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { GameInst } from '../GameInst';
import { Instant } from '../lib/instanceViewer/Instant';
import * as ModelType from '../../../han/types'
const { ccclass, property } = _decorator;

@ccclass('MainPage')
export class MainPage extends GameInst {

    protected doCheckPage():ModelType.Page{
        return ModelType.Page.Start;
    }
}
