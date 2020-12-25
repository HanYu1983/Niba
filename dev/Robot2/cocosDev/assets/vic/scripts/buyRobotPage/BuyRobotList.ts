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

@ccclass('BuyRobotList')
export class BuyRobotList extends BasicInstMenu {
    
    doBuild(content:any, data:any):void{
        const robots = content[0];
        content[0] = robots.map((id)=>{
            return Drawer.getBuyRobot(id, data).Title;
        });
        super.doBuild(content, data);
    }

    
}
