(ns app.gameplay.phase.unitSelectAttackPosition
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

                                               updateUnitSelectMovePosition
                                               updateUnitMenu
                                               unitMoveAnim

                                               actions]])
  (:require [app.gameplay.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.step.selectPosition])
  (:require [app.gameplay.step.menu]))

(m/defbasic unitSelectAttackPosition [gameplayCtx {unit :unit paths :paths}]
  [[gameplayCtx result] (a/<! (app.gameplay.step.selectPosition/selectPosition gameplayCtx {} inputCh outputCh))]
  
  nil
  (m/basicNotify
   {:tempUnit unit}
   (a/<! (updateUnitSelectMovePosition nil state inputCh outputCh)))

  (false? result)
  (m/returnPop false)

  (true? result)
  (let [[gameplayCtx select] (a/<! (app.gameplay.step.menu/menu gameplayCtx {:menu [["ok"] ["cancel"]] :data {}} inputCh outputCh))]
    (cond
      (some #(= select %) [:cancel "cancel"])
      (m/returnPop false)

      :else
      (m/returnPop true))))
  




(m/defstate unitSelectAttackPosition2 [gameplayCtx {unit :unit paths :paths}]
  nil
  (m/basicNotify
   {:tempUnit unit}
   (a/<! (updateUnitSelectMovePosition nil state inputCh outputCh)))

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
   (let [[gameplayCtx select] (a/<! (app.gameplay.step.menu/menu gameplayCtx {:menu [["ok"] ["cancel"]] :data {}} inputCh outputCh))]
     (cond
       (some #(= select %) [:cancel "cancel"])
       (m/returnPop false)

       :else
       (m/returnPop true)))))