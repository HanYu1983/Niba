(ns game.binding-data-dynamic
  (:require [game.data.dynamic]
            [game.define.runtime :as runtime]
            [game.model.core :refer [get-runtime-card-id get-runtime-player-id get-my-units-can-set-character]]
            [game.model.card-table :refer [move-card]]
            [game.model.effect :refer [cut-in]]
            [game.model.selection]
            [game.model.setgroup :refer [set-setgroup-character set-setgroup-operation-unit get-setgroup]]
            [game.define.effect :as effect]))

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
(defmethod game.data.dynamic/get-my-units-can-set-character :default [ctx runtime] (get-my-units-can-set-character ctx runtime))
(defmethod game.data.dynamic/get-card-runtime-type :default [ctx card-id] (game.model.core/get-card-runtime-type ctx card-id))
(defmethod game.data.dynamic/get-card-basyou :default [ctx card-id] (game.model.core/get-card-basyou ctx card-id))
(defmethod game.data.dynamic/get-card-type :default [ctx card-id] (game.model.core/get-card-type ctx card-id))
(defmethod game.data.dynamic/get-selection :default [ctx selection-id] (game.model.selection/get-selection ctx selection-id))
(defmethod game.data.dynamic/set-setgroup-character :default [ctx to-card-id card-id] (set-setgroup-character ctx to-card-id card-id))
(defmethod game.data.dynamic/set-setgroup-operation-unit :default [ctx to-card-id card-id] (set-setgroup-operation-unit ctx to-card-id card-id))
(defmethod game.data.dynamic/get-setgroup :default [ctx card-id] (get-setgroup ctx card-id))