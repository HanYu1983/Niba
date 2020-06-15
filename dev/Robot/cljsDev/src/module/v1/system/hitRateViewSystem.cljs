(ns module.v1.system.hitRateViewSystem
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.common :as common])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [tool.fsm])
  (:require [module.v1.system.spec :as spec]))

(defn getHitRate  [gameplayCtx unit]
  {:pre [(common/explainValid? (s/tuple ::spec/unitMenuView ::type/unit) [gameplayCtx unit])]}
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

(defn handleHitRateView [gameplayCtx unit [cmd args]]
  (common/assertSpec ::spec/unitMenuView gameplayCtx)
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down])
        (let [checkHitRate (getHitRate gameplayCtx unit)
              gameplayCtx (-> gameplayCtx
                              (assoc :checkHitRate checkHitRate))]
          gameplayCtx)

        (some #(= % action) [:left :right])
        (let [checkHitRate (getHitRate gameplayCtx unit)
              gameplayCtx (-> gameplayCtx
                              (assoc :checkHitRate checkHitRate))]
          gameplayCtx)

        :else
        gameplayCtx))
    :else
    gameplayCtx))