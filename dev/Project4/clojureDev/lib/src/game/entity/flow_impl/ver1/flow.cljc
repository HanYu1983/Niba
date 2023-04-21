(ns game.entity.flow-impl.ver1.flow
  (:require [clojure.spec.alpha :as s]
            [game.define.player]
            [game.component.spec]))

(s/def ::effect-id any?)
(s/def ::effect any?)
(s/def ::event any?)
(s/def ::flow-wait-player (s/tuple :flow-wait-player))
(s/def ::flow-observe-effect (s/tuple :flow-observe-effect))
(s/def ::flow-do-effect (s/tuple :flow-do-effect ::effect-id))
(s/def ::flow-pass-pay-cost (s/tuple :flow-pass-pay-cost ::effect-id))
(s/def ::flow-cancel-active-effect (s/tuple :flow-cancel-active-effect))
(s/def ::flow-set-active-effect-id (s/tuple :flow-set-active-effect-id ::effect-id (s/coll-of ::effect)))
(s/def ::flow-delete-immediate-effect (s/tuple :flow-delete-immediate-effect ::effect-id (s/coll-of ::effect)))
(s/def ::flow-handle-stack-effect-finished (s/tuple :flow-handle-stack-effect-finished))
(s/def ::flow-cancel-pass-cut (s/tuple :flow-cancel-pass-cut))
(s/def ::flow-pass-cut (s/tuple :flow-pass-cut))
(s/def ::flow-pass-phase (s/tuple :flow-pass-phase))
(s/def ::flow-cancel-pass-phase (s/tuple :flow-cancel-pass-phase))
(s/def ::flow-next-timing (s/tuple :flow-next-timing))
(s/def ::flow-trigger-text-event (s/tuple :flow-trigger-text-event ::event))
(s/def ::flow-type (s/or :flow-wait-player ::flow-wait-player
                         :flow-observe-effect ::flow-observe-effect
                         :flow-do-effect ::flow-do-effect
                         :flow-pass-pay-cost ::flow-pass-pay-cost
                         :flow-cancel-active-effect ::flow-cancel-active-effect
                         :flow-set-active-effect-id ::flow-set-active-effect-id
                         :flow-delete-immediate-effect ::flow-delete-immediate-effect
                         :flow-handle-stack-effect-finished ::flow-handle-stack-effect-finished
                         :flow-cancel-pass-cut ::flow-cancel-pass-cut
                         :flow-pass-cut ::flow-pass-cut
                         :flow-pass-phase ::flow-pass-phase
                         :flow-cancel-pass-phase ::flow-cancel-pass-phase
                         :flow-next-timing ::flow-next-timing
                         :flow-trigger-text-event ::flow-trigger-text-event))
(s/def ::spec (s/tuple ::flow-type string?))