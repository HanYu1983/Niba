// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import LandMap from "../GamePage/LandMap";
import LandUnits from "../GamePage/LandUnits";
import WeaponMenu from "../GamePage/WeaponMenu"
import UnitStatuMenu from "../GamePage/UnitStatuMenu";
import FightMenu from "../GamePage/FightMenu";
import TurnStart from "../GamePage/TurnStart";
import Effects from "../GamePage/Effects";
import AccuracyInfo from "../GamePage/AccuracyInfo";
import ShowItem from "../ShowItem";
import BasicViewer from "../BasicViewer"
import InputSensor from "../InputSensor";
import MenuButtons from "../MenuButtons";
import ViewController from "../ViewController";
import UnitSampleInfo from "../GamePage/UnitSampleInfo";
import TextEffect from "../GamePage/TextEffect";
import SmallMap from '../GamePage/SmallMap';
import MenuButton from "../MenuButton";
import RobotSelectPanel from "../GamePage/RobotSelect/RobotSelectPanel";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(InputSensor)
export default class GamePage extends BasicViewer {

    @property(LandMap)
    map: LandMap = null;

    @property(LandUnits)
    units: LandUnits = null;

    @property(MenuButtons)
    unitMenu: MenuButtons = null;

    @property(MenuButtons)
    sceneMenu: MenuButtons = null;

    @property(WeaponMenu)
    weaponMenu: WeaponMenu = null;

    @property(UnitStatuMenu)
    unitStatuMenu: UnitStatuMenu = null;

    @property(FightMenu)
    fightInfoMenu: FightMenu = null;

    @property(Effects)
    effects: Effects = null;

    @property(ShowItem)
    accuracyInfos: ShowItem = null;

    @property(ShowItem)
    unitSampleInfos: ShowItem = null;

    @property(ShowItem)
    unitActionInfos: ShowItem = null;

    @property(TurnStart)
    turnStart: TurnStart = null;

    @property(cc.Node)
    cursor: cc.Node = null;

    @property(SmallMap)
    smallMap: SmallMap = null;

    @property(RobotSelectPanel)
    robotSelectPanel: RobotSelectPanel = null;

    // static ON_GAMEPAGE_ENTER: string = "ON_GAMEPAGE_ENTER";
    // static ON_GAMEPAGE_ESCAPE: string = "ON_GAMEPAGE_ESCAPE";

    // private _cursor: number[] = [0, 0];
    // private _camera: number[] = [0, 0];

    onLoad() {
        // 放在這裏shader的計算才會正確
        this.map.initPool();
    }

    init() {

        this.unitMenu.updateItem = ((btn: MenuButton, data: any): void => {
            btn.setLabel(data);
        });

        this.sceneMenu.updateItem = ((btn: MenuButton, data: any): void => {
            btn.setLabel(data);
        });
    }

    open() {
        super.open();
        this.map.resetUV();
        ViewController.instance.notifyStartGame();
        ViewController.instance.audioController.gamePage();
    }

    setCursor(pos: number[]) {
        this.cursor.active = true;
        let cursorPos = ViewController.instance.view.getGridPos(pos);
        this.cursor.x = cursorPos[0];
        this.cursor.y = cursorPos[1];
    }

    hideCursor() {
        this.cursor.active = false;
    }

    openRobotSelectPanel(data:any){
        this.robotSelectPanel.open();
        this.robotSelectPanel.setRobotList(data);
    }

    closeRobotSelectPanel(){
        this.robotSelectPanel.close();
    }

    showFightInfo(datas: any) {
        this.fightInfoMenu.node.active = true;
        this.fightInfoMenu.showInfos(datas.preview);
    }

    closeFightInfo() {
        this.fightInfoMenu.node.active = false;
    }

    setSmallMap(data: any[]) {
        this.smallMap.drawMap(data);
    }

    openUnitStatuMenu(cellstate: any) {
        this.unitStatuMenu.open();
        this.unitStatuMenu.setUnit(cellstate.unit);
        this.unitStatuMenu.setTerrain(cellstate.terrain);
    }

    closeUnitStatuMenu() {
        this.unitStatuMenu.close();
    }

    showAccuracyInfos(data: any[]) {
        this.closeAccuracyInfos();

        let poses: number[][] = [];
        let hitRate: number[] = [];
        data.forEach((info: any) => {
            poses.push(info.targetUnit.position);
            hitRate.push(info.hitRate);
        });

        let i = 0;
        this.accuracyInfos.showItems(poses, (item: cc.Node) => {
            item.getComponent(AccuracyInfo).setAccuracy(hitRate[i++] * 100);
        });
    }

    closeAccuracyInfos() {
        this.accuracyInfos.clearItem();
    }

    showUnitSampleInfos(data: any[]) {
        this.closeUnitSampleInfos();

        let poses: number[][] = [];
        let maxHP: number[] = [];
        let maxEN: number[] = [];
        let hp: number[] = [];
        let en: number[] = [];
        data.forEach((unit: any) => {
            poses.push(unit.position);
            maxHP.push(unit.robotState.maxHp);
            maxEN.push(unit.robotState.maxEn);
            hp.push(unit.robotState.hp);
            en.push(unit.robotState.en);
        });

        let i = 0;
        this.unitSampleInfos.showItems(poses, (item: cc.Node) => {
            item.getComponent(UnitSampleInfo).showHPEN(maxHP[i], hp[i], maxEN[i], en[i]);
            i += 1;
        });
    }

    closeUnitSampleInfos() {
        this.unitSampleInfos.clearItem();
    }

    explodeUnit(data: any, cb: () => void) {
        this.closeUnitSampleInfos();
        this.effects.createUnitExplode(data.unit.position);
        this.units.removeUnitByID(data.unit.key);
        cc.tween(this.node).delay(1).call(cb).start();
    }

    _showAttackerAim(from1, to1, unit1, unitAfter1, unit2) {
        let tween = cc.tween(this.node).call(() => {

            // this.effects.createAimEffect(from1, to1);

            // 攻擊者的初始狀態+扣EN動畫
            this.unitSampleInfos.showItems([from1], (item: cc.Node) => {
                item.getComponent(UnitSampleInfo).showHPEN(unit1.robotState.maxHp, unit1.robotState.hp, unit1.robotState.maxEn, unit1.robotState.en);
                item.getComponent(UnitSampleInfo).changeEN(unit1.robotState.maxEn, unitAfter1.robotState.en);
            });

            // 被攻擊者的初始狀態
            // this.unitSampleInfos.showItems([to1], (item: cc.Node) => {
            //     item.getComponent(UnitSampleInfo).showHPEN(unit2.robotState.maxHp, unit2.robotState.hp, unit2.robotState.maxEn, unit2.robotState.en);
            // });
        }).delay(.7);
        return tween;
    }

    _showDeffenderChangeHP(to1, unit2, unitAfter2) {
        let tween = cc.tween(this.node).call(() => {
            // 被攻擊者的初始狀態+扣HP動畫
            this.unitSampleInfos.showItems([to1], (item: cc.Node) => {
                item.getComponent(UnitSampleInfo).showHPEN(unit2.robotState.maxHp, unit2.robotState.hp, unit2.robotState.maxEn, unit2.robotState.en);
                item.getComponent(UnitSampleInfo).changeHP(unit2.robotState.maxHp, unitAfter2.robotState.hp);
            });

            // this.unitActionInfos.showItems([to1], (item:cc.Node)=>{
            //     item.getComponent(TextEffect).setContent("直擊!");
            // });
        }).delay(.7);
        return tween;
    }

    _showAttackerChangeHP(from1, unit1, unitAfter1) {
        let tween = cc.tween(this.node).call(() => {
            // 攻擊者的扣EN狀態+扣血動畫
            this.unitSampleInfos.showItems([from1], (item: cc.Node) => {
                item.getComponent(UnitSampleInfo).showHPEN(unit1.robotState.maxHp, unit1.robotState.hp, unit1.robotState.maxEn, unitAfter1.robotState.en);
                item.getComponent(UnitSampleInfo).changeHP(unitAfter1.robotState.maxHp, unitAfter1.robotState.hp);
            });
        }).delay(.7);
        return tween;
    }

    _showHitEffect(unit2, to1, result1) {

        let tweens = [];
        let isEvade = false;
        if (result1.events) {

            // 播放技能動畫
            result1.events.forEach((evt: any) => {
                switch (evt) {
                    case "guard":
                        {
                            let tween = cc.tween(this.node).call(() => {
                                this.effects.createShield(unit2.position);
                            }).delay(.7);
                            tweens.push(tween);
                        }
                        break;
                    case "evade":
                        {
                            isEvade = true;
                        }
                        break;
                }
            });
        }

        let tween = cc.tween(this.node).call(() => {

            // 被攻擊者播放受擊動畫
            if (isEvade) {
                this.units.evadeOneUnit(unit2.key);
            } else {
                this.effects.createExplode(result1.damage, to1);
                this.units.shakeOneUnit(unit2.key);
                ViewController.instance.audioController.explode();
            }
        }).delay(.6);
        tweens.push(tween);
        return cc.tween(this.node).sequence(cc.tween(this.node).delay(0), ...tweens);
    }

    _showDeffenderAim(unit2, unitAfter2, from1, to1) {
        let tween = cc.tween(this.node).call(() => {
            // this.effects.createAimEffect(to1, from1);

            // 被攻擊者的扣血狀態+扣EN動畫
            this.unitSampleInfos.showItems([to1], (item: cc.Node) => {
                item.getComponent(UnitSampleInfo).showHPEN(unit2.robotState.maxHp, unitAfter2.robotState.hp, unit2.robotState.maxEn, unit2.robotState.en);
                item.getComponent(UnitSampleInfo).changeEN(unit2.robotState.maxEn, unitAfter2.robotState.en);
            });
        }).delay(.7);
        return tween;
    }

    showAimAnimation(data:any, cb:()=>void){
        this.closeUnitSampleInfos();
        this.hideCursor();

        let unit1 = data.units[0];
        let unit2 = data.units[1];
        let from1 = unit1.position;
        let to1 = unit2.position;

        cc.tween(this.node).delay(1).call(() => {
            this.effects.createAimEffect(from1, to1, .1);
        }).delay(1).call(cb).start()
    }

    awardUnitAnimation(data:any, cb:()=>void){
        let beforeUnit = data[0];
        let afterUnit = data[1];
        let pos = beforeUnit.position;

        cc.tween(this.node).delay(1).call(()=>{
            this.effects.createAwardEffect(pos);
        }).delay(1).call(()=>{
            this.unitSampleInfos.showItem(pos, (item:cc.Node)=>{
                item.getComponent(UnitSampleInfo).showHPEN(beforeUnit.robotState.maxHp, beforeUnit.robotState.hp, beforeUnit.robotState.maxEn, beforeUnit.robotState.en);
                item.getComponent(UnitSampleInfo).changeEN(afterUnit.robotState.maxEn, afterUnit.robotState.en);
                item.getComponent(UnitSampleInfo).changeHP(afterUnit.robotState.maxHp, afterUnit.robotState.hp);
            });
        }).delay(1).call(()=>{
            this.closeUnitSampleInfos();
            cb();
        }).start();
    }

    changeUnitHP(data: any, cb: () => void) {
        this.map.closeMapRange();
        this.map.closeWeaponRange();
        this.closeUnitSampleInfos();
        this.hideCursor();

        let unit1 = data.units[0];
        let unit2 = data.units[1];
        let unitAfter1 = data.unitsAfter[0];
        let unitAfter2 = data.unitsAfter[1];
        let from1 = unit1.position;
        let to1 = unit2.position;
        let result1 = data.results[1];
        let result2 = data.results[0];

        let tweens = [];
        // 攻擊者
        tweens.push(this._showAttackerAim(from1, to1, unit1, unitAfter1, unit2));
        tweens.push(this._showHitEffect(unit2, to1, result1));
        tweens.push(this._showDeffenderChangeHP(to1, unit2, unitAfter2));

        // 沒有REAULT的事件的話，代表對方沒有反擊。
        if (result2.events.length != 0) {
            // 反擊者
            tweens.push(this._showDeffenderAim(unit2, unitAfter2, from1, to1));
            tweens.push(this._showHitEffect(unit1, from1, result2));
            tweens.push(this._showAttackerChangeHP(from1, unit1, unitAfter1));
        }
        cc.tween(this.node).sequence(cc.tween(this.node).delay(0), ...tweens).call(cb).start();
    }

    openTurnStart(isPlayer: boolean, callback: () => void) {
        this.turnStart.setContent(isPlayer ? "玩家回合開始" : "敵軍回合開始");
        this.turnStart.setPlayer(isPlayer);
        this.turnStart.open();
        this.turnStart.node.on("end", () => {
            this.turnStart.node.off("end");
            callback();
        }, this);
        this.closeUnitSampleInfos();
    }

    openSceneMenu(data: any, cursors: any[]) {
        this.closeSceneMenu();

        this.sceneMenu.open();
        this.sceneMenu.setData(data, cursors);
        //this.sceneMenu.node.on(MenuButtons.ON_MENU_ENTER, callback);
    }

    closeSceneMenu() {
        //this.sceneMenu.node.off(MenuButtons.ON_MENU_ENTER);
        this.sceneMenu.close();
    }

    openUnitMenu(pos: number[], menus: any, cursors: any[], cb?: (key: string) => {}) {
        const [menu, weaponInfo] = menus;

        this.closeUnitMenu();
        this.unitMenu.open();
        this.unitMenu.setData(menu, cursors);

        // 顯示指令在unit旁邊
        this.unitActionInfos.showItems([pos], node => {
            const content = this.unitMenu.getFocus();
            node.getComponent(TextEffect).setContent(content);
        });

        if (weaponInfo) {
            let weaponId = weaponInfo.weaponIdx;
            let weapons = weaponInfo.weapons;

            if (cursors) {
                const c1 = cursors[0];
                const c2 = cursors[1][cursors[0]];
                if (c1 == weaponId) {
                    this.openWeaponMenu(weapons);
                    this.weaponMenu.showCurrentWeapon(c2);
                }
            }
        }
    }

    closeUnitMenu() {
        this.unitActionInfos.clearItem();
        this.unitMenu.close();
        this.weaponMenu.close();
    }

    openWeaponMenu(data: any) {

        let ws = [];
        for (let key in data) {
            let weapon = data[key];
            //let weaponDetail = ViewController.instance.getWeapon(weapon.weaponKey);
            let weaponDetail = weapon;
            /**
             * range:number[]
             * energyCost:number
             * maxBulletCount:number
             * suitablility:number[] 地形適性[陸海空宇]
             * ability:string[] 能否移動射擊之類的
             * state:{weaponKey:string 抓資料用的KEY, bulletCount:int 殘彈數}
             * eneygeType:string 是否為能量型
             * title:string
             * type:string 目標的選取方式，會影響RANGE的顯示
             * accuracy:number
             * damage:number
             */
            ws.push(weaponDetail);
        }

        this.weaponMenu.open();
        this.weaponMenu.setWeapons(ws);
    }

    static generateMap(
        w, h,
        deepsea = 1,
        sea = 1,
        sand = 1,
        grass = 1,
        hill = 1,
        city = .3,
        tree = .3,
        award = .01,
        power = 1,
        offset = 0) {

        let total = deepsea + sea + sand + grass + hill;
        let deepseaIn = deepsea / total;
        let seaIn = sea / total + deepseaIn;
        let sandIn = sand / total + seaIn;
        let grassIn = grass / total + sandIn;

        noise.seed(Math.random());
        let scale = .1;
        let map = [];
        for (let i = 0; i < w; ++i) {
            for (let j = 0; j < h; ++j) {
                let f = noise.perlin2(i * scale, j * scale);
                f = Math.pow(f, power);
                f = (f + 1) / 2;
                f += offset;
                if (f > grassIn) {

                    //山脈
                    map.push(5);
                } else if (f > sandIn) {
                    let cityPosX = Math.floor(i * .4) * scale * 3 + 123;
                    let cityPosY = Math.floor(j * .4) * scale * 3 + 245;

                    let f3 = noise.perlin2(cityPosX, cityPosY);
                    f3 = (f3 + 1) / 2;
                    if (f3 > city) {

                        let treePosX = i * scale * 3 + 300;
                        let treePosY = j * scale * 3 + 20;

                        let f2 = noise.perlin2(treePosX, treePosY);
                        f2 = (f2 + 1) / 2;
                        if (f2 > tree) {
                            //平原
                            map.push(Math.random() < award ? 7 : 3);
                        } else {

                            //樹林
                            map.push(Math.random() < award ? 7 : 6);
                        }

                    } else {

                        if (i == 4 || i == 8 || i == 12 || i == 16 ||
                            j == 4 || j == 8 || j == 12 || j == 16) {

                            //路
                            map.push(8);
                        } else {
                            //城市
                            map.push(Math.random() < award ? 7 : 4);
                        }
                    }
                } else if (f > seaIn) {

                    //沙灘
                    map.push(Math.random() < award ? 7 : 2);
                } else if (f > deepseaIn) {

                    //淺海
                    map.push(Math.random() < award ? 7 : 1);
                } else {

                    //深海
                    map.push(0);
                }
            }
        }
        return map;
    }
}
