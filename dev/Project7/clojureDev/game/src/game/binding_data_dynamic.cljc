(ns game.binding-data-dynamic
  (:require [game.data.dynamic]))

(defmethod game.data.dynamic/get-my-g :default [ctx player-id] ["0"])
(defmethod game.data.dynamic/get-card-chars :default [ctx card-id] ["0"])
(defmethod game.data.dynamic/get-card-color :default [ctx card-id] ["0"])
(defmethod game.data.dynamic/is-card-color-blue :default [color] true)