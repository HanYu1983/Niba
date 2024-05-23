(ns game.define.card-text
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]))
(s/def ::script (fn [v] (-> v seq? (and (-> v eval fn?)))))
(s/def ::use-timing (s/tuple #{:any :turn :draw :reroll :maintenance :battle :attack :defense :damage-checking :return}
                             #{:any :own :enemy}))
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
(s/def ::logic (s/map-of string? (s/tuple list? ::script)))
(s/def ::value (s/keys :req-un [::type]
                       :opt-un [::description ::events ::game-effects ::conditions ::logic ::action ::is-surrounded-by-arrows]))

(def card-text-value {:type [:use [:turn :own]]})

(defn get-conditions [text]
  (s/assert ::value text)
  (-> text :conditions))
(defn filter-player-condition [text condition player-id])
(defn is-condition-belong-to-player-id [condition player-id]
  true)
(defn get-logic [text]
  (s/assert ::value text)
  (-> text :logic))
(defn can-pass-conditions [text selection])

(defn tests []
  (s/assert ::value (merge card-text-value {:description ""
                                            :events []
                                            :game-effects []
                                            :conditions {"" {:tips '(fn [])
                                                             :count 0
                                                             :options {}
                                                             :action '(fn [])}}
                                            :logic {"" ['(And (Leaf "")) '(fn [])]}
                                            :is-surrounded-by-arrows false})))