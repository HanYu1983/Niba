(ns app.gameplay.unit
  (:require [app.gameplay.unitState]))

(def *module nil)

(defn model [{:keys [key position] :as info} data]
  (let [state (app.gameplay.unitState/create *module info data)]
    (merge info {:key (or key (gensym))
                 :state state
                 :position (or position [0 0])})))

(defn getWeapons [ctx data]
  (app.gameplay.unitState/getWeapons *module (:state ctx) data))