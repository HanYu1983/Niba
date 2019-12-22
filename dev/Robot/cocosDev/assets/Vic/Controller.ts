// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import View from "./View"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(View)
    view:View = null;

    static instance:NewClass;

    start(){
        NewClass.instance = this;

        window.startApp();
        window.viewOb.subscribe(e=>{
            const [cmd, args] = e;
            switch(cmd){
                case "createUnits":
                    {
                        const [id, units] = args;
                        this.view.getGamePage().units.setUnits(units);
                        this.notifyModel("ok", id, 0);
                    }
                case "unitStateMenu":
                    {
                        const [id] = args;
                        this.notifyAnswer(id);
                    }
                    break;
                case "setCursor":
                    {
                        const [id, pos] = args;
                        this.view.getGamePage().setCursor(pos);
                        this.notifyAnswer(id);
                    }
                    break;
                case "unitMenuClose":
                    {
                        const [id] = args;
                        this.view.getGamePage().closeUnitMenu();
                        this.notifyAnswer(id);
                    }
                    break;
                case "unitMenu":
                    {
                        const [id, menu] = args;
                        this.view.getGamePage().openUnitMenu(menu, ((key)=>{
                            this.notifyAnswer(id, key);
                        }).bind(this));
                    }
                    break;
                case "createMap":
                    {
                        const [id, map] = args;
                        this.view.getGamePage().map.setMap(map);
                        this.notifyAnswer(id);
                    }
                    break;
            }
        })   
    }

    notifySetCursor(pos:number[]){
        cc.log("==============")
        cc.log(pos);
        this.notifyCmd("setCursor", pos);
    }

    notifyStartGame(){
        this.notifyCmd("startGameplay");
    }

    notifyAnswer(id, args = 0){
        this.notifyModel("ok", id, args);
    }

    notifySelectMap(pos:number[]){
        this.notifyCmd("selectMap", pos);
    }

    notifyModel(cmd:string, id:number, data:any){
        window.viewNotifyOb.next([cmd, [id, data]]);
    }

    notifyCmd(cmd:string, data:any = undefined){
        window.viewNotifyOb.next([cmd, data]);
    }
}
