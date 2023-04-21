(ns game.entity.model
  (:require [clojure.spec.alpha :as s]
            [game.component.cuts]
            [game.component.effect]
            [game.component.card-proto]
            [game.entity.flow-impl.ver1.flow-impl]
            [game.entity.flow-impl.ver1.flow-memory]))

(s/def ::spec (s/merge :game.component.cuts/spec
                       :game.component.effect/spec
                       :game.component.card-proto/spec
                       :game.entity.flow-impl.ver1.flow-impl/spec))

(defn return-to-owner-hand [ctx card-id1 card-id2]
  (s/assert ::spec ctx)
  ctx)

(def model {:cuts []
            :effects {}
            :card-proto-pool {}
            :flow-memory game.entity.flow-impl.ver1.flow-memory/flow-memory})

(defn tests []
  (s/assert ::spec model))