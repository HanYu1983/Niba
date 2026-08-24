// 全域變量管理模組
export function createGlobalVar(app) {
  return {
    // 遊戲配置
    config: {
      width: 800,
      height: 600,
      enemySpawnInterval: 120,
      maxCharge: 100,
      chargeRate: 1.5,
    },

    // PIXI 容器
    container: null,
    app: app,

    // 事件發射器
    emitter: null,

    // 碰撞檢測器
    collisionDetector: null,

    // 遊戲狀態
    gameState: {
      score: 0,
      lives: 3,
      isGameOver: false,
      enemySpawnTimer: 0,
      enemySpawnInterval: 120,
      chargeLevel: 0,
      isCharging: false,
      maxCharge: 100,
      chargeRate: 1.5,
    },

    // 物件集合
    collections: {
      stars: [],
      playerBullets: [],
      enemyBullets: [],
      enemies: [],
      explosions: [],
    },

    // 鍵盤狀態
    keys: {},

    // UI 元素引用
    ui: {
      scoreText: null,
      livesText: null,
      chargeBar: null,
      chargeBarBg: null,
      chargeText: null,
      gameOverText: null,
      finalScoreText: null,
      chargeAura: null,
    },

    // 玩家引用
    player: null,
  };
}
