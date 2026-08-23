export function createBackground(globalVar) {
  const stars = [];
  for (let i = 0; i < 100; i++) {
    const star = new window.PIXI.Graphics();
    star.circle(0, 0, Math.random() * 2);
    star.fill(0xFFFFFF);
    star.x = Math.random() * globalVar.config.width;
    star.y = Math.random() * globalVar.config.height;
    star.alpha = Math.random() * 0.5 + 0.5;
    star.speed = Math.random() * 2 + 1;
    stars.push(star);
    globalVar.container.addChild(star);
  }
  globalVar.collections.stars = stars;

  globalVar.emitter.on('onTicker', () => {
    if (globalVar.gameState.isGameOver) return;

    stars.forEach(star => {
      star.x -= star.speed;
      if (star.x < 0) {
        star.x = globalVar.config.width;
        star.y = Math.random() * globalVar.config.height;
      }
    });
  });
}
