// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { GameInst } from '../GameInst';
import * as ModelType from '../../../han/types'
const { ccclass, property } = _decorator;

@ccclass('BuyComponentPage')
export class BuyComponentPage extends GameInst {
    
    protected doCheckPage():ModelType.Page{
        return ModelType.Page.BuyComponent;
    }
}
