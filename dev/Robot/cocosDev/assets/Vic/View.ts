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

    static instance:NewClass;

    start() {
        NewClass.instance = this;

        this.openGamePage();
        
        window.startApp();
        window.viewOb.subscribe(e=>{
            console.log(e)
            const [cmd, args] = e;
            switch(cmd){
                case "unitMenuClose":
                    const [id] = args;
                    this.notifyModel("ok", id, 0);
                    this.getGamePage().closeUnitMenu();
                    break;
                case "unitMenu":
                    const [id, menu] = args;
                    this.getGamePage().openUnitMenu(id, menu);
                    break;
                case "createMap":
                    this.getGamePage().getMap().setMap(GamePage.generateMap(.3, .35, .05, .6, .8, .8, .02));

                    const [id] = args;
                    this.notifyModel("ok", id, 0);
                    break;
            }
        })        
    }

    notifyModel(cmd:string, id:number, data:any){
        window.viewNotifyOb.next([cmd, [id, data]]);

        
    }

    notifyCmd(cmd:string, data:any = undefined){
        window.viewNotifyOb.next(["startGameplay", data]);
    }

    // initAllPages(){
    //     this.pages.forEach(page=>{ page.init(this);})
    // }

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

    // update (dt) {}
}
