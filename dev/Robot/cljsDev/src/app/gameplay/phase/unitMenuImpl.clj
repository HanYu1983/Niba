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
          (let [[gameplayCtx isEnd] (a/<! (app.gameplay.module/waitUnitOnMenu app.gameplay.module/*module gameplayCtx
                                                                              {:unit unit
                                                                               :menuCursor (get state :menuCursor)
                                                                               :menuData (app.gameplay.model/getMenuData gameplayCtx unit)}
                                                                              inputCh
                                                                              outputCh))]
            (if isEnd
              (m/returnPop true)
              (recur gameplayCtx)))))

      (= :cancel action)
      (m/returnPop false))))