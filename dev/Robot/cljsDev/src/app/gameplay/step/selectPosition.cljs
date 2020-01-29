(ns app.gameplay.step.selectPosition
  (:require [clojure.core.async :as a])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               paint
                                               actions]])
  (:require [app.gameplay.view]))


(m/defstate selectPosition [gameplayCtx _]
  nil
  (m/basicNotify {})

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor _ (recur gameplayCtx))

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   (m/returnPop false)

   (= :enter action)
   (m/returnPop true)))