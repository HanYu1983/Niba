// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator } from 'cc';
import { BasicInstMenu } from '../BasicInstMenu';
import { Drawer } from '../Drawer';
const { ccclass } = _decorator;

@ccclass('BuyWeaponList')
export class BuyWeaponList extends BasicInstMenu {
    
    doBuild(content:any, data:any):void{
        const weapons = content[0];
        content[0] = weapons.map((id)=>{
            const weapon = Drawer.getBuyWeapon(id, data);
            const title = weapon.Title;
            const money = weapon.Cost;
            return title + "_" + money;
        });
        super.doBuild(content, data);
    }

    
}
