const { Application, Assets, Container, Sprite, Rectangle, Texture, Spritesheet } = window.PIXI;

class ViewPIXI {
    constructor(injector) {
        this.injector = injector;
    }

    app = null;
    async createCanvas(w, h) {
        const existingCanvas = document.getElementById('gameCanvas');
        const app = new Application();
        await app.init({ background: '#FFFFFF', width: w, height: h, canvas: existingCanvas });
        this.app = app;
        await this._loadAssets();
        this._createPlayPage();
    }

    bindInjectorNotifications() {
        this.app.ticker.add((delta) => {
            this.injector.notifyUpdateListeners(delta.deltaMS);
            this.injector.notifyRenderListeners();
            this._releaseAllObjects();
        });
        window.addEventListener('dblclick', e => {
            const { x, y } = this.app.renderer.events.pointer.global
            this.injector.notifyMouseDBClickListeners([x, y]);
        });
        window.addEventListener('mousemove', e => {
            const { x, y } = this.app.renderer.events.pointer.global
            this.injector.notifyMouseMoveListeners([x, y]);
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
                    this._drawPuyo(`puyo-${i}-${j}`, {
                        ballType,
                        x: j * imgSize,
                        y: i * imgSize,
                        container: this._getBoardContainer()
                    });
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
        if (state == "bouncing") {
            // 先對y座標進行分組, 同樣的y座標的球放在一起
            // 每組使用以下計算
            // 重新計算球的位置, 全部相對於y最大的球的y座標
            // 先將translate到y最大的球的y座標
            // 然後scaleY壓扁
            // 所有的球用相對座標(應為負數)繪制
            const groupsBallsWithSameY = {};
            balls.forEach(ball => {
                const y2 = Math.floor(ball.targetX / BALL_SIZE)
                if (!groupsBallsWithSameY[y2]) {
                    groupsBallsWithSameY[y2] = [];
                }
                groupsBallsWithSameY[y2].push(ball);
            });
            for (let y2 in groupsBallsWithSameY) {
                const tmpName = `renderEatAnimation-group-${y2}`;
                const [tmp, isNew] = this._getObject(tmpName, null);
                if (isNew) {
                    this._getBoardContainer().addChild(tmp);
                }
                this._retainObject(tmpName);
                const group = groupsBallsWithSameY[y2];
                const maxY = Math.max(...group.map(ball => ball.y)) + BALL_SIZE;
                tmp.y = maxY;
                tmp.scale.y = scaleY;
                group.forEach((ball, i) => {
                    this._drawPuyo(`renderEatAnimation-puyo-${y2}-${i}`, {
                        ballType: ball.type,
                        x: ball.x,
                        y: ball.y - maxY,
                        container: tmp
                    });
                });
            }
        } else {
            balls.forEach((ball, i) => {
                this._drawPuyo(`renderEatAnimation-puyo-${i}`, {
                    ballType: ball.type,
                    x: ball.x,
                    y: ball.y,
                    container: this._getBoardContainer()
                });
            });
        }
    }

    globalToBoardLocal([x, y]) {
        const local = this.playPage.boardContainer.toLocal({ x: x, y: y });
        return [local.x, local.y]
    }

    assets = {}
    async _loadAssets() {
        // 確保圖像完全載入後再創建紋理
        // https://pixijs.download/release/docs/assets.Spritesheet.html#textures
        const img = document.getElementById('images/texture.png')
        if (img.complete != true) {
            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })
        }
        const sheet = new Spritesheet(Texture.from(img), TEXTUERS);
        await sheet.parse();
        this.assets = sheet.textures
    }
    // type: 0~4
    _getBallImage(type) {
        const imgs = [
            "puyo_blue.png",
            "puyo_green.png",
            "puyo_purple.png",
            "puyo_red.png",
            "puyo_yellow.png",
        ];
        const texture = this.assets[imgs[type]];
        if (texture == null) {
            throw new Error(`Image for type ${type} not found`);
        }
        return texture
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
    }


    _drawPuyo(key, { ballType, x, y, container }) {
        const [entity, isNew] = this._getObject(key, this._getBallImage(ballType));
        if (isNew) {
            // entity.pivot.x = entity.width / 2;
            // entity.pivot.y = entity.height / 2;
            entity.width = BALL_SIZE
            entity.height = BALL_SIZE
            container.addChild(entity);
        }
        entity.x = x;
        entity.y = y;
        this._retainObject(key);
        return entity
    }



    objectPool = {}
    _getObject(key, texture) {
        let object = this.objectPool[key];
        let isNew = false;
        if (object == null) {
            if (texture == null) {
                object = new Container();
            } else {
                object = new Sprite(texture);
            }
            isNew = true;
            this.objectPool[key] = object
        }
        return [object, isNew];
    }
    objectRetains = {}
    _retainObject(key) {
        this.objectRetains[key] = 1 //Math.min(1, (this.objectRetains[key] || 0) + 1)
    }
    _releaseObject(key) {
        this.objectRetains[key]--;
        if (this.objectRetains[key] < 0) {
            const object = this.objectPool[key];
            if (object) {
                object.destroy();
                delete this.objectPool[key];
                delete this.objectRetains[key];
            }
        }
    }
    _releaseAllObjects() {
        for (const key in this.objectPool) {
            this._releaseObject(key);
        }
    }
}
