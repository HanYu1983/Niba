(ns app2.gameplay.control.camera
  (:require [clojure.core.matrix :as m]))

(defn camera-control [gameplay [cmd args]]
  (condp = cmd
    :keyIsDown
    (let [key args]
      (condp = key
        "left"
        (update-in gameplay [:state :camera] #(m/add % [-1 0 0]))

        "up"
        (update-in gameplay [:state :camera] #(m/add % [0 -1 0]))

        "right"
        (update-in gameplay [:state :camera] #(m/add % [1 0 0]))

        "down"
        (update-in gameplay [:state :camera] #(m/add % [0 1 0]))

        "="
        (update-in gameplay [:state :camera] #(m/add %  [0 0 -0.1]))

        "-"
        (update-in gameplay [:state :camera] #(m/add %  [0 0 0.1]))

        gameplay))
    gameplay))