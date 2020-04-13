(ns module.default.phase.playerTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [module.default.data])
  (:require-macros [module.default.macros :as m])
  (:require [module.default.phase.common])
  (:require [module.default.phase.systemMenu :refer [systemMenu]])
  (:require [module.default.phase.unitMenu :refer [unitMenu]])
  (:require [module.default.view]))

(m/defstate playerTurn [gameplayCtx _]
  (let [units (-> (module.default.data/getUnits gameplayCtx)
                  (tool.units/mapUnits (fn [unit]
                                         (module.default.data/gameplayOnUnitTurnStart app.module/*module gameplayCtx unit))))
        gameplayCtx (-> (module.default.data/setUnits gameplayCtx units))]
    (a/<! (module.default.phase.common/playerTurnStart gameplayCtx nil inputCh outputCh))
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
    (let [unitAtCursor (-> (module.default.data/getUnits gameplayCtx)
                           (tool.units/getByPosition cursor))
          moveRange (if unitAtCursor
                      (let [[mw mh] module.default.data/mapViewSize
                            shortestPathTree (module.default.data/gameplayGetUnitMovePathTree app.module/*module gameplayCtx unitAtCursor)
                            moveRange (map first shortestPathTree)]
                        moveRange)
                      (let []
                        []))]
      (recur (-> gameplayCtx
                 (module.default.data/setMoveRange moveRange)))))

   (= :enter action)
   (let [cursor (module.default.data/getCursor gameplayCtx)
         unitAtCursor (-> (module.default.data/getUnits gameplayCtx)
                          (tool.units/getByPosition cursor))]
     (if unitAtCursor
       (let [[gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh))]
         (if isEnd
           (let [unit (-> (module.default.data/getUnits gameplayCtx)
                          (tool.units/getByKey (:key unitAtCursor)))
                 unitOnDone (module.default.data/gameplayOnUnitDone app.module/*module gameplayCtx unit)
                 units (-> gameplayCtx
                           (module.default.data/getUnits)
                           (tool.units/delete unit)
                           (tool.units/add unitOnDone))
                 gameplayCtx (-> gameplayCtx
                                 (module.default.data/setUnits units))]
             (recur gameplayCtx))
           (recur gameplayCtx)))
       (let [[gameplayCtx endTurn] (a/<! (systemMenu gameplayCtx {} inputCh outputCh))]
         (if endTurn
           (m/returnPopCtx)
           (recur gameplayCtx)))))))