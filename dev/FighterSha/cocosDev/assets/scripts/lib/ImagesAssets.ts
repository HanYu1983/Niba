const { ccclass, property } = cc._decorator;

@ccclass
export default class ImagesAssets extends cc.Component {

    static Instance = null;

    @property(cc.SpriteFrame)
    images: cc.SpriteFrame[] = [];

    start(){
        ImagesAssets.Instance = this;
    }

    getImageByKey(key: string) {
        for (let i = 0; i < this.images.length; ++i) {
            let image = this.images[i];
            if (image.name.toLowerCase() == key.toLowerCase()) {
                return image;
            }
        }
        return undefined;
    }

}
