(ns module.v1.system.moveRangeViewSystem
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.system.spec :as spec]
            [module.v1.type :as type]
            [module.v1.common :as common]
            [module.v1.data :as data]
            [tool.units]))


(defn handleMoveRangeView [gameplayCtx updateMoveRange? [cmd args]]
  {:pre [(common/explainValid? ::spec/moveRangeView gameplayCtx)]}
  (common/assertSpec ::spec/moveRangeView gameplayCtx)
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
                          (let [[unitSpecAtCursor] (s/conform ::type/unit unitAtCursor)
                                moveRange (if (= :robot unitSpecAtCursor)
                                            (let [shortestPathTree (data/getUnitMovePathTree gameplayCtx unitAtCursor)
                                                  moveRange (map first shortestPathTree)]
                                              moveRange)
                                            [])]
                            moveRange)
                          [])]
          (update-in gameplayCtx [:moveRange] (constantly moveRange)))

        :else
        gameplayCtx))

    :else
    gameplayCtx))