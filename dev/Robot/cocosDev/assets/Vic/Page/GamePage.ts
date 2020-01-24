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

    @property(TurnStart)
    turnStart: TurnStart = null;

    @property(cc.Node)
    cursor: cc.Node = null;

    // static ON_GAMEPAGE_ENTER: string = "ON_GAMEPAGE_ENTER";
    // static ON_GAMEPAGE_ESCAPE: string = "ON_GAMEPAGE_ESCAPE";

    // private _cursor: number[] = [0, 0];
    // private _camera: number[] = [0, 0];

    onLoad() {
        this.map.initPool();
    }

    open() {
        super.open();

        this.map.resetUV();
        ViewController.instance.notifyStartGame();
        //this.removeListenser();

        //this.map.setMap(this.generateMap(.3, .35, .05, .6, .8, .8, .02));
        //this.map.focusOnGrid(6, 9);

        //this.setCursor(5,10);

        //this.openSceneMenu(['finish','cancel'], ()=>{});

        //this.openTurnStart();

        //this.showMovableGrid([[3,4],[5,6],[7,9]]);

        // this.showFightInfo([
        //     {

        //     },
        //     {

        //     },
        //     {

        //     }
        // ]);

        //this.effects.createBlade([0,0]);

        //this.effects.createAimEffect([2, 3], [5, 7]);
    }

    setCursor(pos: number[]) {
        let cursorPos = ViewController.instance.view.getGridPos(pos);
        this.cursor.x = cursorPos[0];
        this.cursor.y = cursorPos[1];
    }

    showFightInfo(datas: any[]) {
        this.fightInfoMenu.showInfos(datas);
    }

    openUnitStatuMenu() {

        //this.unitStatuMenu.open();
    }

    closeUnitStatuMenu() {
        //this.unitStatuMenu.close();
    }

    showAccuracyInfos(data:any[]) {
        this.closeAccuracyInfos();

        let poses:number[][] = [];
        let hitRate:number[] = [];
        data.forEach((info:any)=>{
            poses.push(info.targetUnit.position);
            hitRate.push(info.hitRate);
        });

        let i = 0;
        this.accuracyInfos.showItems(poses, (item: cc.Node) => {
            item.getComponent(AccuracyInfo).setAccuracy(hitRate[i++] * 100);
        });
    }

    closeAccuracyInfos(){
        this.accuracyInfos.clearItem();
    }

    openTurnStart(isPlayer: boolean, callback: () => void) {
        this.turnStart.setContent(isPlayer ? "玩家回合開始" : "敵軍回合開始");
        this.turnStart.setPlayer(isPlayer);
        this.turnStart.open();
        this.turnStart.node.on("end", () => {
            this.turnStart.node.off("end");
            callback();
        }, this);
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

    openUnitMenu(menus: any, cursors: any[], cb?: (key: string) => {}) {
        const [menu, weaponInfo] = menus;
        let weaponId = weaponInfo.weaponIdx;
        let weapons = weaponInfo.weapons;
        let weaponRanges = weaponInfo.weaponRange;

        this.closeUnitMenu();
        this.openWeaponMenu(weapons);

        this.unitMenu.open();
        this.unitMenu.setData(menu, cursors);

        this.unitMenu.node.on(MenuButtons.ON_MENU_ENTER, key => {
            if (cb) cb(key);
        });

        let showWeaponRange = (cursor) => {
            this.map.closeWeaponRange();
            if (cursor[0] == weaponId) {
                this.map.showWeaponRange(weaponRanges[cursor[1]]);
            }
        }

        if (cursors) {
            const c1 = cursors[0];
            const c2 = cursors[1][cursors[0]];
            if (c1 == weaponId) {

                // 顯示武器攻擊範圍，改成CONTROLLER呼叫，不自己處理
                // showWeaponRange([c1, c2]);

                this.weaponMenu.showCurrentWeapon(c2);
            }
        }

        this.unitMenu.node.on(MenuButtons.ON_MENU_UP, cursor => {
            showWeaponRange(cursor);
        });

        this.unitMenu.node.on(MenuButtons.ON_MENU_DOWN, cursor => {
            showWeaponRange(cursor);
        });

        this.unitMenu.node.on(MenuButtons.ON_MENU_LEFT, cursor => {
            if (cursor[0] == weaponId) {
                showWeaponRange(cursor);
                this.weaponMenu.showCurrentWeapon(cursor[1]);
            }
        });

        this.unitMenu.node.on(MenuButtons.ON_MENU_RIGHT, cursor => {
            if (cursor[0] == weaponId) {
                showWeaponRange(cursor);
                this.weaponMenu.showCurrentWeapon(cursor[1]);
            }
        });

        this.effects.createAimEffect([0, 0], [3, 3]);
        this.effects.createBlade(120, [4,4]);
        this.effects.createExplode(200, [7,8]);
    }

    closeUnitMenu() {
        this.unitMenu.node.off(MenuButtons.ON_MENU_ENTER);
        this.unitMenu.node.off(MenuButtons.ON_MENU_LEFT);
        this.unitMenu.node.off(MenuButtons.ON_MENU_RIGHT);
        this.unitMenu.node.off(MenuButtons.ON_MENU_UP);
        this.unitMenu.node.off(MenuButtons.ON_MENU_DOWN);
        this.unitMenu.close();

        this.weaponMenu.close();
    }

    openWeaponMenu(data: any) {

        let ws = [];
        for (let key in data) {
            let weapon = data[key];
            let weaponDetail = ViewController.instance.getWeapon(weapon.weaponKey);
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
            ws.push({
                name: weaponDetail.title,
                type: weaponDetail.type,
                power: weaponDetail.damage,
                range: weaponDetail.range[0] + "~" + weaponDetail.range[1],
                hit: weaponDetail.accuracy
            });
        }

        this.weaponMenu.open();
        this.weaponMenu.setWeapons(ws);
    }

    static generateMap(
        deepsea: number = .5,
        sea: number = .4,
        sand: number = .2,
        grass: number = .4,
        city: number = .1,
        tree: number = .8,
        award: number = .1): number[] {
        noise.seed(Math.random());
        let scale = .1;
        let map = [];
        for (let i = 0; i < 20; ++i) {
            for (let j = 0; j < 20; ++j) {
                let f: number = noise.perlin2(i * scale, j * scale);
                if (f > -1 + deepsea + sea + sand + grass) {

                    //山脈
                    map.push(5);
                } else if (f > -1 + deepsea + sea + sand) {
                    let cityPosX = Math.floor(i * .4) * scale * 3 + 123;
                    let cityPosY = Math.floor(j * .4) * scale * 3 + 245;

                    let f3: number = noise.perlin2(cityPosX, cityPosY);
                    if (f3 > -1 + city) {

                        let treePosX = i * scale * 3 + 300;
                        let treePosY = j * scale * 3 + 20;

                        let f2: number = noise.perlin2(treePosX, treePosY);
                        if (f2 > -1 + tree) {
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

                    //map.push(3);
                } else if (f > -1 + deepsea + sea) {

                    //沙灘
                    map.push(Math.random() < award ? 7 : 2);
                } else if (f > -1 + deepsea) {

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
