import { createGlobalVar } from './GlobalVar.js';
import { createEventEmitter } from './EventEmitter.js';
import { createCollisionDetector } from './CollisionDetector.js';
import { createPlayer } from './player.js';
import { createBackground } from './background.js';
import { createUI } from './ui.js';
import { createEnemySpawningSystemHandler } from './EnemySpawningSystem.js';
import { createCollisionSystemHandler } from './CollisionSystem.js';

main().catch(console.error);

async function main() {
  try {
    const networkPlugin = await window.app.networkPlugin;
    networkPlugin.onAssetsLoaded();

    // 1. 初始化 PIXI 應用
    const app = new window.PIXI.Application();
    await app.init({
      view: document.getElementById('game-canvas'),
      width: 800,
      height: 600,
      backgroundColor: 0x000000
    });
    app.stage.sortableChildren = true;

    // 2. 建立核心架構物件
    const globalVar = createGlobalVar(app);
    globalVar.emitter = createEventEmitter();
    globalVar.collisionDetector = createCollisionDetector();

    // 3. 建立遊戲主容器
    globalVar.container = new window.PIXI.Container();
    app.stage.addChild(globalVar.container);

    // 4. 初始化遊戲系統 (System Handlers)
    createEnemySpawningSystemHandler(globalVar);
    createCollisionSystemHandler(globalVar);

    // 5. 初始化基礎遊戲物件與 UI
    createBackground(globalVar);
    createUI(globalVar);
    createPlayer(globalVar);

    // 6. 註冊基礎輸入事件
    window.addEventListener('keydown', (e) => { globalVar.keys[e.key] = true; });
    window.addEventListener('keyup', (e) => { globalVar.keys[e.key] = false; });

    // 7. 遊戲主循環 - 僅負責發射事件
    app.ticker.add(() => {
      globalVar.emitter.emit('onTicker');
    });

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}