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
                unitAtCursor (common/assertSpec
                              (s/nilable ::type/unit)
                              (tool.units/getByPosition units cursor))
                [unitSpec] (if unitAtCursor
                             (s/conform ::type/unit unitAtCursor)
                             [nil])]
            (cond
              (and unitAtCursor (= unitSpec :robot))
              (let [[gameplayCtx isUnitDone] (common/assertSpec
                                              (s/tuple ::type/gameplayCtx boolean?)
                                              (a/<! (unitMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh)))]
                (if isUnitDone
                  (let [{:keys [units]} gameplayCtx
                        unit (common/assertSpec
                              (s/nilable ::type/robot)
                              (tool.units/getByKey units (:key unitAtCursor)))
                        ; 機體可能已經死亡
                        gameplayCtx (common/assertSpec
                                     ::type/gameplayCtx
                                     (if unit
                                       (data/updateUnit gameplayCtx unit #(data/onUnitDone gameplayCtx %))
                                       gameplayCtx))]
                    gameplayCtx)
                  gameplayCtx))

              (and unitAtCursor (= unitSpec :item))
              gameplayCtx

              (not unitAtCursor)
              (let [[gameplayCtx endTurn] (common/assertSpec
                                           (s/tuple ::type/gameplayCtx boolean?)
                                           (a/<! (systemMenu gameplayCtx {} inputCh outputCh)))]
                (if endTurn
                  [gameplayCtx true]
                  gameplayCtx))

              :else
              (throw (js/Error. "can not reach here. please check."))))
          :else
          gameplayCtx))

      :else
      gameplayCtx)))


(defn playerTurn [gameplayCtx _ inputCh outputCh]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (a/go
    (let [gameplayCtx (a/<! (data/onPlayerTurnStart gameplayCtx inputCh outputCh))
          gameplayCtx (update gameplayCtx :activePlayer :player)]
      (loop [gameplayCtx gameplayCtx]
        (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
        (let [evt (common/assertSpec
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
                                 (a/<! (data/onPlayerTurnEnd gameplayCtx inputCh outputCh))))))))