// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Drawer } from '../Drawer';
import { InstMenu } from '../lib/instanceViewer/InstMenu';
import * as ModelType from './../../../han/types'
const { ccclass, property } = _decorator;

@ccclass('UnitMenu')
export class UnitMenu extends InstMenu {

    protected checkData(data:any):any{
        return Drawer.getMenuByPage(data, ModelType.Const.PageUnitMenu, 0);
    }

    doBuild(content:any, data:any):void{
        const options = content[0];
        const robotMenu = data.GameplayPages["10"].RobotMenu;
        for(let i = 0; i < options.length; ++i){
            if(robotMenu.RowFunctionMapping[i] == ModelType.RobotMenuFunction.RobotMenuFunctionWeapon){
                let weaponIds = options[i];
                weaponIds = weaponIds.map((weaponId: string | number)=>{ return robotMenu.Weapons[weaponId].Title});
                options[i] = weaponIds;
            }
        }
        super.doBuild(content, data);
    }
}
