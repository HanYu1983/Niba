(ns app.gameplay.phase.unitSelectSingleTarget
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [app.gameplay.data])
  (:require [app.gameplay.model])
  (:require [app.gameplay.unitState])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               updateMap
                                               updateUnits
                                               updateCursor
                                               updateMoveRange
                                               updateAttackRange

                                               updateUnitSelectSingleTarget

                                               actions]])
  (:require [app.gameplay.phase.unitBattleMenu :refer [unitBattleMenu]]))

(m/defstate unitSelectSingleTarget [gameplayCtx {:keys [unit attackRange]}]
  nil
  (m/basicNotify
   (or (tool.fsm/load fsm) {:tempUnit unit})
   (a/<! (updateUnitSelectSingleTarget nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor _ (recur gameplayCtx))

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) false]

   (= :enter action)
   (let [cursor (app.gameplay.model/getCursor gameplayCtx)
         units (app.gameplay.model/getUnits gameplayCtx)
         unitAtCursor (tool.units/getByPosition units cursor)]
     (if unitAtCursor
       (let [[gameplayCtx isEnd] (a/<! (unitBattleMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh))]
         (if isEnd
           [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) true]
           (recur gameplayCtx)))
       (recur gameplayCtx)))))