(ns app.phase.unitSelectMovePosition
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [app.map])
  (:require [app.data])
  (:require [app.gameplay])
  (:require [app.fsm])
  (:require [app.unitState])
  (:require [app.units])
  (:require-macros [app.macros :as m])
  (:require [app.phase.common :refer [playerTurnStart
                                      enemyTurnStart
                                      updateMap
                                      updateUnits
                                      updateCursor
                                      updateMoveRange
                                      updateAttackRange

                                      updateUnitSelectMovePosition

                                      actions]]))


(m/defstate unitSelectMovePosition [gameplayCtx {unit :unit paths :paths}]
  nil
  (m/basicNotify
   (or (app.fsm/load fsm) {:tempUnit unit})
   (a/<! (updateUnitSelectMovePosition nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor _ (recur gameplayCtx))

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   [(app.gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]

   (= :enter action)
   (let [cursor (app.gameplay/getCursor gameplayCtx)
         camera (app.gameplay/getCamera gameplayCtx)
         path (app.map/buildPath paths cursor)]
     (a/<! (unitMoveAnim gameplayCtx {:unit unit :path (map (partial app.gameplay/world2local camera) path)} inputCh outputCh))
     (let [tempUnit (merge unit {:position cursor})
           state (merge state {:tempUnit tempUnit})
           units (-> gameplayCtx
                     (app.gameplay/getUnits)
                     (app.units/delete unit)
                     (app.units/add tempUnit))
           gameplayCtx (-> gameplayCtx
                           (app.gameplay/setUnits units)
                           (app.gameplay/setFsm (app.fsm/save fsm state)))

           [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit tempUnit} inputCh outputCh))]
       (if isEnd
         [(app.gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]
         (let [tempUnit (:tempUnit state)
               units (-> gameplayCtx
                         (app.gameplay/getUnits)
                         (app.units/delete tempUnit)
                         (app.units/add unit))
               gameplayCtx (-> gameplayCtx
                               (app.gameplay/setUnits units))]
           (recur gameplayCtx)))))))