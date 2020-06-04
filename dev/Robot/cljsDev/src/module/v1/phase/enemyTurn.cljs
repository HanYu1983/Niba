(ns module.v1.phase.enemyTurn
  (:require [module.v1.phase.ai.default.core]))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (module.v1.phase.ai.default.core/enemyTurn gameplayCtx enemy inputCh outputCh))



