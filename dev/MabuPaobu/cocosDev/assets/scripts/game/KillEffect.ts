
import { _decorator, Component, Node, Label, Animation } from 'cc';
import { Viewer } from '../lib/Viewer';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('KillEffect')
@requireComponent(Animation)
export class KillEffect extends Viewer {
    
    @property(Label)
    content:Label;

    @property(Label)
    contentShadow:Label;

    doOpen(data?:any){
        let content = '';
        if (data.score > 0){ content += 'score+' + data.score};
        if (data.money > 0){ content += 'money+' + data.money};
        this.content.string = content;
        this.contentShadow.string = content;
        this.node.getComponent(Animation)?.play()
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
