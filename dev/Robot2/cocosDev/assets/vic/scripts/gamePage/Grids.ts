// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate } from 'cc';
import { Grid } from './Grid';
const { ccclass, property } = _decorator;

@ccclass('Grids')
export class Grids extends Component {

    @property(Node)
    prefab:Node = null;

    initGrids(){
        for(let i = 0; i < 400; ++i){
            let node = instantiate(this.prefab);
            node.parent = this.node;
            node.active = true;
        }
    }

    updateGrids(map:any){
        
    }
}
