(ns app3.gameplay.system.player
  (:require [app3.gameplay.system.basic]))

(defn player-system! [atom-state body [cmd args]]
  (cond
    (and (:player-state @atom-state)
         body
         (= [:keyPressed "j"] [cmd args]))
    (let [_ (swap! atom-state identity)
          _ (app3.gameplay.system.basic/destroy-entity atom-state)])))