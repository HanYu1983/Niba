(ns game.entity.protocol.flow)

(defmulti query-flow (fn [ctx player-id] (:env ctx)))
(defmulti apply-flow (fn [ctx player-id flow] (:env ctx)))