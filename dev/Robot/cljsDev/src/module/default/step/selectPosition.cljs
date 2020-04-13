(ns module.default.step.selectPosition
  (:require [clojure.core.async :as a])
  (:require-macros [module.default.macros :as m])
  (:require [module.default.data])
  (:require [module.default.phase.common :refer [playerTurnStart
                                                 enemyTurnStart
                                                 paint
                                                 actions]])
  (:require [module.default.data])
  (:require [module.default.view]))


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