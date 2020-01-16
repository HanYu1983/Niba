(ns app.gameplay.unit
  (:require [app.gameplay.module]))

(defn model [{:keys [key position] :as unit}]
  (merge (app.gameplay.module/unitStateCreate app.gameplay.module/*module unit)
         {:key (or key (gensym))
          :position (or position [0 0])}))

(defn getWeapons [ctx]
  (app.gameplay.module/unitStateGetWeapons app.gameplay.module/*module ctx))