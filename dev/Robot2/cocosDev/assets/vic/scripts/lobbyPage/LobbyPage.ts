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

@ccclass('LobbyPage')
export class LobbyPage extends GameInst {

    protected checkData(data: any): any {
        const content = {
            Active: data.Actives[ModelType.Page.Lobby],
            Menus: data.Menus[ModelType.Page.Lobby],
            Focus: data.Focus[ModelType.Page.Lobby],
        }
        if (content.Active) {
            return content;
        }
        return null;
    }
}
