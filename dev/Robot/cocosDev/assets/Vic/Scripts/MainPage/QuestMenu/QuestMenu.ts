// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import MenuButton from "../../MenuButton";

const {ccclass, property} = cc._decorator;

@ccclass
export default class QuestMenu extends BasicViewer {

    @property(MenuButtons)
    titleFocus:MenuButtons = null;

    @property(MenuButtons)
    levelMenu:MenuButtons = null;

    @property(MenuButtons)
    landMenu:MenuButtons = null;

    @property(MenuButtons)
    seaMenu:MenuButtons = null;

    @property(MenuButtons)
    skyMenu:MenuButtons = null;

    // @property(MenuButtons)
    // actionMenu:MenuButtons = null;

    private _menus:Array<MenuButtons>;
    private _menuId:number = 0;

    init(){
        this.titleFocus.updateItem = (btn: MenuButton, data: any) => {
            btn.setLabel(data);
        };

        this.levelMenu.updateItem = (btn: MenuButton, data: any) => {
            btn.setLabel(data);
        };
        this.landMenu.updateItem = (btn: MenuButton, data: any) => {
            btn.setLabel(data);
        };
        this.seaMenu.updateItem = (btn: MenuButton, data: any) => {
            btn.setLabel(data);
        };
        this.skyMenu.updateItem = (btn: MenuButton, data: any) => {
            btn.setLabel(data);
        };
        // this.actionMenu.updateItem = (btn: MenuButton, data: any) => {
        //     btn.setLabel(data);
        // };

        this._menus = [
            this.levelMenu, this.landMenu, this.seaMenu, this.skyMenu
        ];
    }

    start(){
        super.open();

        this.titleFocus.open();
        this.titleFocus.setData(["難度","陸","海","空"]);

        this.levelMenu.open();
        this.levelMenu.setData(["難度一","難度二","難度三","難度四","難度五","難度六","難度七","難度八","難度九","難度十"]);

        this.landMenu.open();
        this.landMenu.setData(["陸難度一","陸難度二","陸難度三","陸難度四","陸難度五","陸難度六","陸難度七","陸難度八","陸難度九","陸難度十"]);

        this.seaMenu.open();
        this.seaMenu.setData(["海難度一","海難度二","海難度三","海難度四","海難度五","海難度六","海難度七","海難度八","海難度九","海難度十"]);

        this.skyMenu.open();
        this.skyMenu.setData(["空難度一","空難度二","空難度三","空難度四","空難度五","空難度六","空難度七","空難度八","空難度九","空難度十"]);

        // this.actionMenu.open();
        // this.actionMenu.setData(["隨機副本"]);
    }

    getButtonId(){
        const title = this.titleFocus.getFocusId()[0];
        const level = this.levelMenu.getFocusId()[0];
        const sky_level = this.skyMenu.getFocusId()[0];
        const land_level = this.landMenu.getFocusId()[0];
        const sea_level = this.seaMenu.getFocusId()[0];
        let buttonId = title.toString();
        switch(title){
            case 0: buttonId += "_" + level; break;
            case 1: buttonId += "_" + land_level; break;
            case 2: buttonId += "_" + sea_level; break;
            case 3: buttonId += "_" + sky_level; break;
        }
        return buttonId;
    }

    onPrevClick(owner?: any) {
        this._menus[this._menuId].onPrevClick();
    }
    onNextClick(owner?: any) {
        this._menus[this._menuId].onNextClick();
    }
    onLeftClick(owner?: any) {
        if(--this._menuId < 0){
            this._menuId = this._menus.length - 1;
        }
        this.titleFocus.onPrevClick();
    }
    onRightClick(owner?: any) {
        if(++this._menuId > this._menus.length - 1){
            this._menuId = 0;
        }
        this.titleFocus.onNextClick();
    }
}
