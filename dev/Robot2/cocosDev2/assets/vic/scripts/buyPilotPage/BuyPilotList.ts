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

@ccclass('BuyPilotList')
export class BuyPilotList extends BasicInstMenu {
    
    doBuild(content:any, data:any):void{
        const pilots = content[0];
        content[0] = pilots.map((id)=>{
            const pilot = Drawer.getBuyPilot(id, data);
            const title = pilot.Title;
            const money = pilot.Cost;
            return title + "_" + money;
        });
        super.doBuild(content, data);
    }

    
}
