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
export default class WeaponMenu extends BasicViewer {

    @property(WeaponMenuItem)
    weaponItems:WeaponMenuItem[] = [];

    showCurrentWeapon(id:any){
        this.weaponItems.forEach(weaponItem=>{
            weaponItem.backColor.node.color = cc.Color.WHITE;
        });
        this.weaponItems[id].backColor.node.color = cc.Color.YELLOW;
    }

    setWeapons(data:any){
        for(let i = 0; i < this.weaponItems.length; ++i){
            if(i<data.length){
                this.weaponItems[i].node.active = true;
                let weaponData = data[i];
                let weapon:WeaponMenuItem = this.weaponItems[i];
                weapon.weaponName.string = weaponData.title;
                weapon.weaponPower.string = weaponData.damage;
                weapon.weaponHit.string = (weaponData.accuracy * 100).toFixed(0) + "%";
                weapon.weaponRange.string = weaponData.range[0] + "~" + weaponData.range[1];
                weapon.weaponType.string = weaponData.type;
                weapon.weaponBullet.string = "彈 " + weaponData.maxBulletCount;
                weapon.weaponEN.string = "EN " + weaponData.energyCost;
            }else{
                this.weaponItems[i].node.active = false;
            }
        }
        this.showCurrentWeapon(0);
    }
}
