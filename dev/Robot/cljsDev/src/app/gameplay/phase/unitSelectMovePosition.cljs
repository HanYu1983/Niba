(ns app.gameplay.phase.unitSelectMovePosition
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [app.gameplay.data])
  (:require [app.gameplay.model])
  (:require [app.gameplay.unitState])
  (:require-macros [app.gameplay.macros :as m])
  (:require-macros [app.gameplay.phase.unitMenuImpl])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               updateMap
                                               updateUnits
                                               updateCursor
                                               updateMoveRange
                                               updateAttackRange

                                               updateUnitSelectMovePosition
                                               updateUnitMenu
                                               unitMoveAnim

                                               actions]])
  (:require [app.gameplay.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]])
  (:require [app.gameplay.step.selectPosition]))

(declare unitMenu)

(m/defbasic unitSelectMovePosition [gameplayCtx {unit :unit paths :paths}]
  [[gameplayCtx result] (a/<! (app.gameplay.step.selectPosition/selectPosition gameplayCtx {} inputCh outputCh))]

  nil

  (-> (m/basicNotify
       {:tempUnit unit
        :tempMoveRange (let [[mw mh] app.gameplay.model/mapViewSize
                             shortestPathTree (tool.map/findPath (:position unit)
                                                                 (fn [{:keys [totalCost]} curr]
                                                                   [(>= totalCost 5) false])
                                                                 (fn [[x y]]
                                                                   [[x (min mh (inc y))]
                                                                    [x (max 0 (dec y))]
                                                                    [(min mw (inc x)) y]
                                                                    [(max 0 (dec x)) y]])
                                                                 (constantly 1)
                                                                 (constantly 0))
                             moveRange (map first shortestPathTree)]
                         moveRange)}
       (a/<! (updateUnitSelectMovePosition nil state inputCh outputCh)))
      ((fn [gameplayCtx]
         (app.gameplay.model/setMoveRange gameplayCtx (-> gameplayCtx
                                                          (app.gameplay.model/getFsm)
                                                          (tool.fsm/load)
                                                          (:tempMoveRange))))))

  (false? result)
  (m/returnPop false)

  (true? result)
  (let [cursor (app.gameplay.model/getCursor gameplayCtx)
        camera (app.gameplay.model/getCamera gameplayCtx)
        path (tool.map/buildPath paths cursor)]
    (a/<! (unitMoveAnim gameplayCtx {:unit unit :path (map (partial app.gameplay.model/world2local camera) path)} inputCh outputCh))
    (let [tempUnit (merge unit {:position cursor})
          state (merge state {:tempUnit tempUnit})
          units (-> gameplayCtx
                    (app.gameplay.model/getUnits)
                    (tool.units/delete unit)
                    (tool.units/add tempUnit))
          gameplayCtx (-> gameplayCtx
                          (app.gameplay.model/setUnits units)
                          (app.gameplay.model/setFsm (tool.fsm/save fsm state)))

          [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit tempUnit} inputCh outputCh))]
      (if isEnd
        (m/returnPop true)
        (let [tempUnit (:tempUnit state)
              units (-> gameplayCtx
                        (app.gameplay.model/getUnits)
                        (tool.units/delete tempUnit)
                        (tool.units/add unit))
              gameplayCtx (-> gameplayCtx
                              (app.gameplay.model/setUnits units))]
          (recur gameplayCtx))))))
















(m/defstate unitSelectMovePosition2 [gameplayCtx {unit :unit paths :paths}]
  nil
  (m/basicNotify
   {:tempUnit unit}
   (a/<! (updateUnitSelectMovePosition nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor _ (recur gameplayCtx))

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   (m/returnPop false)

   (= :enter action)
   (let [cursor (app.gameplay.model/getCursor gameplayCtx)
         camera (app.gameplay.model/getCamera gameplayCtx)
         path (tool.map/buildPath paths cursor)]
     (a/<! (unitMoveAnim gameplayCtx {:unit unit :path (map (partial app.gameplay.model/world2local camera) path)} inputCh outputCh))
     (let [tempUnit (merge unit {:position cursor})
           state (merge state {:tempUnit tempUnit})
           units (-> gameplayCtx
                     (app.gameplay.model/getUnits)
                     (tool.units/delete unit)
                     (tool.units/add tempUnit))
           gameplayCtx (-> gameplayCtx
                           (app.gameplay.model/setUnits units)
                           (app.gameplay.model/setFsm (tool.fsm/save fsm state)))

           [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit tempUnit} inputCh outputCh))]
       (if isEnd
         (m/returnPop true)
         (let [tempUnit (:tempUnit state)
               units (-> gameplayCtx
                         (app.gameplay.model/getUnits)
                         (tool.units/delete tempUnit)
                         (tool.units/add unit))
               gameplayCtx (-> gameplayCtx
                               (app.gameplay.model/setUnits units))]
           (recur gameplayCtx)))))))

(app.gameplay.phase.unitMenuImpl/impl)