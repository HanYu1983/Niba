// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MenuButtons from "./MenuButtons";
import ViewController from "./ViewController";
import BasicViewer from "./BasicViewer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StoreListPanel extends BasicViewer {

    @property(MenuButtons)
    list: MenuButtons = null;

    private _pageId:number = 0;

    init() {
        this.list.updateItem = this.updateItem;
    }

    prevPage(){
        if(--this._pageId < 0) this._pageId = 0;
        this.setlist();
    }

    nextPage(){
        this._pageId++;
        this.setlist();
    }

    setlist() {
        this.list.open();
        this.getData(this._pageId, (err:any, data:any)=>{
            this.list.setData(data);
        });
    }

    // 子類覆寫，更新按鈕的方法
    updateItem(btn, data){

    }

    // 子類覆寫，取得資料并且轉換的方法
    getData(pageId:number, cb:(err:any, data:any)=>void){

    }
}
