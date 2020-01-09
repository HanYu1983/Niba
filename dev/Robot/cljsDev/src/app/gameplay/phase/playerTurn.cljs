(ns app.gameplay.phase.playerTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [app.gameplay.data])
  (:require [app.gameplay.gameplay])
  (:require [tool.fsm])
  (:require [app.gameplay.unitState])
  (:require [tool.units])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               updateMap
                                               updateUnits
                                               updateCursor
                                               updateMoveRange
                                               updateAttackRange

                                               updatePlayTurn

                                               actions]])
  (:require [app.gameplay.phase.systemMenu :refer [systemMenu]])
  (:require [app.gameplay.phase.unitMenu :refer [unitMenu]]))

(m/defstate playerTurn [gameplayCtx _]
  (let []
    (a/<! (playerTurnStart gameplayCtx nil inputCh outputCh))
    gameplayCtx)

  (m/basicNotify
   {}
   (a/<! (updatePlayTurn nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor
    cursor
    (let [unitAtCursor (-> (app.gameplay.gameplay/getUnits gameplayCtx)
                           (tool.units/getByPosition cursor))
          moveRange (if unitAtCursor
                      (let [[mw mh] app.gameplay.gameplay/mapViewSize
                            shortestPathTree (tool.map/findPath (:position unitAtCursor)
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
                        moveRange)
                      (let []
                        []))]
      (recur (-> gameplayCtx
                 (app.gameplay.gameplay/setMoveRange moveRange)))))

   (= :enter action)
   (let [cursor (app.gameplay.gameplay/getCursor gameplayCtx)
         unitAtCursor (-> (app.gameplay.gameplay/getUnits gameplayCtx)
                          (tool.units/getByPosition cursor))]
     (if unitAtCursor
       (let [[gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh))]
         (if isEnd
           (recur gameplayCtx)
           (recur gameplayCtx)))
       (let [[gameplayCtx endTurn] (a/<! (systemMenu gameplayCtx {} inputCh outputCh))]
         (if endTurn
           gameplayCtx
           (recur gameplayCtx)))))))