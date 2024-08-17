(ns game.binding-data-dynamic
  (:require [game.data.dynamic]
            [game.define.runtime :as runtime]
            [game.model.core :refer [get-runtime-card-id get-runtime-player-id]]
            [game.model.card-table :refer [move-card]]
            [game.model.effect :refer [cut-in]]
            [game.define.effect :as effect]))

;; (defmethod game.data.dynamic/get-my-g :default [ctx player-id] ["0"])
;; (defmethod game.data.dynamic/get-card-chars :default [ctx card-id] ["0"])
;; (defmethod game.data.dynamic/get-card-color :default [ctx card-id] ["0"])
;; (defmethod game.data.dynamic/is-card-color-blue :default [color] true)
;; (defmethod game.data.dynamic/cut-in :default [ctx effect] true)

(defmethod game.data.dynamic/cut-in :default [ctx effect-id effect] (cut-in ctx effect-id effect))
(defmethod game.data.dynamic/add-text :default [ctx card-id text] ctx)
(defmethod game.data.dynamic/delete-text :default [ctx card-id text] ctx)
(defmethod game.data.dynamic/get-card-proto :default [ctx card-id] {})
(defmethod game.data.dynamic/add-immediate-effect :default [ctx effect] ctx)
(defmethod game.data.dynamic/get-my-g :default [ctx player-id] [])
(defmethod game.data.dynamic/get-my-g-can-tap :default [ctx player-id] [])
(defmethod game.data.dynamic/get-card-chars :default [ctx card-id] [])
(defmethod game.data.dynamic/get-card-color :default [ctx card-id] [])
(defmethod game.data.dynamic/is-card-color-blue :default [color] true)
(defmethod game.data.dynamic/get-my-hand :default [ctx player-id] [])
(defmethod game.data.dynamic/get-card-state :default [ctx card-id] {})
(defmethod game.data.dynamic/set-card-state :default [ctx card-id state] ctx)
(defmethod game.data.dynamic/move-card :default [ctx from to card-id] (move-card ctx from to card-id))
(defmethod game.data.dynamic/get-runtime-card-id :default [ctx runtime] (get-runtime-card-id ctx runtime))
(defmethod game.data.dynamic/get-runtime-player-id :default [ctx runtime] (get-runtime-player-id ctx runtime))