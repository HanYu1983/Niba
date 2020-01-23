(ns app.gameplay.unit
  (:require [app.gameplay.model])
  (:require [app.gameplay.module]))

(defn model [{:keys [key position] :as unit} args]
  (merge (app.gameplay.module/unitCreate app.gameplay.module/*module unit args)
         {:key (or key (gensym))
          :position (or position [0 0])}))

(defn getMovePathTree [ctx gameplayCtx]
  (app.gameplay.module/unitGetMovePathTree app.gameplay.module/*module ctx gameplayCtx))

(defn getMenuData [ctx gameplayCtx]
  (app.gameplay.module/unitGetMenuData app.gameplay.module/*module ctx gameplayCtx))

(defn onMove [ctx pos gameplayCtx]
  (app.gameplay.module/unitOnMove app.gameplay.module/*module ctx pos gameplayCtx))

(defn onDone [ctx gameplayCtx]
  (app.gameplay.module/unitOnDone app.gameplay.module/*module ctx gameplayCtx))

(defn onTurnStart [ctx gameplayCtx]
  (app.gameplay.module/unitOnTurnStart app.gameplay.module/*module ctx gameplayCtx))

(defn selectCounterAttackAction [unit fromUnit weapon gameplayCtx]
  [:attack weapon])

(defn calcActionResult [left leftAction right rightAction gameplayCtx]
  {})

(defn applyActionResult [ctx result]
  ctx)