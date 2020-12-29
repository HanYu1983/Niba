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

    @property ({type:Enum(ModelType.Page)})
    pageId:ModelType.Page = null;

    protected checkData(data:any):any{
        const content = {
            Active: data.Actives[this.pageId],
            Menus: data.Menus[this.pageId],
            Focus: data.Focus[this.pageId],
        }
        if (content.Active) {
            return content;
        }
        return null;
    }
}
