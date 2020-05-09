(ns module.v1.phase.playerTurn
  (:require [clojure.core.async :as a])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common]))

(defn playerTurn [gameplayCtx _ inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
      (let [evt (a/<! inputCh)]
        (recur (-> gameplayCtx
                   (data/handleMapView evt)
                   (data/handleCursorView evt)
                   (data/handleMoveRangeView evt)))))))