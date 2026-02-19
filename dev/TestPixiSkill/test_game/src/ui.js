export function createUI(globalVar) {
  const stage = globalVar.app.stage;
  const gameState = globalVar.gameState;

  // 分數文字
  const scoreText = new window.PIXI.Text(`分數: ${gameState.score}`, {
    fontSize: 24,
    fill: 0xFFFFFF,
    fontFamily: 'Arial'
  });
  scoreText.position.set(10, 10);
  stage.addChild(scoreText);
  globalVar.ui.scoreText = scoreText;

  // 生命文字
  const livesText = new window.PIXI.Text(`生命: ${gameState.lives}`, {
    fontSize: 24,
    fill: 0xFF0000,
    fontFamily: 'Arial'
  });
  livesText.position.set(10, 40);
  stage.addChild(livesText);
  globalVar.ui.livesText = livesText;

  // 集氣進度條背景
  const chargeBarBg = new window.PIXI.Graphics();
  chargeBarBg.rect(10, 70, 200, 20);
  chargeBarBg.fill(0x333333);
  stage.addChild(chargeBarBg);
  globalVar.ui.chargeBarBg = chargeBarBg;

  // 集氣進度條
  const chargeBar = new window.PIXI.Graphics();
  stage.addChild(chargeBar);
  globalVar.ui.chargeBar = chargeBar;

  // 集氣百分比文字
  const chargeText = new window.PIXI.Text('集氣: 0%', {
    fontSize: 18,
    fill: 0x00FFFF,
    fontFamily: 'Arial'
  });
  chargeText.position.set(220, 70);
  stage.addChild(chargeText);
  globalVar.ui.chargeText = chargeText;

  // 集氣光環
  const chargeAura = new window.PIXI.Graphics();
  chargeAura.visible = false;
  globalVar.container.addChild(chargeAura);
  globalVar.ui.chargeAura = chargeAura;

  // 遊戲結束畫面
  const gameOverText = new window.PIXI.Text('遊戲結束！', {
    fontSize: 48,
    fill: 0xFF0000,
    fontFamily: 'Arial',
    fontWeight: 'bold'
  });
  gameOverText.anchor.set(0.5);
  gameOverText.position.set(400, 250);
  gameOverText.visible = false;
  stage.addChild(gameOverText);
  globalVar.ui.gameOverText = gameOverText;

  const finalScoreText = new window.PIXI.Text('', {
    fontSize: 32,
    fill: 0xFFFFFF,
    fontFamily: 'Arial'
  });
  finalScoreText.anchor.set(0.5);
  finalScoreText.position.set(400, 320);
  finalScoreText.visible = false;
  stage.addChild(finalScoreText);
  globalVar.ui.finalScoreText = finalScoreText;

  // 監聽狀態更新事件
  globalVar.emitter.on('onScoreUpdate', (score) => {
    scoreText.text = `分數: ${score}`;
  });

  globalVar.emitter.on('onLivesUpdate', (lives) => {
    livesText.text = `生命: ${lives}`;
  });

  globalVar.emitter.on('onChargeUpdate', (percent) => {
    chargeBar.clear();
    const barWidth = 200 * percent;
    const barColor = percent >= 1.0 ? 0x00FF00 : 0x00FFFF;
    if (barWidth > 0) {
      chargeBar.rect(10, 70, barWidth, 20);
      chargeBar.fill(barColor);
    }
    chargeText.text = `集氣: ${Math.floor(percent * 100)}%`;
  });

  globalVar.emitter.on('onGameOver', () => {
    gameOverText.visible = true;
    finalScoreText.text = `最終分數: ${gameState.score}`;
    finalScoreText.visible = true;
  });
}
