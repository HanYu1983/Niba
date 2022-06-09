import StateController from "./StateController";

export default interface IState  {
    onPrevClick(owner?:any);
    onNextClick(owner?:any);
    onLeftClick(owner?:any);
    onRightClick(owner?:any);
    onEnterClick(owner?:any);
    onEscClick(owner?:any);
}
