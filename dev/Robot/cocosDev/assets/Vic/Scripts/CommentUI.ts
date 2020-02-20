import AnimationendCallback from "./AnimationEndCallback";
import PopPanel from "./PopPanel";
const { ccclass, property } = cc._decorator;

@ccclass
export default class CommentUI extends cc.Component {

    @property(cc.Node)
    alert: cc.Node = null;

    @property(cc.Label)
    alertContent: cc.Label = null;

    @property(PopPanel)
    popPanel: PopPanel = null;

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

    openPopup(content: string) {
        this.popPanel.open();
        this.popPanel.setContent(content);
    }

    closePop() {
        this.popPanel.close();
    }
}
