import IState from "./IState";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DefaultState implements IState {

    constructor(public owner){
        this.owner = owner;
    }

    onUpClick() {
        throw new Error("Method not implemented.");
    }    
    onDownClick() {
        throw new Error("Method not implemented.");
    }
    onLeftClick() {
        throw new Error("Method not implemented.");
    }
    onRightClick() {
        throw new Error("Method not implemented.");
    }
    onEnterClick() {
        throw new Error("Method not implemented.");
    }
    onEscClick() {
        throw new Error("Method not implemented.");
    }
    onEnterState(){
        throw new Error("Method not implemented.");
    }
    onReleaseState(){
        throw new Error("Method not implemented.");
    }
}
