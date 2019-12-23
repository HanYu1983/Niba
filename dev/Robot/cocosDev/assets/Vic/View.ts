// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import Controller from "./Controller";
import LandMap from "./GamePage/LandMap";
import BasicViewer from "./BasicViewer";
import GamePage from "./Page/GamePage";
import MainPage from "./Page/MainPage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(BasicViewer)
    pages: BasicViewer[] = [];

    start() {
        this.openGamePage();
    }

    onPlayerTurn(){
        this.getGamePage().closeSceneMenu();
        this.getGamePage().closeUnitMenu();
        this.getGamePage().addListener();
        this.getGamePage().node.on(GamePage.ON_GAMEPAGE_ENTER, (corsor) => {
            Controller.instance.notifySelectMap(corsor);
        }, this);
    }

    closeAllPages() {
        this.pages.forEach(element => {
            element.close();
        });
    }

    openMainPage():MainPage {
        this.closeAllPages();
        this.pages[0].open();
        return this.getMainPage();
    }

    openGamePage():GamePage {
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

    getGamePage():GamePage{
        return this.pages[1] as GamePage;
    }

    getMainPage():MainPage{
        return this.pages[0] as MainPage; 
    }

    getGridPos(pos: number[]) {
        return [pos[0] * 32 - 304, -pos[1] * 32 + 304];
    }

    getXYByIndex(id:number):number[]{
        cc.log(id);
        let pos = [id%20, Math.floor(id/20)];
        cc.log(id%20, Math.floor(id/20));
        return pos;
    }
}
