// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Sprite } from 'cc';
import ImageAssets from './ImageAssets';
const { ccclass, property } = _decorator;

@ccclass('ImageChanger')
export class ImageChanger extends Component {
    
    @property(Sprite)
    sprites:Sprite[] = [];

    @property(ImageAssets)
    assets:ImageAssets = null;

    changeImage(id:number, imageName:string){
        this.sprites[id].spriteFrame = this.assets.getImageByKey(imageName);
    }

}
