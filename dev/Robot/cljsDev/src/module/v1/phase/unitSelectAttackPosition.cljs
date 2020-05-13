(ns module.v1.phase.unitSelectAttackPosition
  (:require [clojure.core.async :as a]))

(defn unitSelectAttackPosition [gameplayCtx _ _ _]
  (a/go [gameplayCtx false]))