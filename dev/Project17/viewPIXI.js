const { Application, Assets, Container, Sprite, Rectangle, Texture } = window.PIXI;

export const BALL_SIZE = 50; // 假設每個球的大小為50x50像素

export class ViewPIXI {
    constructor(injector) {
        this.injector = injector;
    }


    app = null;
    async createCanvas(w, h) {
        const app = new Application();
        await app.init({ background: '#1099bb', width: w, height: h });
        document.body.appendChild(app.canvas);

        this.app = app;
        await this._loadAssets();
        this._createPlayPage();
    }

    bindInjectorNotifications() {
        this.app.ticker.add((delta) => {
            this.injector.notifyUpdateListeners(delta);
            this.injector.notifyRenderListeners();
        });
    }

    clearCanvas() {

    }

    renderBoard({ boards, hides, state, mx, my }) {
        const imgSize = BALL_SIZE;
        for (let i = 0; i < boards.length; i++) {
            for (let j = 0; j < boards[i].length; j++) {
                const isHide = hides.some(([hx, hy]) => hx === j && hy === i);
                if (isHide) {
                    continue; // 如果這個位置被隱藏, 跳過繪制
                }
                const ballType = boards[i][j];
                if (ballType !== null) {
                    this._drawPuyo(`puyo-${i}-${j}`, ballType, { x: j * imgSize, y: i * imgSize });
                }
            }
        }
        // // 寫出狀態
        // ctx.fillStyle = "blue";
        // ctx.font = "20px Arial";
        // ctx.fillText(`State: ${state}`, 10, 20);
        // // draw x, y
        // ctx.fillText(`Mouse Position: (${mx}, ${my})`, 10, 40);
    }

    renderEatAnimation({ balls, state, scaleY }) {

    }

    assets = {}
    async _loadAssets() {
        const imgs = [
            "images/puyo_blue.png",
            "images/puyo_green.png",
            "images/puyo_purple.png",
            "images/puyo_red.png",
            "images/puyo_yellow.png",
        ];
        for (const imgId of imgs) {
            const img = this._getImage(imgId);
            const texture = Texture.from(img);
            this.assets[imgId] = texture;
        }
    }
    // <img src="images/puyo_blue.png" id="images/puyo_blue.png">
    // <img src="images/puyo_green.png" id="images/puyo_green.png">
    // <img src="images/puyo_purple.png" id="images/puyo_purple.png">
    // <img src="images/puyo_red.png" id="images/puyo_red.png">
    // <img src="images/puyo_yellow.png" id="images/puyo_yellow.png"></img>
    // type: 0~4
    _getBallImage(type) {
        const imgs = [
            "images/puyo_blue.png",
            "images/puyo_green.png",
            "images/puyo_purple.png",
            "images/puyo_red.png",
            "images/puyo_yellow.png",
        ];
        const texture = this.assets[imgs[type]];
        if (texture == null) {
            throw new Error(`Image for type ${type} not found`);
        }
        return texture
    }

    _getRendererEventsPointer() {
        return this.app.renderer.events.pointer
    }

    playPage = {
        container: null,
        boardContainer: null
    }
    _getBoardContainer() {
        return this.playPage.boardContainer
    }
    _createPlayPage() {
        const container = new Container();
        const boardContainer = new Container();
        container.addChild(boardContainer);
        this.playPage.container = container;
        this.playPage.boardContainer = boardContainer;
        this.app.stage.addChild(container);

        boardContainer.x = 100
        // this.app.ticker.add((time) => {
        //     const pointer = this._getRendererEventsPointer();
        //     const local = boardContainer.toLocal(pointer.global);
        //     const puyo = this._drawPuyo('puyo2', local.x, local.y);

        // })
    }

    entites = {}
    _drawPuyo(key, ballType, { x, y, visible }) {
        const img = this._getBallImage(ballType);
        let entity = this.entites[key]
        if (!entity) {
            entity = new Sprite(img);
            // entity.pivot.x = entity.width / 2;
            // entity.pivot.y = entity.height / 2;
            this.entites[key] = entity;
            this.playPage.boardContainer.addChild(entity);
        }
        entity.x = x;
        entity.y = y;
        entity.visible = visible !== undefined ? visible : true; // 默認可見
        return entity
    }

    _getImage(path) {
        return document.getElementById(path)
    }




}