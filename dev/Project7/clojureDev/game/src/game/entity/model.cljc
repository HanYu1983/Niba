(ns game.entity.model
  (:require [clojure.spec.alpha :as s]
            [game.component.cuts]
            [game.component.effect]
            [game.component.card-proto]))
(s/def ::spec (s/merge :game.component.cuts/spec
                       :game.component.effect/spec
                       :game.component.card-proto/spec))
(def model {:cuts []
            :effects {}
            :card-proto-pool {}})
(defn tests []
  (s/assert ::spec model))