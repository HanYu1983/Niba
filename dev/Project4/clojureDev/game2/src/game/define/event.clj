(ns game.define.event
  (:require [clojure.spec.alpha :as s]
            [game.define.card]
            [game.define.basic :refer :all]))

(s/def ::change-phase (s/tuple #{:change-phase}))
(s/def ::gain (s/tuple #{:gain} :game.define.card/id :game.define.basic/battle-point))
(s/def ::card-enter-field (s/tuple #{:card-enter-field} :game.define.card/id))
(s/def ::card-roll (s/tuple #{:card-roll} :game.define.card/id))

(s/def ::spec (s/or :change-phase ::change-phase
                    :gain ::gain
                    :card-enter-field ::card-enter-field
                    :card-roll ::card-roll))