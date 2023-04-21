(ns game.entity.flow-impl.ver1.flow-memory
  (:require [clojure.spec.alpha :as s]
            [game.define.player]
            [game.component.spec]))

(s/def ::player-id :game.define.player/id)
(s/def ::state #{:prepare-deck :who-first :draw-6-and-confirm :playing})
(s/def ::has-trigger-event boolean?)
(s/def ::has-player-pass-phase (s/map-of ::player-id boolean?))
(s/def ::has-player-pass-cut (s/map-of ::player-id boolean?))
(s/def ::has-player-pass-pay-cost (s/map-of ::player-id boolean?))
(s/def ::should-trigger-stack-effect-finished-event boolean?)
(s/def ::msgs (s/coll-of any?))
(s/def ::spec (s/keys :req-un [::state
                               ::has-trigger-event
                               ::has-player-pass-phase
                               ::has-player-pass-cut
                               ::has-player-pass-pay-cost
                               ::should-trigger-stack-effect-finished-event
                               ::msgs]))

(def flow-memory {:state :prepare-deck
                  :has-trigger-event false
                  :has-player-pass-phase {}
                  :has-player-pass-cut {}
                  :has-player-pass-pay-cost {}
                  :should-trigger-stack-effect-finished-event false
                  :msgs []})