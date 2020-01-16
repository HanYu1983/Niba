(ns app.gameplay.unit
  (:require [app.gameplay.module]))

(defn model [{:keys [key position] :as info} data]
  (let [state (app.gameplay.module/unitStateCreate app.gameplay.module/*module info)]
    (merge info {:key (or key (gensym))
                 :state state
                 :position (or position [0 0])})))

(defn getWeapons [ctx data]
  (app.gameplay.module/unitStateGetWeapons app.gameplay.module/*module (:state ctx)))