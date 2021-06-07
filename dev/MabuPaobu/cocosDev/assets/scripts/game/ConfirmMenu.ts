
import { _decorator, Component, Node, Label, Vec3, SystemEventType } from 'cc';
import { MenuViewer } from '../lib/MenuViewer';
const { ccclass, property } = _decorator;

@ccclass('ConfirmMenu')
export class ConfirmMenu extends MenuViewer {

    @property(Label)
    lblContent:Label;

    start(){
        this.node.setPosition(Vec3.ZERO);
    }

    protected doOpen(data?:any){
        this.lblContent.string = data.content;
        this.btns[0].node.on(SystemEventType.MOUSE_UP, data.yes );
        this.btns[1].node.on(SystemEventType.MOUSE_UP, data.no );
    }

    protected doClose(){
        this.btns[0].node.off(SystemEventType.MOUSE_UP);
        this.btns[1].node.off(SystemEventType.MOUSE_UP);
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
