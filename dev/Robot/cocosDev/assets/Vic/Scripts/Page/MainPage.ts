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
import MenuButtons from '../MenuButtons';
import InputSensor from '../InputSensor';
import StateController from '../StateController';
import MainPageDefaultState from '../MainPage/MainPageDefaultState';
import ViewController from '../ViewController';
import RobotStore from '../MainPage/RobotStore/RobotStore';
import PilotStore from '../MainPage/PilotStore/PilotStore';
import StandBy from '../MainPage/StandBy/StandBy';
import RobotStoreState from '../MainPage/RobotStoreState';
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Layout)
export default class MainPage extends BasicViewer {

    @property(MenuButtons)
    menu: MenuButtons = null;

    @property(RobotStore)
    robotStore:RobotStore = null;

    @property(PilotStore)
    pilotStore:PilotStore = null;

    @property(StandBy)
    standBy:StandBy = null;

    private _state: StateController;

    init() {
        this._state = this.node.getComponent(StateController);
    }

    open() {
        super.open();

        this.menu.open();
        this.menu.setData(["整備部隊", "購買機體", "雇傭駕駛", "出擊"]);

        this._state.changeState(new MainPageDefaultState());
        this.closeAllSub();
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
        super.close();
    }

    onMenuUpClick() {
        this.menu.onPrevClick();
    }

    onMenuDownClick() {
        this.menu.onNextClick();
    }

    onRobotStoreUpClick(){
        this.robotStore.onPrevClick(this);
    }

    onRobotStoreDownClick(){
        this.robotStore.onNextClick(this);
    }

    onRobotStoreLeftClick(){
        this.robotStore.onLeftClick(this);
    }

    onRobotStoreRightClick(){
        this.robotStore.onRightClick(this);
    }

    onRobotStoreEnterClick(){
        this.robotStore.onEnterClick(this);
    }

    onRobotStoreEscClick(){
        this.closeAllSub();
        this._state.changeState(new MainPageDefaultState());
    }

    onMenuEnterClick() {
        switch (this.menu.getFocus()) {
            case "整備部隊":
                {
                    this.openStandBy();
                }
                break;
            case "購買機體":
                {
                    this.openRobotStore();
                }
                break;
            case "雇傭駕駛":
                {
                    this.openPilotStore();
                }
                break;
            case "出擊":
                {
                    ViewController.instance.view.openGamePage();
                }
                break;
        }
    }

    openRobotStore(){
        this.closeAllSub();
        this.robotStore.open();
        this._state.changeState(new RobotStoreState())
    }

    openPilotStore(){
        this.closeAllSub();
        this.pilotStore.open();
    }

    openStandBy(){
        this.closeAllSub();
        this.standBy.open();
    }

    closeAllSub(){
        this.robotStore.close();
        this.pilotStore.close();
        this.standBy.close();
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
