import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onRobotStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onRobotStoreDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onRobotStoreLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onRobotStoreRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onRobotStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onRobotStoreEscClick();
    }
}
