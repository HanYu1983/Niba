(ns module.v1.phase.enemyTurn
  (:require [clojure.core.async :as a])
  (:require [module.v1.phase.ai.default.core]))

(def *ai true)

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (let [gameplayCtx (update gameplayCtx :activePlayer enemy)]
    (if *ai
      (module.v1.phase.ai.default.core/enemyTurn gameplayCtx enemy inputCh outputCh)
      (a/go
        gameplayCtx))))



