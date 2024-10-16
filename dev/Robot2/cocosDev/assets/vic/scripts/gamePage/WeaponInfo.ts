// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label, Vec3 } from 'cc';
import { Drawer } from '../Drawer';
import { Instant } from '../lib/instanceViewer/Instant';
import * as ModelType from './../../../han/types'
import { Grids } from './Grids';
const { ccclass, property } = _decorator;

@ccclass('WeaponInfo')
export class WeaponInfo extends Instant {

    @property(Label)
    title:Label = null;

    @property(Label)
    power:Label = null;

    @property(Label)
    range:Label = null;

    @property(Label)
    accuracy:Label = null;

    @property(Label)
    type:Label = null;

    @property(Label)
    count:Label = null;

    @property(Label)
    en:Label = null;

    @property(Label)
    suitable:Label = null;

    @property(Label)
    curage:Label = null;

    protected checkData(data:any):any{
        return Drawer.getMenuByPage(data, ModelType.Const.PageUnitMenu, 0);
    }
    
    clear(){
        super.clear();
        this.title.string = "";
        this.power.string = "";
        this.range.string = "";
        this.accuracy.string = "";
        this.type.string = "";
        this.count.string = "";
        this.en.string = "";
        this.suitable.string = "";
        this.curage.string = "";
    }

    doBuild(content:any, data:any){

        // 這邊要消失的原因是，通過checkData的檢查其實只有知道是打開了unitmenu，並不知道這次的unitmenu是否有武器選項
        // 如果沒有武器的選項，就不用秀出武器資料，這邊就要讓面版消失
        this.node.setScale(Vec3.ZERO);

        const options = content[0].slice();
        const robotMenu = data.GameplayPages["10"].RobotMenu;

        // 這邊做是否有武器選項，有的話，就秀出現在是哪一個武器
        for(let key in robotMenu.RowFunctionMapping){
            if(robotMenu.RowFunctionMapping[key] == ModelType.RobotMenuFunction.RobotMenuFunctionWeapon){

                // 秀出現在是哪一個武器
                this.node.setScale(Vec3.ONE);

                const weaponIds = options[key];
                const currentWeaponId = weaponIds[content[1][key]];
                const currentWeapon = robotMenu.Weapons[currentWeaponId];

                this.title.string = currentWeapon.Title;
                this.power.string = currentWeapon.Damage;
                this.range.string = currentWeapon.Range[0] + "~" + currentWeapon.Range[1];
                this.accuracy.string = Math.round(currentWeapon.Accuracy * 100) + "%";
                this.type.string = currentWeapon.EnergyType;
                this.count.string = currentWeapon.BulletCount + "/" + currentWeapon.MaxBulletCount;
                this.en.string = currentWeapon.EnergyCost;
                this.suitable.string = currentWeapon.Suitability.toString();
                this.curage.string = currentWeapon.Curage;

                if(Drawer.getBattleMenuInGame(data)){
                    this.node.setPosition(new Vec3(83,-2,0));
                }else{
                    const cursor = data.GameplayPages["10"].Cursor;
                    let gridPos = Drawer.getUnitMenuGroupPosition(cursor[0], cursor[1], 265, 0);
                    this.node.setPosition(gridPos);
                }
                
            }
        }
    }
}
