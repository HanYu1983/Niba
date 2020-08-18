// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicStateViewer from "./lib/BasicStateViewer";
import BasicStateViewer from "./lib/BasicStateViewer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class View extends cc.Component {

    @property(BasicStateViewer)
    pages:BasicStateViewer[] = [];

    private currentPage:BasicStateViewer = null;

    openPageById(id:number){
        this.closeAllPages();
        this.pages[id].open();
        this.pages[id].node.x = this.pages[id].node.y = 0;
        this.currentPage = this.pages[id];
        return this.pages[id];
    }

    getCurrentPage(){
        return this.currentPage;
    }

    closeAllPages(){
        this.pages.forEach(page=>{
            page.close();
        });
    }
}
