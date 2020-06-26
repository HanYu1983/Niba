// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from '../BasicViewer'
import InputSensor from '../InputSensor';
import StateController from '../StateController';
import ViewController from '../ViewController';
import RobotStore from '../MainPage/RobotStore/RobotStore';
import PilotStore from '../MainPage/PilotStore/PilotStore';
import StandBy from '../MainPage/StandBy/StandBy';
import MainMenu from '../MainPage/MainMenu/MainMenu';
import PrepareMenu from '../MainPage/PrepareMenu/PrepareMenu';
import MainMenuState from '../MainPage/MainMenu/MainMenuState';
import PrepareMenuState from '../MainPage/PrepareMenu/PrepareMenuState';
import RobotStoreBuyState from '../MainPage/RobotStore/RobotStoreBuyState';
import PilotStoreBuyState from '../MainPage/PilotStore/PilotStoreBuyState';
import PilotStoreState from '../MainPage/PilotStore/PilotStoreState';
import RobotStoreState from '../MainPage/RobotStore/RobotStoreState';
import StandByRobotDetailState from '../MainPage/StandBy/StandyByRobotDetailState';
import StandByRobotPilotState from '../MainPage/StandBy/StandyByRobotPilotState';
import StandByState from '../MainPage/StandBy/StandyByState';
import StandByRobotPilotPopState from '../MainPage/StandBy/StandyByRobotPilotPopState';
import QuestMenu from '../MainPage/QuestMenu/QuestMenu';
import QuestMenuState from '../MainPage/QuestMenu/QuestMenuState';
import RobotDetailOnStoreState from '../CommentUI/RobotDetailPanel/RobotDetailOnStoreState';
import PilotDetailOnStoreState from '../CommentUI/PilotDetailPanel/PilotDetailOnStoreState';
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Layout)
export default class MainPage extends BasicViewer {

    @property(MainMenu)
    mainMenu:MainMenu = null;

    @property(PrepareMenu)
    prepareMenu:PrepareMenu = null;

    @property(QuestMenu)
    questMenu:QuestMenu = null;

    @property(RobotStore)
    robotStore: RobotStore = null;

    @property(PilotStore)
    pilotStore: PilotStore = null;

    @property(StandBy)
    standBy: StandBy = null;

    @property(cc.Label)
    money: cc.Label = null;

    private _state: StateController;

    init() {
        this._state = this.node.getComponent(StateController);
    }

    open() {
        super.open();
        this.backToLooby();
    }

    addListener() {
        super.addListener();

        this.node.on(InputSensor.CURSOR_UP, this._onMainPageCursorUp, this);
        this.node.on(InputSensor.CURSOR_LEFT, this._onMainPageCursorLeft, this);
        this.node.on(InputSensor.CURSOR_RIGHT, this._onMainPageCursorRight, this);
        this.node.on(InputSensor.CURSOR_DOWN, this._onMainPageCursorDown, this);
        this.node.on(InputSensor.ENTER, this._onMainPageCursorEnter, this);
        this.node.on(InputSensor.ESCAPE, this._onMainPageCursorEsc, this);
    }

    removeListenser() {
        super.removeListenser();

        this.node.off(InputSensor.CURSOR_UP, this._onMainPageCursorUp, this);
        this.node.off(InputSensor.CURSOR_LEFT, this._onMainPageCursorLeft, this);
        this.node.off(InputSensor.CURSOR_RIGHT, this._onMainPageCursorRight, this);
        this.node.off(InputSensor.CURSOR_DOWN, this._onMainPageCursorDown, this);
        this.node.off(InputSensor.ENTER, this._onMainPageCursorEnter, this);
        this.node.off(InputSensor.ESCAPE, this._onMainPageCursorEsc, this);
    }

    close() {
        this.closeAllPage();
        super.close();
    }

    //#region QuestMenu
    onQuestUpClick(){
        this.questMenu.onPrevClick();
    }

    onQuestDownClick(){
        this.questMenu.onNextClick();
    }

    onQuestLeftClick(){
        this.questMenu.onLeftClick();
    }

    onQuestRightClick(){
        this.questMenu.onRightClick();
    }

    onQuestEnterClick(){
        ViewController.instance.view.openGamePage();
    }

    onQuestEscClick(){
        this.openPrepareMenu();
    }
    //#endregion

    //#region MainPageDefaultState 最外層的選單

    onMenuUpClick() {
        this.mainMenu.onPrevClick();
    }

    onMenuDownClick() {
        this.mainMenu.onNextClick();
    }

    onMenuEnterClick() {
        switch (this.mainMenu.menu.getFocus()) {
            case "整備部隊":
                {
                    this.openPrepareMenu();
                }
                break;
            case "進入副本":
                {
                    this.openQuestMenu();
                }
                break;
            case "儲存":
                {
                }
                break;
            case "讀取":
                {
                }
                break;
        }
    }

    //#endregion

    //#region PrepareMenuState

    onPrepareMenuPrevClick(){
        this.prepareMenu.menu.onPrevClick();
    }

    onPrepareMenuNextClick(){
        this.prepareMenu.menu.onNextClick();
    } 

    onPrepareMenuEnterClick(){
        switch(this.prepareMenu.menu.getFocus()){
            case "購買機甲":{
                this.openRobotStore();
                break;
            }
            case "雇傭駕駛":{
                this.openPilotStore();
                break;
            }
            case "購買軍火":{
                break;
            }
            case "購買配件":{
                break;
            }
            case "配置駕駛":{
                this.openStandBy();
                break;
            }
            case "配置軍火":{
                break;
            }
            case "配置配件":{
                break;
            }
        }
    } 

    onPrepareMenuEscClick(){
        this.backToLooby();
    } 
    //#endregion

    //#region RobotStoreState 最外層的選單-》買機體的選單

    onRobotStoreUpClick() {
        this.robotStore.robotList.onPrevClick(this);
    }

    onRobotStoreDownClick() {
        this.robotStore.robotList.onNextClick(this);
    }

    onRobotStoreLeftClick() {
        this.robotStore.prevPage();
    }

    onRobotStoreRightClick() {
        this.robotStore.nextPage();
    }

    onRobotStoreEnterClick() {

        const data = this.robotStore.robotList.getFocus();
        data.weapons = ViewController.instance.view.getWeaponConfig(data.weapons);

        ViewController.instance.view.getCommentUI().openRobotDetail(data, ["購買","取消"]);
        this._state.changeState(new RobotDetailOnStoreState());
    }

    onRobotStoreEscClick() {
        this.openPrepareMenu();
    }

    //#endregion

    //#region PilotStoreState 最外層的選單-》買駕駛員的選單

    onPilotStoreUpClick() {
        this.pilotStore.pilotList.onPrevClick(this);
    }

    onPilotStoreDownClick() {
        this.pilotStore.pilotList.onNextClick(this);
    }

    onPilotStoreLeftClick() {
        this.pilotStore.pilotList.onLeftClick(this);
    }

    onPilotStoreRightClick() {
        this.pilotStore.pilotList.onRightClick(this);
    }

    onPilotStoreEnterClick() {
        const data = this.pilotStore.pilotList.getFocus();
        ViewController.instance.view.getCommentUI().openPilotDetail(data, ["確定","取消"]);
        this._state.changeState(new PilotDetailOnStoreState());
    }

    onPilotStoreEscClick() {
        this.openPrepareMenu();
    }

    //#endregion

    //#region PilotStoreBuyState 最外層的選單-》買駕駛員的選單-》買駕駛員的確認選單

    onPilotStoreBuyLeftClick() {
        ViewController.instance.view.getCommentUI().popPanel.onLeftClick();
    }

    onPilotStoreBuyRightClick() {
        ViewController.instance.view.getCommentUI().popPanel.onRightClick();
    }

    onPilotStoreBuyEnterClick() {
        const cursor: number[] = ViewController.instance.view.getCommentUI().popPanel.getCursor();
        if (cursor[0] == 0) {
            const buyPilot = this.pilotStore.pilotList.getFocus();
            ViewController.instance.model.buyPilotById(buyPilot.key, (err: any, data: any) => {
                ViewController.instance.view.getCommentUI().showAlert("已購買");
            });
        }
        this.onPilotStoreBuyEscClick();
        // ViewController.instance.view.getCommentUI().closePop();
        // this._state.changeState(new PilotDetailOnStoreState())
    }

    onPilotStoreBuyEscClick() {
        ViewController.instance.view.getCommentUI().closePop();
        this._state.changeState(new PilotDetailOnStoreState())
    }

    //#endregion

    //#region RobotStoreBuyState 最外層的選單-》買機體的選單-》買機體的確認選單

    onRobotStoreBuyLeftClick() {
        ViewController.instance.view.getCommentUI().popPanel.onLeftClick();
    }

    onRobotStoreBuyRightClick() {
        ViewController.instance.view.getCommentUI().popPanel.onRightClick();
    }

    onRobotStoreBuyEnterClick() {
        const cursor: number[] = ViewController.instance.view.getCommentUI().popPanel.getCursor();
        if (cursor[0] == 0) {
            const buyRobot = this.robotStore.robotList.getFocus();
            ViewController.instance.model.buyRobotById(buyRobot.key, (err: any, data: any) => {
                ViewController.instance.view.getCommentUI().showAlert("已購買");
            });
        }
        this.onRobotStoreBuyEscClick();
    }

    onRobotStoreBuyEscClick() {
        ViewController.instance.view.getCommentUI().closePop();
        this._state.changeState(new RobotDetailOnStoreState())
    }

    //#endregion

    //#region StandByState 最外層的選單-》整備選單

    onStandByUpClick() {
        this.standBy.robotList.onPrevClick(this);
    }

    onStandByDownClick() {
        this.standBy.robotList.onNextClick(this);
    }

    onStandByLeftClick() {
        this.standBy.robotList.onLeftClick(this);
    }

    onStandByRightClick() {
        this.standBy.robotList.onRightClick(this);
    }

    onStandByEnterClick() {
        this._state.changeState(new StandByRobotDetailState());
        const data = this.standBy.robotList.getFocus();

        this.standBy.openRobotDetail();
    }

    onStandByEscClick() {
        this.openPrepareMenu();
    }

    //#endregion

    //#region StandByRobotDetail 最外層的選單-》整備選單-》機體詳細
    onStandByRobotDetailEnterClick() {
        const buttonId = this.standBy.robotDetail.feature.getFocusId();
        const robotId = this.standBy.robotList.getFocusId();
        cc.log("buttonId", buttonId);
        cc.log("robotId", robotId);

        if (buttonId[0] == 0) {
            this.standBy.setPilotList();
            this._state.changeState(new StandByRobotPilotState())
        }
    }

    onStandByRobotDetailEscClick() {
        this.standBy.closeRobotDetail();
        this._state.changeState(new StandByState());
    }
    //#endregion

    //#region StandByRobotPilot 最外層的選單-》整備選單-》機體詳細-》切換駕駛選單

    onStandByRobotPilotUpClick() {
        this.standBy.pilotList.onPrevClick();
    }

    onStandByRobotPilotDownClick() {
        this.standBy.pilotList.onNextClick();
    }

    onStandByRobotPilotEnterClick() {
        const pilotId = this.standBy.pilotList.getFocusId();
        cc.log("pilotId", pilotId);

        ViewController.instance.view.getCommentUI().openPopup("確定？");
        this._state.changeState(new StandByRobotPilotPopState());
    }

    onStandByRobotPilotEscClick() {
        this.standBy.pilotList.close();
        this._state.changeState(new StandByRobotDetailState());
    }
    //#endregion

    //#region StandByRobotPilotPop 最外層的選單-》整備選單-》機體詳細-》切換駕駛選單-》切換駕駛選單的確認選單
    onStandByRobotPilotPopLeftClick() {
        ViewController.instance.view.getCommentUI().popPanel.onLeftClick();
    }

    onStandByRobotPilotPopRightClick() {
        ViewController.instance.view.getCommentUI().popPanel.onRightClick();

    }

    onStandByRobotPilotPopEnterClick() {
        const cursor: number[] = ViewController.instance.view.getCommentUI().popPanel.getCursor();
        if (cursor[0] == 0) {
            const robot = this.standBy.robotList.getFocus();
            const pilot = this.standBy.pilotList.getFocus();

            ViewController.instance.model.setRobotPilot(robot.standbyKey, pilot.standbyKey, (err: any, data: any) => {
                cc.log(data);
                ViewController.instance.view.getCommentUI().showAlert("已修改");

                this.standBy.pilotList.close();
                ViewController.instance.view.getCommentUI().closePop();
                this._state.changeState(new StandByRobotDetailState());
            });
        } else {
            this.onStandByRobotPilotPopEscClick();
        }
    }

    onStandByRobotPilotPopEscClick() {
        ViewController.instance.view.getCommentUI().closePop();
        this._state.changeState(new StandByRobotPilotState());
    }

    //#endregion

    //#region RobotDetailOnStoreState
    onRobotDetailOnStoreUpClick(){
        ViewController.instance.view.commentUI.robotDetailPanel.menu.onPrevClick();
    }

    onRobotDetailOnStoreDownClick(){
        ViewController.instance.view.commentUI.robotDetailPanel.menu.onNextClick();
    }

    onRobotDetailOnStoreEnterClick(){
        switch(ViewController.instance.view.commentUI.robotDetailPanel.menu.getFocus()){
            case "購買":{
                const data = this.robotStore.robotList.getFocus();
                ViewController.instance.view.getCommentUI().openPopup("確定要買？");
                this._state.changeState(new RobotStoreBuyState());
                break;
            }
            case "取消":{
                this.onRobotDetailOnStoreEscClick();
                break;
            }
        }
    }

    onRobotDetailOnStoreEscClick(){
        ViewController.instance.view.commentUI.closeRobotDetail();
        this._state.changeState(new RobotStoreState());
    }

    //#endregion

    //#region PilotDetailOnStoreState
    onPilotDetailOnStoreUpClick(){
        ViewController.instance.view.commentUI.pilotDetailPanel.menu.onPrevClick();
    }

    onPilotDetailOnStoreDownClick(){
        ViewController.instance.view.commentUI.pilotDetailPanel.menu.onNextClick();
    }

    onPilotDetailOnStoreLeftClick(){
        
    }

    onPilotDetailOnStoreRightClick(){
        
    }

    onPilotDetailOnStoreEnterClick(){
        switch(ViewController.instance.view.commentUI.pilotDetailPanel.menu.getFocus()){
            case "確定":{
                const data = this.pilotStore.pilotList.getFocus();
                ViewController.instance.view.getCommentUI().openPopup("確定要買？");
                this._state.changeState(new PilotStoreBuyState());
                break;
            }
            case "取消":{
                this.onPilotDetailOnStoreEscClick();
                break;
            }
        }
    }

    onPilotDetailOnStoreEscClick(){
        ViewController.instance.view.commentUI.closePilotDetail();
        this._state.changeState(new PilotStoreState());
    }
    //#endregion
    openPrepareMenu(){
        this.closeAllPage();
        this.prepareMenu.open();
        this._state.changeState(new PrepareMenuState());
    }

    openQuestMenu(){
        this.closeAllPage();
        this.questMenu.open();
        this._state.changeState(new QuestMenuState());
    }

    openRobotStore() {
        this.closeAllPage();
        this.robotStore.open();
        this.robotStore.setRobotList();
        this._state.changeState(new RobotStoreState());
    }

    openPilotStore() {
        this.closeAllPage();
        this.pilotStore.open();
        this.pilotStore.setPilotList();
        this._state.changeState(new PilotStoreState());
    }

    openStandBy() {
        this.closeAllPage();
        this.standBy.open();
        this.standBy.setRobotList();
        this._state.changeState(new StandByState());
    }

    backToLooby() {
        this.closeAllPage();
        this.mainMenu.open();
        this._state.changeState(new MainMenuState());
    }

    closeAllPage(){
        this.mainMenu.close();
        this.prepareMenu.close();
        this.questMenu.close();
        this.robotStore.close();
        this.pilotStore.close();
        this.standBy.close();
        ViewController.instance.view.commentUI.closeRobotDetail();
    }

    setMoney(money: number) {
        this.money.string = money.toString();
    }

    private _onMainPageCursorUp() {
        this._state.onPrevClick(this);
    }

    private _onMainPageCursorLeft() {
        this._state.onLeftClick(this);
    }

    private _onMainPageCursorRight() {
        this._state.onRightClick(this);
    }

    private _onMainPageCursorDown() {
        this._state.onNextClick(this);
    }

    private _onMainPageCursorEnter() {
        this._state.onEnterClick(this);
    }

    private _onMainPageCursorEsc() {
        this._state.onEscClick(this);
    }
}
