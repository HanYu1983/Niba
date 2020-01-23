(ns app.gameplay.phase.unitMenuImpl)

(defmacro impl []
  '(m/defstate unitMenu [gameplayCtx {unit :unit}]
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
                               (nth cursor2)
                               ((fn [weapon]
                                  (app.gameplay.model/getWeaponRange gameplayCtx unit weapon)))))
             xxx (when (= cursor1 weaponIdx)
                   (let [unitsNearby (-> (app.gameplay.model/getUnitsByRegion gameplayCtx (:position unit) nil)
                                         (filter (comp not (partial app.gameplay.model/isFriendlyUnit unit))))
                         checkHitRate (map identity unitsNearby)]
                     checkHitRate))
             gameplayCtx (-> gameplayCtx
                             (app.gameplay.model/setAttackRange attackRange))]
         (recur gameplayCtx)))

      (= :enter action)
      (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
            cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
            weaponIdx (get-in state [:data :weaponIdx])
            attackRange (if (= cursor1 weaponIdx)
                          (get-in state [:data :weaponRange cursor2])
                          [])
            select (tool.menuCursor/getSelect (:menuCursor state))]
        (cond
          (= cursor1 weaponIdx)
          (let [menu (tool.menuCursor/getMenu (:menuCursor state))
                weapon  (-> (app.gameplay.model/getWeapons gameplayCtx unit)
                            (nth cursor2))
                weaponType (app.gameplay.model/getWeaponType gameplayCtx unit weapon)]
            (cond
              (= "single" weaponType)
              (let [[gameplay isEnd] (a/<! (unitSelectSingleTarget gameplayCtx {:unit unit :attackRange attackRange :weapon weapon} inputCh outputCh))]
                (if isEnd
                  (m/returnPop true)
                  (recur gameplayCtx)))

              (= "line" weaponType)
              (let [[gameplay isEnd] (a/<! (unitSelectAttackPosition gameplayCtx {:unit unit :weapon weapon} inputCh outputCh))]
                (if isEnd
                  (m/returnPop true)
                  (recur gameplayCtx)))

              :else
              (recur gameplayCtx)))

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
          (recur gameplayCtx)))

      (= :cancel action)
      (m/returnPop false))))