
import PopPanel from "./PopPanel";
import RobotDetailPanel from "./RobotDetailPanel/RobotDetailPanel";
import AnimationendCallback from "../AnimationEndCallback";
import PilotDetailPanel from "./PilotDetailPanel/PilotDetailPanel";
const { ccclass, property } = cc._decorator;

@ccclass
export default class CommentUI extends cc.Component {

    @property(cc.Node)
    alert: cc.Node = null;

    @property(cc.Label)
    alertContent: cc.Label = null;

    @property(PopPanel)
    popPanel: PopPanel = null;

    @property(RobotDetailPanel)
    robotDetailPanel:RobotDetailPanel = null;

    @property(PilotDetailPanel)
    pilotDetailPanel:PilotDetailPanel = null;

    showAlert(content: string, cb?: () => void) {
        this.alert.active = false;
        this.alert.active = true;
        this.alertContent.string = content;
        this.alert.getComponent(cc.Animation).play();

        this.alert.off(AnimationendCallback.ON_ANIMATION_END);
        this.alert.on(AnimationendCallback.ON_ANIMATION_END, () => {
            this.alert.active = false;
            this.alert.off(AnimationendCallback.ON_ANIMATION_END);
            if (cb) cb();
        });
    }

    openRobotDetail(unit:any, menu:any){
        this.robotDetailPanel.open();
        this.robotDetailPanel.setUnit(unit);
        this.robotDetailPanel.setMenu(menu);
    }

    openPilotDetail(pilot:any, menu:any){
        this.pilotDetailPanel.open();
        this.pilotDetailPanel.setPilot(pilot);
        this.pilotDetailPanel.setMenu(menu);
    }

    closeRobotDetail(){
        this.robotDetailPanel.close();
    }

    closePilotDetail(){
        this.pilotDetailPanel.close();
    }

    openPopup(content: string) {
        this.popPanel.open();
        this.popPanel.setContent(content);
    }

    closePop() {
        this.popPanel.close();
    }
}
