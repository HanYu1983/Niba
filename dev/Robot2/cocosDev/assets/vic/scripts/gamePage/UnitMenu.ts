// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec3 } from 'cc';
import { Drawer } from '../Drawer';
import { InstMenu } from '../lib/instanceViewer/InstMenu';
import * as ModelType from './../../../han/types'
import { Grids } from './Grids';
const { ccclass, property } = _decorator;

@ccclass('UnitMenu')
export class UnitMenu extends InstMenu {

    protected checkData(data:any):any{
        return Drawer.getMenuByPage(data, ModelType.Const.PageUnitMenu, 0);
    }

    doBuild(content:any, data:any):void{
        const options = content[0].slice();
        const robotMenu = data.GameplayPages["10"].RobotMenu;
        for(let key in robotMenu.RowFunctionMapping){
            if(robotMenu.RowFunctionMapping[key] == ModelType.RobotMenuFunction.RobotMenuFunctionWeapon){
                const weaponIds = options[key];
                let weaponTitles = weaponIds.map((weaponId: string | number)=>{ return robotMenu.Weapons[weaponId].Title});
                options[key] = weaponTitles;
            }
        }
        content[0] = options;
        super.doBuild(content, data);
        
        if(Drawer.getBattleMenuInGame(data)){
            this.node.setPosition(new Vec3(-83,-2,0));
        }else{
            const cursor = data.GameplayPages["10"].Cursor;
            let gridPos = Drawer.getUnitMenuGroupPosition(cursor[0], cursor[1], 100, 0);
            this.node.setPosition(gridPos);
        }
        
    }
}
