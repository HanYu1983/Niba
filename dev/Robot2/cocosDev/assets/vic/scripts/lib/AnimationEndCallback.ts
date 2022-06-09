import { _decorator, Component } from "cc";

const {ccclass, property} = _decorator;

@ccclass
export default class AnimationEndCallback extends Component {

    static ON_ANIMATION_END:string = "ON_ANIMATION_END";
    end(){
        this.node.emit(AnimationEndCallback.ON_ANIMATION_END);
    }
}
