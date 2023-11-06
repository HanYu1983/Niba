(ns game.define.card-text
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]))

(s/def ::use-timing (s/tuple #{:any :turn :draw :reroll :maintenance :battle :attack :defense :damage-checking :return}
                             #{:own :enemy nil}))
(s/def ::description string?)
(s/def ::special-effect (s/or :psycommu (s/tuple #{:psycommu} int?)))
(s/def ::type (s/or :automatic (s/tuple #{:automatic} #{:residents :trigger :constant})
                    :use (s/tuple #{:use} ::use-timing)
                    :special (s/tuple #{:special} ::special-effect)))
(s/def ::action list?)
(s/def ::tips list?)
(s/def ::condition  (s/keys :req-un [::action]
                            :opt-un [::tips ::count ::options]))
(s/def ::conditions (s/map-of any? ::condition))
(s/def ::events (s/coll-of list?))
(s/def ::game-effects (s/coll-of list?))
(s/def ::spec (s/keys :req-un [::type]
                      :opt-un [::description ::events ::game-effects ::conditions ::logic ::action ::is-surrounded-by-arrows]))

(def default-text {:type [:use [:turn :own]]
                   :description ""
                   :events []
                   :game-effects []
                   :conditions {"" {:tips '()
                                    :count 0
                                    :options {}
                                    :action '()}}
                   :logic nil
                   :action '()
                   :is-surrounded-by-arrows false})

(defn tests []
  (s/explain ::spec default-text))