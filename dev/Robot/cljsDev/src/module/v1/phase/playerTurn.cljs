(ns module.v1.phase.playerTurn
  (:require [clojure.core.async :as a])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common])
  (:require [module.v1.type :as type])
  (:require [tool.units])
  (:require-macros [module.v1.core :as core])
  (:require [module.v1.phase.unitMenu :refer [unitMenu]])
  (:require [module.v1.phase.systemMenu :refer [systemMenu]]))

(defn playerTurn [gameplayCtx _ inputCh outputCh]
  (a/go
    (a/<! (common/playerTurnStart nil (data/render gameplayCtx) inputCh outputCh))
    (loop [gameplayCtx gameplayCtx]
      (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
      (let [[cmd args :as evt] (a/<! inputCh)
            gameplayCtx (-> gameplayCtx
                            (data/handleMapView evt)
                            (data/handleCursorView evt)
                            (data/handleMoveRangeView evt))]
        (common/assertSpec ::type/moveRangeView gameplayCtx)
        (cond
          (= "KEY_DOWN" cmd)
          (let [action (common/actions args)]
            (cond
              (= :enter action)
              (let [{:keys [cursor units]} gameplayCtx
                    unitAtCursor (tool.units/getByPosition units cursor)]
                (if unitAtCursor
                  (let [[gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh))]
                    (if isEnd
                      (let [{:keys [units]} gameplayCtx
                            unit (tool.units/getByKey units (:key unitAtCursor))
                            unitOnDone (data/gameplayOnUnitDone nil gameplayCtx unit)
                            units (-> units
                                      (tool.units/delete unit)
                                      (tool.units/add unitOnDone))
                            gameplayCtx (assoc gameplayCtx :units units)]
                        (recur gameplayCtx))
                      (recur gameplayCtx)))
                  (let [[gameplayCtx endTurn] (a/<! (systemMenu gameplayCtx {} inputCh outputCh))]
                    (if endTurn
                      gameplayCtx
                      (recur gameplayCtx)))))
              :else
              (recur gameplayCtx)))

          :else
          (recur gameplayCtx))))))