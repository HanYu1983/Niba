// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, tween } from 'cc';
import { BasicViewer } from '../lib/BasicViewer';
import { IInstant } from '../lib/instanceViewer/IInstant';
import { Instant } from '../lib/instanceViewer/Instant';
import { InstMenu } from '../lib/instanceViewer/InstMenu';
import { Grids } from './Grids';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends Instant {
   
    
}
