(ns module.v1.phase.unitMenuImpl)

(defmacro impl []
  '(core/defstate unitMenu {unit :unit}
     {:nameCtx gameplayCtx
      :initState
      (let [_ (common/assertSpec type/gameplayCtx gameplayCtx)
            _ (common/assertSpec type/unit unit)
            [menu data] (data/getMenuData gameplayCtx unit true)]
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
          (assoc :moveRange []
                 :cursor (:position unit)))}
     
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
                   (let [shortestPathTree (data/gameplayGetUnitMovePathTree nil gameplayCtx unit)
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
                       (let [[_ _ suit3 _] (data/getUnitSuitability {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                             canSky? (not (zero? suit3))]
                         (if canSky?
                           (let [transformedUnit (update-in unit [:robotState :tags] (fn [tags]
                                                                                       (if (contains? tags :sky)
                                                                                         (dissoc tags :sky)
                                                                                         (conj tags [:sky true]))))
                                 gameplayCtx (-> gameplayCtx
                                                 (data/updateUnit unit (constantly transformedUnit)))
                                 _ (if (contains? (get-in transformedUnit [:robotState :tags]) :sky)
                                     (a/<! (common/unitSkyAnim nil {:unit (->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} transformedUnit)
                                                                               (data/mapUnitToLocal gameplayCtx nil))} inputCh outputCh))
                                     (a/<! (common/unitGroundAnim nil {:unit (->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} transformedUnit)
                                                                                  (data/mapUnitToLocal gameplayCtx nil))} inputCh outputCh)))]
                             (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh)))
                           (do
                             (a/<! (common/showMessage nil {:message (str "沒有飛行能力")} inputCh outputCh))
                             (recur gameplayCtx))))

                       (= cursor1 transformIdx)
                       (let [transformedUnit (data/unitOnTransform gameplayCtx unit (get-in unit [:robotState :robotKey]) select)
                             gameplayCtx (-> gameplayCtx
                                             (data/updateUnit unit (constantly transformedUnit)))
                             [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
                         [gameplayCtx isEnd])

                       (= cursor1 weaponIdx)
                       (let [weapon (common/assertSpec
                                     type/weapon
                                     (nth weapons cursor2))
                             weaponType (data/getWeaponType {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)]
                         (cond
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