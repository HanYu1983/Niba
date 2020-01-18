(ns app.gameplay.phase.unitMenuImpl)

(defmacro impl []
  '(m/defstate unitMenu [gameplayCtx {unit :unit}]
     nil
     (m/basicNotify
      (let [weapons (into [] (app.gameplay.unit/getWeapons unit gameplayCtx))
            menu [["move"] (into [] (range (count weapons))) ["ok"] ["cancel"]]]
        {:menuCursor (tool.menuCursor/model menu)
         :data {:weaponIdx 1
                :weapons weapons
                :weaponRange (into []
                                   (map (fn [weapon]
                                          (app.gameplay.unit/getAttackRange unit weapon gameplayCtx))
                                        weapons))}})
      (a/<! (updateUnitMenu nil state inputCh outputCh)))

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
                           (get-in state [:data :weaponRange cursor2])
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
             attackRange (if (= cursor1 weaponIdx)
                           (get-in state [:data :weaponRange cursor2])
                           [])
             gameplayCtx (-> gameplayCtx
                             (app.gameplay.model/setAttackRange attackRange))]
         (recur gameplayCtx)))

      (= :enter action)
      (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
            cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
            weaponIdx (get-in state [:data :weaponIdx])
            select (tool.menuCursor/getSelect (:menuCursor state))]
        (cond
          (= cursor1 weaponIdx)
          (let [menu (tool.menuCursor/getMenu (:menuCursor state))
                weapons (get-in state [:data :weapons])
                weapon (get weapons cursor2)
                weaponType (get weapon "type")]
            (cond
              (= "single" weaponType)
              (let [[gameplay isEnd] (a/<! (unitSelectSingleTarget gameplayCtx {:unit unit :attackRange []} inputCh outputCh))]
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
                shortestPathTree (app.gameplay.unit/getMovePathTree unit gameplayCtx)
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