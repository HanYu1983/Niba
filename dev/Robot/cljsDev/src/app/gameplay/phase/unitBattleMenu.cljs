(ns app.gameplay.phase.unitBattleMenu
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

                                               updateUnitBattleMenu
                                               unitBattleAnim

                                               actions]]))

(m/defstate unitBattleMenu [gameplayCtx {:keys [unit targetUnit]}]
  nil
  (m/basicNotify
   (let [weapons (into [] (app.gameplay.unitState/getWeapons nil (:state unit) (app.gameplay.model/getData gameplayCtx)))
         menu [(into [] (range (count weapons))) ["ok"] ["cancel"]]]
     {:tempUnit unit
      :menuCursor (tool.menuCursor/model menu)
      :data {:weaponIdx 0
             :weapons weapons
             :weaponRange (into []
                                (map (fn [{[min max] "range" type "type" :as weapon}]
                                       (->> (tool.map/simpleFindPath (:position unit) (dec min))
                                            (into #{})
                                            (clojure.set/difference (->> (tool.map/simpleFindPath (:position unit) max)
                                                                         (into #{})))))
                                     weapons))}})
   (a/<! (updateUnitBattleMenu nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) false]

   (some #(= % action) [:up :down])
   (m/handleMenuCursorUpDown
    (recur gameplayCtx))

   (some #(= % action) [:left :right])
   (m/handleMenuCursorLeftRight
    (recur gameplayCtx))

   (= :enter action)
   (let [select (tool.menuCursor/getSelect (:menuCursor state))]
     (cond
       (= "ok" select)
       (let [result 0]
         (a/<! (unitBattleAnim nil result inputCh outputCh))
         [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) true])

       (= "cancel" select)
       [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) false]

       :else
       (recur gameplayCtx)))))