(ns module.default.phase.unitMenuImpl)

(defmacro impl []
  '(m/defstate unitMenu [gameplayCtx {unit :unit}]
     nil
     (m/basicNotify
      (let [[menu data] (module.default.data/getMenuData gameplayCtx unit)]
        {:menuCursor (tool.menuCursor/model menu)
         :data data
         :unit unit}))

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
             attackRange (module.default.phase.unitMenu/getAttackRange)
             checkHitRate (module.default.phase.unitMenu/getHitRate)
             gameplayCtx (-> gameplayCtx
                             (module.default.data/updateTemp (fn [temp]
                                                               (merge temp {:checkHitRate checkHitRate})))
                             (module.default.data/setAttackRange attackRange))]
         (recur gameplayCtx)))

      (some #(= % action) [:left :right])
      (m/handleMenuCursorLeftRight
       (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
             cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
             menu (tool.menuCursor/getMenu (:menuCursor state))
             weaponIdx (get-in state [:data :weaponIdx])
             attackRange (module.default.phase.unitMenu/getAttackRange)
             checkHitRate (module.default.phase.unitMenu/getHitRate)
             gameplayCtx (-> gameplayCtx
                             (module.default.data/updateTemp (fn [temp]
                                                               (merge temp {:checkHitRate checkHitRate})))
                             (module.default.data/setAttackRange attackRange))]
         (recur gameplayCtx)))

      (= :enter action)
      (let [select (tool.menuCursor/getSelect (:menuCursor state))]
        (cond
          (= "move" select)
          (let [[mw mh] module.default.data/mapViewSize
                shortestPathTree (module.default.data/gameplayGetUnitMovePathTree nil gameplayCtx unit)
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
                                                                       (dissoc tags :sky)
                                                                       (conj tags [:sky true]))))
                    gameplayCtx (-> gameplayCtx
                                    (module.default.data/updateUnit unit (constantly transformedUnit)))
                    _ (if (contains? (get-in transformedUnit [:state :tags]) :sky)
                        (a/<! (unitSkyAnim nil {:unit (module.default.data/mapUnitToLocal gameplayCtx nil transformedUnit)} inputCh outputCh))
                        (a/<! (unitGroundAnim nil {:unit (module.default.data/mapUnitToLocal gameplayCtx nil transformedUnit)} inputCh outputCh)))
                    [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
                (m/returnPop isEnd))

              (= cursor1 transformIdx)
              (let [transformedUnit (module.default.data/unitOnTransform gameplayCtx unit (get-in unit [:state :robot]) select)
                    gameplayCtx (-> gameplayCtx
                                    (module.default.data/updateUnit unit (constantly transformedUnit)))
                    [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
                (m/returnPop isEnd))

              (= cursor1 weaponIdx)
              (let [menu (tool.menuCursor/getMenu menuCursor)
                    weapon  (-> (module.default.data/getUnitWeapons gameplayCtx unit)
                                second
                                (nth cursor2))
                    weaponType (module.default.data/getWeaponType gameplayCtx unit weapon)]
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
      (m/returnPop false))))