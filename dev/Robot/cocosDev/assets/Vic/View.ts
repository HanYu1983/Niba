import BasicViewer from "./BasicViewer";
import MainPage from "./Page/MainPage";
import IView from "../Han/interface/IView";
import IUnit from "../Han/interface/IUnit";
import GamePage from './Page/GamePage';

const { ccclass, property } = cc._decorator;

@ccclass
export default class View extends cc.Component {
    playerTurnStart(data: any, cb: () => void) {
        this.closeUnitMenu();
        this.closeSystemMenu();
        this.repaintPlayerStart(cb);
    }
    enemyTurnStart(enemyName: string, cb: () => void) {
        this.closeUnitMenu();
        this.closeSystemMenu();
        this.repaintEnemyTurnStart(enemyName, cb);
    }
    unitMoveAnim(data: { unit: IUnit; path: number[][]; }, cb: () => void) {
        this.performUnitMoveAnim(data.unit.key, data.path, cb);
    }
    unitBattleAnim(data: any, cb: () => void) {
        this.getGamePage().closeFightInfo();
        this.getGamePage().changeUnitHP(data, cb);
    }
    paint(data: any, cb: () => void) {
        this.repaintUnits(data.units);
        this.repaintMap(data.map)
        this.repaintCursor(data.cursor);
        this.repaintMoveRange(data.moveRange);
        this.repaintAttackRange(data.attackRange);
        this.repaintSystemMenu(data.systemMenu);
        this.repaintUnitMenu(data.unitMenu);
        this.repaintHitInfo(data.checkHitRate);
        this.repainBattleMenu(data.battleMenu);
        cb();
    }

    private repainBattleMenu(battleMenu:any){
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

    private repaintUnitMenu(unitMenu: any) {
        if (unitMenu) {
            this.createOrUpdateUnitMenu(
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
        this.getGamePage().map.showMovableGrid(data);
    }

    private repaintAttackRange(data: number[][]) {
        this.getGamePage().map.showWeaponRange(data);
    }

    private repaintMapAttackRange(data: number[][], cb: () => void) {
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
    }

    private repaintUnits(data: IUnit[]) {
        this.getGamePage().units.setUnits(data);
        this.getGamePage().showUnitSampleInfos(data);
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

    private createOrUpdateUnitMenu(menu: any, info: any, cursor: number, subcursor: number[]) {
        this.getGamePage().openUnitMenu([menu, info], [cursor, subcursor]);
    }

    private createOrUpdateSystemMenu(menu: any, info: any, cursor: number, subcursor: number[]) {
        this.getGamePage().openSceneMenu(menu, [cursor, subcursor]);
    }

    private performUnitMoveAnim(unitKey: string, path: number[][], cb: () => void) {
        this.getGamePage().units.moveUnitByID(unitKey, path, cb);
    }

    @property(BasicViewer)
    pages: BasicViewer[] = [];

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
        cc.log(id);
        let pos = [id % 20, Math.floor(id / 20)];
        cc.log(id % 20, Math.floor(id / 20));
        return pos;
    }
}
