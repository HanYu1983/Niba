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
import Grid from "../GamePage/Grid";
import Effects from "../GamePage/Effects";

import BasicViewer from "../BasicViewer"
import InputSensor from "../InputSensor";
import MenuButtons from "../MenuButtons";
import ViewController from "../ViewController";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(InputSensor)
export default class NewClass extends BasicViewer {

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

    @property(TurnStart)
    turnStart: TurnStart = null;

    @property(cc.Node)
    cursor: cc.Node = null;

    static ON_GAMEPAGE_ENTER: string = "ON_GAMEPAGE_ENTER";
    static ON_GAMEPAGE_ESCAPE: string = "ON_GAMEPAGE_ESCAPE";

    // private _cursor: number[] = [0, 0];
    // private _camera: number[] = [0, 0];

    onLoad(){
        this.map.initPool();
    }

    open() {
        super.open();

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
    }

    setCursor(pos: number[]) {
        let cursorPos = ViewController.instance.view.getGridPos(pos);
        this.cursor.x = cursorPos[0];
        this.cursor.y = cursorPos[1];
    }

    showFightInfo(datas: any[]) {
        this.fightInfoMenu.showInfos(datas);
    }

    addListener() {
        super.addListener();

        this.node.on(InputSensor.CURSOR_UP, () => {
            ViewController.instance.onGamePageWClick();
        });

        this.node.on(InputSensor.CURSOR_LEFT, () => {
            ViewController.instance.onGamePageAClick();
        });

        this.node.on(InputSensor.CURSOR_DOWN, () => {
            ViewController.instance.onGamePageSClick();
        });

        this.node.on(InputSensor.CURSOR_RIGHT, () => {
            ViewController.instance.onGamePageDClick();
        });

        this.node.on(InputSensor.SCREEN_UP, () => {
            ViewController.instance.onGamePageUPClick();
        });

        this.node.on(InputSensor.SCREEN_LEFT, () => {
            ViewController.instance.onGamePageLEFTClick();
        });

        this.node.on(InputSensor.SCREEN_DOWN, () => {
            ViewController.instance.onGamePageDOWNClick();
        });

        this.node.on(InputSensor.SCREEN_RIGHT, () => {
            ViewController.instance.onGamePageRIGHTClick();
        });

        this.node.on(InputSensor.ENTER, () => {
            ViewController.instance.onGamePageENTERClick();
        }, this);

        this.node.on(InputSensor.ESCAPE, () => {
            ViewController.instance.onGamePageESCAPEClick();
        }, this);
    }

    removeListenser() {
        super.removeListenser();

        this.node.off(InputSensor.CURSOR_UP);
        this.node.off(InputSensor.CURSOR_LEFT);
        this.node.off(InputSensor.CURSOR_DOWN);
        this.node.off(InputSensor.CURSOR_RIGHT);
        this.node.off(InputSensor.SCREEN_UP);
        this.node.off(InputSensor.SCREEN_LEFT);
        this.node.off(InputSensor.SCREEN_DOWN);
        this.node.off(InputSensor.SCREEN_RIGHT);
        this.node.off(InputSensor.ENTER);
        this.node.off(InputSensor.ESCAPE);
        this.node.off(NewClass.ON_GAMEPAGE_ENTER);
        this.node.off(NewClass.ON_GAMEPAGE_ESCAPE);
    }

    openUnitStatuMenu() {

        //this.unitStatuMenu.open();
    }

    closeUnitStatuMenu() {
        //this.unitStatuMenu.close();
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

    openSceneMenu(data: any, callback: (key) => void) {
        this.closeSceneMenu();

        this.sceneMenu.open();
        this.sceneMenu.setData(data);
        this.sceneMenu.node.on(MenuButtons.ON_MENU_ENTER, callback);
    }

    closeSceneMenu() {
        this.sceneMenu.node.off(MenuButtons.ON_MENU_ENTER);
        this.sceneMenu.close();
    }

    openUnitMenu(menus: any, callback: (key) => void) {
        const [menu, weaponInfo] = menus;
        let weaponId = weaponInfo.weaponIdx;
        let weapons = weaponInfo.weapons;
        let weaponRanges = weaponInfo.weaponRange;

        this.closeUnitMenu();

        this.unitMenu.open();
        this.unitMenu.setData(menu);
        this.unitMenu.node.on(MenuButtons.ON_MENU_ENTER, key => {
            callback(key);
        });

        let showWeaponRange = (cursor) => {
            this.map.closeWeaponRange();
            if(cursor[0] == weaponId){
                this.map.showWeaponRange(weaponRanges[cursor[1]]);
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

        this.openWeaponMenu(weapons);
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
        for(let weaponKey in data){
            let weapon = data[weaponKey];
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
                name: weapon.title,
                type: weapon.type,
                power: weapon.damage,
                range: weapon.range[0] + "~" + weapon.range[1],
                hit: weapon.accuracy
            });
        }

        this.weaponMenu.open();
        this.weaponMenu.setWeapons(ws);
    }

    static generateMap(
        deepsea: number = .3,
        sea: number = .3,
        sand: number = .3,
        grass: number = .3,
        city: number = .3,
        tree: number = .3,
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
