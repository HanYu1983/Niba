import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PrepareMenuState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onPrepareMenuPrevClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onPrepareMenuNextClick();
    }
    onLeftClick(owner: any) {
        
    }
    onRightClick(owner: any) {
        
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onPrepareMenuEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onPrepareMenuEscClick();
    }
}
