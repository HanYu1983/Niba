import MenuButton from "../../MenuButton";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponListItem extends MenuButton {

    @property(cc.Label)
    money:cc.Label = null;
}
