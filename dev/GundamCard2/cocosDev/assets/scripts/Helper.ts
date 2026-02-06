import { Texture2D, ImageAsset } from "cc";

function getImgSrc(imgID: string) {
    return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${imgID}.jpg`;
}

async function loadTextureFromURL(url: string): Promise<Texture2D> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
            const imageAsset = new ImageAsset(image);
            const texture = new Texture2D();
            texture.image = imageAsset;
            resolve(texture);
        };
        image.onerror = (err) => {
            reject(err);
        };
        image.src = url;
    });
}

const texturePool: Record<string, Texture2D> = {};

async function getTexture(cardID: string): Promise<Texture2D> {
    if (texturePool[cardID]) {
        return texturePool[cardID];
    } else {
        const url = `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${cardID}.jpg`;
        const texture = await loadTextureFromURL(url);
        texturePool[cardID] = texture;
        return texture;
    }
}



function callWeb(type: string, data: any) {
    console.log("Calling web function via postMessage", { type, data });
    if (window['html']) {
        window['html'].callParent({ type: type, data: data });
    }
}

export { getImgSrc, loadTextureFromURL, getTexture, callWeb };