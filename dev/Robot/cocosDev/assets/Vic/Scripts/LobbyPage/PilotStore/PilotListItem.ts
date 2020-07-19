import MenuButton from "../../MenuButton";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotListItem extends MenuButton {

    @property(cc.Label)
    money:cc.Label = null;
}
