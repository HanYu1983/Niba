// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec3 } from 'cc';
import { ImageChanger } from '../lib/ImageChanger';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Unit')
@requireComponent(ImageChanger)
export class Unit extends Component {

    @property(Node)
    airLand:Node = null;

    airPos:Vec3 = new Vec3(0,10,0);

    unitId:string = "";

    // example
    // start(){
    //     this.changeUnit("byj");
    //     this.isAir(true);
    // }
    
    changeUnit(robotName:string){
        this.node.getComponent(ImageChanger)?.changeImage(0, robotName);
    }

    isAir(air:boolean){
        this.airLand.setPosition(air ? this.airPos : Vec3.ZERO);
    }
    
}
