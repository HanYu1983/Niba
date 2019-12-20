// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "./BasicViewer"
import LandMap from "./LandMap";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends BasicViewer {

    @property(LandMap)
    map: LandMap = null;

    open() {

        super.open();
        this.map.initPool();
        this.map.setMap(this.generateMap(.3, .35, .05, .6, .8, .8, .02));
        //this.map.focusOnGrid(6, 9);
    }

    generateMap(deepsea: number = .3, 
                sea: number = .3, 
                sand: number = .3, 
                grass: number = .3, 
                city: number = .3, 
                tree: number = .3,
                award:number = .1): number[] {
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

                        //城市
                        map.push( Math.random() < award ? 7 : 4);
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

    getMap(): LandMap {
        return this.map;
    }
}
