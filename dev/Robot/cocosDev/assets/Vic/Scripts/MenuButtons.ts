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
import MenuCursor from "./MenuCursor";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(MenuCursor)
export default class MenuButtons extends BasicViewer {

    @property(MenuButton)
    prefabButton: MenuButton = null;

    private _btns: Array<MenuButton> = [];
    private _menuCursor: MenuCursor;

    static ON_MENU_ENTER: string = "ON_MENU_ENTER";
    static ON_MENU_LEFT: string = "ON_MENU_LEFT";
    static ON_MENU_RIGHT: string = "ON_MENU_RIGHT";
    static ON_MENU_UP: string = "ON_MENU_UP";
    static ON_MENU_DOWN: string = "ON_MENU_DOWN";

    updateItem:(btn:MenuButton, data:any)=>void = null;

    onLoad(){
        this._menuCursor = this.node.getComponent(MenuCursor);
    }

    // init() {
    //     super.init();
    //     this._menuCursor = this.node.getComponent(MenuCursor);
    // }

    onPrevClick(owner?: any) {
        this._menuCursor.previus();
        this.node.emit(MenuButtons.ON_MENU_UP, this._menuCursor.getCurrentId());
    }

    onNextClick(owner?: any) {
        this._menuCursor.next();
        this.node.emit(MenuButtons.ON_MENU_DOWN, this._menuCursor.getCurrentId());
    }

    onLeftClick(owner?: any) {
        this._menuCursor.left();
        this.node.emit(MenuButtons.ON_MENU_LEFT, this._menuCursor.getCurrentId());
    }

    onRightClick(owner?: any) {
        this._menuCursor.right();
        this.node.emit(MenuButtons.ON_MENU_RIGHT, this._menuCursor.getCurrentId());
    }

    onEnterClick(owner?: any) {
        this.node.emit(MenuButtons.ON_MENU_ENTER, this._menuCursor.getCurrentFocus());
    }

    onEscClick(owner: any) {
        this.node.emit(MenuButtons.ON_MENU_ENTER, "cancel");
    }

    getFocus():any{
        return this._menuCursor.getCurrentFocus();
    }

    addListener() {
        super.addListener();

        this.node.on(MenuCursor.ON_CURSOR_CHANGE, data => {
            this._focusOn(data[0]);
            this._refreshButtonLabel();
        }, this);
    }

    removeListenser() {
        super.removeListenser();

        this.node.off(MenuCursor.ON_CURSOR_CHANGE);

        this._btns.forEach(btn => {
            btn.node.destroy();
        });
        this._btns = [];
    }

    /**
     * this.setData([["atk", "def", "dodge"],["1000","2000"],["cancel"]]);
     * @param data 
     */
    setData(data: any, cursors?: any[]) {
        this._menuCursor.setData(data, cursors);
        data = this._menuCursor.getData();

        let id = 0;
        data.forEach(element => {
            let btn: cc.Node = cc.instantiate(this.prefabButton.node);
            btn.setParent(this.node);
            btn.active = true;

            let btnButton: MenuButton = btn.getComponent(MenuButton);
            let currentCursor2: number = cursors ? cursors[1][id] : 0;
            if(this.updateItem){
                this.updateItem(btnButton, data[id++][currentCursor2]);
            }

            this._btns.push(btnButton);
        });
        this._focusOn(cursors ? cursors[0] : 0);
    }

    private _refreshButtonLabel() {
        let corsor = this._menuCursor.getCurrentId();
        if(this.updateItem){
            this.updateItem(this._btns[corsor[0]], this._menuCursor.getCurrentFocus());
        }
    }

    private _focusOn(cursor1: number) {
        this._btns.forEach(element => {
            element.setFocus(false);
        });
        this._btns[cursor1].setFocus(true);
    }
}
