(ns game.entity.model
  (:require [clojure.spec.alpha :as s]
            [game.tool.card.table]
            [game.component.cuts]
            [game.component.effect]
            [game.component.card-proto]
            [game.component.table]))
(s/def ::spec (s/merge :game.component.cuts/spec
                       :game.component.effect/spec
                       :game.component.card-proto/spec
                       :game.component.table/spec))
(def model {:cuts []
            :effects {}
            :card-proto-pool {}
            :table game.tool.card.table/table
            :table-items {}})
(defn tests []
  (s/assert ::spec model))