// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "./lib/BasicViewer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class View extends cc.Component {

    @property(BasicViewer)
    pages:BasicViewer[] = [];

    openPageById(id:number){
        this.closeAllPages();
        this.pages[id].open();
        this.pages[id].node.x = this.pages[id].node.y = 0;
        return this.pages[id];
    }

    closeAllPages(){
        this.pages.forEach(page=>{
            page.close();
        });
    }
}
