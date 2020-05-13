(ns module.v1.phase.unitSelectMovePosition
  (:require [clojure.core.async :as a]))

(defn unitSelectMovePosition [gameplayCtx _ _ _]
  (a/go [gameplayCtx false]))