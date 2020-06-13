(ns module.v1.system.moveRangeViewSystem
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.common :as common])
  (:require [module.v1.data :as data])
  (:require [tool.units]))


(defn handleMoveRangeView [gameplayCtx updateMoveRange? [cmd args]]
  {:pre [(common/explainValid? ::spec/moveRangeView gameplayCtx)]}
  (cond
    (false? (boolean updateMoveRange?))
    gameplayCtx
    
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down :left :right])
        (let [{:keys [cursor units]} gameplayCtx
              unitAtCursor (tool.units/getByPosition units cursor)
              moveRange (if unitAtCursor
                          (let [shortestPathTree (data/getUnitMovePathTree gameplayCtx unitAtCursor)
                                moveRange (map first shortestPathTree)]
                            moveRange)
                          [])]
          (update-in gameplayCtx [:moveRange] (constantly moveRange)))

        :else
        gameplayCtx))

    :else
    gameplayCtx))