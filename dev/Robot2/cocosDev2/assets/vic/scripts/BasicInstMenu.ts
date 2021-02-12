// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, CCInteger, Enum } from 'cc';
import { InstMenu } from './lib/instanceViewer/InstMenu';
import * as ModelType from '../../han/types'
import { Drawer } from './Drawer';
const { ccclass, property } = _decorator;

@ccclass('BasicInstMenu')
export class BasicInstMenu extends InstMenu {

    @property({type:Enum(ModelType.Const)})
    pageId:ModelType.Const = 0;

    @property(CCInteger)
    menuIndex:number = 0;

    protected checkData(data:any):any{
        return Drawer.getMenuByPage(data, this.pageId, this.menuIndex);
    }
}