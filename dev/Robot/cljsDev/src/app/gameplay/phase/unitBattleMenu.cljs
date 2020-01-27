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

(m/defstate unitBattleMenu [gameplayCtx [{left :unit [leftActionType leftWeapon :as leftAction] :action}
                                         {right :unit} :as args]]
  nil
  (m/basicNotify
   (let [[menu data] (app.gameplay.model/getMenuData gameplayCtx left)
         [_ weapon] leftAction]
     {:menuCursor (tool.menuCursor/model menu)
      :data data
      :args (-> args
                (update-in [0 :hitRate] (constantly (app.gameplay.model/getHitRate gameplayCtx left leftWeapon right)))
                (update-in [1 :action] (constantly (app.gameplay.model/thinkReaction gameplayCtx right left weapon)))
                (update-in [1 :hitRate] (constantly 0)))}))

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
          attackRange (if (= cursor1 weaponIdx)
                        (-> (app.gameplay.model/getWeapons gameplayCtx left)
                            second
                            (nth cursor2)
                            ((fn [weapon]
                               (app.gameplay.model/getWeaponRange gameplayCtx left weapon))))
                        [])
          gameplayCtx (-> gameplayCtx
                          (app.gameplay.model/setAttackRange attackRange))]
      (recur gameplayCtx)))

   (some #(= % action) [:left :right])
   (m/handleMenuCursorLeftRight
    (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
          cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
          menu (tool.menuCursor/getMenu (:menuCursor state))
          weaponIdx (get-in state [:data :weaponIdx])
          leftAction (if (= cursor1 weaponIdx)
                       (-> (app.gameplay.model/getWeapons gameplayCtx left)
                           second
                           (nth cursor2)
                           ((fn [weapon]
                              [:attack weapon])))
                       leftAction)

          rightAction (if (= cursor1 weaponIdx)
                        (-> (app.gameplay.model/getWeapons gameplayCtx left)
                            second
                            (nth cursor2)
                            ((fn [weapon]
                               (app.gameplay.model/thinkReaction gameplayCtx right left weapon))))
                        (get-in state [:args 1 :action]))
          attackRange (if (= cursor1 weaponIdx)
                        (-> (app.gameplay.model/getWeapons gameplayCtx left)
                            second
                            (nth cursor2)
                            ((fn [weapon]
                               (app.gameplay.model/getWeaponRange gameplayCtx left weapon))))
                        [])

          hitRate (cond-> (get-in state [:args 0 :hitRate])
                    (= rightAction [:evade])
                    (/ 2))

          state (-> state
                    (update-in [:args 1 :action] (constantly rightAction))
                    (update-in [:args 0 :action] (constantly leftAction))
                    (update-in [:args 0 :hitRate] (constantly hitRate)))

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
             result (app.gameplay.model/calcActionResult gameplayCtx left leftAction right rightAction)]
         (a/<! (unitBattleAnim nil result inputCh outputCh))
         (m/returnPop true))

       (= "cancel" select)
       (m/returnPop false)

       :else
       (recur gameplayCtx)))))