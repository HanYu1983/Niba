import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponDetailOnStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onWeaponDetailOnStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onWeaponDetailOnStoreDownClick();
    }
    onLeftClick(owner: any) {
    }
    onRightClick(owner: any) {
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onWeaponDetailOnStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onWeaponDetailOnStoreEscClick();
    }
}
