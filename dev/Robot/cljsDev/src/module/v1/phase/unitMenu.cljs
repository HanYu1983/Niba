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

          (= :cancel action)
          [gameplayCtx false]

          :else
          (recur gameplayCtx)))

      :else
      (recur gameplayCtx))))