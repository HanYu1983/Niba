(ns app.gameplay.phase.unitBattleMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [app.gameplay.map])
  (:require [app.gameplay.data])
  (:require [app.gameplay.gameplay])
  (:require [app.gameplay.fsm])
  (:require [app.gameplay.unitState])
  (:require [app.gameplay.units])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
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
   (or (app.gameplay.fsm/load fsm) {:tempUnit unit})
   (a/<! (updateUnitBattleMenu nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor _ (recur gameplayCtx))

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   [(app.gameplay.gameplay/setFsm gameplayCtx (app.gameplay.fsm/popState fsm)) false]

   (= :enter action)
   (let [cursor (app.gameplay.gameplay/getCursor gameplayCtx)
         units (app.gameplay.gameplay/getUnits gameplayCtx)
         unitAtCursor (app.gameplay.units/getByPosition units cursor)]
     (if unitAtCursor)
     (recur gameplayCtx))))