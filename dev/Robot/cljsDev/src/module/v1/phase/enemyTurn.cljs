(ns module.v1.phase.enemyTurn
  (:require [clojure.core.async :as a]))

(defn enemyTurn [gameplayCtx args inputCh outputCh]
  (a/go
    gameplayCtx))