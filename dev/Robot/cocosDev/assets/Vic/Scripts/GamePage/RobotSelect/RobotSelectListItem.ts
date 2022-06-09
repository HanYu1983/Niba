import MenuButton from "../../MenuButton";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotSelectListItem extends MenuButton {

    @property(cc.Label)
    pilot:cc.Label = null;

    @property(cc.Node)
    readyIcon:cc.Node = null;

    setReady(ready:boolean){
        this.readyIcon.active = ready;
    }
}
