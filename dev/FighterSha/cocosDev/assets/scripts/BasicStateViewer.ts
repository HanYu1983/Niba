import BasicViewer from "./lib/BasicViewer";
import IState from "./lib/IState";
import ISync from "./lib/ISync";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BasicStateViewer extends BasicViewer implements IState, ISync {
    sync(data: any) {
        
    }
    
    owner: cc.Node;
    onEnterState() {
        
    }
    onReleaseState() {
        
    }

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
