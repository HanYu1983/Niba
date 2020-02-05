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
                                               unitDeadAnim
                                               showMessage
                                               actions]])
  (:require [app.gameplay.session.battleMenu]))

(m/defstate unitBattleMenu [gameplayCtx [{left :unit [leftActionType leftWeapon :as leftAction] :action}
                                         {right :unit} :as args]]
  nil
  (m/basicNotify
   (let [[menu data] (app.gameplay.model/getMenuData gameplayCtx left)
         [_ weapon] leftAction]
     {:menuCursor (-> (tool.menuCursor/model menu)
                      (tool.menuCursor/mapCursor2 (constantly (let [indexMap (zipmap (-> (app.gameplay.model/getWeapons gameplayCtx left)
                                                                                         second)
                                                                                     (range))
                                                                    weaponIdx (indexMap leftWeapon)]
                                                                weaponIdx))))
      :data data
      :battleMenuSession (-> args
                             (app.gameplay.session.battleMenu/setRightActionFromReaction gameplayCtx))}))
  
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

          battleMenuSession (if (= cursor1 weaponIdx)
                              (let [weapon (-> (app.gameplay.model/getWeapons gameplayCtx left)
                                               second
                                               (nth cursor2))]
                                (-> (:battleMenuSession state)
                                    (app.gameplay.session.battleMenu/setLeftAction [:attack weapon] gameplayCtx)
                                    (app.gameplay.session.battleMenu/setRightActionFromReaction gameplayCtx)))
                              (:battleMenuSession state))

          attackRange (if (= cursor1 weaponIdx)
                        (-> (app.gameplay.model/getWeapons gameplayCtx left)
                            second
                            (nth cursor2)
                            ((fn [weapon]
                               (app.gameplay.model/getWeaponRange gameplayCtx left weapon))))
                        [])

          state (-> state
                    (update :battleMenuSession (constantly battleMenuSession)))

          fsm (tool.fsm/save fsm state)
          gameplayCtx (-> gameplayCtx
                          (app.gameplay.model/setFsm fsm)
                          (app.gameplay.model/setAttackRange attackRange))]
      (recur gameplayCtx)))

   (= :enter action)
   (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
         weaponIdx (get-in state [:data :weaponIdx])
         select (tool.menuCursor/getSelect (:menuCursor state))]
     (cond
       (= cursor1 weaponIdx)
       (let [cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
             weapon (-> (app.gameplay.model/getWeapons gameplayCtx left)
                        second
                        (nth cursor2))
             attackRange (app.gameplay.model/getWeaponRange gameplayCtx left weapon)
             isTargetInRange (some #(= (:position right) %) attackRange)]
         (if (not isTargetInRange)
           (let []
             (a/<! (showMessage nil {:message (str "不在範圍內")} inputCh outputCh))
             (recur gameplayCtx))
           (let [leftAction (get-in state [:battleMenuSession 0 :action])
                 rightAction (get-in state [:battleMenuSession 1 :action])
                 result (app.gameplay.model/calcActionResult gameplayCtx left leftAction right rightAction)
                 gameplayCtx (app.gameplay.model/applyActionResult gameplayCtx left leftAction right rightAction result)
                 leftAfter (-> (app.gameplay.model/getUnits gameplayCtx)
                               (tool.units/getByKey (:key left)))
                 rightAfter (-> (app.gameplay.model/getUnits gameplayCtx)
                                (tool.units/getByKey (:key right)))
                 _ (a/<! (unitBattleAnim nil {:units [(app.gameplay.model/mapUnitToLocal gameplayCtx nil left)
                                                      (app.gameplay.model/mapUnitToLocal gameplayCtx nil right)]
                                              :unitsAfter [(app.gameplay.model/mapUnitToLocal gameplayCtx nil leftAfter)
                                                           (app.gameplay.model/mapUnitToLocal gameplayCtx nil rightAfter)]
                                              :results result} inputCh outputCh))
                 gameplayCtx (if (app.gameplay.model/isDead gameplayCtx leftAfter)
                               (let [gameplayCtx (-> (app.gameplay.model/getUnits gameplayCtx)
                                                     (tool.units/delete leftAfter)
                                                     ((fn [units]
                                                        (app.gameplay.model/setUnits gameplayCtx units))))
                                     gameplayCtx (a/<! (app.gameplay.model/onDead gameplayCtx leftAfter))
                                     _ (a/<! (unitDeadAnim nil {:unit (app.gameplay.model/mapUnitToLocal gameplayCtx nil leftAfter)} inputCh outputCh))]
                                 gameplayCtx)
                               gameplayCtx)
                 gameplayCtx (if (app.gameplay.model/isDead gameplayCtx rightAfter)
                               (let [gameplayCtx (-> (app.gameplay.model/getUnits gameplayCtx)
                                                     (tool.units/delete rightAfter)
                                                     ((fn [units]
                                                        (app.gameplay.model/setUnits gameplayCtx units))))
                                     gameplayCtx (a/<! (app.gameplay.model/onDead gameplayCtx rightAfter))
                                     _ (a/<! (unitDeadAnim nil {:unit (app.gameplay.model/mapUnitToLocal gameplayCtx nil rightAfter)} inputCh outputCh))]
                                 gameplayCtx)
                               gameplayCtx)]
             (m/returnPop true))))

       (= "cancel" select)
       (m/returnPop false)

       :else
       (recur gameplayCtx)))))