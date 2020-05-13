(ns module.v1.phase.unitBattleMenu
  (:require [clojure.core.async :as a]))

(defn unitBattleMenu [gameplayCtx _ _ _]
  (a/go [gameplayCtx false]))