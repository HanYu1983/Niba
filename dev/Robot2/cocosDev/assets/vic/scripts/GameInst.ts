// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Instant } from './lib/instanceViewer/Instant';
import * as ModelType from '../../han/types'
const { ccclass, property } = _decorator;

@ccclass('GameInst')
export class GameInst extends Instant {

    protected checkData(data:any):any{
        const content = {
            Active: data.Actives[this.doCheckPage()],
            Menus: data.Menus[this.doCheckPage()],
            Focus: data.Focus[this.doCheckPage()],
        }
        if (content.Active) {
            return content;
        }
        return null;
    }

    protected doCheckPage():ModelType.Page{
        return ModelType.Page.Start;
    }
}
