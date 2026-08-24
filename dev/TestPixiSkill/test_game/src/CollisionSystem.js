import { removeEnemy } from './enemy.js';
import { createExplosion } from './explosion.js';
import { removeBullet } from './bullet.js';
import { removeEnemyBullet, deflectBullet } from './enemyBullet.js';

export function createCollisionSystemHandler(globalVar) {
  globalVar.emitter.on('onTicker', () => {
    if (globalVar.gameState.isGameOver) return;

    const cd = globalVar.collisionDetector;
    const gs = globalVar.gameState;
    const em = globalVar.emitter;

    // A. 玩家子彈 vs 敵人
    for (let i = cd.playerBullets.length - 1; i >= 0; i--) {
      const bullet = cd.playerBullets[i];
      const bulletRadius = bullet.isBig ? 15 : 4;

      for (let j = cd.enemies.length - 1; j >= 0; j--) {
        const enemy = cd.enemies[j];
        if (cd.checkCollision(bullet, enemy, bulletRadius, 15)) {
          createExplosion(globalVar, enemy.x, enemy.y);
          removeEnemy(globalVar, enemy);

          gs.score += 10;
          em.emit('onScoreUpdate', gs.score);

          if (!bullet.isBig) {
            removeBullet(globalVar, bullet);
          }
          break; // 該子彈已碰撞
        }
      }
    }

    // B. 玩家撞敵人
    for (let i = cd.enemies.length - 1; i >= 0; i--) {
      const enemy = cd.enemies[i];
      if (cd.checkCollision(globalVar.player, enemy, 15, 15)) {
        createExplosion(globalVar, enemy.x, enemy.y);
        removeEnemy(globalVar, enemy);
        takeDamage(globalVar);
      }
    }

    // C. 敵人子彈 vs 玩家/敵人
    for (let i = cd.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = cd.enemyBullets[i];

      if (bullet.isDeflected) {
        // 被彈開的子彈可以擊中敵人
        for (let j = cd.enemies.length - 1; j >= 0; j--) {
          const enemy = cd.enemies[j];
          if (cd.checkCollision(bullet, enemy, 4, 15)) {
            createExplosion(globalVar, enemy.x, enemy.y);
            removeEnemy(globalVar, enemy);
            removeEnemyBullet(globalVar, bullet);
            gs.score += 10;
            em.emit('onScoreUpdate', gs.score);
            break;
          }
        }
      } else {
        // 未彈開的子彈檢查擊中玩家
        if (cd.checkCollision(bullet, globalVar.player, 4, 15)) {
          if (gs.chargeLevel >= gs.maxCharge) {
            deflectBullet(bullet);
          } else {
            createExplosion(globalVar, globalVar.player.x, globalVar.player.y);
            removeEnemyBullet(globalVar, bullet);
            takeDamage(globalVar);
          }
        }
      }
    }
  });
}

function takeDamage(globalVar) {
  const gs = globalVar.gameState;
  gs.lives--;
  globalVar.emitter.emit('onLivesUpdate', gs.lives);

  if (gs.lives <= 0) {
    gs.isGameOver = true;
    globalVar.emitter.emit('onGameOver');
  }
}
