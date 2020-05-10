(ns module.v1.phase.enemyTurn
  (:require [clojure.core.async :as a])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common]))

(defn enemyTurn [gameplayCtx args inputCh outputCh]
  (a/go
    (a/<! (common/enemyTurnStart nil (data/render gameplayCtx) inputCh outputCh))
    gameplayCtx))