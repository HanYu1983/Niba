// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "../BasicViewer"
import LandMap from "../GamePage/LandMap";
import LandUnits from "../GamePage/LandUnits";
import InputSensor from "../InputSensor";
import MenuButtons from "../MenuButtons";
import WeaponMenu from "../GamePage/WeaponMenu"
import Controller from "../Controller";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(InputSensor)
export default class NewClass extends BasicViewer {

    @property(LandMap)
    map: LandMap = null;

    @property(LandUnits)
    units:LandUnits = null;

    @property(MenuButtons)
    unitMenu:MenuButtons = null;

    @property(MenuButtons)
    sceneMenu:MenuButtons = null;

    @property(WeaponMenu)
    weaponMenu:WeaponMenu = null;

    @property(cc.Node)
    cursor:cc.Node = null;

    private _cursor:number[] = [0,0];

    open() {

        super.open();
        this.map.initPool();

        Controller.instance.notifyStartGame();

        //this.map.setMap(this.generateMap(.3, .35, .05, .6, .8, .8, .02));
        //this.map.focusOnGrid(6, 9);

        //this.setCursor(5,10);

        //this.openSceneMenu(2, ['finish','cancel']);
    }

    setCursor(pos:number[]){
        this._cursor[0] = pos[0];
        this._cursor[1] = pos[1];

        let cursorPos = Controller.instance.view.getGridPos(this._cursor);
        this.cursor.x = cursorPos[0];
        this.cursor.y = cursorPos[1];
    }

    addListener(){
        super.addListener();

        this.node.on(InputSensor.CURSOR_UP, ()=>{
            this.cursor[1] = this.cursor[1] + 1;
            Controller.instance.notifySetCursor(this._cursor);
        });

        this.node.on(InputSensor.CURSOR_LEFT, ()=>{
            this.cursor[0] -= 1;
            Controller.instance.notifySetCursor(this._cursor);
        });

        this.node.on(InputSensor.CURSOR_DOWN, ()=>{
            this.cursor[1] -= 1;
            Controller.instance.notifySetCursor(this._cursor);
        });

        this.node.on(InputSensor.CURSOR_RIGHT, ()=>{
            this.cursor[0] += 1;
            Controller.instance.notifySetCursor(this._cursor);
        });

        this.node.on(InputSensor.ENTER, ()=>{
            Controller.instance.notifySelectMap(this._cursor);
            //Controller.instance.notifyModel("selectMap", [0,0]);
        }, this);
    }

    removeListenser(){
        super.removeListenser();

        this.node.off(InputSensor.CURSOR_UP);
        this.node.off(InputSensor.ENTER);
    }

    openSceneMenu(id:number, data:any){
        this.sceneMenu.open();
        this.sceneMenu.setData(data);
        this.sceneMenu.node.on(MenuButtons.ON_MENU_ENTER, key=>{
            Controller.instance.notifyModel("ok", id, key);
        });

        this.removeListenser();
    }

    closeSceneMenu(){
        this.sceneMenu.close();
        this.sceneMenu.node.off(MenuButtons.ON_MENU_ENTER);

        this.addListener();
    }

    openUnitMenu(data:any, callback:(key)=>void){
        this.unitMenu.open();
        this.unitMenu.setData(data);
        this.unitMenu.node.on(MenuButtons.ON_MENU_ENTER, key=>{
            //View.instance.notifyModel("ok", id, key);
            callback(key);
        });

        this.unitMenu.node.on(MenuButtons.ON_MENU_LEFT, cursor=>{
            this._changeCurrentWeapon(cursor);
        });

        this.unitMenu.node.on(MenuButtons.ON_MENU_RIGHT, cursor=>{
            this._changeCurrentWeapon(cursor);
        });

        this.openWeaponMenu(data);
        this.removeListenser();
    }

    closeUnitMenu(){
        this.unitMenu.node.off(MenuButtons.ON_MENU_ENTER);
        this.unitMenu.node.off(MenuButtons.ON_MENU_LEFT);
        this.unitMenu.node.off(MenuButtons.ON_MENU_RIGHT);
        this.unitMenu.close();

        this.weaponMenu.close();
        this.addListener();
    }

    openWeaponMenu(data:any){

        let ws = [];
        for(let i = 0; i < data[1].length; ++i){
            ws.push({
                name:'weapon_' + i,
                type:'type',
                power: i * 1000,
                range:'1~3',
                hit:53
            });
        }

        this.weaponMenu.open();
        this.weaponMenu.setWeapons(ws);
    }

    private _changeCurrentWeapon(cursor:any){
        if(cursor[0]==1){
            this.weaponMenu.showCurrentWeapon(cursor[1]);
        }
    }

    closeWeaponMenu(){
        this.weaponMenu.close();
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

    // getMap(): LandMap {
    //     return this.map;
    // }
}
