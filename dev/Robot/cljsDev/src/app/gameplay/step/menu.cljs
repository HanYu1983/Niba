(ns app.gameplay.step.menu
  (:require [clojure.core.async :as a])
  (:require-macros [app.gameplay.macros :as m])
  (:require [tool.menuCursor])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               paint
                                               actions]])
  (:require [app.gameplay.view]))


(m/defstate menu [gameplayCtx {:keys [menu data]}]
  nil
  (m/basicNotify
   {:menuCursor (tool.menuCursor/model menu)})

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

   (some #(= % action) [:left :right])
   (let [state (update state :menuCursor (fn [ctx]
                                           (tool.menuCursor/mapCursor2 ctx
                                                                       (action {:left dec :right inc}))))
         gameplayCtx (-> gameplayCtx
                         (app.gameplay.model/setFsm (tool.fsm/save fsm state)))]
     (recur gameplayCtx))

   (= :enter action)
   (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
         cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
         select (tool.menuCursor/getSelect (:menuCursor state))]
     (m/returnPop select))

   (= :cancel action)
   (m/returnPop :cancel)))