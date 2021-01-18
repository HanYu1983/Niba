// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Sprite, ImageAsset } from 'cc';
import ImageAssets from '../lib/ImageAssets';
const { ccclass, property } = _decorator;

@ccclass('Grid')
export class Grid extends Component {
    // @property(Label)
    // typeName: Label = null;

    // @property(Sprite)
    // backColor: Sprite = null;

    @property(Node)
    moveRange: Node = null;

    @property(Node)
    weaponRange: Node = null;

    @property(Node)
    mapRange:Node = null;

    @property(Sprite)
    land:Sprite = null;

    @property(ImageAssets)
    assetLands:ImageAssets = null;

    @property(Sprite)
    boxImage:Sprite = null;

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

    setType(type: Number) {
        switch (type) {
            case 0:
                //"深";
                this.land.spriteFrame = this.assetLands.getImageByKey("sea");
                break;
            case 1:
                //"海"
                this.land.spriteFrame = this.assetLands.getImageByKey("shallowSea");
                break;
            case 2:
                //"沙";
                this.land.spriteFrame = this.assetLands.getImageByKey("beach");
                break;
            case 3:
                //"草";
                this.land.spriteFrame = this.assetLands.getImageByKey("plain");
                break;
            case 4:
                //"城";
                this.land.spriteFrame = this.assetLands.getImageByKey("city");
                break;
            case 5:
                //"山";
                this.land.spriteFrame = this.assetLands.getImageByKey("hill");
                break;
            case 6:
                //"林";
                this.land.spriteFrame = this.assetLands.getImageByKey("forest");
                break;
            case 7:
                //"補";
                this.land.spriteFrame = this.assetLands.getImageByKey("award");
                break;
            case 8:
                // "路";
                this.land.spriteFrame = this.assetLands.getImageByKey("road");
                break;
        }
    }
}
