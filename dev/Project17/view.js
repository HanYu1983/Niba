export class View {
    constructor(injector) {
        this.injector = injector;
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
}