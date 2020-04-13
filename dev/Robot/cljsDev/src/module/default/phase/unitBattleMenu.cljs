(ns module.default.phase.unitBattleMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [module.default.data])
  (:require-macros [app.gameplay.macros :as m])
  (:require [module.default.phase.common])
  (:require [module.default.data])
  (:require [module.default.session.battleMenu])
  (:require [module.default.tmp]))

(m/defstate unitBattleMenu [gameplayCtx [{left :unit [leftActionType leftWeapon :as leftAction] :action}
                                         {right :unit} :as args]]
  nil
  (m/basicNotify
   (let [[menu data] (module.default.data/getMenuData gameplayCtx left)
         [_ weapon] leftAction]
     {:menuCursor (-> (tool.menuCursor/model menu)
                      (tool.menuCursor/mapCursor2 (:weaponIdx data) (constantly (let [indexMap (zipmap (-> (module.default.data/getUnitWeapons gameplayCtx left)
                                                                                                           second)
                                                                                                       (range))
                                                                                      weaponIdx (indexMap leftWeapon)]
                                                                                  weaponIdx))))
      :data data
      :battleMenuSession (-> args
                             (module.default.session.battleMenu/setRightActionFromReaction gameplayCtx))
      :unit left}))
  
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
                        (-> (module.default.data/getUnitWeapons gameplayCtx left)
                            second
                            (nth cursor2)
                            ((fn [weapon]
                               (module.default.data/getUnitWeaponRange gameplayCtx left weapon))))
                        [])
          gameplayCtx (-> gameplayCtx
                          (module.default.data/setAttackRange attackRange))]
      (recur gameplayCtx)))

   (some #(= % action) [:left :right])
   (m/handleMenuCursorLeftRight
    (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
          cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
          menu (tool.menuCursor/getMenu (:menuCursor state))
          weaponIdx (get-in state [:data :weaponIdx])

          battleMenuSession (if (= cursor1 weaponIdx)
                              (let [weapon (-> (module.default.data/getUnitWeapons gameplayCtx left)
                                               second
                                               (nth cursor2))]
                                (-> (:battleMenuSession state)
                                    (module.default.session.battleMenu/setLeftAction [:attack weapon] gameplayCtx)
                                    (module.default.session.battleMenu/setRightActionFromReaction gameplayCtx)))
                              (:battleMenuSession state))

          attackRange (if (= cursor1 weaponIdx)
                        (-> (module.default.data/getUnitWeapons gameplayCtx left)
                            second
                            (nth cursor2)
                            ((fn [weapon]
                               (module.default.data/getUnitWeaponRange gameplayCtx left weapon))))
                        [])

          state (-> state
                    (update :battleMenuSession (constantly battleMenuSession)))

          fsm (tool.fsm/save fsm state)
          gameplayCtx (-> gameplayCtx
                          (module.default.data/setFsm fsm)
                          (module.default.data/setAttackRange attackRange))]
      (recur gameplayCtx)))

   (= :enter action)
   (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
         weaponIdx (get-in state [:data :weaponIdx])
         select (tool.menuCursor/getSelect (:menuCursor state))]
     (cond
       (= cursor1 weaponIdx)
       (let [cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
             weapon (-> (module.default.data/getUnitWeapons gameplayCtx left)
                        second
                        (nth cursor2))
             attackRange (module.default.data/getUnitWeaponRange gameplayCtx left weapon)
             isTargetInRange (some #(= (:position right) %) attackRange)]
         (if (not isTargetInRange)
           (let []
             (a/<! (module.default.phase.common/showMessage nil {:message (str "不在範圍內")} inputCh outputCh))
             (recur gameplayCtx))
           (let [leftAction (get-in state [:battleMenuSession 0 :action])
                 rightAction (get-in state [:battleMenuSession 1 :action])
                 result (module.default.data/calcActionResult gameplayCtx left leftAction right rightAction)
                 gameplayCtx (module.default.data/applyActionResult gameplayCtx left leftAction right rightAction result)
                 leftAfter (-> (module.default.data/getUnits gameplayCtx)
                               (tool.units/getByKey (:key left)))
                 rightAfter (-> (module.default.data/getUnits gameplayCtx)
                                (tool.units/getByKey (:key right)))
                 _ (when (nil? leftAfter)
                     (print (module.default.data/getUnits gameplayCtx))
                     (throw (js/Error. (str "leftAfter " (:key left) " not found"))))
                 _ (when (nil? rightAfter)
                     (print (module.default.data/getUnits gameplayCtx))
                     (throw (js/Error. (str "rightAfter " (:key left) " not found"))))
                 _ (a/<! (module.default.phase.common/unitBattleAnim nil {:units [(module.default.data/mapUnitToLocal gameplayCtx nil left)
                                                                                (module.default.data/mapUnitToLocal gameplayCtx nil right)]
                                                                        :unitsAfter [(module.default.data/mapUnitToLocal gameplayCtx nil leftAfter)
                                                                                     (module.default.data/mapUnitToLocal gameplayCtx nil rightAfter)]
                                                                        :results result} inputCh outputCh))
                 ; 進攻方死亡
                 gameplayCtx (if (module.default.tmp/gameplayGetUnitIsDead app.module/*module gameplayCtx leftAfter)
                               (let [gameplayCtx (-> (module.default.data/getUnits gameplayCtx)
                                                     (tool.units/delete leftAfter)
                                                     ((fn [units]
                                                        (module.default.data/setUnits gameplayCtx units))))
                                     gameplayCtx (a/<! (module.default.tmp/gameplayOnUnitDead app.module/*module gameplayCtx leftAfter))
                                     _ (a/<! (module.default.phase.common/unitDeadAnim nil {:unit (module.default.data/mapUnitToLocal gameplayCtx nil leftAfter)} inputCh outputCh))]
                                 gameplayCtx)
                               gameplayCtx)
                 ; 防守方死亡
                 gameplayCtx (if (module.default.tmp/gameplayGetUnitIsDead app.module/*module gameplayCtx rightAfter)
                               (let [gameplayCtx (-> (module.default.data/getUnits gameplayCtx)
                                                     (tool.units/delete rightAfter)
                                                     ((fn [units]
                                                        (module.default.data/setUnits gameplayCtx units))))
                                     gameplayCtx (a/<! (module.default.tmp/gameplayOnUnitDead app.module/*module gameplayCtx rightAfter))
                                     _ (a/<! (module.default.phase.common/unitDeadAnim nil {:unit (module.default.data/mapUnitToLocal gameplayCtx nil rightAfter)} inputCh outputCh))]
                                 gameplayCtx)
                               gameplayCtx)]
             (m/returnPop true))))

       (= "cancel" select)
       (m/returnPop false)

       :else
       (recur gameplayCtx)))))