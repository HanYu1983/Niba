import { Injector } from "./injector.js";
//import { View, BALL_SIZE } from "./view.js";
import { ViewPIXI as View, BALL_SIZE } from "./viewPIXI.js";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class Controller {
    injector = new Injector();
    view = new View(this.injector);

    async start() {
        await this.view.createCanvas(720, 1280);
        this.injector.addRenderListener(() => {
            this.view.clearCanvas();
        })
        this.view.bindInjectorNotifications();
        this.createBoards()
    }

    hides = [] // array of [x, y] pairs to hide balls

    setHidesFromFallInfos(infos) {
        // 將掉落資訊轉換為隱藏位置
        // infos為列表, 內容為{from:[x,y], to:[x,y], type}
        this.hides = infos.map(info => info.from); // 只保留to位置
    }

    clearHides() {
        // 清除所有隱藏位置
        this.hides = [];
    }

    boards = [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ]; // 6行8列的棋盤

    createBoards() {
        for (let i = 0; i < this.boards.length; i++) {
            for (let j = 0; j < this.boards[i].length; j++) {
                this.boards[i][j] = Math.floor(Math.random() * 5); // 隨機生成0-4的數字
            }
        }
        let state = "normal"; // normal, falling
        let mx = 0
        let my = 0
        this.injector.addMouseMoveListener(([x, y]) => {
            mx = x;
            my = y;
        })

        this.injector.addMouseDBClickListener(([x, y]) => {
            const col = Math.floor(x / BALL_SIZE);
            const row = Math.floor(y / BALL_SIZE);
            if (state == "normal") {
                state = "falling"; // 改變狀態為掉落
                const animate = async () => {
                    this.boards[row][col] = null; // 將點擊的球設為null
                    const fallInfos = this.getFallInfos();
                    this.setHidesFromFallInfos(fallInfos); // 設置隱藏位置
                    await this.createBallFallAnimation(fallInfos);
                    this.applyFallInfos(fallInfos);
                    this.clearHides(); // 清除隱藏位置
                    for (let i = 0; i < 50; i++) {
                        const eatInfos = this.getEatInfo();
                        if (eatInfos.length > 0) {
                            await this.setHidesFromEatInfos(eatInfos); // 設置隱藏位置
                            // 這裡可以添加吃掉球的動畫
                            await this.createEatBallAnimation(eatInfos);
                            this.clearHides(); // 清除隱藏位置
                            this.applyEatInfos(eatInfos); // 將吃掉的球位置應用到棋盤上

                            const fallInfos = this.getFallInfos();
                            this.setHidesFromFallInfos(fallInfos); // 設置隱藏位置
                            await this.createBallFallAnimation(fallInfos);
                            this.applyFallInfos(fallInfos);
                            this.clearHides(); // 清除隱藏位置
                        } else {
                            break   // 如果沒有吃掉的球, 則跳出循環
                        }
                    }
                    state = "normal"
                }
                animate().catch(console.error);
            }
        })

        this.injector.addUpdateListener((delta) => {
            if (state === "normal") {
                // 在正常狀態下不做任何事
                return;
            } else if (state === "falling") {
                // 在掉落狀態下不做任何事
                return;
            }
        })

        this.injector.addRenderListener(() => {
            this.view.renderBoard({
                boards: this.boards,
                hides: this.hides,
                state: state,
                mx: mx,
                my: my
            });
        })
    }

    getNextBallType() {
        return Math.floor(Math.random() * 5); // 隨機生成0-4的數字
    }

    getFallInfos() {
        // 這個方法應該返回一個列表, 內容為{from:[x,y], to:[x,y], type}
        // 先將boards轉置成boardsT
        const boardsT = [];
        for (let j = 0; j < this.boards[0].length; j++) {
            boardsT[j] = [];
            for (let i = 0; i < this.boards.length; i++) {
                boardsT[j][i] = this.boards[i][j];
            }
        }
        // 先將boardsT的值全部映射到新的2維陣列tmp並轉置, 內容為{id, x, y, type}
        const tmp = boardsT.map((row, y) => {
            return row.map((type, x) => {
                if (type === null) return null; // 保留null
                return { id: `${x}-${y}`, type }; // 使用x和y作為id的一部分
            });
        });
        const tmp2 = JSON.parse(JSON.stringify(tmp)); // 深拷貝
        // 將tmp2的每一個元素重新排序, null排在前面, 其它元素保持原順序
        tmp2.forEach((item) => {
            item.sort((a, b) => {
                if (a === null && b === null) return 0; // 都是null, 保持原順序
                if (a === null) return -1; // null排在前面
                if (b === null) return 1; // null排在前面
                return 0; // 其它元素保持原順序
            })
        })
        // 比較tmp和tmp2, 找出id相同但x,y不同的元素
        const fallInfos = [];
        for (let y = 0; y < tmp.length; y++) {
            for (let x = 0; x < tmp[y].length; x++) {
                const left = tmp[y][x];
                for (let x2 = 0; x2 < tmp2[y].length; x2++) {
                    const right = tmp2[y][x2];
                    if (left && right && left.id === right.id && x !== x2) {
                        // 找到掉落的球
                        fallInfos.push({
                            from: [x, y], // 原位置
                            to: [x2, y], // 新位置
                            type: left.type // 球的類型
                        });
                    }
                }
            }
        }
        for (let y = 0; y < tmp2.length; y++) {
            for (let x = 0; x < tmp2[y].length; x++) {
                const left = tmp2[y][x];
                if (left == null) {
                    fallInfos.push({
                        from: [x - tmp2.length, y], // 原位置
                        to: [x, y], // 新位置
                        type: this.getNextBallType(), // 掉落的球的類型
                        isNew: true // 標記為新掉落的球
                    });
                }
            }
        }
        // 將fallInfos中的每個元素的from和to的座標轉置回來
        return fallInfos.map(info => ({
            from: [info.from[1], info.from[0]], // 轉置
            to: [info.to[1], info.to[0]], // 轉置
            type: info.type,
            isNew: info.isNew || false // 如果沒有isNew屬性, 則默認為false
        }));
    }

    applyFallInfos(infos) {
        // 將掉落資訊應用到棋盤上
        // 這裡假設infos為列表, 內容為{from:[x,y], to:[x,y], type}
        // 先將infos排序, to位置的y值從大到小
        infos.sort((a, b) => b.to[1] - a.to[1]); // 先處理較高的行
        infos.forEach(info => {
            const toX = info.to[0];
            const toY = info.to[1];
            if (info.isNew) {
                // 如果是新掉落的球, 則直接在to位置放置新球
                this.boards[toY][toX] = info.type; // 將新球放在to位置
                return; // 跳過後續處理
            }
            const fromX = info.from[0];
            const fromY = info.from[1];
            // 將from位置的球移到to位置
            if (this.boards[fromY][fromX] !== null) {
                this.boards[toY][toX] = this.boards[fromY][fromX];
                this.boards[fromY][fromX] = null; // 將原位置設為null
            }
        });
    }

    getEatInfo() {
        // 這個方法應該返回一個列表, 內容為[[x,y], [x,y], ...]
        // 這裡假設吃掉的球是連續的, 並且只考慮水平和垂直方向
        const eatInfos = [];
        for (let y = 0; y < this.boards.length; y++) {
            for (let x = 0; x < this.boards[y].length; x++) {
                const type = this.boards[y][x];
                if (type === null) continue; // 跳過空位

                // 檢查水平連續
                let count = 1;
                while (x + count < this.boards[y].length && this.boards[y][x + count] === type) {
                    count++;
                }
                if (count >= 3) { // 至少3個連續
                    for (let i = 0; i < count; i++) {
                        eatInfos.push([x + i, y]); // 添加所有連續的球位置
                    }
                }

                // 檢查垂直連續
                count = 1;
                while (y + count < this.boards.length && this.boards[y + count][x] === type) {
                    count++;
                }
                if (count >= 3) { // 至少3個連續
                    for (let i = 0; i < count; i++) {
                        eatInfos.push([x, y + i]); // 添加所有連續的球位置
                    }
                }
            }
        }
        return eatInfos;
    }

    applyEatInfos(eatInfos) {
        // 將吃掉的球位置應用到棋盤上
        // eatInfos為列表, 內容為[[x,y], [x,y], ...]
        eatInfos.forEach(([x, y]) => {
            this.boards[y][x] = null; // 將吃掉的球位置設為null
        });
    }

    async setHidesFromEatInfos(eatInfos) {
        // 將吃掉的球位置轉換為隱藏位置
        // eatInfos為列表, 內容為[[x,y], [x,y], ...]
        this.hides = eatInfos; // 直接使用eatInfos作為隱藏位置
    }

    async createBallFallAnimation(infos) {
        // infos為列表, 內容為{from:[x,y], to:[x,y], type}
        // 使用addUpdateListener來處理狀態和動畫
        // 使用addRenderListener來繪制
        const balls = infos.map(info => {
            const id = `ball-${Math.random().toString(36).substr(2, 9)}`;
            return {
                id,
                x: info.from[0] * BALL_SIZE,
                y: info.from[1] * BALL_SIZE,
                targetX: info.to[0] * BALL_SIZE,
                targetY: info.to[1] * BALL_SIZE,
                type: info.type,
            };
        })
        // 動畫順序
        let state = "falling"; // falling, bouncing
        let timeElapsed = 0;
        let scaleY = 1;
        const onUpdate = (delta) => {
            // 1. 0.5秒後移到目標位置
            // 2. 變成彈跳狀態，持續0.5秒
            if (timeElapsed < 500) {
                // 在0.5秒內移動到目標位置
                balls.forEach(ball => {
                    const progress = timeElapsed / 500; // 0到1之間
                    ball.x = ball.x + (ball.targetX - ball.x) * progress;
                    ball.y = ball.y + (ball.targetY - ball.y) * progress;
                });
            } else {
                state = "bouncing";
                scaleY = 0.7 + 0.3 * Math.abs(Math.cos((timeElapsed - 500) / 1000 * Math.PI * 2));
            }
            timeElapsed += delta;
        }
        const onRender = () => {
            this.view.renderEatAnimation({
                balls: balls,
                state: state,
                scaleY: scaleY
            });
        }
        this.injector.addUpdateListener(onUpdate);
        this.injector.addRenderListener(onRender);
        await delay(1000);
        this.injector.removeListener(onUpdate);
        this.injector.removeListener(onRender);
    }

    async createEatBallAnimation(eatInfos) {

    }
}
