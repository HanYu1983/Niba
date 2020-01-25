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

    @property(cc.Sprite)
    map: cc.Sprite = null;

    start() {
        this.drawMap();
    }

    drawMap() {
        let size = this.node.getContentSize();
        let newTexture = new cc.Texture2D();
        let data = this.createQuadData(size.width, size.height);
        newTexture.initWithData(data, 4, size.width, size.height);
        newTexture.handleLoadedTexture();
        let spriteFrame = new cc.SpriteFrame(newTexture, new cc.Rect(0, 0, size.width, size.height), false
            , cc.Vec2.ZERO, size);

        this.map.spriteFrame = spriteFrame;
    }

    createQuadData(width, height) {
        let data = new Uint8Array(width * height * 4);
        for (let i = 0; i < width; i++) {
            for (let n = 0; n < height; n++) {
                //R
                data[i * width * 4 + n * 4 + 0] = 255;
                //G
                data[i * width * 4 + n * 4 + 1] = 255;
                //B
                data[i * width * 4 + n * 4 + 2] = 255;
                //A
                data[i * width * 4 + n * 4 + 3] = 255;
            }
        }
        return data;
    }
}
