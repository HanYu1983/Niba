(ns app.gameplay.unit
  (:require [app.gameplay.model])
  (:require [app.gameplay.module]))

(defn model [{:keys [key position] :as unit}]
  (merge (app.gameplay.module/unitStateCreate app.gameplay.module/*module unit)
         {:key (or key (gensym))
          :position (or position [0 0])}))

(defn getWeapons [ctx gameplayCtx]
  (app.gameplay.module/unitStateGetWeapons app.gameplay.module/*module ctx gameplayCtx))

(defn getMovePathTree [ctx gameplayCtx]
  (app.gameplay.module/unitGetMovePathTree app.gameplay.module/*module ctx gameplayCtx))

(defn getAttackRange [ctx weapon gameplayCtx]
  (app.gameplay.module/unitGetAttackRange app.gameplay.module/*module ctx weapon gameplayCtx))