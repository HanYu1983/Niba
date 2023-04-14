(ns game.entity.model
  (:require [clojure.spec.alpha :as s]
            [game.component.cuts]
            [game.component.effect]))

(s/def ::spec (s/merge :game.component.cuts/spec
                       :game.component.effect/spec))

(def model {:cuts []
            :effects {}})

(defn tests []
  (s/assert ::spec model))