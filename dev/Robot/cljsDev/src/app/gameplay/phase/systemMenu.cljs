(ns app.gameplay.phase.systemMenu
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
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               updateMap
                                               updateUnits
                                               updateCursor
                                               updateMoveRange
                                               updateAttackRange

                                               updateSystemMenu

                                               actions]]))


(m/defstate systemMenu [gameplayCtx _]
  nil
  (m/basicNotify
   (let [menu [["endTurn"] ["cancel"]]]
     {:menuCursor (tool.menuCursor/model menu)})
   (a/<! (updateSystemMenu gameplayCtx state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down])
   (let [state (update state :menuCursor (fn [ctx]
                                           (tool.menuCursor/mapCursor1 ctx
                                                                       (action {:up dec :down inc}))))
         gameplayCtx (-> gameplayCtx
                         (app.gameplay.model/setFsm (tool.fsm/save fsm state)))]
     (recur gameplayCtx))

   (= :enter action)
   (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
         cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
         select (tool.menuCursor/getSelect (:menuCursor state))]
     (cond
       (= "endTurn" select)
       [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) true]

       (= "cancel" select)
       [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) false]

       :else
       (recur gameplayCtx)))

   (= :cancel action)
   [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) false]))