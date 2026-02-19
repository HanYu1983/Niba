export function createPlayerBullet(globalVar, x, y) {
  const bullet = new window.PIXI.Graphics();
  bullet.circle(0, 0, 4);
  bullet.fill(0xFFFF00);
  bullet.x = x;
  bullet.y = y;
  bullet.vx = 8;
  bullet.isBig = false;

  addBullet(globalVar, bullet);
  return bullet;
}

export function createBigBullet(globalVar, x, y) {
  const bullet = new window.PIXI.Graphics();
  bullet.circle(0, 0, 15);
  bullet.fill(0x00FFFF);
  bullet.circle(0, 0, 18);
  bullet.fill({ color: 0x00FFFF, alpha: 0.3 });
  bullet.x = x;
  bullet.y = y;
  bullet.vx = 10;
  bullet.isBig = true;

  addBullet(globalVar, bullet);
  return bullet;
}

function addBullet(globalVar, bullet) {
  globalVar.collections.playerBullets.push(bullet);
  globalVar.container.addChild(bullet);
  globalVar.collisionDetector.playerBullets.push(bullet);

  const updateHandler = () => {
    if (globalVar.gameState.isGameOver) return;

    bullet.x += bullet.vx;

    if (bullet.x > globalVar.config.width) {
      removeBullet(globalVar, bullet, updateHandler);
    }
  };

  globalVar.emitter.on('onTicker', updateHandler);

  // 保存 handler 以便移除
  bullet._updateHandler = updateHandler;
}

export function removeBullet(globalVar, bullet) {
  const index = globalVar.collections.playerBullets.indexOf(bullet);
  if (index !== -1) {
    globalVar.collections.playerBullets.splice(index, 1);
  }

  const collisionIndex = globalVar.collisionDetector.playerBullets.indexOf(bullet);
  if (collisionIndex !== -1) {
    globalVar.collisionDetector.playerBullets.splice(collisionIndex, 1);
  }

  globalVar.container.removeChild(bullet);
  globalVar.emitter.off('onTicker', bullet._updateHandler);
}
