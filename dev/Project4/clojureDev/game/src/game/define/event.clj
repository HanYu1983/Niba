(ns game.define.event
  (:require [clojure.spec.alpha :as s]
            [game.define.card]
            [game.define.basic :refer :all]))

(s/def ::change-phase (s/tuple #{:change-phase}))
(s/def ::gain (s/tuple #{:gain} :game.define.card/id :game.define.basic/battle-point))