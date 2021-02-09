// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
import { ValueBar } from '../lib/ValueBar';
import *  as ModelType from '../../../han/types';
import { ImageChanger } from '../lib/ImageChanger';
const { ccclass, property, requireComponent } = _decorator;


@ccclass('UnitInfo')
@requireComponent(ImageChanger)
export class UnitInfo extends Instant {
    @property(Label)
    title:Label = null;

    @property(Label)
    exp:Label = null;

    @property(ValueBar)
    hpValueBar:ValueBar = null;

    @property(ValueBar)
    enValueBar:ValueBar = null;


    clear(){
        super.clear();
    }

    doBuild(content:any, data:any){
        this.setRobot(content);
    }

    private setRobot(robot:any){
        this.title.string = robot.Title;

        this.hpValueBar.maxValue = robot.MaxHP;
        this.hpValueBar.setValue(robot.HP);

        this.enValueBar.maxValue = robot.MaxEN;
        this.enValueBar.setValue(robot.EN);

        this.node.getComponent(ImageChanger)?.changeImage(0, robot.ProtoID);
    }
}