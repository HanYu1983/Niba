(ns game.component.effect
  (:require [clojure.spec.alpha :as s]
            [tool.component.cuts]
            [tool.component.effect]
            [game.model-spec.core]
            [game.define.runtime]
            [game.define.effect]))

(def get-effects tool.component.effect/get-effects)
(def get-top-cut tool.component.effect/get-top-cut)
(def map-effects tool.component.effect/map-effects)
(def remove-effect tool.component.effect/remove-effect)

(defn cut-in
  [ctx id effect]
  (s/assert :game.model-spec.core/has-effects ctx)
  (s/assert :game.define.effect/value effect)
  (tool.component.effect/cut-in ctx id effect))

(defn new-cut
  [ctx id effect]
  (s/assert :game.model-spec.core/has-effects ctx)
  (s/assert :game.define.effect/value effect)
  (tool.component.effect/new-cut ctx id effect))

(defn tests []
  (tool.component.effect/tests))