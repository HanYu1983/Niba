(ns module.v1.phase.playerTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common])
  (:require [module.v1.type :as type])
  (:require [tool.units])
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.system.core :as systemCore])
  (:require-macros [module.v1.system.core :as systemCore])
  (:require [module.v1.system.mapViewSystem :as mapViewSystem])
  (:require [module.v1.system.cursorViewSystem :as cursorViewSystem])
  (:require [module.v1.system.moveRangeViewSystem :as moveRangeViewSystem])
  (:require [module.v1.phase.unitMenu :refer [unitMenu]])
  (:require [module.v1.phase.systemMenu :refer [systemMenu]]))


(defn handleCore [gameplayCtx inputCh outputCh [cmd args]]
  (common/assertSpec ::spec/moveRangeView gameplayCtx)
  (a/go
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
                    gameplayCtx)
                  gameplayCtx))
              (let [[gameplayCtx endTurn] (a/<! (systemMenu gameplayCtx {} inputCh outputCh))]
                (if endTurn
                  [gameplayCtx true]
                  gameplayCtx))))
          :else
          gameplayCtx))

      :else
      gameplayCtx)))


(defn playerTurn [gameplayCtx _ inputCh outputCh]
  (a/go
    (let [units (-> (:units gameplayCtx)
                    (tool.units/mapUnits (fn [unit]
                                           (data/gameplayOnUnitTurnStart nil gameplayCtx unit))))
          gameplayCtx (assoc gameplayCtx :units units)]
      (a/<! (common/playerTurnStart nil (data/render gameplayCtx) inputCh outputCh))
      (loop [gameplayCtx gameplayCtx]
        (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
        (let [evt (a/<! inputCh)
              returnCtx (-> gameplayCtx
                            (#(systemCore/mapReturn data/handleTest % evt))
                            (#(systemCore/mapReturn mapViewSystem/handleMapView % evt))
                            (#(systemCore/mapReturn cursorViewSystem/handleCursorView % evt))
                            (#(systemCore/mapReturn moveRangeViewSystem/handleMoveRangeView % true evt))
                            (#(systemCore/asyncMapReturn handleCore % inputCh outputCh evt))
                            (a/<!))]
          (systemCore/return-let [[gameplayCtx] returnCtx] gameplayCtx))))))