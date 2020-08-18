import IState from "./IState";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DefaultState implements IState {

    onUpClick(owner: any) {
        throw new Error("Method not implemented.");
    }    
    onDownClick(owner: any) {
        throw new Error("Method not implemented.");
    }
    onLeftClick(owner: any) {
        throw new Error("Method not implemented.");
    }
    onRightClick(owner: any) {
        throw new Error("Method not implemented.");
    }
    onEnterClick(owner: any) {
        throw new Error("Method not implemented.");
    }
    onEscClick(owner: any) {
        throw new Error("Method not implemented.");
    }
    onEnterState(onwer?:any){
        throw new Error("Method not implemented.");
    }
    onReleaseState(onwer?:any){
        throw new Error("Method not implemented.");
    }
}
