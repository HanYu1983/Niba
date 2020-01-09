// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import LandMap from "./GamePage/LandMap";
import BasicViewer from "./BasicViewer";
import MainPage from "./Page/MainPage";
import IView from "../Han/interface/IView";
import IUnit from "../Han/interface/IUnit";
import GamePage from './Page/GamePage';
import MenuCursor from "./MenuCursor";

const { ccclass, property } = cc._decorator;

@ccclass
export default class View extends cc.Component implements IView {
    updateMoveRange(data: number[][], cb: () => void) {
        this.repaintMoveRange(data, cb);
    }
    updateAttackRange(data: number[][], cb: () => void) {
        this.repaintAttackRange(data, cb);
    }
    updateMapAttackRange(data: number[][], cb: () => void) {
        this.repaintMapAttackRange(data, cb);
    }
    updateCursor(data: number[], cb: () => void) {
        this.repaintCursor(data, cb);
    }
    updateMap(data: number[][], cb: () => void) {
        this.repaintMap(data, cb);
    }
    updateUnits(data: IUnit[], cb: () => void) {
        this.repaintUnits(data, cb);
    }
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


    updatePlayTurn(data: { cursor: number[]; }, cb: () => void) {
        this.closeUnitMenu();
        this.closeSystemMenu();
        cb();
    }
    updateSystemMenu(data: any, cb: () => void) {
        this.createOrUpdateSystemMenu(data.menuCursor.menu, data.data, data.menuCursor.cursor, data.menuCursor.subcursor);
        cb();
    }
    updateUnitMenu(data: any, cb: () => void) {
        this.createOrUpdateUnitMenu(data.menuCursor.menu, data.data, data.menuCursor.cursor, data.menuCursor.subcursor);
        cb();
    }
    updateUnitSelectMovePosition(data: { cursor: number[][]; }, cb: () => void) {
        this.closeUnitMenu();
        this.closeSystemMenu();
        cb();
    }
    updateUnitSelectSingleTarget(data: any, cb: () => void) {
        this.closeUnitMenu();
        this.closeSystemMenu();
        cb();
    }   
    updateUnitBattleMenu(data: any, cb: () => void) {
        this.closeUnitMenu();
        this.closeSystemMenu();
        cb();
    }


    // ====================== //

    private repaintMoveRange(data: number[][], cb: () => void) {
        this.getGamePage().map.showMovableGrid(data);
        cb();
    }

    private repaintAttackRange(data: number[][], cb: () => void) {
        this.getGamePage().map.showWeaponRange(data);
        cb();
    }

    private repaintMapAttackRange(data: number[][], cb: () => void) {
        this.getGamePage().map.showWeaponRange(data);
        cb();
    }

    private repaintCursor(cursor: number[], cb: () => void) {
        this.getGamePage().setCursor(cursor);
        cb();
    }

    private repaintMap(data: number[][], cb: () => void) {
        this.getGamePage().map.setMap(data);
        cb();
    }

    private repaintUnits(data: IUnit[], cb: () => void) {
        this.getGamePage().units.setUnits(data);
        cb();
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

    // ====================== //

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
