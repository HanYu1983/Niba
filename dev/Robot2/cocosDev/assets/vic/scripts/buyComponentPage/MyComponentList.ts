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

@ccclass('MyComponentList')
export class MyComponentList extends BasicInstMenu {
    
    doBuild(content:any, data:any):void{
        // const pilots = content[0];
        // content[0] = pilots.map((id)=>{
        //     return Drawer.getPilot(id, data).ProtoID;
        // });
        // super.doBuild(content, data);
        super.doBuild(content, data);
    }
}
