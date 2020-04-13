(ns app.gameplay.phase.unitMenu
  (:require-macros [app.gameplay.phase.unitMenuImpl])
  (:require [module.default.tmp]))

; 使用這個方法解決和unitSelectMovePosition的互相依賴
; 記得這裡有用到的引用也要在別的地方一起加上
; 雖然後來使用multimethod剛好避開這個問題, 但這裡的結構還是保存
(app.gameplay.phase.unitMenuImpl/impl)