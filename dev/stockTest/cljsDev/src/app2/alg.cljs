(ns app2.alg
  (:require [clojure.spec.alpha :as s]))

(s/def ::position int?)
(s/def ::money int?)
(s/def ::army int?)
(s/def ::food int?)

(s/def ::player-id #{"player" "ai1"})
(s/def ::player (s/and (s/keys :req-un [::player-id ::position ::money ::army ::food])
                       (s/map-of #{:player-id :position :money :army :food} any?)))

(s/def ::city-id string?)
(s/def ::city (s/and (s/keys :req-un [::city-id ::money ::army ::food])
                     (s/map-of #{:city-id :money :army :food} any?)))

(s/def ::terrain #{"city" "enemy"})
(s/def ::grid (s/and (s/keys :req-un [::terrain]
                             :opt-un [::city])
                     (s/map-of #{:terrain :city} any?)))

(s/def ::grids (s/coll-of ::grid))
(s/def ::players (s/map-of ::player-id ::player))
(s/def ::player-order (s/coll-of ::player-id))
(s/def ::model (s/and (s/keys :req-un [::players ::player-order ::grids])
                      (s/map-of #{:players :player-order :grids} any?)))


(def model {:players {"player" {:player-id "player"
                                :position 0
                                :money 0
                                :army 0
                                :food 0}}
            :player-order ["player" "ai1"]
            :grids [{:terrain "enemy"
                     :city {:city-id "master"
                            :money 0
                            :army 0
                            :food 0}}]})


(defn player-move [ctx player-id cnt]
  (update-in ctx [:players player-id :position] #(+ % cnt)))


(defn log [categroy msg]
  (println (str "[" categroy "]" msg)))

(defn assertx [f o msg]
  (when (not (s/valid? f o))
    (throw (js/Error. msg))))

(defn step-earn [ctx grid-id]
  (log "step-earn" "start")
  (assertx ::city (get-in ctx [:grids grid-id :city])
           (str "grid-id " grid-id " 必須是城市"))
  (update-in ctx [:grids grid-id :city] (fn [grid]
                                          (update grid :food inc))))