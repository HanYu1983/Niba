(ns module.v1.phase.unitMenuImpl)

(defmacro impl []
  '(core/defstate unitMenu {unit :unit}
     {:nameCtx gameplayCtx
      :initState
      (let [_ (common/assertSpec type/gameplayCtx gameplayCtx)
            _ (common/assertSpec type/robot unit)
            [menu data] (data/getMenuData gameplayCtx unit true nil)]
        {:menuCursor (tool.menuCursor/model menu)
         :data data
         :unit unit})

      :initCtx
      (let [canMove? (common/assertSpec
                      boolean?
                      (-> gameplayCtx :fsm tool.fsm/load
                          :menuCursor :menu flatten (#(into #{} %))
                          (contains? "move")))
            moveRange (common/assertSpec
                       (s/coll-of vector?)
                       (if canMove?
                         (let [shortestPathTree (data/getUnitMovePathTree gameplayCtx unit)
                               moveRange (map first shortestPathTree)]
                           moveRange)
                         []))
            attackRange (attackRangeViewSystem/getAttackRange gameplayCtx unit)
            hitRate (hitRateViewSystem/getHitRate gameplayCtx unit)]
        (assoc gameplayCtx
               :moveRange moveRange
               :attackRange attackRange
               :checkHitRate hitRate))

      :exitCtx
      (-> gameplayCtx
          (dissoc :attackRange :checkHitRate)
          (assoc :moveRange []))}
     
     (loop [gameplayCtx gameplayCtx]
       (common/assertSpec spec/unitMenuView gameplayCtx)
       (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
       (let [[cmd args :as evt] (a/<! inputCh)
             gameplayCtx (-> gameplayCtx
                             (data/handleTest evt)
                             (mapViewSystem/handleMapView evt)
                             (menuCursorViewSystem/handleMenuCursor evt)
                             (attackRangeViewSystem/handleAttackRangeView unit evt)
                             (hitRateViewSystem/handleHitRateView unit evt))]
         (cond
           (= "KEY_DOWN" cmd)
           (let [action (common/actions args)]
             (cond
               (= :enter action)
               (let [state (-> gameplayCtx :fsm tool.fsm/load)
                     select (tool.menuCursor/getSelect (:menuCursor state))]
                 (cond
                   (= "move" select)
                   (let [shortestPathTree (data/getUnitMovePathTree gameplayCtx unit)
                         [gameplayCtx isEnd] (common/assertSpec
                                              (s/tuple type/gameplayCtx boolean?)
                                              (a/<! (unitSelectMovePosition gameplayCtx {:unit unit :paths shortestPathTree} inputCh outputCh)))]
                     (if isEnd
                       [gameplayCtx true]
                       (recur gameplayCtx)))

                   (= "ok" select)
                   [gameplayCtx true]

                   (= "cancel" select)
                   [gameplayCtx false]

                   :else
                   (let [transformIdx (-> state :data :transformIdx)
                         {:keys [weaponIdx weapons]} (-> state :data)
                         cursor1 (-> state :menuCursor tool.menuCursor/getCursor1)
                         cursor2 (-> state :menuCursor tool.menuCursor/getCursor2)]
                     (cond
                       (= select "sky/ground")
                       (let [[ground _ air _] (data/getUnitSuitability {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                             sky? (-> unit :robotState :tags :sky)
                             transformedUnit (cond
                                               (and sky? (zero? ground))
                                               (do
                                                 (a/<! (common/showMessage nil {:message (str "沒有地面能力")} inputCh outputCh))
                                                 unit)

                                               (and (not sky?) (zero? air))
                                               (do
                                                 (a/<! (common/showMessage nil {:message (str "沒有飛行能力")} inputCh outputCh))
                                                 unit)

                                               :else
                                               (if sky?
                                                 (do
                                                   (a/<! (common/unitGroundAnim nil {:unit (->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                                                                                                (data/mapUnitToLocal gameplayCtx nil))} inputCh outputCh))
                                                   (update-in unit [:robotState :tags] #(dissoc % :sky)))
                                                 (do
                                                   (a/<! (common/unitSkyAnim nil {:unit (->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                                                                                             (data/mapUnitToLocal gameplayCtx nil))} inputCh outputCh))
                                                   (update-in unit [:robotState :tags] #(conj % [:sky true])))))
                             gameplayCtx (-> gameplayCtx
                                             (data/updateUnit unit (constantly transformedUnit)))
                             [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
                         [gameplayCtx isEnd])

                       (= cursor1 transformIdx)
                       (let [; 變形
                             transformedUnit (data/unitOnTransform gameplayCtx unit (get-in unit [:robotState :robotKey]) select)
                             ; 先畫變形
                             gameplayCtx (-> gameplayCtx
                                             (data/updateUnit unit (constantly transformedUnit)))
                             _ (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
                             
                             unit transformedUnit
                             ; 調整到空中或地面並播放動畫
                             transformedUnit (a/<! (data/fixUnitSkyGround gameplayCtx unit inputCh outputCh))
                             ; 再畫結果
                             gameplayCtx (-> gameplayCtx
                                             (data/updateUnit unit (constantly transformedUnit)))
                             _ (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
                             [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
                         [gameplayCtx isEnd])

                       (= cursor1 weaponIdx)
                       (let [weapon (common/assertSpec
                                     type/weaponState
                                     (nth weapons cursor2))
                             invalidWeaponMsg (data/invalidWeapon? gameplayCtx unit weapon nil)
                             weaponType (data/getWeaponType {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)]
                         (cond
                           invalidWeaponMsg
                           (do
                             (a/<! (common/showMessage nil {:message invalidWeaponMsg} inputCh outputCh))
                             (recur gameplayCtx))

                           (= "single" weaponType)
                           (let [; 注意gameplayCtx的名稱不要打錯, 若打成gameplay, 不會報錯結果造成狀態沒有連續
                                 [gameplayCtx isEnd] (a/<! (unitSelectSingleTarget gameplayCtx {:unit unit :weapon weapon} inputCh outputCh))]
                             (if isEnd
                               [gameplayCtx isEnd]
                               (recur gameplayCtx)))

                           (= "line" weaponType)
                           (let [[gameplayCtx isEnd] (a/<! (unitSelectAttackPosition gameplayCtx {:unit unit :weapon weapon} inputCh outputCh))]
                             (if isEnd
                               [gameplayCtx isEnd]
                               (recur gameplayCtx)))

                           :else
                           (recur gameplayCtx)))

                       :else
                       (recur gameplayCtx)))))

               (= :cancel action)
               [gameplayCtx false]

               :else
               (recur gameplayCtx)))

           :else
           (recur gameplayCtx))))))