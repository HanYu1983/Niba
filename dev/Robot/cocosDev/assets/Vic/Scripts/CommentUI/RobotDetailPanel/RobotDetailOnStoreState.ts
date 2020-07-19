import DefaultState from "../../DefaultState";
import LobbyPage from "../../LobbyPage/LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotDetailOnStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onRobotDetailOnStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onRobotDetailOnStoreDownClick();
    }
    onLeftClick(owner: any) {
    }
    onRightClick(owner: any) {
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onRobotDetailOnStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onRobotDetailOnStoreEscClick();
    }
}
