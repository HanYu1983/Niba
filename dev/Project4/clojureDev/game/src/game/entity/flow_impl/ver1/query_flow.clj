(ns game.entity.flow-impl.ver1.query-flow
  (:require [clojure.spec.alpha :as s]
            [game.entity.protocol.flow]
            [game.entity.flow-impl.ver1.flow-impl]
            [game.entity.flow-impl.ver1.flow-memory]
            [game.component.current-effect :refer [get-current-effect]]))

(defmethod game.entity.protocol.flow/query-flow :ver1 [ctx player-id]
  (s/assert :game.entity.flow-impl.ver1.flow-impl/spec ctx)
  (let [process-current-effect (fn []
                                 (when (get-current-effect ctx)
                                   nil))
        flows nil
        flows (or flows (process-current-effect))
        flows (or flows (process-current-effect))]
    flows))
