import BasicViewer from "./BasicViewer";
import CommentUI from "./CommentUI/CommentUI";
import MainPage from "./MainPage/MainPage";
import GamePage from "./GamePage/GamePage";
import ViewController from "./ViewController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class View extends cc.Component {
    playerTurnStart(data: any, cb: () => void) {
        this.closeUnitMenu();
        this.closeSystemMenu();
        this.repaintPlayerStart(cb);
    }
    enemyTurnStart(enemyName: any, cb: () => void) {
        this.closeUnitMenu();
        this.closeSystemMenu();
        this.repaintEnemyTurnStart(enemyName, cb);
    }
    unitMoveAnim(data: any, cb: () => void) {
        this.performUnitMoveAnim(data.unit.key, data.path, cb);
    }
    unitTargetingAnim(data: any, cb: () => void){
        this.getGamePage().showAimAnimation(data, cb);
    }
    unitBattleAnim(data: any, cb: () => void) {
        this.getGamePage().closeFightInfo();
        this.getGamePage().closeAccuracyInfos();
        this.getGamePage().changeUnitHP(data, cb);
    }
    unitDeadAnim(data: any, cb: ()=>void){
        this.getGamePage().explodeUnit(data, cb);
    }
    unitSkyAnim(data: any, cb: ()=>void){
        this.getGamePage().units.toSkyUnit(data.unit.key, cb);
    }
    unitGroundAnim(data: any, cb: ()=>void){
        this.getGamePage().units.toLandUnit(data.unit.key, cb);
    }
    unitGetAwardAnim(data: any, cb: ()=>void){
        this.getGamePage().awardUnitAnimation(data, cb);
    }
    showMessage(data: any, cb: ()=>void){
        this.getCommentUI().showAlert(data.message, ()=>{});
        cb()
    }
    paint(data: any, cb: () => void) {
        this.repaintUnits(data.units);
        this.repaintMap(data.map)
        this.repaintCursor(data.cursor);
        this.repaintMoveRange(data.moveRange);
        this.repaintAttackRange(data.attackRange);
        this.repaintSystemMenu(data.systemMenu);
        this.repaintUnitMenu(data.cursor, data.unitMenu);
        this.repaintHitInfo(data.checkHitRate);
        this.repaintBattleMenu(data.battleMenu);
        this.repaintCellstate(data.cellState);
        this.repaintStartUnitsMenu(data.startUnitsMenu);
        cb();
    }

    // 上下移動游標, 左右選擇取消, enter確認
    private repaintStartUnitsMenu(info:any){
        this.getGamePage().closeRobotSelectPanel();
        if(info){
            this.getGamePage().openRobotSelectPanel(info);
        }
    }

    private repaintCellstate(cellstate:any){
        this.getGamePage().closeUnitStatuMenu();
        if(cellstate){
            this.getGamePage().openUnitStatuMenu(cellstate);
        }
    }

    private repaintBattleMenu(battleMenu:any){
        if(battleMenu){
            this.getGamePage().showFightInfo(battleMenu);
        }else{
            this.getGamePage().closeFightInfo();
        }
    }

    private repaintHitInfo(checkHitRate:any){
        if(checkHitRate){
            this.getGamePage().showAccuracyInfos(checkHitRate);
        }else{
            this.getGamePage().closeAccuracyInfos();
        }
    }

    private repaintUnitMenu(pos:number[], unitMenu: any) {
        if (unitMenu) {
            this.createOrUpdateUnitMenu(
                pos,
                unitMenu.menuCursor.menu,
                unitMenu.data,
                unitMenu.menuCursor.cursor,
                unitMenu.menuCursor.subcursor
            );
        } else {
            this.closeUnitMenu();
        }
    }

    private repaintSystemMenu(systemMenu: any) {
        if (systemMenu) {
            this.createOrUpdateSystemMenu(
                systemMenu.menuCursor.menu,
                systemMenu.data,
                systemMenu.menuCursor.cursor,
                systemMenu.menuCursor.subcursor
            );
        } else {
            this.closeSystemMenu();
        }
    }

    private repaintMoveRange(data: number[][]) {
        if(data == null){
            return;
        }
        this.getGamePage().map.showMovableGrid(data);
    }

    private repaintAttackRange(data: number[][]) {
        if(data == null){
            return;
        }
        this.getGamePage().map.showWeaponRange(data);
    }

    private repaintMapAttackRange(data: number[][], cb: () => void) {
        if(data == null){
            return;
        }
        this.getGamePage().map.showWeaponRange(data);
        cb();
    }

    private repaintCursor(cursor: number[]) {
        this.getGamePage().setCursor(cursor);
    }

    private repaintMap(data: number[][]) {
        // let temp = GamePage.generateMap(20,20);
        // this.getGamePage().map.setMapOneLevel(temp);

        this.getGamePage().map.setMap(data);
        this.getGamePage().setSmallMap(data);
    }

    private repaintUnits(data: IUnit[]) {
        if(data == null){
            return;
        }
        this.getGamePage().units.setUnits(data);
        // this.getGamePage().showUnitSampleInfos(data);
    }

    private repaintPlayerStart(cb: () => void) {
        this.getGamePage().openTurnStart(true, cb);
    }

    private repaintEnemyTurnStart(enemyName: string, cb: () => void) {
        this.getGamePage().openTurnStart(false, cb);
    }

    private closeUnitMenu() {
        this.getGamePage().closeUnitMenu();
    }

    private closeSystemMenu() {
        this.getGamePage().closeSceneMenu();
    }

    private createOrUpdateUnitMenu(pos:number[], menu: any, info: any, cursor: number, subcursor: number[]) {
        this.getGamePage().openUnitMenu(pos, [menu, info], [cursor, subcursor]);
    }

    private createOrUpdateSystemMenu(menu: any, info: any, cursor: number, subcursor: number[]) {
        this.getGamePage().openSceneMenu(menu, [cursor, subcursor]);
    }

    private performUnitMoveAnim(unitKey: string, path: number[][], cb: () => void) {
        this.getGamePage().closeUnitSampleInfos();
        this.getGamePage().units.moveUnitByID(unitKey, path, cb);
    }

    @property(BasicViewer)
    pages: BasicViewer[] = [];

    @property(CommentUI)
    commentUI:CommentUI = null;

    closeAllPages() {
        this.pages.forEach(element => {
            element.close();
        });
    }

    openMainPage(): MainPage {
        this.closeAllPages();
        this.pages[0].open();
        return this.getMainPage();
    }

    openGamePage(): GamePage {
        this.closeAllPages();
        this.openLoadingPage();

        this.node.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function () {
            this.pages[1].open();
            this.closeLoadingPage();
        }, this)));

        return this.getGamePage();
    }

    openLoadingPage() {
        this.pages[2].open();
    }

    closeLoadingPage() {
        this.pages[2].close();
    }

    getCommentUI():CommentUI{
        return this.commentUI;
    }

    getGamePage(): GamePage {
        return this.pages[1] as GamePage;
    }

    getMainPage(): MainPage {
        return this.pages[0] as MainPage;
    }

    getGridPos(pos: number[]) {
        return [pos[0] * 32 - 304, -pos[1] * 32 + 304];
    }

    getXYByIndex(id: number): number[] {
        let pos = [id % 20, Math.floor(id / 20)];
        return pos;
    }
    
    getWeaponConfig(keys:string[]){
        let ws = [];
        for (let id in keys) {
            let key = keys[id];
            let weaponDetail = ViewController.instance.getWeapon(key);
            ws.push(weaponDetail);
        }
        return ws;
    }
}
