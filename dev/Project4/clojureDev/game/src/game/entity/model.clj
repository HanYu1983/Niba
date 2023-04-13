(ns game.entity.model
  (:require [clojure.spec.alpha :as s]
            [game.component.cuts]))

(s/def ::spec (s/merge :game.component.cuts/spec))

(def model (merge game.component.cuts/cuts))

(defn tests []
  (s/assert ::spec model))