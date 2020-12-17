// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Pool } from '../Pool';
import { IInstant } from './IInstant';
const { ccclass, property } = _decorator;

@ccclass('Instant')
export class Instant extends Component implements IInstant {

    @property(Pool)
    pool:Pool = null;
    
    clear():void{

    }
    build(data:any):void{
        this.clear();
    }
}
