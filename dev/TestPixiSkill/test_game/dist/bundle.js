/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/CollisionDetector.js"
/*!**********************************!*\
  !*** ./src/CollisionDetector.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createCollisionDetector: () => (/* binding */ createCollisionDetector)\n/* harmony export */ });\n// 碰撞檢測系統\nfunction createCollisionDetector() {\n  return {\n    // 碰撞群組\n    playerBullets: [],\n    enemyBullets: [],\n    enemies: [],\n    player: null,\n\n    // 碰撞檢測方法\n    checkCollision(obj1, obj2, radius1 = 15, radius2 = 15) {\n      const dx = obj1.x - obj2.x;\n      const dy = obj1.y - obj2.y;\n      const distance = Math.sqrt(dx * dx + dy * dy);\n      return distance < radius1 + radius2;\n    },\n\n    // 清空所有群組\n    clear() {\n      this.playerBullets = [];\n      this.enemyBullets = [];\n      this.enemies = [];\n      this.player = null;\n    }\n  };\n}\n\n\n//# sourceURL=webpack://test_game/./src/CollisionDetector.js?\n}");

/***/ },

/***/ "./src/CollisionSystem.js"
/*!********************************!*\
  !*** ./src/CollisionSystem.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createCollisionSystemHandler: () => (/* binding */ createCollisionSystemHandler)\n/* harmony export */ });\n/* harmony import */ var _enemy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enemy.js */ \"./src/enemy.js\");\n/* harmony import */ var _explosion_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./explosion.js */ \"./src/explosion.js\");\n/* harmony import */ var _bullet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bullet.js */ \"./src/bullet.js\");\n/* harmony import */ var _enemyBullet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enemyBullet.js */ \"./src/enemyBullet.js\");\n\n\n\n\n\nfunction createCollisionSystemHandler(globalVar) {\n  globalVar.emitter.on('onTicker', () => {\n    if (globalVar.gameState.isGameOver) return;\n\n    const cd = globalVar.collisionDetector;\n    const gs = globalVar.gameState;\n    const em = globalVar.emitter;\n\n    // A. 玩家子彈 vs 敵人\n    for (let i = cd.playerBullets.length - 1; i >= 0; i--) {\n      const bullet = cd.playerBullets[i];\n      const bulletRadius = bullet.isBig ? 15 : 4;\n\n      for (let j = cd.enemies.length - 1; j >= 0; j--) {\n        const enemy = cd.enemies[j];\n        if (cd.checkCollision(bullet, enemy, bulletRadius, 15)) {\n          (0,_explosion_js__WEBPACK_IMPORTED_MODULE_1__.createExplosion)(globalVar, enemy.x, enemy.y);\n          (0,_enemy_js__WEBPACK_IMPORTED_MODULE_0__.removeEnemy)(globalVar, enemy);\n\n          gs.score += 10;\n          em.emit('onScoreUpdate', gs.score);\n\n          if (!bullet.isBig) {\n            (0,_bullet_js__WEBPACK_IMPORTED_MODULE_2__.removeBullet)(globalVar, bullet);\n          }\n          break; // 該子彈已碰撞\n        }\n      }\n    }\n\n    // B. 玩家撞敵人\n    for (let i = cd.enemies.length - 1; i >= 0; i--) {\n      const enemy = cd.enemies[i];\n      if (cd.checkCollision(globalVar.player, enemy, 15, 15)) {\n        (0,_explosion_js__WEBPACK_IMPORTED_MODULE_1__.createExplosion)(globalVar, enemy.x, enemy.y);\n        (0,_enemy_js__WEBPACK_IMPORTED_MODULE_0__.removeEnemy)(globalVar, enemy);\n        takeDamage(globalVar);\n      }\n    }\n\n    // C. 敵人子彈 vs 玩家/敵人\n    for (let i = cd.enemyBullets.length - 1; i >= 0; i--) {\n      const bullet = cd.enemyBullets[i];\n\n      if (bullet.isDeflected) {\n        // 被彈開的子彈可以擊中敵人\n        for (let j = cd.enemies.length - 1; j >= 0; j--) {\n          const enemy = cd.enemies[j];\n          if (cd.checkCollision(bullet, enemy, 4, 15)) {\n            (0,_explosion_js__WEBPACK_IMPORTED_MODULE_1__.createExplosion)(globalVar, enemy.x, enemy.y);\n            (0,_enemy_js__WEBPACK_IMPORTED_MODULE_0__.removeEnemy)(globalVar, enemy);\n            (0,_enemyBullet_js__WEBPACK_IMPORTED_MODULE_3__.removeEnemyBullet)(globalVar, bullet);\n            gs.score += 10;\n            em.emit('onScoreUpdate', gs.score);\n            break;\n          }\n        }\n      } else {\n        // 未彈開的子彈檢查擊中玩家\n        if (cd.checkCollision(bullet, globalVar.player, 4, 15)) {\n          if (gs.chargeLevel >= gs.maxCharge) {\n            (0,_enemyBullet_js__WEBPACK_IMPORTED_MODULE_3__.deflectBullet)(bullet);\n          } else {\n            (0,_explosion_js__WEBPACK_IMPORTED_MODULE_1__.createExplosion)(globalVar, globalVar.player.x, globalVar.player.y);\n            (0,_enemyBullet_js__WEBPACK_IMPORTED_MODULE_3__.removeEnemyBullet)(globalVar, bullet);\n            takeDamage(globalVar);\n          }\n        }\n      }\n    }\n  });\n}\n\nfunction takeDamage(globalVar) {\n  const gs = globalVar.gameState;\n  gs.lives--;\n  globalVar.emitter.emit('onLivesUpdate', gs.lives);\n\n  if (gs.lives <= 0) {\n    gs.isGameOver = true;\n    globalVar.emitter.emit('onGameOver');\n  }\n}\n\n\n//# sourceURL=webpack://test_game/./src/CollisionSystem.js?\n}");

/***/ },

/***/ "./src/EnemySpawningSystem.js"
/*!************************************!*\
  !*** ./src/EnemySpawningSystem.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createEnemySpawningSystemHandler: () => (/* binding */ createEnemySpawningSystemHandler)\n/* harmony export */ });\n/* harmony import */ var _enemy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enemy.js */ \"./src/enemy.js\");\n\n\nfunction createEnemySpawningSystemHandler(globalVar) {\n  globalVar.emitter.on('onTicker', () => {\n    if (globalVar.gameState.isGameOver) return;\n\n    const gs = globalVar.gameState;\n    gs.enemySpawnTimer++;\n    if (gs.enemySpawnTimer >= gs.enemySpawnInterval) {\n      (0,_enemy_js__WEBPACK_IMPORTED_MODULE_0__.createEnemy)(globalVar);\n      gs.enemySpawnTimer = 0;\n      // 隨時間增加難度\n      if (gs.enemySpawnInterval > 40) {\n        gs.enemySpawnInterval -= 0.5;\n      }\n    }\n  });\n}\n\n\n//# sourceURL=webpack://test_game/./src/EnemySpawningSystem.js?\n}");

/***/ },

/***/ "./src/EventEmitter.js"
/*!*****************************!*\
  !*** ./src/EventEmitter.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createEventEmitter: () => (/* binding */ createEventEmitter)\n/* harmony export */ });\n// 觀察者模式的事件系統\nfunction createEventEmitter() {\n  const listeners = {};\n\n  return {\n    // 註冊事件監聽器\n    on(eventName, callback) {\n      if (!listeners[eventName]) {\n        listeners[eventName] = [];\n      }\n      listeners[eventName].push(callback);\n    },\n\n    // 發射事件\n    emit(eventName, ...args) {\n      if (listeners[eventName]) {\n        listeners[eventName].forEach(callback => callback(...args));\n      }\n    },\n\n    // 移除事件監聽器\n    off(eventName, callback) {\n      if (listeners[eventName]) {\n        listeners[eventName] = listeners[eventName].filter(cb => cb !== callback);\n      }\n    },\n\n    // 清除所有監聽器\n    clear() {\n      Object.keys(listeners).forEach(key => {\n        listeners[key] = [];\n      });\n    }\n  };\n}\n\n\n//# sourceURL=webpack://test_game/./src/EventEmitter.js?\n}");

/***/ },

/***/ "./src/GlobalVar.js"
/*!**************************!*\
  !*** ./src/GlobalVar.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createGlobalVar: () => (/* binding */ createGlobalVar)\n/* harmony export */ });\n// 全域變量管理模組\nfunction createGlobalVar(app) {\n  return {\n    // 遊戲配置\n    config: {\n      width: 800,\n      height: 600,\n      enemySpawnInterval: 120,\n      maxCharge: 100,\n      chargeRate: 1.5,\n    },\n\n    // PIXI 容器\n    container: null,\n    app: app,\n\n    // 事件發射器\n    emitter: null,\n\n    // 碰撞檢測器\n    collisionDetector: null,\n\n    // 遊戲狀態\n    gameState: {\n      score: 0,\n      lives: 3,\n      isGameOver: false,\n      enemySpawnTimer: 0,\n      enemySpawnInterval: 120,\n      chargeLevel: 0,\n      isCharging: false,\n      maxCharge: 100,\n      chargeRate: 1.5,\n    },\n\n    // 物件集合\n    collections: {\n      stars: [],\n      playerBullets: [],\n      enemyBullets: [],\n      enemies: [],\n      explosions: [],\n    },\n\n    // 鍵盤狀態\n    keys: {},\n\n    // UI 元素引用\n    ui: {\n      scoreText: null,\n      livesText: null,\n      chargeBar: null,\n      chargeBarBg: null,\n      chargeText: null,\n      gameOverText: null,\n      finalScoreText: null,\n      chargeAura: null,\n    },\n\n    // 玩家引用\n    player: null,\n  };\n}\n\n\n//# sourceURL=webpack://test_game/./src/GlobalVar.js?\n}");

/***/ },

/***/ "./src/assets/particle.png"
/*!*********************************!*\
  !*** ./src/assets/particle.png ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"data:image/png;base32768,禨䞑隡嚠蔀㐀侒組帀㐀㦀㐀㕠唐㐀㒴築垀㐀壄缢㥑눃櫗涷뛌㘀鐄輖彚걘嗁뷿鐈䨶豊佨墙枟絺僇厶燊燇민몺濺黬댥息歡駶逵솴揕皿㾫始㾋鍥㫠妼蚥醗뗡摛弇誙狆矍偑渞鑙俵䍽斵鐂㸌뮶蓔覃傛唉媃䤘杣哶㰸극哞㑲㼆沵檃聹懌岐砚䝸䘇偈䭬镳멨棂蟶碹㻜뽥榢䙻㿽㞩翷䐻疒껉䣅璷饙걨窃둸鏦膇믟軧䘽縫猊譨家昣䲭涼驙袁狳㽮㹘䏔鋜扭嗌卿陛뾚飭瞷啯嵁亙酲桻㑽垎笏郙㕰㜺㕝덄밒岈듆蕻卻눅䱹堊䲲警欖枮蹅릨䣡闣唞洱냧嚧崬눃儀蚕뒮鎁롹䆁紊䳠臿㘖㛛㾼䗔裮瞓抰뎉설렐铥뒇曮秊녒島㹣畑烏볳鎠㑊뻭懠뇶㣐㙿轔蝒萷楓嬸눓唄븀㹒閧쀾뺶焾韶柸期黕櫃묷玼胿뤀钙铤㛷爽櫣磅囄櫅㗤䗩鎬剃뵣纫觻欫㯽㞴軋箘謝볚誄鄖뇦鉕뜵럔譝袪랏願㥮胈詿뾡痢磖詀虑窌蕽輡䁙䊱囉䬵隐诔峢管秛䕗拐鬙暫磷脕敶볈뜾汨矧넵䎻症稔煯俸㙽承荹睉獧萨劓雥㳳㧚粥讽帿浼뾷냰걆跸㐀㐀㢔彲䚹㣁㘀\");\n\n//# sourceURL=webpack://test_game/./src/assets/particle.png?\n}");

/***/ },

/***/ "./src/background.js"
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createBackground: () => (/* binding */ createBackground)\n/* harmony export */ });\nfunction createBackground(globalVar) {\n  const stars = [];\n  for (let i = 0; i < 100; i++) {\n    const star = new window.PIXI.Graphics();\n    star.circle(0, 0, Math.random() * 2);\n    star.fill(0xFFFFFF);\n    star.x = Math.random() * globalVar.config.width;\n    star.y = Math.random() * globalVar.config.height;\n    star.alpha = Math.random() * 0.5 + 0.5;\n    star.speed = Math.random() * 2 + 1;\n    stars.push(star);\n    globalVar.container.addChild(star);\n  }\n  globalVar.collections.stars = stars;\n\n  globalVar.emitter.on('onTicker', () => {\n    if (globalVar.gameState.isGameOver) return;\n\n    stars.forEach(star => {\n      star.x -= star.speed;\n      if (star.x < 0) {\n        star.x = globalVar.config.width;\n        star.y = Math.random() * globalVar.config.height;\n      }\n    });\n  });\n}\n\n\n//# sourceURL=webpack://test_game/./src/background.js?\n}");

/***/ },

/***/ "./src/bullet.js"
/*!***********************!*\
  !*** ./src/bullet.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createBigBullet: () => (/* binding */ createBigBullet),\n/* harmony export */   createPlayerBullet: () => (/* binding */ createPlayerBullet),\n/* harmony export */   removeBullet: () => (/* binding */ removeBullet)\n/* harmony export */ });\nfunction createPlayerBullet(globalVar, x, y) {\n  const bullet = new window.PIXI.Graphics();\n  bullet.circle(0, 0, 4);\n  bullet.fill(0xFFFF00);\n  bullet.x = x;\n  bullet.y = y;\n  bullet.vx = 8;\n  bullet.isBig = false;\n\n  addBullet(globalVar, bullet);\n  return bullet;\n}\n\nfunction createBigBullet(globalVar, x, y) {\n  const bullet = new window.PIXI.Graphics();\n  bullet.circle(0, 0, 15);\n  bullet.fill(0x00FFFF);\n  bullet.circle(0, 0, 18);\n  bullet.fill({ color: 0x00FFFF, alpha: 0.3 });\n  bullet.x = x;\n  bullet.y = y;\n  bullet.vx = 10;\n  bullet.isBig = true;\n\n  addBullet(globalVar, bullet);\n  return bullet;\n}\n\nfunction addBullet(globalVar, bullet) {\n  globalVar.collections.playerBullets.push(bullet);\n  globalVar.container.addChild(bullet);\n  globalVar.collisionDetector.playerBullets.push(bullet);\n\n  const updateHandler = () => {\n    if (globalVar.gameState.isGameOver) return;\n\n    bullet.x += bullet.vx;\n\n    if (bullet.x > globalVar.config.width) {\n      removeBullet(globalVar, bullet, updateHandler);\n    }\n  };\n\n  globalVar.emitter.on('onTicker', updateHandler);\n\n  // 保存 handler 以便移除\n  bullet._updateHandler = updateHandler;\n}\n\nfunction removeBullet(globalVar, bullet) {\n  const index = globalVar.collections.playerBullets.indexOf(bullet);\n  if (index !== -1) {\n    globalVar.collections.playerBullets.splice(index, 1);\n  }\n\n  const collisionIndex = globalVar.collisionDetector.playerBullets.indexOf(bullet);\n  if (collisionIndex !== -1) {\n    globalVar.collisionDetector.playerBullets.splice(collisionIndex, 1);\n  }\n\n  globalVar.container.removeChild(bullet);\n  globalVar.emitter.off('onTicker', bullet._updateHandler);\n}\n\n\n//# sourceURL=webpack://test_game/./src/bullet.js?\n}");

/***/ },

/***/ "./src/enemy.js"
/*!**********************!*\
  !*** ./src/enemy.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createEnemy: () => (/* binding */ createEnemy),\n/* harmony export */   removeEnemy: () => (/* binding */ removeEnemy)\n/* harmony export */ });\n/* harmony import */ var _enemyBullet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enemyBullet.js */ \"./src/enemyBullet.js\");\n\n\nfunction createEnemy(globalVar) {\n  const enemy = new window.PIXI.Graphics();\n  enemy.moveTo(0, -12);\n  enemy.lineTo(-25, 0);\n  enemy.lineTo(0, 12);\n  enemy.lineTo(0, -12);\n  enemy.fill(0xFF0000);\n  enemy.x = globalVar.config.width;\n  enemy.y = Math.random() * (globalVar.config.height - 40) + 20;\n  enemy.vx = -(Math.random() * 2 + 2);\n  enemy.shootTimer = Math.random() * 120 + 60;\n\n  globalVar.collections.enemies.push(enemy);\n  globalVar.container.addChild(enemy);\n  globalVar.collisionDetector.enemies.push(enemy);\n\n  const updateHandler = () => {\n    if (globalVar.gameState.isGameOver) return;\n\n    enemy.x += enemy.vx;\n\n    // 敵人射擊\n    enemy.shootTimer--;\n    if (enemy.shootTimer <= 0) {\n      (0,_enemyBullet_js__WEBPACK_IMPORTED_MODULE_0__.createEnemyBullet)(globalVar, enemy.x - 25, enemy.y);\n      enemy.shootTimer = Math.random() * 120 + 60;\n    }\n\n    // 移除超出畫面的敵人\n    if (enemy.x < -30) {\n      removeEnemy(globalVar, enemy);\n    }\n  };\n\n  globalVar.emitter.on('onTicker', updateHandler);\n  enemy._updateHandler = updateHandler;\n\n  return enemy;\n}\n\nfunction removeEnemy(globalVar, enemy) {\n  const index = globalVar.collections.enemies.indexOf(enemy);\n  if (index !== -1) {\n    globalVar.collections.enemies.splice(index, 1);\n  }\n\n  const collisionIndex = globalVar.collisionDetector.enemies.indexOf(enemy);\n  if (collisionIndex !== -1) {\n    globalVar.collisionDetector.enemies.splice(collisionIndex, 1);\n  }\n\n  globalVar.container.removeChild(enemy);\n  globalVar.emitter.off('onTicker', enemy._updateHandler);\n}\n\n\n//# sourceURL=webpack://test_game/./src/enemy.js?\n}");

/***/ },

/***/ "./src/enemyBullet.js"
/*!****************************!*\
  !*** ./src/enemyBullet.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createEnemyBullet: () => (/* binding */ createEnemyBullet),\n/* harmony export */   deflectBullet: () => (/* binding */ deflectBullet),\n/* harmony export */   removeEnemyBullet: () => (/* binding */ removeEnemyBullet)\n/* harmony export */ });\nfunction createEnemyBullet(globalVar, x, y) {\n  const bullet = new window.PIXI.Graphics();\n  bullet.circle(0, 0, 4);\n  bullet.fill(0xFF0000);\n  bullet.x = x;\n  bullet.y = y;\n  bullet.vx = -6;\n  bullet.vy = 0;\n  bullet.isDeflected = false;\n\n  addBullet(globalVar, bullet);\n  return bullet;\n}\n\nfunction addBullet(globalVar, bullet) {\n  globalVar.collections.enemyBullets.push(bullet);\n  globalVar.container.addChild(bullet);\n  globalVar.collisionDetector.enemyBullets.push(bullet);\n\n  const updateHandler = () => {\n    if (globalVar.gameState.isGameOver) return;\n\n    bullet.x += bullet.vx;\n    if (bullet.vy) bullet.y += bullet.vy;\n\n    if (bullet.x < 0 || bullet.x > globalVar.config.width || bullet.y < 0 || bullet.y > globalVar.config.height) {\n      removeEnemyBullet(globalVar, bullet);\n    }\n  };\n\n  globalVar.emitter.on('onTicker', updateHandler);\n  bullet._updateHandler = updateHandler;\n}\n\nfunction deflectBullet(bullet) {\n  bullet.vx = -bullet.vx * 1.5;\n  bullet.vy = (Math.random() - 0.5) * 8;\n  bullet.isDeflected = true;\n  bullet.clear();\n  bullet.circle(0, 0, 4);\n  bullet.fill(0xFFFF00);\n}\n\nfunction removeEnemyBullet(globalVar, bullet) {\n  const index = globalVar.collections.enemyBullets.indexOf(bullet);\n  if (index !== -1) {\n    globalVar.collections.enemyBullets.splice(index, 1);\n  }\n\n  const collisionIndex = globalVar.collisionDetector.enemyBullets.indexOf(bullet);\n  if (collisionIndex !== -1) {\n    globalVar.collisionDetector.enemyBullets.splice(collisionIndex, 1);\n  }\n\n  globalVar.container.removeChild(bullet);\n  globalVar.emitter.off('onTicker', bullet._updateHandler);\n}\n\n\n//# sourceURL=webpack://test_game/./src/enemyBullet.js?\n}");

/***/ },

/***/ "./src/explosion.js"
/*!**************************!*\
  !*** ./src/explosion.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createExplosion: () => (/* binding */ createExplosion)\n/* harmony export */ });\n/* harmony import */ var _lib_tool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/tool */ \"./src/lib/tool.js\");\n/* harmony import */ var _assets_particle_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/particle.png */ \"./src/assets/particle.png\");\n\n\n\nasync function createExplosion(globalVar, x, y) {\n  const particleTexture = await (0,_lib_tool__WEBPACK_IMPORTED_MODULE_0__.loadTexture)(_assets_particle_png__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n  const emitter = new window.PIXI.particles.Emitter(\n    globalVar.container,\n    window.PIXI.particles.upgradeConfig({\n      \"lifetime\": { \"min\": 0.2, \"max\": 0.5 },\n      \"frequency\": 0.001,\n      \"emitterLifetime\": 0.2,\n      \"maxParticles\": 20,\n      \"pos\": { \"x\": x, \"y\": y },\n      \"addAtBack\": false,\n      \"behaviors\": [\n        {\n          \"type\": \"alpha\",\n          \"config\": {\n            \"alpha\": {\n              \"list\": [\n                { \"time\": 0, \"value\": 1 },\n                { \"time\": 1, \"value\": 0 }\n              ]\n            }\n          }\n        },\n        {\n          \"type\": \"scale\",\n          \"config\": {\n            \"scale\": {\n              \"list\": [\n                { \"time\": 0, \"value\": 0.5 },\n                { \"time\": 1, \"value\": 0.1 }\n              ]\n            }\n          }\n        },\n        {\n          \"type\": \"color\",\n          \"config\": {\n            \"color\": {\n              \"list\": [\n                { \"time\": 0, \"value\": \"ffaa00\" },\n                { \"time\": 1, \"value\": \"ff0000\" }\n              ]\n            }\n          }\n        },\n        {\n          \"type\": \"moveSpeed\",\n          \"config\": {\n            \"speed\": {\n              \"list\": [\n                { \"time\": 0, \"value\": 200 },\n                { \"time\": 1, \"value\": 50 }\n              ]\n            }\n          }\n        },\n        {\n          \"type\": \"rotationStatic\",\n          \"config\": {\n            \"min\": 0,\n            \"max\": 360\n          }\n        },\n        {\n          \"type\": \"spawnShape\",\n          \"config\": {\n            \"type\": \"torus\",\n            \"data\": {\n              \"x\": 0,\n              \"y\": 0,\n              \"radius\": 10,\n              \"innerRadius\": 0,\n              \"affectRotation\": false\n            }\n          }\n        }\n      ]\n    }, [particleTexture])\n  );\n\n  emitter.emit = true;\n  const explosionObj = { emitter, elapsed: Date.now() };\n  globalVar.collections.explosions.push(explosionObj);\n\n  const updateHandler = () => {\n    const now = Date.now();\n    emitter.update((now - explosionObj.elapsed) * 0.001);\n    explosionObj.elapsed = now;\n\n    if (!emitter.emit && emitter.particleCount === 0) {\n      removeExplosion(globalVar, explosionObj, updateHandler);\n    }\n  };\n\n  globalVar.emitter.on('onTicker', updateHandler);\n}\n\nfunction removeExplosion(globalVar, explosionObj, handler) {\n  const index = globalVar.collections.explosions.indexOf(explosionObj);\n  if (index !== -1) {\n    globalVar.collections.explosions.splice(index, 1);\n  }\n  explosionObj.emitter.destroy();\n  globalVar.emitter.off('onTicker', handler);\n}\n\n\n//# sourceURL=webpack://test_game/./src/explosion.js?\n}");

/***/ },

/***/ "./src/index.js"
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _GlobalVar_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GlobalVar.js */ \"./src/GlobalVar.js\");\n/* harmony import */ var _EventEmitter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EventEmitter.js */ \"./src/EventEmitter.js\");\n/* harmony import */ var _CollisionDetector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CollisionDetector.js */ \"./src/CollisionDetector.js\");\n/* harmony import */ var _player_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./player.js */ \"./src/player.js\");\n/* harmony import */ var _background_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./background.js */ \"./src/background.js\");\n/* harmony import */ var _ui_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui.js */ \"./src/ui.js\");\n/* harmony import */ var _EnemySpawningSystem_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./EnemySpawningSystem.js */ \"./src/EnemySpawningSystem.js\");\n/* harmony import */ var _CollisionSystem_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CollisionSystem.js */ \"./src/CollisionSystem.js\");\n\n\n\n\n\n\n\n\n\nmain().catch(console.error);\n\nasync function main() {\n  try {\n    const networkPlugin = await window.app.networkPlugin;\n    networkPlugin.onAssetsLoaded();\n\n    // 1. 初始化 PIXI 應用\n    const app = new window.PIXI.Application();\n    await app.init({\n      view: document.getElementById('game-canvas'),\n      width: 800,\n      height: 600,\n      backgroundColor: 0x000000\n    });\n    app.stage.sortableChildren = true;\n\n    // 2. 建立核心架構物件\n    const globalVar = (0,_GlobalVar_js__WEBPACK_IMPORTED_MODULE_0__.createGlobalVar)(app);\n    globalVar.emitter = (0,_EventEmitter_js__WEBPACK_IMPORTED_MODULE_1__.createEventEmitter)();\n    globalVar.collisionDetector = (0,_CollisionDetector_js__WEBPACK_IMPORTED_MODULE_2__.createCollisionDetector)();\n\n    // 3. 建立遊戲主容器\n    globalVar.container = new window.PIXI.Container();\n    app.stage.addChild(globalVar.container);\n\n    // 4. 初始化遊戲系統 (System Handlers)\n    (0,_EnemySpawningSystem_js__WEBPACK_IMPORTED_MODULE_6__.createEnemySpawningSystemHandler)(globalVar);\n    (0,_CollisionSystem_js__WEBPACK_IMPORTED_MODULE_7__.createCollisionSystemHandler)(globalVar);\n\n    // 5. 初始化基礎遊戲物件與 UI\n    (0,_background_js__WEBPACK_IMPORTED_MODULE_4__.createBackground)(globalVar);\n    (0,_ui_js__WEBPACK_IMPORTED_MODULE_5__.createUI)(globalVar);\n    (0,_player_js__WEBPACK_IMPORTED_MODULE_3__.createPlayer)(globalVar);\n\n    // 6. 註冊基礎輸入事件\n    window.addEventListener('keydown', (e) => { globalVar.keys[e.key] = true; });\n    window.addEventListener('keyup', (e) => { globalVar.keys[e.key] = false; });\n\n    // 7. 遊戲主循環 - 僅負責發射事件\n    app.ticker.add(() => {\n      globalVar.emitter.emit('onTicker');\n    });\n\n  } catch (error) {\n    alert(error.message);\n    console.error(error);\n  }\n}\n\n//# sourceURL=webpack://test_game/./src/index.js?\n}");

/***/ },

/***/ "./src/lib/baseX.js"
/*!**************************!*\
  !*** ./src/lib/baseX.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\nconst S = String.fromCharCode, n2cjk = n => S(n += n < 6400 ? 13312 : n < 27136 ? 13568 : 16896),\n  Base = {\n    e64(A) {\n      var a = 62, b = 0, c, z = A.length, B = new Uint8Array((z * 4 + 2) / 3), C = new Uint8Array(64);\n      for (C[a] = 43; a;)C[--a] = a > 51 ? a - 4 : a > 25 ? a + 71 : a + 65;\n      for (C[63] = 47; a < z; B[b++] = C[63 & c])c = A[a++] << 16 | A[a++] << 8 | A[a++], B[b++] = C[c >> 18], B[b++] = C[63 & c >> 12], B[b++] = C[63 & c >> 6];\n      return new TextDecoder().decode(B)\n    },\n    d64(A) {\n      if (typeof A == \"string\") A = new TextEncoder().encode(A);\n      var a = 62, b = 0, c, z = A.length, B = new Uint8Array((z + 2 >>> 2) * 3 - \"0021\"[z & 3]), C = new Uint8Array(123);\n      for (C[43] = a; C[--a > 51 ? a - 4 : a > 25 ? a + 71 : a + 65] = a;);\n      for (C[47] = 63; a < z; B[b++] = 255 & c)c = C[A[a++]] << 18 | C[A[a++]] << 12 | C[A[a++]] << 6 | C[A[a++]], B[b++] = c >> 16, B[b++] = 255 & c >> 8;\n      return B\n    },\n    e85(B) {\n      var a = 85, b, i, o = 0, z = B.length, C = new Uint8Array(124), A = new Uint8Array((z * 5 + 3) / 4);\n      for (; a;)C[--a] = a + 38;\n      for (C[54] = 33; a < z;) {\n        b = (B[a++] | B[a++] << 8 | B[a++] << 16 | B[a++] << 24) >>> 0;\n        for (i = 5; i--; b = b / 85 | 0)A[o++] = C[b % 85]\n      }\n      return new TextDecoder().decode(A)\n    },\n    d85(A) {\n      if (typeof A == \"string\") A = new TextEncoder().encode(A);\n      var a = 85, o = 0, z = A.length, b = z % 5, C = new Uint8Array(124), B = new Uint8Array((z - b) / 5 * 4 + (b && b - 1));\n      for (; C[--a + 38] = a;);\n      for (C[33] = 54, C[0..a] = 0; a < z; B[o++] = b >>> 24)\n        b = 52200625 * C[A[a += 4]] + 614125 * C[A[a - 1]] + 7225 * C[A[a - 2]] + 85 * C[A[a - 3]] + C[A[a++ - 4]],\n          B[o++] = b, B[o++] = b >> 8, B[o++] = b >> 16;\n      return B\n    },\n    e91(B) {\n      var a = 91, b = 0, c, z = B.length, n, o = 0, A = new Uint8Array(z * 1.24 + 2), C = new Uint8Array(a);\n      for (; a;)C[--a] = (a > 57) + !!a + a + 33;\n      for (; a < z;) {\n        c |= B[a++] << b; b += 8;\n        if (b > 13) {\n          n = c & 8191;\n          if (n > 88) c >>= 13, b -= 13;\n          else n = c & 16383, c >>= 14, b -= 14;\n          A[o++] = C[n % 91]; A[o++] = C[n / 91 | 0]\n        }\n      }\n      if (b) {\n        A[o++] = C[c % 91];\n        if (b > 7 || c > 90) A[o++] = C[c / 91 | 0]\n      }\n      return new TextDecoder().decode(A.subarray(0, o))\n    },\n    d91(A) {\n      if (typeof A == \"string\") A = new TextEncoder().encode(A);\n      for (var a = 91, b = 0, c = -1, d, e, o = 0, C = new Uint8Array(126); C[(--a > 57) + !!a + a + 33] = a;);\n      for (; d = A[a++];)\n        if (d = C[d], ~c) for (c += d * 91, e |= c << b, b += (c & 8191) > 88 ? 13 : 14, c = -1; A[o++] = e & 255, e >>= 8, b -= 8, b > 7;);\n        else c = d;\n      if (~c) A[o++] = e | c << b;\n      return A.subarray(0, o)\n    },\n    e122(A) {\n      function g(c) {\n        if (a >= z) return -1;\n        c = (254 >>> b & A[a]) << b; c >>= 1, b += 7;\n        if (b < 8 || (b -= 8, ++a >= z)) return c;\n        return (65280 >> b & A[a]) >> 8 - b | c\n      }\n      var a = 0, b = 0, c, e = 8, n, o = 0, z = A.length, E = new Int8Array(256), B = new Uint8Array(z * 1.15 + 3);\n      for (n of [0, 10, 13, 34, 38, 92]) E[n] = e++;\n      for (; c = g(), ~c; B[o++] = c)\n        if (e = E[c]) n = g(), e = ~n ? 194 | 28 & e << 2 : (n = c, 222), B[o++] = e | n >> 6, c = 128 | 63 & n;\n      return new TextDecoder().decode(B.subarray(0, o))\n    },\n    d122(B) {\n      function p(n) { n <<= 1, c |= n >> b, b += 7; if (b > 7) A[o++] = c, b -= 8, c = n << 7 - b & 255 }\n      for (var a = 0, b = 0, c, d, e, o = 0, z = B.length, E = [0, 10, 13, 34, 38, 92], A = new Uint8Array(z * 1.75); a < z; p(e))\n        if (e = B.charCodeAt(a++), 127 < e)\n          d = e >> 8 & 7, 7 > d && p(E[d]), e &= 127;\n      return A.subarray(0, o)\n    },\n    e32768(A) {\n      for (var a = 0, b, c, i = 0, n = 0, z = A.length, s = []; a < z;)\n        if (c = A[a++], n < 8) b |= c << 7 - n, n += 8;\n        else n -= 7, s[i++] = n2cjk(b |= c >> n), b = c << 15 - n & 32767;\n      if (0 < n) if (s[i++] = n2cjk(b), 8 < n) s[i++] = n2cjk(32768);\n      return s.join(\"\")\n    },\n    d32768(s) {\n      if (!s) return new Uint8Array(0);\n      var a = 0, b, c, i = 0, n = s.length - 1, z = 15 * (n >> 3) + n % 8 * 2, A = s[n] == n2cjk(32768);\n      n % 8 < 1 && !A && z++, n % 8 && A && z--;\n      A = new Uint8Array(z);\n      for (n = 0; a < z; n -= 8, A[a++] = b >> n & 255)\n        if (n < 8) c = s.charCodeAt(i++), b = b << 15 | (c -= c < 19712 ? 13312 : c < 40704 ? 13568 : 16896), n += 15;\n      return A\n    }\n  };\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Base);\n\n//# sourceURL=webpack://test_game/./src/lib/baseX.js?\n}");

/***/ },

/***/ "./src/lib/tool.js"
/*!*************************!*\
  !*** ./src/lib/tool.js ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   baseXToObjectURL: () => (/* binding */ baseXToObjectURL),\n/* harmony export */   loadAnimatedAPNG: () => (/* binding */ loadAnimatedAPNG),\n/* harmony export */   loadAnimatedWebP: () => (/* binding */ loadAnimatedWebP),\n/* harmony export */   loadGifSprite: () => (/* binding */ loadGifSprite),\n/* harmony export */   loadImage: () => (/* binding */ loadImage),\n/* harmony export */   loadSpine: () => (/* binding */ loadSpine),\n/* harmony export */   loadSpritesheet: () => (/* binding */ loadSpritesheet),\n/* harmony export */   loadTexture: () => (/* binding */ loadTexture),\n/* harmony export */   loadVideo: () => (/* binding */ loadVideo),\n/* harmony export */   loadVideoTexture: () => (/* binding */ loadVideoTexture)\n/* harmony export */ });\n/* harmony import */ var _baseX_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseX.js */ \"./src/lib/baseX.js\");\n\n\nfunction loadImage(dataUrl) {\n  dataUrl = baseXToObjectURL(dataUrl)\n  return new Promise((resolve, reject) => {\n    const img = new Image();\n    img.src = dataUrl;\n    img.onload = () => resolve(img);\n    img.onerror = () => reject(new Error('Failed to load image'));\n  });\n}\n\nasync function loadVideo(dataUrl) {\n  dataUrl = baseXToObjectURL(dataUrl)\n  const video = document.createElement('video');\n  video.src = dataUrl;\n  video.autoplay = true;\n  video.loop = true;\n  video.muted = true; // 自動再生には muted が必要\n  video.crossOrigin = \"anonymous\";\n  video.playsInline = true; // iOS Safari のインライン再生許可\n  video.setAttribute('playsinline', '');\n  video.setAttribute('webkit-playsinline', '');\n  await new Promise((resolve, reject) => {\n    video.addEventListener('loadedmetadata', resolve, { once: true });\n    video.addEventListener('error', reject, { once: true });\n  });\n  video.currentTime = 0;\n  video.load();\n  await video.play();\n  return video;\n}\n\nasync function loadTexture(dataUrl) {\n  const img = await loadImage(dataUrl);\n  return window.PIXI.Texture.from(img);\n}\n\nasync function loadVideoTexture(dataUrl) {\n  const video = await loadVideo(dataUrl);\n  return window.PIXI.Texture.from(video);\n}\n\nasync function loadSpritesheet(texture, json) {\n  const sheet = new window.PIXI.Spritesheet(texture, json);\n  await sheet.parse();\n  return sheet;\n}\n\nasync function loadGifSprite(dataUrl) {\n  const gif = await window.PIXI.Assets.load(dataUrl);\n  return new window.PIXI.GifSprite({ source: gif });\n}\n\nasync function loadSpine({ atlasDataUrl, textureDataUrl, skelDataUrl }) {\n  const spine = window.spine;\n  const required = [\"TextureAtlas\", \"AtlasAttachmentLoader\", \"SkeletonBinary\", \"Spine\", \"SpineTexture\"];\n  const missing = required.filter(k => !spine[k]);\n  if (missing.length) {\n    console.error(\"spine keys:\", Object.keys(spine || {}));\n    throw new Error(\"Spine v8 クラス不足: \" + missing.join(\", \"));\n  }\n  const atlasText = atob(atlasDataUrl.split(\",\")[1]);\n  const textureAtlas = new spine.TextureAtlas(atlasText);\n  const texture = await loadTexture(textureDataUrl);\n  for (const page of textureAtlas.pages) {\n    page.setTexture(spine.SpineTexture.from(texture.source)); // ← 公式推奨の割当\n  }\n  const attachmentLoader = new spine.AtlasAttachmentLoader(textureAtlas);\n  const binary = new spine.SkeletonBinary(attachmentLoader);\n  const skelBytes = toUint8Array(skelDataUrl.split(\",\")[1]);\n  const skeletonData = binary.readSkeletonData(skelBytes);\n  return new spine.Spine(skeletonData);\n}\n\nfunction toUint8Array(b64) {\n  const raw = atob(b64);\n  const u8 = new Uint8Array(raw.length);\n  for (let i = 0; i < raw.length; i++) u8[i] = raw.charCodeAt(i);\n  return u8;\n}\n\nasync function loadAnimatedWebP(dataUrl) {\n  dataUrl = baseXToObjectURL(dataUrl)\n  return fetch(dataUrl)\n    .then(res => res.arrayBuffer())\n    .then(PIXI.pixiAnimatedWebp.AnimatedWebP.fromBuffer)\n}\n\nasync function loadAnimatedAPNG(dataUrl) {\n  dataUrl = baseXToObjectURL(dataUrl)\n  return fetch(dataUrl)\n    .then(res => res.arrayBuffer())\n    .then(PIXI.pixiApng.AnimatedAPNG.fromBuffer)\n}\n\nfunction baseXToObjectURL(dataUrl) {\n  const [meta, payload] = dataUrl.split(',')\n  if (meta.indexOf('base32768') == -1) {\n    return dataUrl\n  }\n  const mimeType = meta.match(/^data:([^;]+);/)[1]\n  const bytes = _baseX_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].d32768(payload)\n  const blob = new Blob([bytes], { type: mimeType })\n  const url = URL.createObjectURL(blob)\n  return url\n}\n\n//# sourceURL=webpack://test_game/./src/lib/tool.js?\n}");

/***/ },

/***/ "./src/player.js"
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createPlayer: () => (/* binding */ createPlayer)\n/* harmony export */ });\n/* harmony import */ var _bullet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bullet.js */ \"./src/bullet.js\");\n\n\nfunction createPlayer(globalVar) {\n  const player = new window.PIXI.Graphics();\n  player.moveTo(0, -15);\n  player.lineTo(30, 0);\n  player.lineTo(0, 15);\n  player.lineTo(0, -15);\n  player.fill(0x00AAFF);\n  player.x = 100;\n  player.y = 300;\n  player.vx = 0;\n  player.vy = 0;\n  player.shootCooldown = 0;\n\n  globalVar.player = player;\n  globalVar.container.addChild(player);\n  globalVar.collisionDetector.player = player;\n\n  // 監聽更新事件\n  globalVar.emitter.on('onTicker', () => {\n    if (globalVar.gameState.isGameOver) return;\n\n    // 玩家移動\n    player.vx = 0;\n    player.vy = 0;\n\n    const keys = globalVar.keys;\n    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.vy = -5;\n    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.vy = 5;\n    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.vx = -5;\n    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.vx = 5;\n\n    player.x += player.vx;\n    player.y += player.vy;\n\n    // 限制玩家在畫布內\n    player.x = Math.max(15, Math.min(200, player.x));\n    player.y = Math.max(15, Math.min(585, player.y));\n\n    // 集氣系統\n    handleCharging(player, globalVar);\n\n    // 普通射擊冷卻\n    if (player.shootCooldown > 0) player.shootCooldown--;\n  });\n\n  return player;\n}\n\nfunction handleCharging(player, globalVar) {\n  const keys = globalVar.keys;\n  const gameState = globalVar.gameState;\n  const ui = globalVar.ui;\n\n  if (keys[' '] || keys['Spacebar']) {\n    if (!gameState.isCharging && player.shootCooldown === 0) {\n      gameState.isCharging = true;\n    }\n\n    if (gameState.isCharging) {\n      gameState.chargeLevel = Math.min(gameState.maxCharge, gameState.chargeLevel + gameState.chargeRate);\n\n      // 更新集氣光環\n      if (ui.chargeAura) {\n        const chargePercent = gameState.chargeLevel / gameState.maxCharge;\n        const auraRadius = 20 + chargePercent * 15;\n        const auraAlpha = 0.3 + chargePercent * 0.4;\n\n        ui.chargeAura.clear();\n        ui.chargeAura.circle(player.x, player.y, auraRadius);\n        ui.chargeAura.fill({ color: 0x00FFFF, alpha: auraAlpha });\n        ui.chargeAura.circle(player.x, player.y, auraRadius + 5);\n        ui.chargeAura.fill({ color: 0xFFFFFF, alpha: auraAlpha * 0.5 });\n        ui.chargeAura.visible = true;\n      }\n\n      // 更新 UI 事件（由 ui.js 監聽，但這裡先直接操作或改用 event）\n      globalVar.emitter.emit('onChargeUpdate', gameState.chargeLevel / gameState.maxCharge);\n    }\n  } else {\n    if (gameState.isCharging) {\n      if (gameState.chargeLevel >= gameState.maxCharge) {\n        (0,_bullet_js__WEBPACK_IMPORTED_MODULE_0__.createBigBullet)(globalVar, player.x + 30, player.y);\n        player.shootCooldown = 30;\n      } else if (gameState.chargeLevel > 10) {\n        (0,_bullet_js__WEBPACK_IMPORTED_MODULE_0__.createPlayerBullet)(globalVar, player.x + 30, player.y);\n        player.shootCooldown = 12;\n      }\n\n      gameState.chargeLevel = 0;\n      gameState.isCharging = false;\n      if (ui.chargeAura) ui.chargeAura.visible = false;\n      globalVar.emitter.emit('onChargeUpdate', 0);\n    }\n  }\n}\n\n\n//# sourceURL=webpack://test_game/./src/player.js?\n}");

/***/ },

/***/ "./src/ui.js"
/*!*******************!*\
  !*** ./src/ui.js ***!
  \*******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createUI: () => (/* binding */ createUI)\n/* harmony export */ });\nfunction createUI(globalVar) {\n  const stage = globalVar.app.stage;\n  const gameState = globalVar.gameState;\n\n  // 分數文字\n  const scoreText = new window.PIXI.Text(`分數: ${gameState.score}`, {\n    fontSize: 24,\n    fill: 0xFFFFFF,\n    fontFamily: 'Arial'\n  });\n  scoreText.position.set(10, 10);\n  stage.addChild(scoreText);\n  globalVar.ui.scoreText = scoreText;\n\n  // 生命文字\n  const livesText = new window.PIXI.Text(`生命: ${gameState.lives}`, {\n    fontSize: 24,\n    fill: 0xFF0000,\n    fontFamily: 'Arial'\n  });\n  livesText.position.set(10, 40);\n  stage.addChild(livesText);\n  globalVar.ui.livesText = livesText;\n\n  // 集氣進度條背景\n  const chargeBarBg = new window.PIXI.Graphics();\n  chargeBarBg.rect(10, 70, 200, 20);\n  chargeBarBg.fill(0x333333);\n  stage.addChild(chargeBarBg);\n  globalVar.ui.chargeBarBg = chargeBarBg;\n\n  // 集氣進度條\n  const chargeBar = new window.PIXI.Graphics();\n  stage.addChild(chargeBar);\n  globalVar.ui.chargeBar = chargeBar;\n\n  // 集氣百分比文字\n  const chargeText = new window.PIXI.Text('集氣: 0%', {\n    fontSize: 18,\n    fill: 0x00FFFF,\n    fontFamily: 'Arial'\n  });\n  chargeText.position.set(220, 70);\n  stage.addChild(chargeText);\n  globalVar.ui.chargeText = chargeText;\n\n  // 集氣光環\n  const chargeAura = new window.PIXI.Graphics();\n  chargeAura.visible = false;\n  globalVar.container.addChild(chargeAura);\n  globalVar.ui.chargeAura = chargeAura;\n\n  // 遊戲結束畫面\n  const gameOverText = new window.PIXI.Text('遊戲結束！', {\n    fontSize: 48,\n    fill: 0xFF0000,\n    fontFamily: 'Arial',\n    fontWeight: 'bold'\n  });\n  gameOverText.anchor.set(0.5);\n  gameOverText.position.set(400, 250);\n  gameOverText.visible = false;\n  stage.addChild(gameOverText);\n  globalVar.ui.gameOverText = gameOverText;\n\n  const finalScoreText = new window.PIXI.Text('', {\n    fontSize: 32,\n    fill: 0xFFFFFF,\n    fontFamily: 'Arial'\n  });\n  finalScoreText.anchor.set(0.5);\n  finalScoreText.position.set(400, 320);\n  finalScoreText.visible = false;\n  stage.addChild(finalScoreText);\n  globalVar.ui.finalScoreText = finalScoreText;\n\n  // 監聽狀態更新事件\n  globalVar.emitter.on('onScoreUpdate', (score) => {\n    scoreText.text = `分數: ${score}`;\n  });\n\n  globalVar.emitter.on('onLivesUpdate', (lives) => {\n    livesText.text = `生命: ${lives}`;\n  });\n\n  globalVar.emitter.on('onChargeUpdate', (percent) => {\n    chargeBar.clear();\n    const barWidth = 200 * percent;\n    const barColor = percent >= 1.0 ? 0x00FF00 : 0x00FFFF;\n    if (barWidth > 0) {\n      chargeBar.rect(10, 70, barWidth, 20);\n      chargeBar.fill(barColor);\n    }\n    chargeText.text = `集氣: ${Math.floor(percent * 100)}%`;\n  });\n\n  globalVar.emitter.on('onGameOver', () => {\n    gameOverText.visible = true;\n    finalScoreText.text = `最終分數: ${gameState.score}`;\n    finalScoreText.visible = true;\n  });\n}\n\n\n//# sourceURL=webpack://test_game/./src/ui.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;