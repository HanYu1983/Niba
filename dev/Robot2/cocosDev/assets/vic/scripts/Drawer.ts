// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Instant } from './lib/instanceViewer/Instant';
import * as ModelType from '../../han/types';
const { ccclass, property } = _decorator;

@ccclass('Drawer')
export class Drawer extends Instant {

    static getBuyRobot(id:string, data:any):any{
        return data.Info.CanBuyRobots[id];
    }

    static getBuyPilot(id:string, data:any):any{
        return data.Info.CanBuyPilots[id];
    }

    static getBuyWeapon(id:string, data:any):any{
        return data.Info.CanBuyWeapons[id];
    }

    static getBuyComponent(id:string, data:any):any{
        return data.Info.CanBuyComponents[id];
    }

    static getRobot(id:string, data:any):any{
        return data.Info.Robots[id];
    }

    static getPilot(id:string, data:any):any{
        return data.Info.Pilots[id];
    }

    static getWeapon(id:string, data:any):any{
        return data.Info.Weapons[id];
    }

    static getComponent(id:string, data:any):any{
        return data.Info.Components[id];
    }

    static getMenuByPage(data:any, page:ModelType.Page, menuIndex:number = 0){
        const content = {
            Active: data.Actives[page],
            Menus: data.Menus[page],
            Focus: data.Focus[page],
        }
        if (content.Active) {
            if(data.Menu1Ds[content.Menus[menuIndex]]){
                const menu = data.Menu1Ds[content.Menus[menuIndex]].Info;
                return [
                    menu.Options, Array.from(menu.Options, x => 0), menu.Cursor
                ]
            }
        }
        return null;
    }
}
