// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "./BasicViewer";
import IState from "./IState";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BasicStateViewer extends BasicViewer implements IState {

    onUpClick(owner?:any){

    }
    onDownClick(owner?:any){

    }
    onLeftClick(owner?:any){

    }
    onRightClick(owner?:any){

    }
    onEnterClick(owner?:any){

    }
    onEscClick(owner?:any){
        
    }
}
