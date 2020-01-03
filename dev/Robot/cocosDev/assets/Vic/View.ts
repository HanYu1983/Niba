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
import GamePage from "./Page/GamePage";
import MainPage from "./Page/MainPage";
import IView from "../Han/interface/IView";
import IUnit from "../Han/interface/IUnit";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component implements IView {
    updateMoveRange(data: number[][], cb: () => void) {
        this.getGamePage().map.showMovableGrid(data);
        cb();
    }
    updateAttackRange(data: number[][], cb: () => void) {
        this.getGamePage().map.showWeaponRange(data);
        cb();
    }
    updateMapAttackRange(data: number[][], cb: () => void) {
        cb();
    }
    updateCursor(data: number[], cb: () => void) {
        this.getGamePage().setCursor(data);
        cb();
    }
    updateMap(data: number[][], cb: () => void) {
        this.getGamePage().map.setMap(data);
        cb();
    }
    updateUnits(data: IUnit[], cb: () => void) {
        this.getGamePage().units.setUnits(data);
        cb();
    }
    playerTurnStart(data: any, cb: () => void) {
        this.getGamePage().openTurnStart(true, cb);
    }
    enemyTurnStart(data: string, cb: () => void) {
        this.getGamePage().openTurnStart(false, cb);
    }
    updatePlayTurn(data: { cursor: number[]; }, cb: () => void) {
        console.log(data.cursor);
        this.getGamePage().closeUnitMenu();
        cb()
    }
    updateSystemMenu(data: { menu: string[]; cursor: number; }, cb: () => void) {
        console.log(data.cursor);
        cc.log(data.menu);
        this.getGamePage().openSceneMenu(data.menu, cb);
    }
    updateUnitMenu(data: { menu: string[][]; cursor: number; subcursor: any; }, cb: () => void) {
        const cursor1 = data.cursor;
        const cursor2 = data.subcursor;
        const menu = data.menu;
        cc.log(cursor1, cursor2 );
        this.getGamePage().openUnitMenu(menu, [cursor1, cursor2]);
        cb();
    }
    updateUnitSelectMovePosition(data: { cursor: number[][]; }, cb: () => void) {
        console.log(data.cursor);
        this.getGamePage().closeUnitMenu();
        cb()
    }
    unitMoveAnim(data: { unit: IUnit; path: number[][]; }, cb: () => void) {
        console.log(data.unit);
        console.log(data.path);
        this.getGamePage().units.moveUnitByID(data.unit.key, data.path, cb);
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
