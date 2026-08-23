import { createEnemy } from './enemy.js';

export function createEnemySpawningSystemHandler(globalVar) {
  globalVar.emitter.on('onTicker', () => {
    if (globalVar.gameState.isGameOver) return;

    const gs = globalVar.gameState;
    gs.enemySpawnTimer++;
    if (gs.enemySpawnTimer >= gs.enemySpawnInterval) {
      createEnemy(globalVar);
      gs.enemySpawnTimer = 0;
      // 隨時間增加難度
      if (gs.enemySpawnInterval > 40) {
        gs.enemySpawnInterval -= 0.5;
      }
    }
  });
}
