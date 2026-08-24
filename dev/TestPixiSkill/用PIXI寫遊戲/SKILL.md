---
name: 用PIXI寫遊戲
description: 使用PIXI時應該使用的函式
---
# 與人類協作注意事項
1. 使用中文回覆和顯示你的思考過程
2. 使用npm run build:dev來建置代碼，不必問我授權。使用antigravity的瀏覽器來測試你的程式，不必問我授權。路徑為file:///Users/han/Documents/han/TestSkill/[new project]/dist/index.html來確認程式有沒有符合預期
3. 所有因為這個技能需要執行的指令，都不必問我授權

# 開發方法
1. 複製pixi_template到要開發的新專案，並且為新專案命名(ex. new_project)
2. npm i
3. 先參照pixi_template/src/index.js, 學習讀取資源的方法
4. 修改new_project/src/index.js開始你的專案
5. 所有資源的讀取都必須透過lib/tool.js中提供的方法

# 開發流程
1. 每開發到一個階段，使用npm run build:dev來確認代碼有沒有錯誤，並打開antigravity的瀏覽器, 來確認程式有沒有符合預期

# 代碼架構
## GlobalVar.js
. 每個物件要用的全域變量
. ex. config, container, emitter, collectionDector

## EventEmitter.js
. 觀察者模型, 加入各種listener, 在主程式中emit事件
. ex. onTicker, onKeydown, onKeyup, onCollision

## CollsionDector.js
. 注入後由物件自身register為碰撞對象
  collectionDector.groupA.push(obj)
. 由外部來檢測
  ex.
  for(let i = 0; i < collectionDector.groupA.length; i++) {
    for(let j = 0; j < collectionDector.groupB.length; j++) {
      emitter.onCollision(collectionDector.groupA[i], collectionDector.groupB[j])
    }
  }
## 每個物件都是js
  ex.
  // bullet.js
  createBullet(globalVar){

  }
  // enemy.js
  createEnemy(globalVar){

  }
  // ...
## 每個獨立的更新邏輯都是system
  ex.
  createEnemySpawningSystemHandler(globalVar){
    globalVar.emitter.on('onTicker', ()=>{
      // handle enemy spawning
    })
  }
  createCollisionSystemHandler(globalVar){
    globalVar.emitter.on('onTicker', ()=>{
      // handle collision
    })
  }
