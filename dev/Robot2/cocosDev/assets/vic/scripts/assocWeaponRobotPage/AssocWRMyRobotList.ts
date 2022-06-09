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

@ccclass('AssocWRMyRobotList')
export class AssocWRMyRobotList extends BasicInstMenu {
    
    doBuild(content:any, data:any):void{
        const robots = content[0];
        content[0] = robots.map((id)=>{
            const robot = Drawer.getRobot(id, data);      
            return [robot.Title, robot.Power, robot.MaxPower, robot.MaxHP, robot.MaxEN, robot.Armor, robot.BeamArmor].join("_")
        });
        super.doBuild(content, data);
    }
}
