(ns game.define.card-text
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]))

(s/def ::description string?)
(s/def ::special-effect (s/or :psycommu (s/tuple #{:psycommu} int?)))
(s/def ::use-timing any?)
(s/def ::type (s/or :automatic (s/tuple #{:automatic} #{:residents :trigger :constant})
                    :use (s/tuple #{:use} ::use-timing)
                    :special (s/tuple #{:special} ::special-effect)))
(s/def ::condition  (s/keys :req-un [::action]
                            :opt-un [::tips ::count ::options]))
(s/def ::conditions (s/map-of any? ::condition))
(s/def ::spec (s/keys :req-un [::type]
                      :opt-un [::description ::events ::game-effects ::conditions ::logic ::action ::is-surrounded-by-arrows]))