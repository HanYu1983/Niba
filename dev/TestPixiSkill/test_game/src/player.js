import { createPlayerBullet, createBigBullet } from './bullet.js';

export function createPlayer(globalVar) {
  const player = new window.PIXI.Graphics();
  player.moveTo(0, -15);
  player.lineTo(30, 0);
  player.lineTo(0, 15);
  player.lineTo(0, -15);
  player.fill(0x00AAFF);
  player.x = 100;
  player.y = 300;
  player.vx = 0;
  player.vy = 0;
  player.shootCooldown = 0;

  globalVar.player = player;
  globalVar.container.addChild(player);
  globalVar.collisionDetector.player = player;

  // 監聽更新事件
  globalVar.emitter.on('onTicker', () => {
    if (globalVar.gameState.isGameOver) return;

    // 玩家移動
    player.vx = 0;
    player.vy = 0;

    const keys = globalVar.keys;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.vy = -5;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.vy = 5;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.vx = -5;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.vx = 5;

    player.x += player.vx;
    player.y += player.vy;

    // 限制玩家在畫布內
    player.x = Math.max(15, Math.min(200, player.x));
    player.y = Math.max(15, Math.min(585, player.y));

    // 集氣系統
    handleCharging(player, globalVar);

    // 普通射擊冷卻
    if (player.shootCooldown > 0) player.shootCooldown--;
  });

  return player;
}

function handleCharging(player, globalVar) {
  const keys = globalVar.keys;
  const gameState = globalVar.gameState;
  const ui = globalVar.ui;

  if (keys[' '] || keys['Spacebar']) {
    if (!gameState.isCharging && player.shootCooldown === 0) {
      gameState.isCharging = true;
    }

    if (gameState.isCharging) {
      gameState.chargeLevel = Math.min(gameState.maxCharge, gameState.chargeLevel + gameState.chargeRate);

      // 更新集氣光環
      if (ui.chargeAura) {
        const chargePercent = gameState.chargeLevel / gameState.maxCharge;
        const auraRadius = 20 + chargePercent * 15;
        const auraAlpha = 0.3 + chargePercent * 0.4;

        ui.chargeAura.clear();
        ui.chargeAura.circle(player.x, player.y, auraRadius);
        ui.chargeAura.fill({ color: 0x00FFFF, alpha: auraAlpha });
        ui.chargeAura.circle(player.x, player.y, auraRadius + 5);
        ui.chargeAura.fill({ color: 0xFFFFFF, alpha: auraAlpha * 0.5 });
        ui.chargeAura.visible = true;
      }

      // 更新 UI 事件（由 ui.js 監聽，但這裡先直接操作或改用 event）
      globalVar.emitter.emit('onChargeUpdate', gameState.chargeLevel / gameState.maxCharge);
    }
  } else {
    if (gameState.isCharging) {
      if (gameState.chargeLevel >= gameState.maxCharge) {
        createBigBullet(globalVar, player.x + 30, player.y);
        player.shootCooldown = 30;
      } else if (gameState.chargeLevel > 10) {
        createPlayerBullet(globalVar, player.x + 30, player.y);
        player.shootCooldown = 12;
      }

      gameState.chargeLevel = 0;
      gameState.isCharging = false;
      if (ui.chargeAura) ui.chargeAura.visible = false;
      globalVar.emitter.emit('onChargeUpdate', 0);
    }
  }
}
