import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestMenuState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onQuestUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onQuestDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onQuestLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onQuestRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onQuestEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onQuestEscClick();
    }
}
