
(ns game.define.basyou
  (:require [clojure.spec.alpha :as s]
            [clojure.string]
            [game.define.player]))

(def ba-syou-keyword [:hon-goku
                      :sute-yama
                      :space-area
                      :earth-area
                      :maintenance-area
                      :g-zone
                      :junk-yard
                      :te-hu-ta
                      :hanger
                      :played-card
                      :removed-card])

(s/def ::ba-syou-keyword (into #{} ba-syou-keyword))

(s/def ::spec (s/tuple :game.define.player/id ::ba-syou-keyword))

(defn is-battle-area? [k]
  (#{:space-area :earth-area} k))

(defn is-maintenance-area? [k]
  (#{:maintenance-area :g-zone} k))

(defn is-ba? [k]
  (or (is-battle-area? k)
      (is-maintenance-area? k)))

(defn value-of [player-id basyou-id]
  (s/assert ::spec [player-id basyou-id]))

(defn get-player-id [basyou]
  (s/assert ::spec basyou)
  (-> basyou first))

(defn get-ba-syou-keyword [basyou]
  (s/assert ::spec basyou)
  (-> basyou second))

(defn get-basyous-by-player-id [player-id]
  (->> ba-syou-keyword (map (fn [k] (value-of player-id k)))))

(defn update-ba-syou-keyword [basyou kw]
  (s/assert ::spec basyou)
  (s/assert ::ba-syou-keyword kw)
  (value-of (get-player-id basyou) kw))

(defn tests []
  (s/assert ::spec [:A :sute-yama])
  (when (not (is-battle-area? :space-area))
    (throw (ex-info "space-area is-battle-area?" {})))
  (when (is-battle-area? :hon-goku)
    (throw (ex-info "hon-goku is not is-battle-area?" {}))))