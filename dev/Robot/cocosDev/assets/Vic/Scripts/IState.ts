import StateController from "./StateController";

export default interface IState  {
    onPrevClick(owner:any, stateController:StateController);
    onNextClick(owner:any, stateController:StateController);
    onLeftClick(owner:any, stateController:StateController);
    onRightClick(owner:any, stateController:StateController);
    onEnterClick(owner:any, stateController:StateController);
    onEscClick(owner:any, stateController:StateController);
}
