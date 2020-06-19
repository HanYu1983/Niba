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
                unitAtCursor (s/assert
                              (s/nilable ::type/unit)
                              (tool.units/getByPosition units cursor))]
            (if unitAtCursor
              (let [[gameplayCtx isUnitDone] (s/assert
                                              (s/tuple ::type/gameplayCtx boolean?)
                                              (a/<! (unitMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh)))]
                (if isUnitDone
                  (let [{:keys [units]} gameplayCtx
                        unit (s/assert
                              (s/nilable ::type/unit)
                              (tool.units/getByKey units (:key unitAtCursor)))
                        ; 機體可能已經死亡
                        gameplayCtx (s/assert
                                     ::type/gameplayCtx
                                     (if unit
                                       (data/updateUnit gameplayCtx unit #(data/gameplayOnUnitDone nil gameplayCtx %))
                                       gameplayCtx))]
                    gameplayCtx)
                  gameplayCtx))
              (let [[gameplayCtx endTurn] (s/assert
                                           (s/tuple ::type/gameplayCtx boolean?)
                                           (a/<! (systemMenu gameplayCtx {} inputCh outputCh)))]
                (if endTurn
                  [gameplayCtx true]
                  gameplayCtx))))
          :else
          gameplayCtx))

      :else
      gameplayCtx)))


(defn playerTurn [gameplayCtx _ inputCh outputCh]
  (s/assert ::type/gameplayCtx gameplayCtx)
  (a/go
    (let [units (s/assert
                 ::tool.units/modelType
                 (-> (:units gameplayCtx)
                     (tool.units/mapUnits (fn [unit]
                                            (data/gameplayOnUnitTurnStart nil gameplayCtx unit)))))
          gameplayCtx (assoc gameplayCtx :units units)]
      (a/<! (common/playerTurnStart nil (data/render gameplayCtx) inputCh outputCh))
      (loop [gameplayCtx gameplayCtx]
        (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
        (let [evt (s/assert 
                   (s/tuple any? any?)
                   (a/<! inputCh))
              returnCtx (-> gameplayCtx
                            (#(systemCore/mapReturn data/handleTest % evt))
                            (#(systemCore/mapReturn mapViewSystem/handleMapView % evt))
                            (#(systemCore/mapReturn cursorViewSystem/handleCursorView % evt))
                            (#(systemCore/mapReturn moveRangeViewSystem/handleMoveRangeView % true evt))
                            (#(systemCore/asyncMapReturn handleCore % inputCh outputCh evt))
                            (a/<!))]
          (systemCore/return-let [[gameplayCtx] returnCtx]
                                 (update gameplayCtx
                                         :units (fn [units]
                                                  (tool.units/mapUnits units (fn [unit]
                                                                               (data/gameplayOnUnitTurnEnd nil gameplayCtx unit)))))))))))