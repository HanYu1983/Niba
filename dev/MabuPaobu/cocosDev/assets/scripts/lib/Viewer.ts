
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Viewer')
export class Viewer extends Component {

    private isOpen = true;
    
    onLoad(){
        this.close();
    }

    open(data?:any){
        if(!this.isOpen){
            this.isOpen = true;
            if(!this.node.active) this.node.active = true;
        
            this.node.scale = Vec3.ONE;
            this.doOpen(data);
        }
    }

    close(){
        if(this.isOpen){
            this.isOpen = false;
            this.node.scale = Vec3.ZERO;
            this.doClose();
        }
    }

    protected doOpen(data?:any){
        
    }

    protected doClose(){

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
