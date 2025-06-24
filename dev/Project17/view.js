export const BALL_SIZE = 50; // 假設每個球的大小為50x50像素

export class View {
    constructor(injector) {
        this.injector = injector;
    }
    bindInjectorNotifications() {
        window.addEventListener('mouseup', e => {
            const { clientX, clientY } = e;
            const ndc = this.getRelatedPositionFromCanvas([clientX, clientY]);
            this.injector.notifyMouseUpListeners(ndc);
        });
        window.addEventListener('mousedown', e => {
            const { clientX, clientY } = e;
            const ndc = this.getRelatedPositionFromCanvas([clientX, clientY]);
            this.injector.notifyMouseDownListeners(ndc);
        });
        window.addEventListener('dblclick', e => {
            const { clientX, clientY } = e;
            const ndc = this.getRelatedPositionFromCanvas([clientX, clientY]);
            this.injector.notifyMouseDBClickListeners(ndc);
        });
        window.addEventListener('mousemove', e => {
            const { clientX, clientY } = e;
            const ndc = this.getRelatedPositionFromCanvas([clientX, clientY]);
            this.injector.notifyMouseMoveListeners(ndc);
        });
        // 使用requestAnimationFrame計算delta並叫用notifyUpdateListeners
        let lastTime = performance.now();
        const animate = () => {
            const time = performance.now();
            const delta = time - lastTime;
            lastTime = time;
            this.injector.notifyUpdateListeners(delta);
            this.injector.notifyRenderListeners();
            requestAnimationFrame(animate);
        };
        animate()
    }
    createCanvas(w, h) {
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = w || window.innerWidth;
        this.canvas.height = h || window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getContext() {
        if (this.ctx == null) {
            console.error("Canvas context is not initialized. Call createCanvas first.");
            return null;
        }
        return this.ctx;
    }
    getRelatedPositionFromCanvas([x, y]) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        return [canvasX, canvasY];
    }
    getImage(path) {
        return document.getElementById(path)
    }

    // <img src="images/puyo_blue.png" id="images/puyo_blue.png">
    // <img src="images/puyo_green.png" id="images/puyo_green.png">
    // <img src="images/puyo_purple.png" id="images/puyo_purple.png">
    // <img src="images/puyo_red.png" id="images/puyo_red.png">
    // <img src="images/puyo_yellow.png" id="images/puyo_yellow.png"></img>
    // type: 0~4
    getBallImage(type) {
        const imgs = [
            "images/puyo_blue.png",
            "images/puyo_green.png",
            "images/puyo_purple.png",
            "images/puyo_red.png",
            "images/puyo_yellow.png",
        ];
        return this.getImage(imgs[type]);
    }

    clearCanvas() {
        const ctx = this.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 清除畫布
    }

    renderBoard({ boards, hides, state, mx, my }) {
        const ctx = this.getContext();
        const imgSize = BALL_SIZE;
        for (let i = 0; i < boards.length; i++) {
            for (let j = 0; j < boards[i].length; j++) {
                const isHide = hides.some(([hx, hy]) => hx === j && hy === i);
                if (isHide) {
                    continue; // 如果這個位置被隱藏, 跳過繪制
                }
                const ballType = boards[i][j];
                if (ballType !== null) {
                    const img = this.getBallImage(ballType);
                    if (img) {
                        ctx.drawImage(img, j * imgSize, i * imgSize, imgSize, imgSize);
                    } else {
                        console.error(`Image for type ${ballType} not found`);
                    }
                }
            }
        }
        // 寫出狀態
        ctx.fillStyle = "blue";
        ctx.font = "20px Arial";
        ctx.fillText(`State: ${state}`, 10, 20);
        // draw x, y
        ctx.fillText(`Mouse Position: (${mx}, ${my})`, 10, 40);
    }
    onRenderEatAnimation({ balls, state, scaleY }) {
        const ctx = this.getContext();
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
                ctx.save();
                const group = groupsBallsWithSameY[y2];
                const maxY = Math.max(...group.map(ball => ball.y)) + BALL_SIZE;
                ctx.translate(0, maxY);
                ctx.scale(1, scaleY);
                group.forEach(ball => {
                    const img = this.getBallImage(ball.type);
                    if (img) {
                        ctx.drawImage(img, ball.x, ball.y - maxY, BALL_SIZE, BALL_SIZE);
                    } else {
                        console.error(`Image for type ${ball.type} not found`);
                    }
                });
                ctx.restore(); // 重置變換矩陣
            }
        } else {
            balls.forEach(ball => {
                const img = this.getBallImage(ball.type);
                if (img) {
                    ctx.drawImage(img, ball.x, ball.y, BALL_SIZE, BALL_SIZE);
                } else {
                    console.error(`Image for type ${ball.type} not found`);
                }
            });
        }
    }
}