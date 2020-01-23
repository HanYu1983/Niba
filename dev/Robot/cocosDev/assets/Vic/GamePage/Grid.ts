import UVReset from './UVReset';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Grid extends cc.Component {

    // @property(cc.Label)
    // typeName: cc.Label = null;

    // @property(cc.Sprite)
    // backColor: cc.Sprite = null;

    @property(cc.Node)
    moveRange: cc.Node = null;

    @property(cc.Node)
    weaponRange: cc.Node = null;

    @property(cc.Node)
    mapRange:cc.Node = null;

    @property(cc.Sprite)
    landImages:cc.Sprite[] = [];

    @property(cc.Sprite)
    boxImage:cc.Sprite = null;

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

    showBox(show:boolean = true){
        this.boxImage.node.active = show;
    }

    showTargetLand(id:number){
        for(let i = 0; i < this.landImages.length; ++i){
            this.landImages[i].node.active = (i == id);
        }
        this.showBox(false);
    }

    resetUV(){
        for(let i = 0; i < this.landImages.length; ++i){
            let uvreset = this.landImages[i].node.getComponent(UVReset);
            if (uvreset) {
                uvreset.fix();
            }
        }
    }

    setType(type: Number) {
        switch (type) {
            case 0:
                // this.typeName.string = "深";
                // this.backColor.node.color = cc.Color.BLUE;
                this.showTargetLand(0);
                break;
            case 1:
                // this.typeName.string = "海";
                // this.backColor.node.color = new cc.Color(50, 50, 255);
                this.showTargetLand(1);
                break;
            case 2:
                // this.typeName.string = "沙";
                // this.backColor.node.color = cc.Color.YELLOW;
                this.showTargetLand(2);
                break;
            case 3:
                // this.typeName.string = "草";
                // this.backColor.node.color = cc.Color.GREEN;
                this.showTargetLand(3);
                break;
            case 4:
                // this.typeName.string = "城";
                // this.backColor.node.color = cc.Color.GRAY;
                this.showTargetLand(4);
                break;
            case 5:
                // this.typeName.string = "山";
                // this.backColor.node.color = cc.Color.ORANGE;
                this.showTargetLand(5);
                break;
            case 6:
                // this.typeName.string = "林";
                // this.backColor.node.color = new cc.Color(0, 120, 0);
                this.showTargetLand(6);
                break;
            case 7:
                // this.typeName.string = "補";
                // this.backColor.node.color = cc.Color.RED;
                this.showTargetLand(8);
                break;
            case 8:
                // this.typeName.string = "路";
                // this.backColor.node.color = cc.Color.WHITE;
                this.showTargetLand(7);
                break;
        }
    }
}
