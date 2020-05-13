(ns module.v1.phase.unitMenu
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [tool.fsm])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [module.v1.common :as common]))

(defn getAttackRange [gameplayCtx unit]
  {:pre [(common/explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]}
  (let [state (-> gameplayCtx :fsm tool.fsm/load)
        cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
        cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
        weaponIdx (get-in state [:data :weaponIdx])]
    (if (= cursor1 weaponIdx)
      (-> (data/getUnitWeapons gameplayCtx unit)
          second
          (nth cursor2)
          ((fn [weapon]
             (data/getUnitWeaponRange gameplayCtx unit weapon))))
      [])))

(defn getHitRate  [gameplayCtx unit]
  {:pre [(common/explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]}
  (let [state (-> gameplayCtx :fsm tool.fsm/load)
        cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
        cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
        weaponIdx (get-in state [:data :weaponIdx])]
    (when (= cursor1 weaponIdx)
      (let [weapon (-> (data/getUnitWeapons gameplayCtx unit)
                       second
                       (nth cursor2))
            unitsNearby (->> (data/getUnitsByRegion gameplayCtx (:position unit) nil)
                             (filter (comp not (partial data/isFriendlyUnit gameplayCtx unit))))
            checkHitRate (map (fn [targetUnit]
                                {:unit unit
                                 :targetUnit targetUnit
                                 :weapon weapon
                                 :hitRate (data/getUnitHitRate gameplayCtx unit weapon targetUnit)})
                              unitsNearby)]
        checkHitRate))))

(defn unitSelectMovePosition [gameplayCtx _ _ _]
  (a/go [gameplayCtx false]))

(defn unitSelectSingleTarget [gameplayCtx _ _ _]
  (a/go [gameplayCtx false]))

(defn unitSelectAttackPosition [gameplayCtx _ _ _]
  (a/go [gameplayCtx false]))

(core/defstate unitMenu {unit :unit}
  {:nameCtx gameplayCtx
   :initCtx nil
   :initState
   (let [[menu data] (data/getMenuData gameplayCtx unit)]
     {:menuCursor (tool.menuCursor/model menu)
      :data data
      :unit unit})

   :nameFsm _
   :nameState _
   :updateCtx
   (do
     (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
     gameplayCtx)}
  (common/assertSpec ::type/unitMenuView gameplayCtx)
  (let [[cmd args :as evt] (a/<! inputCh)
        gameplayCtx (-> gameplayCtx
                        (data/handleMapView evt)
                        (data/handleMenuCursor evt))]
    (cond
      (= "KEY_DOWN" cmd)
      (let [action (common/actions args)]
        (cond
          (some #(= % action) [:up :down])
          (let [attackRange (getAttackRange gameplayCtx unit)
                checkHitRate (getHitRate gameplayCtx unit)
                gameplayCtx (-> gameplayCtx
                                (assoc :checkHitRate checkHitRate)
                                (assoc :attackRangeView attackRange))]
            (println (-> gameplayCtx :fsm tool.fsm/load))
            (recur gameplayCtx))

          (some #(= % action) [:left :right])
          (let [attackRange (getAttackRange gameplayCtx unit)
                checkHitRate (getHitRate gameplayCtx unit)
                gameplayCtx (-> gameplayCtx
                                (assoc :checkHitRate checkHitRate)
                                (assoc :attackRangeView attackRange))]
            (println (-> gameplayCtx :fsm tool.fsm/load))
            (recur gameplayCtx))

          (= :enter action)
          (let [state (-> gameplayCtx :fsm tool.fsm/load)
                select (tool.menuCursor/getSelect (:menuCursor state))]
            (cond
              (= "move" select)
              (let [shortestPathTree (data/gameplayGetUnitMovePathTree nil gameplayCtx unit)
                    [gameplayCtx isEnd] (a/<! (unitSelectMovePosition gameplayCtx {:unit unit :paths shortestPathTree} inputCh outputCh))]
                (if isEnd
                  [gameplayCtx true]
                  (recur gameplayCtx)))

              (= "ok" select)
              [gameplayCtx true]

              (= "cancel" select)
              [gameplayCtx false]

              :else
              (let [transformIdx (-> state :data :transformIdx)
                    weaponIdx (-> state :data :weaponIdx)
                    cursor1 (-> state :menuCursor tool.menuCursor/getCursor1)
                    cursor2 (-> state :menuCursor tool.menuCursor/getCursor2)
                    attackRange (getAttackRange gameplayCtx unit)]
                (cond
                  (= select "sky/ground")
                  (let [transformedUnit (update-in unit [:robotState :tags] (fn [tags]
                                                                              (if (contains? tags :sky)
                                                                                (dissoc tags :sky)
                                                                                (conj tags [:sky true]))))
                        gameplayCtx (-> gameplayCtx
                                        (data/updateUnit unit (constantly transformedUnit)))
                        _ (if (contains? (get-in transformedUnit [:robotState :tags]) :sky)
                            (a/<! (common/unitSkyAnim nil {:unit (data/mapUnitToLocal gameplayCtx nil transformedUnit)} inputCh outputCh))
                            (a/<! (common/unitGroundAnim nil {:unit (data/mapUnitToLocal gameplayCtx nil transformedUnit)} inputCh outputCh)))
                        [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
                    [gameplayCtx isEnd])

                  (= cursor1 transformIdx)
                  (let [transformedUnit (data/unitOnTransform gameplayCtx unit (get-in unit [:robotState :robotKey]) select)
                        gameplayCtx (-> gameplayCtx
                                        (data/updateUnit unit (constantly transformedUnit)))
                        [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
                    [gameplayCtx isEnd])

                  (= cursor1 weaponIdx)
                  (let [weapon  (-> (data/getUnitWeapons gameplayCtx unit)
                                    second
                                    (nth cursor2))
                        weaponType (data/getWeaponType gameplayCtx unit weapon)]
                    (cond
                      (= "single" weaponType)
                      (let [; 注意gameplayCtx的名稱不要打錯, 若打成gameplay, 不會報錯結果造成狀態沒有連續
                            [gameplayCtx isEnd] (a/<! (unitSelectSingleTarget gameplayCtx {:unit unit :attackRange attackRange :weapon weapon} inputCh outputCh))]
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
      (recur gameplayCtx))))