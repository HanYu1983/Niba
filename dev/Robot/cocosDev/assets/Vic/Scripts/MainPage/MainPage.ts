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
import MainMenu from './MainMenu/MainMenu';
import QuestMenu from './QuestMenu/QuestMenu';
import MainMenuState from './MainMenu/MainMenuState';
import QuestMenuState from './QuestMenu/QuestMenuState';
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Layout)
export default class MainPage extends BasicViewer {

    @property(MainMenu)
    mainMenu:MainMenu = null;

    @property(QuestMenu)
    questMenu:QuestMenu = null;

    private _state: StateController;

    init() {
        this._state = this.node.getComponent(StateController);
    }

    open() {
        super.open();
        this.backToStart();        
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
        ViewController.instance.view.openGamePage(this.questMenu.getButtonId());
    }

    onQuestEscClick(){
        this.backToStart();
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
                    ViewController.instance.view.openLobbyPage();
                }
                break;
            case "進入副本":
                {
                    this.openQuestMenu();
                }
                break;
            case "繼續中途戰":
                {
                    ViewController.instance.view.openGamePage();
                }
                break;
            case "新游戲":
                {
                    ViewController.instance.notifyNewGame(()=>{
                        ViewController.instance.view.openMainPage();
                    });
                }
                break;
        }
    }

    //#endregion

    openQuestMenu(){
        this.closeAllPage();
        this.questMenu.open();
        this._state.changeState(new QuestMenuState());
    }

    backToStart() {
        this.closeAllPage();
        this.mainMenu.open();
        this._state.changeState(new MainMenuState());
    }

    closeAllPage(){
        this.mainMenu.close();
        this.questMenu.close();
        ViewController.instance.view.commentUI.closeRobotDetail();
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
