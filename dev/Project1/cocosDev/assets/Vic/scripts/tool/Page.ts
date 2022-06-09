
import { _decorator, Component, Node, CCString, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Page')
export class Page extends Component {
    
    open(data?:any){
        this.node.setScale(Vec3.ONE);
        this.doOpen(data);
    }

    close(data?:any){
        this.node.setScale(Vec3.ZERO);
        this.doClose(data);
    }

    private doOpen(data?:any){

    }

    private doClose(data?:any){

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
