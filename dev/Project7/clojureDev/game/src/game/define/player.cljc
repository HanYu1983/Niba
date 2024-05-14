(ns game.define.player
  (:require [clojure.spec.alpha :as s]))

(def player-ids [:A :B])

(s/def ::id (into #{} player-ids))
(s/def ::spec (s/keys :req-un [::id]))

(defn get-opponent [player-id]
  (if (= player-id :A) :B :A))