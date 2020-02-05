(ns app.gameplay.phase.playerTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [app.gameplay.model])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               paint
                                               actions]])
  (:require [app.gameplay.phase.systemMenu :refer [systemMenu]])
  (:require [app.gameplay.phase.unitMenu :refer [unitMenu]]))

(m/defstate playerTurn [gameplayCtx _]
  (let [units (-> (app.gameplay.model/getUnits gameplayCtx)
                  (tool.units/mapUnits (fn [unit]
                                         (app.gameplay.model/onTurnStart gameplayCtx unit))))
        gameplayCtx (-> (app.gameplay.model/setUnits gameplayCtx units))]
    (a/<! (playerTurnStart gameplayCtx nil inputCh outputCh))
    gameplayCtx)

  (m/basicNotify
   {})

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor
    cursor
    (let [unitAtCursor (-> (app.gameplay.model/getUnits gameplayCtx)
                           (tool.units/getByPosition cursor))
          moveRange (if unitAtCursor
                      (let [[mw mh] app.gameplay.model/mapViewSize
                            shortestPathTree (app.gameplay.model/getMovePathTree gameplayCtx unitAtCursor)
                            moveRange (map first shortestPathTree)]
                        moveRange)
                      (let []
                        []))]
      (recur (-> gameplayCtx
                 (app.gameplay.model/setMoveRange moveRange)))))

   (= :enter action)
   (let [cursor (app.gameplay.model/getCursor gameplayCtx)
         unitAtCursor (-> (app.gameplay.model/getUnits gameplayCtx)
                          (tool.units/getByPosition cursor))]
     (if (app.gameplay.model/isBelongToPlayer gameplayCtx unitAtCursor)
       (let [[gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh))]
         (if isEnd
           (let [unit (-> (app.gameplay.model/getUnits gameplayCtx)
                          (tool.units/getByKey (:key unitAtCursor)))
                 unitOnDone (app.gameplay.model/onDone gameplayCtx unit)
                 units (-> gameplayCtx
                           (app.gameplay.model/getUnits)
                           (tool.units/delete unit)
                           (tool.units/add unitOnDone))
                 gameplayCtx (-> gameplayCtx
                                 (app.gameplay.model/setUnits units))]
             (recur gameplayCtx))
           (recur gameplayCtx)))
       (let [[gameplayCtx endTurn] (a/<! (systemMenu gameplayCtx {} inputCh outputCh))]
         (if endTurn
           gameplayCtx
           (recur gameplayCtx)))))))