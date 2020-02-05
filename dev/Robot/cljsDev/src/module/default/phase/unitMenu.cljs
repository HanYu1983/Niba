(ns module.default.phase.unitMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [app.gameplay.model])
  (:require-macros [app.gameplay.macros :as m])
  (:require-macros [app.gameplay.phase.unitMenuImpl])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               paint
                                               unitMoveAnim
                                               actions]])
  (:require [app.gameplay.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.phase.unitSelectMovePosition :refer [unitSelectMovePosition]])
  (:require [app.gameplay.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]])
  (:require [app.gameplay.view]))

(m/defwait unitSkyAnim [ctx args])
(m/defwait unitGroundAnim [ctx args])

(defn unitOnTransform [gameplayCtx unit fromKey toKey]
  (-> unit
      (update-in [:state :robot] (constantly toKey))
      (update-in [:state :weapons (keyword toKey)] (constantly (let [weapons (get-in unit [:state :weapons (keyword fromKey)])]
                                                                 weapons)))))

(m/defstate unitMenu [gameplayCtx {unit :unit}]
  nil
  (m/basicNotify
   (let [[menu data] (app.gameplay.model/getMenuData gameplayCtx unit)]
     {:menuCursor (tool.menuCursor/model menu)
      :data data}))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down])
   (m/handleMenuCursorUpDown
    (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
          cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
          menu (tool.menuCursor/getMenu (:menuCursor state))
          weaponIdx (get-in state [:data :weaponIdx])
          attackRange (if (= cursor1 weaponIdx)
                        (-> (app.gameplay.model/getWeapons gameplayCtx unit)
                            second
                            (nth cursor2)
                            ((fn [weapon]
                               (app.gameplay.model/getWeaponRange gameplayCtx unit weapon))))
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
          attackRange (when (= cursor1 weaponIdx)
                        (-> (app.gameplay.model/getWeapons gameplayCtx unit)
                            second
                            (nth cursor2)
                            ((fn [weapon]
                               (app.gameplay.model/getWeaponRange gameplayCtx unit weapon)))))
          checkHitRate (when (= cursor1 weaponIdx)
                         (let [weapon (-> (app.gameplay.model/getWeapons gameplayCtx unit)
                                          second
                                          (nth cursor2))
                               unitsNearby (->> (app.gameplay.model/getUnitsByRegion gameplayCtx (:position unit) nil)
                                                (filter (comp not (partial app.gameplay.model/isFriendlyUnit gameplayCtx unit))))
                               checkHitRate (map (fn [targetUnit]
                                                   {:unit unit
                                                    :targetUnit targetUnit
                                                    :weapon weapon
                                                    :hitRate (app.gameplay.model/getHitRate gameplayCtx unit weapon targetUnit)})
                                                 unitsNearby)]
                           checkHitRate))
          gameplayCtx (-> gameplayCtx
                          (app.gameplay.model/updateTemp (fn [temp]
                                                           (merge temp {:checkHitRate checkHitRate})))
                          (app.gameplay.model/setAttackRange attackRange))]
      (recur gameplayCtx)))

   (= :enter action)
   (let [select (tool.menuCursor/getSelect (:menuCursor state))]
     (cond
       (= "move" select)
       (let [[mw mh] app.gameplay.model/mapViewSize
             shortestPathTree (app.gameplay.model/getMovePathTree gameplayCtx unit)
             moveRange (map first shortestPathTree)
             [gameplayCtx isEnd] (a/<! (unitSelectMovePosition gameplayCtx {:unit unit :paths shortestPathTree} inputCh outputCh))]
         (if isEnd
           (m/returnPop true)
           (recur gameplayCtx)))

       (= "ok" select)
       (m/returnPop true)

       (= "cancel" select)
       (let []
         (m/returnPop false))

       :else
       (let [menuCursor (:menuCursor state)
             data (:data state)
             cursor1 (tool.menuCursor/getCursor1 menuCursor)
             cursor2 (tool.menuCursor/getCursor2 menuCursor)
             weaponIdx (get-in data [:weaponIdx])
             transformIdx (get-in data [:transformIdx])
             attackRange (if (= cursor1 weaponIdx)
                           (get-in data [:weaponRange cursor2])
                           [])
             select (tool.menuCursor/getSelect menuCursor)]
         (cond
           (= select "sky/ground")
           (let [transformedUnit (update-in unit [:state :tags] (fn [tags]
                                                                  (if (contains? tags :sky)
                                                                    (disj tags :sky)
                                                                    (conj tags :sky))))
                 gameplayCtx (-> gameplayCtx
                                 (app.gameplay.model/updateUnit unit (constantly transformedUnit)))
                 _ (if (contains? (get-in transformedUnit [:state :tags]) :sky)
                     (a/<! (unitSkyAnim nil {:unit (app.gameplay.model/mapUnitToLocal gameplayCtx nil transformedUnit)} inputCh outputCh))
                     (a/<! (unitGroundAnim nil {:unit (app.gameplay.model/mapUnitToLocal gameplayCtx nil transformedUnit)} inputCh outputCh)))
                 [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
             (m/returnPop isEnd))

           (= cursor1 transformIdx)
           (let [transformedUnit (unitOnTransform gameplayCtx unit (get-in unit [:state :robot]) select)
                 ; transformedUnit (app.gameplay.model/onTransform gameplayCtx unit select)
                 gameplayCtx (-> gameplayCtx
                                 (app.gameplay.model/updateUnit unit (constantly transformedUnit)))
                 [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
             (m/returnPop isEnd))

           (= cursor1 weaponIdx)
           (let [menu (tool.menuCursor/getMenu menuCursor)
                 weapon  (-> (app.gameplay.model/getWeapons gameplayCtx unit)
                             second
                             (nth cursor2))
                 weaponType (app.gameplay.model/getWeaponType gameplayCtx unit weapon)]
             (cond
               (= "single" weaponType)
               (let [; 注意gameplayCtx的名稱不要打錯, 若打成gameplay, 不會報錯結果造成狀態沒有連續
                     [gameplayCtx isEnd] (a/<! (unitSelectSingleTarget gameplayCtx {:unit unit :attackRange attackRange :weapon weapon} inputCh outputCh))]
                 (if isEnd
                   (m/returnPop isEnd)
                   (recur gameplayCtx)))

               (= "line" weaponType)
               (let [[gameplayCtx isEnd] (a/<! (unitSelectAttackPosition gameplayCtx {:unit unit :weapon weapon} inputCh outputCh))]
                 (if isEnd
                   (m/returnPop isEnd)
                   (recur gameplayCtx)))

               :else
               (recur gameplayCtx)))

           :else
           (recur gameplayCtx)))))

   (= :cancel action)
   (m/returnPop false)))