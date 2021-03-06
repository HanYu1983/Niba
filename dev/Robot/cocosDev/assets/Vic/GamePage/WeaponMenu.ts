// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import MenuCursor from "../MenuCursor";
import BasicViewer from "../BasicViewer";
import WeaponMenuItem from "./WeaponMenuItem";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(MenuCursor)
export default class NewClass extends BasicViewer {

    @property(WeaponMenuItem)
    weaponItems:WeaponMenuItem[] = [];

    private _menuCursor:MenuCursor;

    start(){
        this.open();
    }

    open(){
        super.open();
        this._menuCursor = this.node.getComponent(MenuCursor);

        let ws = [];
        for(let i = 0; i < 3; ++i){
            ws.push({
                name:'weapon_' + i,
                type:'type',
                power: i * 1000,
                range:'1~3',
                hit:53
            });
        }
        this.setWeapons(ws);


        this._menuCursor.node.on(MenuCursor.ON_CURSOR_CHANGE, this.showCurrentWeapon, this);

        this._menuCursor.next();
    }

    close(){
        super.close();
        this._menuCursor.node.off(MenuCursor.ON_CURSOR_CHANGE);
    }

    showCurrentWeapon(cursor:any){
        cc.log("showCurrentWeapon:", cursor[0]);
        let cursor1 = cursor[0];
        this.weaponItems.forEach(weaponItem=>{
            weaponItem.backColor.node.color = cc.Color.WHITE;
        });
        this.weaponItems[cursor1].node.color = cc.Color.YELLOW;
    }

    setWeapons(data:any){
        this._menuCursor.setData(data);

        for(let i = 0; i < this.weaponItems.length; ++i){
            if(i<data.length){
                this.weaponItems[i].node.active = true;
                let weaponData = data[i];
                let weapon:WeaponMenuItem = this.weaponItems[i];
                weapon.weaponName.string = weaponData.name;
                weapon.weaponPower.string = weaponData.power;
                weapon.weaponHit.string = weaponData.hit;
                weapon.weaponRange.string = weaponData.range;
                weapon.weaponType.string = weaponData.type;
            }else{
                this.weaponItems[i].node.active = false;
            }
        }
    }
}
