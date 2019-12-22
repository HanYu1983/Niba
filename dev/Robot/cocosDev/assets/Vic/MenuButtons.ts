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
import MenuCursor from "./MenuCursor";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(MenuCursor)
@requireComponent(InputSensor)
export default class NewClass extends BasicViewer {

    @property(MenuButton)
    prefabButton:MenuButton = null;

    private _btns:Array<MenuButton> = [];
    private _menuCursor:MenuCursor;

    static ON_MENU_ENTER:string = "ON_MENU_ENTER";
    static ON_MENU_LEFT:string = "ON_MENU_LEFT";
    static ON_MENU_RIGHT:string = "ON_MENU_RIGHT";

    init(){
        super.init();
        this._menuCursor = this.node.getComponent(MenuCursor);
    }

    addListener(){
        super.addListener();

        this.node.on(InputSensor.CURSOR_UP, ()=>{
            this._menuCursor.previus();
        }, this);

        this.node.on(InputSensor.CURSOR_LEFT, ()=>{
            this._menuCursor.right();
            this.node.emit(NewClass.ON_MENU_LEFT, this._menuCursor.getCurrentId());
        }, this);

        this.node.on(InputSensor.CURSOR_DOWN, ()=>{
            this._menuCursor.next();
        }, this);

        this.node.on(InputSensor.CURSOR_RIGHT, ()=>{
            this._menuCursor.right();
            this.node.emit(NewClass.ON_MENU_RIGHT, this._menuCursor.getCurrentId());
        }, this);

        this.node.on(InputSensor.ENTER, ()=>{
            this.node.emit(NewClass.ON_MENU_ENTER, this._menuCursor.getCurrentFocus());
        }, this);

        this.node.on(InputSensor.ESCAPE, ()=>{
            this.node.emit(NewClass.ON_MENU_ENTER, "cancel");
        }, this);

        this.node.on(MenuCursor.ON_CURSOR_CHANGE, data =>{
            this._focusOn(data[0]);
            this._refreshButtonLabel();
        }, this);
    }

    removeListenser(){
        super.removeListenser();

        this.node.off(InputSensor.CURSOR_UP);
        this.node.off(InputSensor.CURSOR_LEFT);
        this.node.off(InputSensor.CURSOR_DOWN);
        this.node.off(InputSensor.CURSOR_RIGHT);
        this.node.off(InputSensor.ENTER);
        this.node.off(InputSensor.ESCAPE);

        this._btns.forEach(btn=>{
            btn.node.destroy();
        });
        this._btns = [];
    }

    /**
     * this.setData([["atk", "def", "dodge"],["1000","2000"],["cancel"]]);
     * @param data 
     */
    setData(data:any){
        this._menuCursor.setData(data);
        data = this._menuCursor.getData();

        let id = 0;
        data.forEach(element=>{
            let btn:cc.Node = cc.instantiate(this.prefabButton.node);
            btn.setParent(this.node);
            btn.active = true;

            let btnButton:MenuButton = btn.getComponent(MenuButton);
            btnButton.setLabel(data[id++][0]);

            this._btns.push(btnButton);
        });
        this._focusOn(0);
    }

    private _refreshButtonLabel(){
        let corsor = this._menuCursor.getCurrentId();
        this._btns[corsor[0]].setLabel(this._menuCursor.getCurrentFocus());
    }

    private _focusOn(cursor1:number){
        this._btns.forEach(element => {
            element.setFocus(false);
        });
        this._btns[cursor1].setFocus(true);
    }
}
