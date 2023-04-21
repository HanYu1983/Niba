(ns game.entity.flow-impl.ver1.apply-flow
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.entity.protocol.flow]
            [game.entity.flow-impl.ver1.flow-impl]
            [game.entity.flow-impl.ver1.flow-memory]
            [game.entity.flow-impl.ver1.flow]))

(defmethod game.entity.protocol.flow/apply-flow :ver1 [ctx player-id flow]
  (s/assert :game.entity.flow-impl.ver1.flow-impl/spec ctx)
  (s/assert :game.entity.flow-impl.ver1.flow/spec flow)
  (match flow
    [[:flow-wait-player] _]
    ctx
    :else
    (throw (ex-message (str "flow not match " flow)))))
