// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec3, Vec2, Sprite, tween, Color, Label } from 'cc';
import { Drawer } from '../Drawer';
import { ImageChanger } from '../lib/ImageChanger';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Unit')
@requireComponent(ImageChanger)
export class Unit extends Component {

    @property(Node)
    airLand:Node = null;

    @property(Label)
    lblAction:Label = null;

    @property(Sprite)
    HPBar:Sprite = null;

    @property(Sprite)
    ENBar:Sprite = null;

    @property(Sprite)
    unitImage:Sprite = null;

    @property(Color)
    unitColors:Color[] = [];

    airPos:Vec3 = new Vec3(0,10,0);

    unitId:string = "";

    gridPos:Vec2 = new Vec2();

    start(){

        // example
        // this.changeUnit("byj");
        // this.isAir(true);

        this.hideHPEN();
        this.hideAction();
    }

    showColor(side:number){
        this.unitImage.color = Drawer.staticPlayerColors[side];
    }
    
    changeUnit(robotName:string){
        this.node.getComponent(ImageChanger)?.changeImage(0, robotName);
    }

    isAir(air:boolean){
        this.airLand.setPosition(air ? this.airPos : Vec3.ZERO);
    }

    showAction(action:string){
        this.lblAction.string = action;
    }

    hideAction(){
        this.lblAction.string = "";
    }
    
    hideHPEN(){
        this.HPBar.node.setScale(new Vec3());
        this.ENBar.node.setScale(new Vec3());
    }

    showHPEN(hp:number, maxHP:number, en:number, maxEN:number){
        this.HPBar.node.setScale(hp/maxHP, 1, 1);
        this.ENBar.node.setScale(en/maxEN, 1, 1);
    }

    tweenHPEN(hp:number, maxHP:number, en:number, maxEN:number){
        let toScale = hp / maxHP;
        tween(this.HPBar.node).to(1, {scale:new Vec3(toScale, 1, 1)}, {easing:"expoOut"}).start();

        toScale = en / maxEN;
        tween(this.ENBar.node).to(1, {scale:new Vec3(toScale, 1, 1)}, {easing:"expoOut"}).start();
    }
}
