// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, CCInteger, Enum } from 'cc';
import { Instant } from './lib/instanceViewer/Instant';
import * as ModelType from '../../han/types'
const { ccclass, property } = _decorator;

@ccclass('BasicPage')
export class BasicPage extends Instant {

    @property (CCInteger)
    pageId:number;

    protected checkData(data:any):any{
        const pageName = Object.values(ModelType.Const)[this.pageId];
        const content = {
            Active: data.Actives[pageName],
            Menus: data.Menus[pageName],
            Focus: data.Focus[pageName],
            GameplayPages:data.GameplayPages[pageName]
        }
        
        if (content.Active) {
            return content;
        }
        return null;
    }
}
