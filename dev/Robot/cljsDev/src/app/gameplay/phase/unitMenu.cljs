(ns app.gameplay.phase.unitMenu
  (:require-macros [app.gameplay.phase.unitMenuImpl]))

; 使用這個方法解決和unitSelectMovePosition的互相依賴
; 記得這裡有用到的引用也要在別的地方一起加上
(app.gameplay.phase.unitMenuImpl/impl)