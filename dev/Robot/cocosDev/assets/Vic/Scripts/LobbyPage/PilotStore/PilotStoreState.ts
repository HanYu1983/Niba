import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onPilotStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onPilotStoreDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onPilotStoreLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onPilotStoreRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onPilotStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onPilotStoreEscClick();
    }
}
