import MenuButton from "../../MenuButton";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotListItem extends MenuButton {

    @property(cc.Label)
    money:cc.Label = null;
}
