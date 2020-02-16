// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SmallMap extends cc.Component {

    @property(cc.Graphics)
    map: cc.Graphics = null;

    @property(cc.Color)
    colors:cc.Color[] = [];

    drawDot(pos:number[], type){
        this.map.fillColor = this.colors[type];
        this.map.fillRect(pos[0],-pos[1], 2,2)
    }

    drawMap(data:any[]) {
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data[i].length; ++j) {
                const type = data[i][j];
                this.drawDot([j*2-100,i*2-100], data[i][j]);
            }
        }
    }
}
