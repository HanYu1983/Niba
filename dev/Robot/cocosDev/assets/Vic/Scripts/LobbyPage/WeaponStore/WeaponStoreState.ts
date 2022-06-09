import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";


const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onWeaponStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onWeaponStoreDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onWeaponStoreLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onWeaponStoreRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onWeaponStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onWeaponStoreEscClick();
    }
}
