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

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(BasicViewer)
    pages: BasicViewer[] = [];

    start() {
        this.openGamePage();
        /*
        window.startApp();
        window.viewOb.subscribe(e=>{
            console.log(e)
            const [cmd, args] = enum
            switch(cmd){
                case "unitMenu":
                    const [id, menu] = args;
                    this.getPopup(id=>{
                        window.viewNotifyOb.next(["ok", [id, menu[id]]])
                    })
                    break;
                case "createMap":
                    break;
            }
        })
        window.viewNotifyOb.next(["startGameplay"])
        window.viewNotifyOb.next(["selectMap", [0, 0]])
        */
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

    // onKeyUp(evt: cc.Event.EventKeyboard) {
    //     switch (evt.keyCode) {
    //         case cc.macro.KEY.w:
    //             cc.log("move up");
    //             break;
    //         case cc.macro.KEY.a:
    //             cc.log("move left");
    //             break;
    //         case cc.macro.KEY.s:
    //             cc.log("move bottom");
    //             break;
    //         case cc.macro.KEY.d:
    //             cc.log("move right");
    //             break;
    //         case cc.macro.KEY.enter:
    //             cc.log("enter");
    //             break;
    //         case cc.macro.KEY.escape:
    //             cc.log("esc");
    //             break;
    //     }
    // }

    // update (dt) {}
}
