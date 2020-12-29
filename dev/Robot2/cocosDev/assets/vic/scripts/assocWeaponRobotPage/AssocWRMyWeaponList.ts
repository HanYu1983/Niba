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

@ccclass('AssocWRMyWeaponList')
export class AssocWRMyWeaponList extends BasicInstMenu {
    
    doBuild(content:any, data:any):void{
        const robots = content[0];
        content[0] = robots.map((id)=>{
            const weapon = Drawer.getWeapon(id, data);
            const robotId = Drawer.getRobotIDByWeaponID(weapon.ID, data);
            const robot = Drawer.getRobot(robotId, data);
            if(robot){
                return weapon.Title + "_" + robot.Title;
            }else{
                return weapon.Title + "_--";
            }
        });
        super.doBuild(content, data);
    }
}
