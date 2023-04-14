(ns game.component.spec
  (:require [clojure.spec.alpha :as s]
            [game.define.effect]))

(s/def ::effect-id any?)
(s/def ::cuts (s/coll-of (s/coll-of ::effect-id)))
(s/def ::effects (s/map-of ::effect-id any?))