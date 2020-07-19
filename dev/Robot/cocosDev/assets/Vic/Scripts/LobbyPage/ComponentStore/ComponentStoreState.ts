import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onComponentStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onComponentStoreDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onComponentStoreLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onComponentStoreRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onComponentStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onComponentStoreEscClick();
    }
}
