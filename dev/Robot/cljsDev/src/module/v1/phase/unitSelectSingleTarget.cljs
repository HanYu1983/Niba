(ns module.v1.phase.unitSelectSingleTarget
  (:require [clojure.core.async :as a]))

(defn unitSelectSingleTarget [gameplayCtx _ _ _]
  (a/go [gameplayCtx false]))