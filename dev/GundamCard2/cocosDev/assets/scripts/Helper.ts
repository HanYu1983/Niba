import { Texture2D, ImageAsset } from "cc";

function getImgSrc(imgID: string) {
    return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${imgID}.jpg`;
}

async function loadTextureFromURL(url: string):Promise<Texture2D> {
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

export { getImgSrc, loadTextureFromURL };