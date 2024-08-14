(ns game.model-spec.core
  (:require [clojure.spec.alpha :as s]))

(s/def ::current-effect :game.define.effect/value)
(s/def ::has-current-effect (s/keys :req-un [::current-effect]))

(s/def ::current-player-id any?)
(s/def ::has-current-player-id (s/keys :req-un [::current-player-id]))

(s/def ::effect :game.define.effect/value)
(s/def ::effects (s/map-of any? ::effect))
(s/def ::has-effects (s/merge :tool.component.cuts/spec
                              (s/keys :req-un [::effects])))

(s/def ::phase :game.define.timing/timing)
(s/def ::has-phase (s/keys :req-un [::phase]))

(s/def ::is-table (s/merge :tool.component.card-table/spec
                           :tool.component.coin-table/spec
                           :tool.component.chip-table/spec))