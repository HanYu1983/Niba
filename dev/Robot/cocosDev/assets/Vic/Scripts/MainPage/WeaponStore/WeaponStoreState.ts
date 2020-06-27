import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onWeaponStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onWeaponStoreDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onWeaponStoreLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onWeaponStoreRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onWeaponStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onWeaponStoreEscClick();
    }
}
