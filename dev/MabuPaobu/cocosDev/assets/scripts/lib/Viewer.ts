
import { _decorator, Component, Node, Vec3, CCInteger, TERRAIN_HEIGHT_BASE } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Viewer')
export class Viewer extends Component {

    @property(Node)
    pages:Node[] = [];

    @property(CCInteger)
    defaultPage:number = 0;

    onLoad(){
        this.close();
    }

    open(data?:any){
        if(!this.node.active) this.node.active = true;
    
        this.openTargetPage(this.defaultPage);

        this.node.scale = Vec3.ONE;
        this.doOpen(data);
    }

    close(){
        this.node.scale = Vec3.ZERO;
        this.doClose();
    }

    protected doOpen(data?:any){
        
    }

    protected doClose(){

    }

    private closeAllPages(){
        this.pages.forEach(page=>{
            page.setScale(Vec3.ZERO);
        });
    }

    protected openTargetPage(id:number = 0){
        this.closeAllPages();
        if(id < this.pages.length){
            this.pages[id].setScale(Vec3.ONE);
        }
    }

    protected getTargetPage(id:number = 0):Node{
        return this.pages[id];
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
