(ns module.v1.phase.unitSelectMovePosition
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.map])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [module.v1.common :as common])
  (:require-macros [module.v1.phase.unitMenuImpl])
  (:require [module.v1.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [module.v1.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]])
  (:require [module.v1.step.selectPosition :refer [selectPosition]])
  (:require [module.v1.system.mapViewSystem :as mapViewSystem]))

(declare unitMenu)

(core/defstate unitSelectMovePosition {unit :unit paths :paths}
  {:nameCtx gameplayCtx
   :initState
   {:tempMoveRange (let [moveRange (map first paths)]
                     moveRange)}
   :initCtx nil}
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (assoc gameplayCtx :moveRange (-> gameplayCtx :fsm tool.fsm/load :tempMoveRange))
    (let [[gameplayCtx result] (a/<! (selectPosition gameplayCtx {} inputCh outputCh))]
      (cond
        (false? result)
        [gameplayCtx false]

        (true? result)
        (let [{:keys [cursor camera]} gameplayCtx
              path (tool.map/buildPath paths cursor)]
          (if (> (count path) 1)
            (let [unitAtCursor (-> (:units gameplayCtx)
                                   (tool.units/getByPosition cursor))]
              (if unitAtCursor
                (recur gameplayCtx)
                (do (a/<! (common/unitMoveAnim gameplayCtx {:unit (data/mapUnitToLocal gameplayCtx nil unit) :path (map (partial data/world2local camera) path)} inputCh outputCh))
                    (let [tempUnit (data/gameplayOnUnitMove nil gameplayCtx unit cursor)
                          state (-> gameplayCtx :fsm tool.fsm/load)
                          state (merge state {:tempUnit tempUnit})
                          gameplayCtx (-> gameplayCtx
                                          (data/updateUnit unit (constantly tempUnit))
                                          (update :fsm #(tool.fsm/save % state)))
                          [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit tempUnit} inputCh outputCh))]
                      (if isEnd
                        [gameplayCtx true]
                        (let [tempUnit (:tempUnit state)
                              gameplayCtx (data/updateUnit gameplayCtx tempUnit (constantly unit))]
                          (recur gameplayCtx)))))))
            (recur gameplayCtx)))

        :else
        (recur gameplayCtx)))))

(module.v1.phase.unitMenuImpl/impl)