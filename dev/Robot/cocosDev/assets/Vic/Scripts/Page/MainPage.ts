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
import MenuButton from '../MenuButton';
import RobotStoreBuyState from '../MainPage/RobotStoreBuyState';
import PilotStoreState from '../MainPage/PilotStoreState';
import PilotStoreBuyState from '../MainPage/PilotStoreBuyState';
import StandByState from '../MainPage/StandyByState';
import StandByRobotDetailState from '../MainPage/StandyByRobotDetailState';
import StandByRobotPilotState from '../MainPage/StandyByRobotPilotState';
import StandByRobotPilotPopState from '../MainPage/StandyByRobotPilotPopState';
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Layout)
export default class MainPage extends BasicViewer {

    @property(MenuButtons)
    menu: MenuButtons = null;

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

        this.menu.updateItem = (btn: MenuButton, data: any) => {
            btn.setLabel(data);
        };
    }

    open() {
        super.open();

        this.menu.open();
        this.menu.setData(["整備部隊", "購買機體", "雇傭駕駛", "出擊"]);

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
        super.close();
    }

    //#region MainPageDefaultState 最外層的選單

    onMenuUpClick() {
        this.menu.onPrevClick();
    }

    onMenuDownClick() {
        this.menu.onNextClick();
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

    //#endregion

    //#region RobotStoreState 最外層的選單-》買機體的選單

    onRobotStoreUpClick() {
        this.robotStore.robotList.onPrevClick(this);
    }

    onRobotStoreDownClick() {
        this.robotStore.robotList.onNextClick(this);
    }

    onRobotStoreLeftClick() {
        this.robotStore.robotList.onLeftClick(this);
    }

    onRobotStoreRightClick() {
        this.robotStore.robotList.onRightClick(this);
    }

    onRobotStoreEnterClick() {
        this._state.changeState(new RobotStoreBuyState());

        const data = this.robotStore.robotList.getFocus();
        ViewController.instance.view.getCommentUI().openPopup("確定要買？");
    }

    onRobotStoreEscClick() {
        this.backToLooby();
    }

    //#endregion

    //#region PilotStoreState 最外層的選單-》買駕駛員的選單

    onPilotStoreUpClick() {
        this.pilotStore.robotList.onPrevClick(this);
    }

    onPilotStoreDownClick() {
        this.pilotStore.robotList.onNextClick(this);
    }

    onPilotStoreLeftClick() {
        this.pilotStore.robotList.onLeftClick(this);
    }

    onPilotStoreRightClick() {
        this.pilotStore.robotList.onRightClick(this);
    }

    onPilotStoreEnterClick() {
        this._state.changeState(new PilotStoreBuyState());

        const data = this.pilotStore.robotList.getFocus();
        ViewController.instance.view.getCommentUI().openPopup("確定要買？");
    }

    onPilotStoreEscClick() {
        this.backToLooby();
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
            ViewController.instance.model.buyPilotById((data:any)=>{
                ViewController.instance.view.getCommentUI().showAlert("已購買");
            });
        }
        ViewController.instance.view.getCommentUI().closePop();
        this._state.changeState(new PilotStoreState())
    }

    onPilotStoreBuyEscClick() {
        ViewController.instance.view.getCommentUI().closePop();
        this._state.changeState(new PilotStoreState())
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
            ViewController.instance.model.buyRobotById((data:any)=>{
                ViewController.instance.view.getCommentUI().showAlert("已購買");
            });
        }
        ViewController.instance.view.getCommentUI().closePop();
        this._state.changeState(new RobotStoreState())
    }

    onRobotStoreBuyEscClick() {
        ViewController.instance.view.getCommentUI().closePop();
        this._state.changeState(new RobotStoreState())
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
        this.backToLooby();
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
            ViewController.instance.model.setRobotPilot((data:any)=>{
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

    openRobotStore() {
        this.closeAllSub();
        this.robotStore.open();
        this.robotStore.setRobotList();
        this._state.changeState(new RobotStoreState());
    }

    openPilotStore() {
        this.closeAllSub();
        this.pilotStore.open();
        this.pilotStore.setRobotList();
        this._state.changeState(new PilotStoreState());
    }

    openStandBy() {
        this.closeAllSub();
        this.standBy.open();
        this.standBy.setRobotList();
        this._state.changeState(new StandByState());
    }

    backToLooby() {
        this.closeAllSub();
        this._state.changeState(new MainPageDefaultState());
    }

    closeAllSub() {
        this.robotStore.close();
        this.pilotStore.close();
        this.standBy.close();
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
