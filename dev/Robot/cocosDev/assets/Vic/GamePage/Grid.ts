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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    typeName: cc.Label = null;

    @property(cc.Sprite)
    backColor: cc.Sprite = null;

    @property(cc.Node)
    moveRange: cc.Node = null;

    @property(cc.Node)
    weaponRange: cc.Node = null;

    @property(cc.Node)
    mapRange:cc.Node = null;

    landX: number;
    landY: number;

    showNormal() {
        this.showMoveRange(false);
        this.showWeaponRange(false);
        this.showMapRange(false);
    }

    showMoveRange(show: boolean = true) {
        this.moveRange.active = show;
    }

    showWeaponRange(show: boolean = true) {
        this.weaponRange.active = show;
    }

    showMapRange(show:boolean = true){
        this.mapRange.active = show;
    }

    setType(type: Number) {
        switch (type) {
            case 0:
                this.typeName.string = "深";
                this.backColor.node.color = cc.Color.BLUE;
                break;
            case 1:
                this.typeName.string = "海";
                this.backColor.node.color = new cc.Color(50, 50, 255);
                break;
            case 2:
                this.typeName.string = "沙";
                this.backColor.node.color = cc.Color.YELLOW;
                break;
            case 3:
                this.typeName.string = "草";
                this.backColor.node.color = cc.Color.GREEN;
                break;
            case 4:
                this.typeName.string = "城";
                this.backColor.node.color = cc.Color.GRAY;
                break;
            case 5:
                this.typeName.string = "山";
                this.backColor.node.color = cc.Color.ORANGE;
                break;
            case 6:
                this.typeName.string = "林";
                this.backColor.node.color = new cc.Color(0, 120, 0);
                break;
            case 7:
                this.typeName.string = "補";
                this.backColor.node.color = cc.Color.RED;
                break;
            case 8:
                this.typeName.string = "路";
                this.backColor.node.color = cc.Color.WHITE;
                break;
        }
    }
}
