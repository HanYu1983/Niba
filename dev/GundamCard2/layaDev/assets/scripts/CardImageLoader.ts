export class CardImageLoader {

    private static inst: CardImageLoader = new CardImageLoader();

    private constructor() { }

    private imageMap: Map<String, Laya.Texture> = new Map();

    static instance() {
        return this.inst;
    }

    async getImage(uid: string, url: string) {
        // console.log("start get image");
        
        if (!this.imageMap.has(uid)) {
            const tex = await this.fatchUrl(url);
            this.imageMap.set(uid, tex);
        }
        
        // console.log("end get image");
        
        return this.imageMap.get(uid);
    }

    fatchUrl(url: string): Promise<Laya.Texture> {
        return new Promise((resolve) => {
            // console.log("start loding image");
            
            Laya.loader.fetch(url, "image").then((res) => {
                // console.log("end loading image");

                //创建Texture2D
                var t2d: Laya.Texture2D = new Laya.Texture2D(res.width, res.height, Laya.TextureFormat.R8G8B8A8, false, false, true);
                t2d.setImageData(res, true, false);

                resolve(new Laya.Texture(t2d));
            });
        });
    }
}