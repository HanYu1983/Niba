---
name: 用PIXI寫遊戲
description: 使用PIXI時應該使用的函式
---
# 開發方法
1. 複製pixi_template到要開發的新專案，並且為新專案命名(ex. new_project)
2. 先參照pixi_template/src/index.js, 學習讀取資源的方法
3. 修改new_project/src/index.js開始你的專案
4. 所有資源的讀取都必須透過lib/tool.js中提供的方法

# 開發流程
1. 每開發到一個階段，使用npm run build:dev來確認代碼有沒有錯誤