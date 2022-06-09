// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "./BasicViewer";
import MenuButtons from "./MenuButtons";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ListPageController extends BasicViewer {

    @property(MenuButtons)
    list:MenuButtons = null;

    pageId:number = 0;

    maxPageId:number = 0;

    loop:boolean = true;


    open(){
        super.open();
        this.list.open();
    }

    close(){
        super.close();
        this.list.close();
    }

    prevPage(){
        if(--this.pageId < 0){
            this.pageId = this.loop ? this.maxPageId : 0;
        }
    }

    nextPage(){
        if(++this.pageId > this.maxPageId){
            this.pageId = this.loop ? 0 : this.maxPageId;
        }
    }
}
