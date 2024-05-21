(ns game.define.runtime
  (:require [clojure.spec.alpha :as s]))

(s/def ::id any?)
(s/def ::err (s/nilable string?))
(s/def ::card-id (s/tuple ::err ::id))
(s/def ::player-id (s/tuple ::err ::id))
(s/def ::spec (s/keys :opt-un [::card-id ::player-id]))

(defn value-of [card-id player-id]
  {:player-id [nil player-id]
   :card-id [nil card-id]})

(defn get-player-id [runtime]
  (let [[err id] (:player-id runtime)
        _ (when err (throw (ex-info err {})))]
    id))

(defn get-card-id [runtime]
 (let [[err id] (:card-id runtime)
        _ (when err (throw (ex-info err {})))]
    id))
