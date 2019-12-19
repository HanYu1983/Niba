// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import MenuButton from "./MenuButton"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    private _btns:Array<MenuButton> = [];

    @property(MenuButton)
    prefabButton:MenuButton = null;

    private _data:any;
    private _cursor1:number = 0;
    private _cursor2:Array<number> = [];
    
    start () {
        this.setData([["atk", "def", "dodge"],["1000","2000"],["cancel"]]);
        this.right();
        cc.log(this._cursor2);
        this.next();
        cc.log(this._cursor2);
        this.right();
        cc.log(this._cursor2);
        this.next();
        cc.log(this._cursor2);
        this.right();
        cc.log(this._cursor2);
        this.next();
        cc.log(this._cursor2);
        this.right();
        cc.log(this._cursor2);
        this.next();
        cc.log(this._cursor2);
        this.right();
        cc.log(this._cursor2);
        this.next();
        cc.log(this._cursor2);
        this.left();
        cc.log(this._cursor2);
        this.next();
        cc.log(this._cursor2);
        this.left();
        cc.log(this._cursor2);
    }

    setData(data:any){
        this._data = data;
        let id = 0;
        data.forEach(element=>{
            let btn:cc.Node = cc.instantiate(this.prefabButton.node);
            btn.setParent(this.node);
            btn.active = true;

            let btnButton:MenuButton = btn.getComponent(MenuButton);
            btnButton.setLabel(this._data[id++][0]);

            this._btns.push(btnButton);

            this._cursor2.push(0);
        });
    }

    private _refreshButtonLabel(){
        this._btns[this._cursor1].setLabel(this._data[this._cursor1][this._cursor2[this._cursor1]]);
    }

    private _focusOn(){
        this._btns.forEach(element => {
            element.setFocus(false);
        });
        this._btns[this._cursor1].setFocus(true);
    }

    previus():number{
        if(--this._cursor1 < 0){
            this._cursor1 = this._btns.length - 1;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    next():number{
        if(++this._cursor1 > this._btns.length - 1){
            this._cursor1 = 0;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    left():number{
        if(--this._cursor2[this._cursor1] < 0){
            this._cursor2[this._cursor1] = this._data[this._cursor1].length - 1;
        }
        this._refreshButtonLabel();
        return this._cursor2[this._cursor1];
    }

    right():number{
        if(++this._cursor2[this._cursor1] > this._data[this._cursor1].length - 1){
            this._cursor2[this._cursor1] = 0;
        }
        this._refreshButtonLabel();
        return this._cursor2[this._cursor1];
    }

    getCurrentId():number{
        return this._cursor1;
    }



    // update (dt) {}
}
