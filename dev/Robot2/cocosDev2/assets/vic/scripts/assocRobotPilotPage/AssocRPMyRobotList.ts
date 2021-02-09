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

@ccclass('AssocRPMyRobotList')
export class AssocRPMyRobotList extends BasicInstMenu {
    
    doBuild(content:any, data:any):void{
        const robots = content[0];
        content[0] = robots.map((id)=>{
            const robot = Drawer.getRobot(id, data);
            const pilotId = Drawer.getPilotIDByRobotID(robot.ID, data);
            const pilot = Drawer.getPilot(pilotId, data);
            if(pilot){
                return robot.Title + "_" + pilot.Title;
            }else{
                return robot.Title + "_--";
            }
        });
        super.doBuild(content, data);
    }
}
