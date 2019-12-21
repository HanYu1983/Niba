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
import BasicViewer from "./BasicViewer";
import InputSensor from "./InputSensor";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(InputSensor)
export default class NewClass extends BasicViewer {

    @property(MenuButton)
    prefabButton:MenuButton = null;

    private _btns:Array<MenuButton> = [];
    private _data:any;
    private _cursor1:number = 0;
    private _cursor2:Array<number> = [];

    static ON_MENU_ENTER:string = "ON_MENU_ENTER";

    open(){
        super.open();

        this.node.on(InputSensor.CURSOR_UP, ()=>{
            this.previus();
        }, this);

        this.node.on(InputSensor.CURSOR_LEFT, ()=>{
            this.right();
        }, this);

        this.node.on(InputSensor.CURSOR_DOWN, ()=>{
            this.next();
        }, this);

        this.node.on(InputSensor.CURSOR_RIGHT, ()=>{
            this.right();
        }, this);

        this.node.on(InputSensor.ENTER, ()=>{
            this.node.emit(NewClass.ON_MENU_ENTER, this._data[this._cursor1][this._cursor2[this._cursor1]]);
        }, this);

        this.node.on(InputSensor.ESCAPE, ()=>{
            this.close();
        }, this);
    }

    close(){
        this.node.off(InputSensor.CURSOR_UP);
        this.node.off(InputSensor.CURSOR_LEFT);
        this.node.off(InputSensor.CURSOR_DOWN);
        this.node.off(InputSensor.CURSOR_RIGHT);
        this.node.off(InputSensor.ENTER);
        this.node.off(InputSensor.ESCAPE);

        super.close();
    }

    /**
     * this.setData([["atk", "def", "dodge"],["1000","2000"],["cancel"]]);
     * @param data 
     */
    setData(data:any){
        this._data = data;
        let id = 0;
        data.forEach(element=>{
            if( typeof element == 'string'){
                this._data[id] = [element];
            }

            let btn:cc.Node = cc.instantiate(this.prefabButton.node);
            btn.setParent(this.node);
            btn.active = true;

            let btnButton:MenuButton = btn.getComponent(MenuButton);
            btnButton.setLabel(this._data[id++][0]);

            this._btns.push(btnButton);
            this._cursor2.push(0);
        });
        this._focusOn();
    }

    private _refreshButtonLabel(){
        this._btns[this._cursor1].setLabel(this._data[this._cursor1][this._cursor2[this._cursor1]]);
    }

    private _focusOn(){
        this._btns.forEach(element => {
            element.setFocus(false);
        });
        cc.log( this._cursor1 );
        this._btns[this._cursor1].setFocus(true);
    }

    previus():Array<number>{
        cc.log("previus:");
        cc.log(this._btns.length);
        cc.log(this._cursor1);

        if(--this._cursor1 < 0){
            this._cursor1 = this._btns.length - 1;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    next():Array<number>{
        cc.log("next:");
        cc.log(this._btns.length);
        cc.log(this._cursor1);
        if(++this._cursor1 > this._btns.length - 1){
            this._cursor1 = 0;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    left():Array<number>{
        if(--this._cursor2[this._cursor1] < 0){
            this._cursor2[this._cursor1] = this._data[this._cursor1].length - 1;
        }
        this._refreshButtonLabel();
        return this.getCurrentId();
    }

    right():Array<number>{
        if(++this._cursor2[this._cursor1] > this._data[this._cursor1].length - 1){
            this._cursor2[this._cursor1] = 0;
        }
        this._refreshButtonLabel();
        return this.getCurrentId();
    }

    getCurrentId():Array<number>{
        return [this._cursor1, this._cursor2[this._cursor1]];
    }



    // update (dt) {}
}
