(ns app3.gameplay.system.camera
  (:require [app3.gameplay.system.basic]))

(defn camera-control! [atom-state body [cmd args]]
  (cond
    (= [:keyPressed "left"] [cmd args])
    (let [])

    :else
    nil))