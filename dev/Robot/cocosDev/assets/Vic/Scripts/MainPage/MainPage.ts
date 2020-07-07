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
import MainMenu from '../MainPage/MainMenu/MainMenu';
import PrepareMenu from '../MainPage/PrepareMenu/PrepareMenu';
import MainMenuState from '../MainPage/MainMenu/MainMenuState';
import PrepareMenuState from '../MainPage/PrepareMenu/PrepareMenuState';
import RobotStoreBuyState from '../MainPage/RobotStore/RobotStoreBuyState';
import PilotStoreBuyState from '../MainPage/PilotStore/PilotStoreBuyState';
import PilotStoreState from '../MainPage/PilotStore/PilotStoreState';
import RobotStoreState from '../MainPage/RobotStore/RobotStoreState';
import QuestMenu from '../MainPage/QuestMenu/QuestMenu';
import QuestMenuState from '../MainPage/QuestMenu/QuestMenuState';
import RobotDetailOnStoreState from '../CommentUI/RobotDetailPanel/RobotDetailOnStoreState';
import PilotDetailOnStoreState from '../CommentUI/PilotDetailPanel/PilotDetailOnStoreState';
import WeaponStore from './WeaponStore/WeaponStore';
import WeaponStoreState from './WeaponStore/WeaponStoreState';
import ComponentStore from './ComponentStore/ComponentStore';
import ComponentStoreState from './ComponentStore/ComponentStoreState';
import ComponentDetailOnStoreState from '../CommentUI/ComponentDetailPanel/ComponentDetailOnStoreState';
import ComponentStoreBuyState from './ComponentStore/ComponentStoreBuyState';
import WeaponDetailOnStoreState from '../CommentUI/WeaponDetailPanel/WeaponDetailOnStoreState';
import WeaponStoreBuyState from './WeaponStore/WeaponStoreBuyState';
import ComponentSetting from './ComponentSetting/ComponentSetting';
import ComponentSettingComponentState from './ComponentSetting/ComponentSettingComponentState';
import ComponentSettingRobotState from './ComponentSetting/ComponentSettingRobotState';
import ComponentSettingRobotEquipState from './ComponentSetting/ComponentSettingRobotEquipState';
import WeaponSetting from './WeaponSetting/WeaponSetting';
import WeaponSettingRobotEquipState from './WeaponSetting/WeaponSettingRobotEquipState';
import WeaponSettingRobotState from './WeaponSetting/WeaponSettingRobotState';
import WeaponSettingComponentState from './WeaponSetting/WeaponSettingComponentState';
import PilotSetting from './PilotSetting/PilotSetting';
import PilotSettingRobotEquipState from './PilotSetting/PilotSettingRobotEquipState';
import PilotSettingComponentState from './PilotSetting/PilotSettingComponentState';
import PilotSettingRobotState from './PilotSetting/PilotSettingRobotState';
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

    @property(WeaponStore)
    weaponStore: WeaponStore = null;

    @property(ComponentStore)
    componentStore:ComponentStore = null;

    @property(ComponentSetting)
    componentSetting:ComponentSetting = null;

    @property(WeaponSetting)
    weaponSetting:WeaponSetting = null;

    @property(PilotSetting)
    pilotSetting:PilotSetting = null;

    @property(cc.Label)
    money: cc.Label = null;

    private _state: StateController;

    init() {
        this._state = this.node.getComponent(StateController);
    }

    open() {
        super.open();
        ViewController.instance.notifyStartLobby();
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
                this.openWeaponStore();
                break;
            }
            case "購買配件":{
                this.openComponentStore();
                break;
            }
            case "配置駕駛":{
                this.openPilotSetting();
                break;
            }
            case "配置軍火":{
                this.openWeaponSetting();
                break;
            }
            case "配置配件":{
                this.openComponentSetting();
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
        this.robotStore.list.onPrevClick(this);
    }

    onRobotStoreDownClick() {
        this.robotStore.list.onNextClick(this);
    }

    onRobotStoreLeftClick() {
        this.robotStore.prevPage();
    }

    onRobotStoreRightClick() {
        this.robotStore.nextPage();
    }

    onRobotStoreEnterClick() {

        const data = this.robotStore.list.getFocus();
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
        this.pilotStore.list.onPrevClick(this);
    }

    onPilotStoreDownClick() {
        this.pilotStore.list.onNextClick(this);
    }

    onPilotStoreLeftClick() {
        this.pilotStore.list.onLeftClick(this);
    }

    onPilotStoreRightClick() {
        this.pilotStore.list.onRightClick(this);
    }

    onPilotStoreEnterClick() {
        const data = this.pilotStore.list.getFocus();
        ViewController.instance.view.getCommentUI().openPilotDetail(data, ["購買","取消"]);
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
            const buyPilot = this.pilotStore.list.getFocus();
            ViewController.instance.model.buyPilotById(buyPilot.key, (err: any, data: any) => {
                ViewController.instance.view.getCommentUI().showAlert("已購買");
            });
        }
        this.onPilotStoreBuyEscClick();
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
            const buyRobot = this.robotStore.list.getFocus();
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
                const data = this.robotStore.list.getFocus();
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
            case "購買":{
                const data = this.pilotStore.list.getFocus();
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
    
    //#region 確定購買武器的popup
    onWeaponStoreBuyLeftClick() {
        ViewController.instance.view.getCommentUI().popPanel.onLeftClick();
    }

    onWeaponStoreBuyRightClick() {
        ViewController.instance.view.getCommentUI().popPanel.onRightClick();
    }

    onWeaponStoreBuyEnterClick() {
        const cursor: number[] = ViewController.instance.view.getCommentUI().popPanel.getCursor();
        if (cursor[0] == 0) {
            const buyWeapon = this.weaponStore.list.getFocus();
            ViewController.instance.model.buyWeaponById(buyWeapon.key, (err: any, data: any) => {
                ViewController.instance.view.getCommentUI().showAlert("已購買");
            });
        }
        this.onWeaponStoreBuyEscClick();
    }

    onWeaponStoreBuyEscClick() {
        ViewController.instance.view.getCommentUI().closePop();
        this._state.changeState(new WeaponDetailOnStoreState())
    }
    //#endregion

    //#region 買武器的選單

    onWeaponStoreUpClick() {
        this.weaponStore.list.onPrevClick(this);
    }

    onWeaponStoreDownClick() {
        this.weaponStore.list.onNextClick(this);
    }

    onWeaponStoreLeftClick() {
        this.weaponStore.prevPage();
    }

    onWeaponStoreRightClick() {
        this.weaponStore.nextPage();
    }

    onWeaponStoreEnterClick() {
        const data = this.weaponStore.list.getFocus();
        ViewController.instance.view.getCommentUI().openWeaponDetail(data, ["購買","取消"]);
        this._state.changeState(new WeaponDetailOnStoreState());
    }

    onWeaponStoreEscClick() {
        this.openPrepareMenu();
    }

    //#endregion

    //#region 確定購買配件的popup
    onComponentStoreBuyLeftClick() {
        ViewController.instance.view.getCommentUI().popPanel.onLeftClick();
    }

    onComponentStoreBuyRightClick() {
        ViewController.instance.view.getCommentUI().popPanel.onRightClick();
    }

    onComponentStoreBuyEnterClick() {
        const cursor: number[] = ViewController.instance.view.getCommentUI().popPanel.getCursor();
        if (cursor[0] == 0) {
            const buyComponent = this.componentStore.list.getFocus();
            ViewController.instance.model.buyComponentById(buyComponent.key, (err: any, data: any) => {
                ViewController.instance.view.getCommentUI().showAlert("已購買");
            });
        }
        this.onComponentStoreBuyEscClick();
    }

    onComponentStoreBuyEscClick() {
        ViewController.instance.view.getCommentUI().closePop();
        this._state.changeState(new ComponentDetailOnStoreState())
    }
    //#endregion

    //#region 買配件的選單

    onComponentStoreUpClick() {
        this.componentStore.list.onPrevClick(this);
    }

    onComponentStoreDownClick() {
        this.componentStore.list.onNextClick(this);
    }

    onComponentStoreLeftClick() {
        this.componentStore.prevPage();
    }

    onComponentStoreRightClick() {
        this.componentStore.nextPage();
    }

    onComponentStoreEnterClick() {
        const data = this.componentStore.list.getFocus();
        ViewController.instance.view.getCommentUI().openComponentDetail(data, ["購買","取消"]);
        this._state.changeState(new ComponentDetailOnStoreState());
    }

    onComponentStoreEscClick() {
        this.openPrepareMenu();
    }

    //#endregion

    //#region ComponentDetailOnStoreState
    onComponentDetailOnStoreUpClick(){
        ViewController.instance.view.commentUI.componentDetailPanel.menu.onPrevClick();
    }

    onComponentDetailOnStoreDownClick(){
        ViewController.instance.view.commentUI.componentDetailPanel.menu.onNextClick();
    }

    onComponentDetailOnStoreLeftClick(){
        
    }

    onComponentDetailOnStoreRightClick(){
        
    }

    onComponentDetailOnStoreEnterClick(){
        switch(ViewController.instance.view.commentUI.componentDetailPanel.menu.getFocus()){
            case "購買":{
                const data = this.componentStore.list.getFocus();
                ViewController.instance.view.getCommentUI().openPopup("確定要買？");
                this._state.changeState(new ComponentStoreBuyState());
                break;
            }
            case "取消":{
                this.onComponentDetailOnStoreEscClick();
                break;
            }
        }
    }

    onComponentDetailOnStoreEscClick(){
        ViewController.instance.view.commentUI.closeComponentDetail();
        this._state.changeState(new ComponentStoreState());
    }
    //#endregion
    
    //#region WeaponDetailOnStoreState
    onWeaponDetailOnStoreUpClick(){
        ViewController.instance.view.commentUI.weaponDetailPanel.menu.onPrevClick();
    }

    onWeaponDetailOnStoreDownClick(){
        ViewController.instance.view.commentUI.weaponDetailPanel.menu.onNextClick();
    }

    onWeaponDetailOnStoreLeftClick(){
        
    }

    onWeaponDetailOnStoreRightClick(){
        
    }

    onWeaponDetailOnStoreEnterClick(){
        switch(ViewController.instance.view.commentUI.weaponDetailPanel.menu.getFocus()){
            case "購買":{
                const data = this.weaponStore.list.getFocus();
                ViewController.instance.view.getCommentUI().openPopup("確定要買？");
                this._state.changeState(new WeaponStoreBuyState());
                break;
            }
            case "取消":{
                this.onWeaponDetailOnStoreEscClick();
                break;
            }
        }
    }

    onWeaponDetailOnStoreEscClick(){
        ViewController.instance.view.commentUI.closeWeaponDetail();
        this._state.changeState(new WeaponStoreState());
    }
    //#endregion
    
    //#region ComponentSettingComponentState

    onComponentSettingComponentStateUpClick(){
        this.componentSetting.upComponentList();
    }

    onComponentSettingComponentStateDownClick(){
        this.componentSetting.downComponentList();
        
    }
    onComponentSettingComponentStateLeftClick(){
        
    }
    onComponentSettingComponentStateRightClick(){
        
    }
    onComponentSettingComponentStateEnterClick(){
        let component = this.componentSetting.componentList.list.getFocus();
        let equip = this.componentSetting.robotEquipList.list.getFocus();
        let robot = this.componentSetting.robotList.list.getFocus();

        let callback = (err, data)=>{
            this.componentSetting.setRobotList();
            this.onComponentSettingComponentStateEscClick();
        }

        if( equip.title == "新增"){
            ViewController.instance.model.addUnitComponent(robot.key, component.key, callback);
        }else{
            if( component.title == "拆除"){
                ViewController.instance.model.removeUnitComponent(robot.key, equip.key, callback);
            }else{
                ViewController.instance.model.removeUnitComponent(robot.key, equip.key, ()=>{
                    ViewController.instance.model.addUnitComponent(robot.key, component.key, callback);
                });
            }
        }
    }
    onComponentSettingComponentStateEscClick(){
        this._state.changeState(new ComponentSettingRobotEquipState());
        this.componentSetting.prevFocus();
    }

    //#endregion
    
    //#region ComponentSettingRobotState

    onComponentSettingRobotStateUpClick(){
        this.componentSetting.upRobotList();
    }

    onComponentSettingRobotStateDownClick(){
        this.componentSetting.downRobotList();
        
    }
    onComponentSettingRobotStateLeftClick(){
        
    }
    onComponentSettingRobotStateRightClick(){
        
    }
    onComponentSettingRobotStateEnterClick(){
        this._state.changeState(new ComponentSettingRobotEquipState());
        this.componentSetting.nextFocus();
    }
    onComponentSettingRobotStateEscClick(){
        this.openPrepareMenu();
    }

    //#endregion
    
    
    //#region ComponentSettingRobotEquipState

    onComponentSettingRobotEquipStateUpClick(){
        this.componentSetting.upRobotEquipList();
    }

    onComponentSettingRobotEquipStateDownClick(){
        this.componentSetting.downRobotEquipList();
        
    }
    onComponentSettingRobotEquipStateLeftClick(){
        
    }
    onComponentSettingRobotEquipStateRightClick(){
        
    }
    onComponentSettingRobotEquipStateEnterClick(){
        this._state.changeState(new ComponentSettingComponentState());
        this.componentSetting.nextFocus();
    }
    onComponentSettingRobotEquipStateEscClick(){
        this._state.changeState(new ComponentSettingRobotState());
        this.componentSetting.prevFocus();
    }

    //#endregion

    //#region WeaponSettingComponentState

    onWeaponSettingComponentStateUpClick(){
        this.weaponSetting.upComponentList();
    }

    onWeaponSettingComponentStateDownClick(){
        this.weaponSetting.downComponentList();
        
    }
    onWeaponSettingComponentStateLeftClick(){
        
    }
    onWeaponSettingComponentStateRightClick(){
        
    }
    onWeaponSettingComponentStateEnterClick(){
        let component = this.weaponSetting.componentList.list.getFocus();
        let equip = this.weaponSetting.robotEquipList.list.getFocus();
        let robot = this.weaponSetting.robotList.list.getFocus();

        let callback = (err, data)=>{
            this.weaponSetting.setRobotList();
            this.onWeaponSettingComponentStateEscClick();
        }

        if( equip.title == "新增"){
            ViewController.instance.model.addUnitWeapon(robot.key, component.key, callback);
        }else{
            if( component.title == "拆除"){
                ViewController.instance.model.removeUnitWeapon(robot.key, equip.key, callback);
            }else{
                ViewController.instance.model.removeUnitWeapon(robot.key, equip.key, ()=>{
                    ViewController.instance.model.addUnitWeapon(robot.key, component.key, callback);
                });
            }
        }
    }
    onWeaponSettingComponentStateEscClick(){
        this._state.changeState(new WeaponSettingRobotEquipState());
        this.weaponSetting.prevFocus();
    }

    //#endregion
    
    //#region WeaponSettingRobotState

    onWeaponSettingRobotStateUpClick(){
        this.weaponSetting.upRobotList();
    }

    onWeaponSettingRobotStateDownClick(){
        this.weaponSetting.downRobotList();
        
    }
    onWeaponSettingRobotStateLeftClick(){
        
    }
    onWeaponSettingRobotStateRightClick(){
        
    }
    onWeaponSettingRobotStateEnterClick(){
        this._state.changeState(new WeaponSettingRobotEquipState());
        this.weaponSetting.nextFocus();
    }
    onWeaponSettingRobotStateEscClick(){
        this.openPrepareMenu();
    }

    //#endregion
    
    
    //#region WeaponSettingRobotEquipState

    onWeaponSettingRobotEquipStateUpClick(){
        this.weaponSetting.upRobotEquipList();
    }

    onWeaponSettingRobotEquipStateDownClick(){
        this.weaponSetting.downRobotEquipList();
        
    }
    onWeaponSettingRobotEquipStateLeftClick(){
        
    }
    onWeaponSettingRobotEquipStateRightClick(){
        
    }
    onWeaponSettingRobotEquipStateEnterClick(){
        this._state.changeState(new WeaponSettingComponentState());
        this.weaponSetting.nextFocus();
    }
    onWeaponSettingRobotEquipStateEscClick(){
        this._state.changeState(new WeaponSettingRobotState());
        this.weaponSetting.prevFocus();
    }

    //#endregion

    //#region PilotSettingComponentState

    onPilotSettingComponentStateUpClick(){
        this.pilotSetting.upComponentList();
    }

    onPilotSettingComponentStateDownClick(){
        this.pilotSetting.downComponentList();
        
    }
    onPilotSettingComponentStateLeftClick(){
        
    }
    onPilotSettingComponentStateRightClick(){
        
    }
    onPilotSettingComponentStateEnterClick(){
        let component = this.pilotSetting.componentList.list.getFocus();
        let equip = this.pilotSetting.robotEquipList.list.getFocus();
        let robot = this.pilotSetting.robotList.list.getFocus();

        let callback = (err, data)=>{
            this.pilotSetting.setRobotList();
            this.onPilotSettingComponentStateEscClick();
        }

        if( equip.title == "新增"){
            ViewController.instance.model.setRobotPilot(robot.key, component.key, callback);
        }else{
            if( component.title == "拆除"){
                ViewController.instance.model.removeRobotPilot(robot.key, equip.key, callback);
            }else{
                ViewController.instance.model.removeRobotPilot(robot.key, equip.key, ()=>{
                    ViewController.instance.model.setRobotPilot(robot.key, component.key, callback);
                });
            }
        }
    }
    onPilotSettingComponentStateEscClick(){
        this._state.changeState(new PilotSettingRobotEquipState());
        this.pilotSetting.prevFocus();
    }

    //#endregion
    
    //#region PilotSettingRobotState

    onPilotSettingRobotStateUpClick(){
        this.pilotSetting.upRobotList();
    }

    onPilotSettingRobotStateDownClick(){
        this.pilotSetting.downRobotList();
        
    }
    onPilotSettingRobotStateLeftClick(){
        
    }
    onPilotSettingRobotStateRightClick(){
        
    }
    onPilotSettingRobotStateEnterClick(){
        this._state.changeState(new PilotSettingRobotEquipState());
        this.pilotSetting.nextFocus();
    }
    onPilotSettingRobotStateEscClick(){
        this.openPrepareMenu();
    }

    //#endregion
    
    //#region PilotSettingRobotEquipState

    onPilotSettingRobotEquipStateUpClick(){
        this.pilotSetting.upRobotEquipList();
    }

    onPilotSettingRobotEquipStateDownClick(){
        this.pilotSetting.downRobotEquipList();
        
    }
    onPilotSettingRobotEquipStateLeftClick(){
        
    }
    onPilotSettingRobotEquipStateRightClick(){
        
    }
    onPilotSettingRobotEquipStateEnterClick(){
        this._state.changeState(new PilotSettingComponentState());
        this.pilotSetting.nextFocus();
    }
    onPilotSettingRobotEquipStateEscClick(){
        this._state.changeState(new PilotSettingRobotState());
        this.pilotSetting.prevFocus();
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
        this.robotStore.setlist();
        this._state.changeState(new RobotStoreState());
    }

    openPilotStore() {
        this.closeAllPage();
        this.pilotStore.open();
        this.pilotStore.setlist();
        this._state.changeState(new PilotStoreState());
    }

    openWeaponStore() {
        this.closeAllPage();
        this.weaponStore.open();
        this.weaponStore.setlist();
        this._state.changeState(new WeaponStoreState());
    }

    openComponentStore() {
        this.closeAllPage();
        this.componentStore.open();
        this.componentStore.setlist();
        this._state.changeState(new ComponentStoreState());
    }

    openPilotSetting() {
        this.closeAllPage();
        this.pilotSetting.open();
        this._state.changeState(new PilotSettingRobotState());
    }

    openComponentSetting(){
        this.closeAllPage();
        this.componentSetting.open();
        this._state.changeState(new ComponentSettingRobotState());
    }

    openWeaponSetting(){
        this.closeAllPage();
        this.weaponSetting.open();
        this._state.changeState(new WeaponSettingRobotState());
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
        this.pilotSetting.close();
        this.weaponStore.close();
        this.weaponSetting.close();
        this.componentStore.close();
        this.componentSetting.close();
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
