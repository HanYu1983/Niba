(ns game.component.spec
  (:require [clojure.spec.alpha :as s]
            [game.define.effect]
            [game.define.card-proto]))

(s/def ::effect-id any?)
(s/def ::cuts (s/coll-of (s/coll-of ::effect-id)))
(s/def ::effects (s/map-of ::effect-id any?))
(s/def ::card-proto-pool (s/map-of any? :game.define.card-proto/spec))