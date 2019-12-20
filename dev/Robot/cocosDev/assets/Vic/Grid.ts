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
    selectBorder:cc.Node = null;

    landX: number;
    landY: number;

    start() {

    }

    showFocus(show:boolean){
        this.selectBorder.active = show;
    }

    showMove() {
        this.backColor.node.color = cc.Color.BLUE;
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
        }
    }
}
