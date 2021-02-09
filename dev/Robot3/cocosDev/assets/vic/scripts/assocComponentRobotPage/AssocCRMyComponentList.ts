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

@ccclass('AssocCRMyComponentList')
export class AssocCRMyComponentList extends BasicInstMenu {
    
    doBuild(content:any, data:any):void{
        const components = content[0];
        content[0] = components.map((id)=>{
            const component = Drawer.getComponent(id, data);
            const robotId = Drawer.getRobotIDByComponentID(component.ID, data);
            const robot = Drawer.getRobot(robotId, data);
            if(robot){
                return component.Title + "_" + robot.Title;
            }else{
                return component.Title + "_--";
            }
        });
        super.doBuild(content, data);
    }
}
