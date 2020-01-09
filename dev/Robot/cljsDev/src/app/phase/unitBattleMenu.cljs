(ns app.phase.unitBattleMenu
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

                                      updateUnitBattleMenu

                                      actions]]))

(m/defstate unitBattleMenu [gameplayCtx {:keys [unit targetUnit]}]
  nil
  (m/basicNotify
   (or (app.fsm/load fsm) {:tempUnit unit})
   (a/<! (updateUnitBattleMenu nil state inputCh outputCh)))

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
     (if unitAtCursor)
     (recur gameplayCtx))))