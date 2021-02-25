// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Color } from 'cc';
import { Instant } from './lib/instanceViewer/Instant';
import * as ModelType from '../../han/types';
import { Grids } from './gamePage/Grids';
const { ccclass, property } = _decorator;

@ccclass('Drawer')
export class Drawer extends Instant {

    @property(Color)
    playerColors:Color[] = [];

    static staticPlayerColors:Color[] = [];

    onLoad(){
        Drawer.staticPlayerColors = this.playerColors;
    }

    getPageByName(name:string){
        for(let i = 0; i < this.childs.length; ++i){
            const child = this.childs[i];
            if(child.name == name) return child;
        }
        return null;
    }

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

    static getPilotIDByRobotID(robot:string, data:any):any{
        return data.Info.PilotIDByRobotID[robot];
    }

    static getRobotIDByWeaponID(weapon:string, data:any):any{
        return data.Info.RobotIDByWeaponID[weapon];
    }

    static getRobotIDByComponentID(component:string, data:any):any{
        return data.Info.RobotIDByComponentID[component];
    }
    
    static getMenuByPage(data:any, page:ModelType.Const, menuIndex:number = 0){
        const content = {
            Active: data.Actives[page],
            Menus: data.Menus[page],
        }
        if (content.Active) {
            if(data.Menu1Ds[content.Menus[menuIndex]]){
                const menu = data.Menu1Ds[content.Menus[menuIndex]];
                return [
                    menu.Options, Array.from(menu.Options, x => 0), menu.Cursor
                ];
            }
            if(data.Menu2Ds[content.Menus[menuIndex]]){
                const menu = data.Menu2Ds[content.Menus[menuIndex]];
                return [
                    menu.Options, menu.Cursor2, menu.Cursor1
                ];
            }
        }
        return null;
    }

    static getBattleMenuInGame(data:any, menuIndex:number = 0){
        const content = {
            Active: data.Actives[ModelType.Const.PageBattleMenu],
            Menus: data.Menus[ModelType.Const.PageBattleMenu],
        }
        if (content.Active) {
            if(data.BattleMenus[content.Menus[menuIndex]]){
                const menu = data.BattleMenus[content.Menus[menuIndex]];
                return menu;
            }
        }
        return null;
    }

    static getMenuSelectByPage(data:any, page:ModelType.Const, menuIndex:number, id:number){
        const content = {
            Active: data.Actives[page],
            Menus: data.Menus[page],
        }
        if (content.Active) {
            if(data.Menu1Ds[content.Menus[menuIndex]]){
                const menu = data.Menu1Ds[content.Menus[menuIndex]];
                return menu.Selection[id];
            }
        }
        return false;    
    }

    static getFocusByPage(data:any, page:ModelType.Const){
        const content = {
            Active: data.Actives[page],
            Menus: data.Menus[page],
            Focus: data.Focus[page],
        }
        if (content.Active) {
            return [
                Array.from(content.Menus, x => ""), Array.from(content.Menus, x => 0), content.Focus
            ]
        }
        return null;
    }

    static getUnitMenuGroupPosition(x:number, y:number, offsetX:number = 0, offsetY:number = 0){
        let gridPos = Grids.getGridPos(x, y);
        gridPos.x += offsetX;
        gridPos.y += offsetY;
        if(x > 9)  gridPos.x -= (x - 9) * 32;
        if(y > 9)  gridPos.y += (y - 9) * 32;
        return gridPos;
    }
}
