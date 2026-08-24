import { createEnemyBullet } from './enemyBullet.js';

export function createEnemy(globalVar) {
  const enemy = new window.PIXI.Graphics();
  enemy.moveTo(0, -12);
  enemy.lineTo(-25, 0);
  enemy.lineTo(0, 12);
  enemy.lineTo(0, -12);
  enemy.fill(0xFF0000);
  enemy.x = globalVar.config.width;
  enemy.y = Math.random() * (globalVar.config.height - 40) + 20;
  enemy.vx = -(Math.random() * 2 + 2);
  enemy.shootTimer = Math.random() * 120 + 60;

  globalVar.collections.enemies.push(enemy);
  globalVar.container.addChild(enemy);
  globalVar.collisionDetector.enemies.push(enemy);

  const updateHandler = () => {
    if (globalVar.gameState.isGameOver) return;

    enemy.x += enemy.vx;

    // 敵人射擊
    enemy.shootTimer--;
    if (enemy.shootTimer <= 0) {
      createEnemyBullet(globalVar, enemy.x - 25, enemy.y);
      enemy.shootTimer = Math.random() * 120 + 60;
    }

    // 移除超出畫面的敵人
    if (enemy.x < -30) {
      removeEnemy(globalVar, enemy);
    }
  };

  globalVar.emitter.on('onTicker', updateHandler);
  enemy._updateHandler = updateHandler;

  return enemy;
}

export function removeEnemy(globalVar, enemy) {
  const index = globalVar.collections.enemies.indexOf(enemy);
  if (index !== -1) {
    globalVar.collections.enemies.splice(index, 1);
  }

  const collisionIndex = globalVar.collisionDetector.enemies.indexOf(enemy);
  if (collisionIndex !== -1) {
    globalVar.collisionDetector.enemies.splice(collisionIndex, 1);
  }

  globalVar.container.removeChild(enemy);
  globalVar.emitter.off('onTicker', enemy._updateHandler);
}
