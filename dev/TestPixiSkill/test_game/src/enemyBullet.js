export function createEnemyBullet(globalVar, x, y) {
  const bullet = new window.PIXI.Graphics();
  bullet.circle(0, 0, 4);
  bullet.fill(0xFF0000);
  bullet.x = x;
  bullet.y = y;
  bullet.vx = -6;
  bullet.vy = 0;
  bullet.isDeflected = false;

  addBullet(globalVar, bullet);
  return bullet;
}

function addBullet(globalVar, bullet) {
  globalVar.collections.enemyBullets.push(bullet);
  globalVar.container.addChild(bullet);
  globalVar.collisionDetector.enemyBullets.push(bullet);

  const updateHandler = () => {
    if (globalVar.gameState.isGameOver) return;

    bullet.x += bullet.vx;
    if (bullet.vy) bullet.y += bullet.vy;

    if (bullet.x < 0 || bullet.x > globalVar.config.width || bullet.y < 0 || bullet.y > globalVar.config.height) {
      removeEnemyBullet(globalVar, bullet);
    }
  };

  globalVar.emitter.on('onTicker', updateHandler);
  bullet._updateHandler = updateHandler;
}

export function deflectBullet(bullet) {
  bullet.vx = -bullet.vx * 1.5;
  bullet.vy = (Math.random() - 0.5) * 8;
  bullet.isDeflected = true;
  bullet.clear();
  bullet.circle(0, 0, 4);
  bullet.fill(0xFFFF00);
}

export function removeEnemyBullet(globalVar, bullet) {
  const index = globalVar.collections.enemyBullets.indexOf(bullet);
  if (index !== -1) {
    globalVar.collections.enemyBullets.splice(index, 1);
  }

  const collisionIndex = globalVar.collisionDetector.enemyBullets.indexOf(bullet);
  if (collisionIndex !== -1) {
    globalVar.collisionDetector.enemyBullets.splice(collisionIndex, 1);
  }

  globalVar.container.removeChild(bullet);
  globalVar.emitter.off('onTicker', bullet._updateHandler);
}
