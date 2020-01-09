(ns app.phase.systemMenu
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

                                      updateSystemMenu

                                      actions]]))


(m/defstate systemMenu [gameplayCtx _]
  nil
  (m/basicNotify
   (let [menu [["endTurn"] ["cancel"]]]
     {:cursor 0
      :subcursor (into [] (repeat (count menu) 0))
      :menu [menu {}]})
   (a/<! (updateSystemMenu gameplayCtx state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down])
   (let [cursor (:cursor state)
         menu (get-in state [:menu 0])
         dir {:up dec
              :down inc}
         cursor (-> cursor
                    ((action dir))
                    (max 0)
                    (min (dec (count menu))))
         state (update state :cursor (constantly cursor))
         fsm (app.fsm/save fsm state)]
     (recur (app.gameplay/setFsm gameplayCtx fsm)))

   (= :enter action)
   (let [cursor1 (:cursor state)
         cursor2 (get-in state [:subcursor cursor1])
         select (get-in state [:menu 0 cursor1 cursor2])]
     (cond
       (= "endTurn" select)
       [(app.gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) true]

       (= "cancel" select)
       [(app.gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]

       :else
       (recur gameplayCtx)))

   (= :cancel action)
   [(app.gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]))