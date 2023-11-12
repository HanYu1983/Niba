(ns game.define.card-text
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]))
(s/def ::script any?)
(s/def ::use-timing (s/tuple #{:any :turn :draw :reroll :maintenance :battle :attack :defense :damage-checking :return}
                             #{:own :enemy nil}))
(s/def ::description string?)
(s/def ::special-effect (s/or :psycommu (s/tuple #{:psycommu} int?)))
(s/def ::type (s/or :automatic (s/tuple #{:automatic} #{:residents :trigger :constant})
                    :use (s/tuple #{:use} ::use-timing)
                    :special (s/tuple #{:special} ::special-effect)
                    :system #{:system}))
(s/def ::action ::script)
(s/def ::tips ::script)
(s/def ::condition  (s/keys :req-un [::action]
                            :opt-un [::tips ::count ::options]))
(s/def ::conditions (s/map-of any? ::condition))
(s/def ::events (s/coll-of ::script))
(s/def ::game-effects (s/coll-of ::script))
(s/def ::logic ::script)
(s/def ::value (s/keys :req-un [::type]
                       :opt-un [::description ::events ::game-effects ::conditions ::logic ::action ::is-surrounded-by-arrows]))
(s/def ::spec (s/tuple any? ::value))

(def card-text-value {:type [:use [:turn :own]]})

(defn get-conditions [text])
(defn filter-player-condition [player-id text])
(defn get-logic [text])
(defn can-pass-conditions [text selection])

(defn tests []
  (s/assert ::value (merge card-text-value {:description ""
                                            :events []
                                            :game-effects []
                                            :conditions {"" {:tips '()
                                                             :count 0
                                                             :options {}
                                                             :action '()}}
                                            :logic '(And (Leaf ""))
                                            :action '()
                                            :is-surrounded-by-arrows false})))