(ns app.gameplay.unit
  (:require [app.gameplay.model])
  (:require [app.gameplay.module]))

(defn model [{:keys [key position] :as unit} args]
  (merge (app.gameplay.module/unitCreate app.gameplay.module/*module unit args)
         {:key (or key (gensym))
          :position (or position [0 0])}))