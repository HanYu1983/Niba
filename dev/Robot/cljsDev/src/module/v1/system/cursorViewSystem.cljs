(ns module.v1.system.cursorViewSystem
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.common :as common]))


(defn handleCursorView [gameplayCtx [cmd args]]
  {:pre [(common/explainValid? ::spec/cursorView gameplayCtx)]}
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down :left :right])
        (update-in gameplayCtx [:cursor] #(mapv + % (action {:up [0 -1]
                                                             :down [0 1]
                                                             :left [-1 0]
                                                             :right [1 0]})))
        :else
        gameplayCtx))

    :else
    gameplayCtx))