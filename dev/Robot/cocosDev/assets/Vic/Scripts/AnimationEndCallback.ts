const {ccclass, property} = cc._decorator;

@ccclass
export default class AnimationendCallback extends cc.Component {

    static ON_ANIMATION_END:string = "ON_ANIMATION_END";
    end(){
        this.node.emit(AnimationendCallback.ON_ANIMATION_END);
    }
}
