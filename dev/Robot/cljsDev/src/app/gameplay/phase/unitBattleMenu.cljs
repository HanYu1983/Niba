(ns app.gameplay.phase.unitBattleMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [app.gameplay.model])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               paint
                                               
                                               unitBattleAnim
                                               actions]]))

(m/defstate unitBattleMenu [gameplayCtx {left :left
                                         right :right
                                         leftAction :leftAction
                                         :as args}]
  nil
  (m/basicNotify
   (let [[menu data] (app.gameplay.model/getMenuData gameplayCtx left)
         [_ weapon] leftAction]
     {:menuCursor (tool.menuCursor/model menu)
      :data data
      :args (merge args
                   {:rightAction (app.gameplay.model/selectCounterAttackAction right left weapon gameplayCtx)})}))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   (m/returnPop false)

   (some #(= % action) [:up :down])
   (m/handleMenuCursorUpDown
    (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
          cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
          menu (tool.menuCursor/getMenu (:menuCursor state))
          weaponIdx (get-in state [:data :weaponIdx])
          attackRange (-> (app.gameplay.model/getWeapons gameplayCtx left)
                          (nth cursor2)
                          ((fn [weapon]
                             (app.gameplay.model/getWeaponRange gameplayCtx left weapon))))
          gameplayCtx (-> gameplayCtx
                          (app.gameplay.model/setAttackRange attackRange))]
      (recur gameplayCtx)))

   (some #(= % action) [:left :right])
   (m/handleMenuCursorLeftRight
    (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
          cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
          menu (tool.menuCursor/getMenu (:menuCursor state))
          weaponIdx (get-in state [:data :weaponIdx])
          rightAction (if (= cursor1 weaponIdx)
                        (let [weapon (get-in state [:data :weapons cursor2])]
                          (app.gameplay.model/selectCounterAttackAction right left weapon gameplayCtx))
                        [:pending])
          attackRange (-> (app.gameplay.model/getWeapons gameplayCtx left)
                          (nth cursor2)
                          ((fn [weapon]
                             (app.gameplay.model/getWeaponRange gameplayCtx left weapon))))
          state (merge state {:rightAction rightAction})
          fsm (tool.fsm/save fsm state)
          gameplayCtx (-> gameplayCtx
                          (app.gameplay.model/setFsm fsm)
                          (app.gameplay.model/setAttackRange attackRange))]
      (recur gameplayCtx)))

   (= :enter action)
   (let [select (tool.menuCursor/getSelect (:menuCursor state))]
     (cond
       (= "ok" select)
       (let [leftAction (:leftAction state)
             rightAction (:rightAction state)
             result (app.gameplay.model/calcActionResult left leftAction right rightAction gameplayCtx)]
         (a/<! (unitBattleAnim nil result inputCh outputCh))
         (m/returnPop true))

       (= "cancel" select)
       (m/returnPop false)

       :else
       (recur gameplayCtx)))))