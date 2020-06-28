// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import MenuButton from "../../MenuButton";
import WeaponMenu from "../../GamePage/WeaponMenu";


const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponDetailPanel extends BasicViewer {

    @property(MenuButtons)
    menu:MenuButtons = null;

    init(){
        this.menu.updateItem = (btn: MenuButton, data: any) => {
            btn.setLabel(data);
        };
    }

    setWeapon(weapon:any){
        cc.log(weapon);
    }

    setMenu(menu:any){
        this.menu.open();
        this.menu.setData(menu);
    }
}
