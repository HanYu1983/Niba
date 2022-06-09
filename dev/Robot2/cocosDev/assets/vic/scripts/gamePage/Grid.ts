// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Sprite, ImageAsset } from 'cc';
import ImageAssets from '../lib/ImageAssets';
import { ImageChanger } from '../lib/ImageChanger';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Grid')
@requireComponent(ImageChanger)
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
                this.node.getComponent(ImageChanger)?.changeImage(0, "deepSea");
                break;
            case 1:
                //"海"
                this.node.getComponent(ImageChanger)?.changeImage(0, "shallowSea");
                break;
            case 2:
                //"沙";
                this.node.getComponent(ImageChanger)?.changeImage(0, "beach");
                break;
            case 3:
                //"草";
                this.node.getComponent(ImageChanger)?.changeImage(0, "plain");
                break;
            case 4:
                //"城";
                this.node.getComponent(ImageChanger)?.changeImage(0, "city");
                break;
            case 5:
                //"山";
                this.node.getComponent(ImageChanger)?.changeImage(0, "hill");
                break;
            case 6:
                //"林";
                this.node.getComponent(ImageChanger)?.changeImage(0, "forest");
                break;
            case 7:
                //"補";
                this.node.getComponent(ImageChanger)?.changeImage(0, "award");
                break;
            case 8:
                // "路";
                this.node.getComponent(ImageChanger)?.changeImage(0, "road");
                break;
        }
    }
}
