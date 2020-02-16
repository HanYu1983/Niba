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
export default class ImagesAssets extends cc.Component {

    @property(cc.SpriteFrame)
    images: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    landImages: cc.SpriteFrame[] = [];

    getImageByKey(key: string) {
        const allImages = this.images.concat(this.landImages);
        for (let i = 0; i < allImages.length; ++i) {
            let image = allImages[i];
            if (image.name.toLowerCase() == key.toLowerCase()) {
                return image;
            }
        }
        return undefined;
    }

    getLandImageByType(type: number) {
        switch (type) {
            case 0:
                return this.getImageByKey("sea");
            case 1:
                return this.getImageByKey("beach");
            case 2:
                return this.getImageByKey("sand");
            case 3:
                return this.getImageByKey("grass");
            case 4:
                return this.getImageByKey("city");
            case 5:
                return this.getImageByKey("hill");
            case 6:
                return this.getImageByKey("energy");
            default:
                throw Error("還沒有圖片哦:" + type);
        }
    }
}
