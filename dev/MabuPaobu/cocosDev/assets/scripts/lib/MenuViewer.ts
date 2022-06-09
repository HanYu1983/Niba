
import { _decorator, Component, Node, Button, SystemEventType } from 'cc';
import { Viewer } from './Viewer';
const { ccclass, property } = _decorator;

@ccclass('MenuViewer')
export class MenuViewer extends Viewer {
    @property(Button)
    btns:Button[] = [];

    setButtonEnable(enables:number[]){

        this.btns.forEach(elem=>{
            elem.interactable = false;
        });

        enables.forEach(elem=>{
            this.btns[elem].interactable = true;
        });
    }

    offAllListener(){
        this.btns.forEach(elem=>{
            elem.node.off(SystemEventType.MOUSE_UP);
        });
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
