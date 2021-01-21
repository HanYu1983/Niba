// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
import { ValueBar } from '../lib/ValueBar';
const { ccclass, property } = _decorator;

@ccclass('UnitInfo')
export class UnitInfo extends Instant {

    @property(ValueBar)
    hpValueBar:ValueBar = null;

    @property(ValueBar)
    enValueBar:ValueBar = null;
}
