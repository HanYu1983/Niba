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

@ccclass('BuyComponentList')
export class BuyComponentList extends BasicInstMenu {
    
    doBuild(content:any, data:any):void{
        const components = content[0];
        content[0] = components.map((id)=>{
            const component = Drawer.getBuyComponent(id, data);
            const title = component.Title;
            const money = component.Cost;
            return title + "_" + money;
        });
        super.doBuild(content, data);
    }

    
}
