(ns app.phase.unitSelectSingleTarget
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

                                      updateUnitSelectSingleTarget

                                      actions]])
  (:require [app.phase.unitBattleMenu :refer [unitBattleMenu]]))

(m/defstate unitSelectSingleTarget [gameplayCtx {:keys [unit attackRange]}]
  nil
  (m/basicNotify
   (or (app.fsm/load fsm) {:tempUnit unit})
   (a/<! (updateUnitSelectSingleTarget nil state inputCh outputCh)))

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
         units (app.gameplay/getUnits gameplayCtx)
         unitAtCursor (app.units/getByPosition units cursor)]
     (if unitAtCursor
       (let [[gameplayCtx isEnd] (a/<! (unitBattleMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh))]
         (if isEnd
           [(app.gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) true]
           (recur gameplayCtx)))
       (recur gameplayCtx)))))