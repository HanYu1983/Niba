(ns module.default.phase.unitMenu)

(defmacro getAttackRange []
  '(if (= cursor1 weaponIdx)
     (-> (module.default.data/getUnitWeaponsM gameplayCtx unit)
         second
         (nth cursor2)
         ((fn [weapon]
            (module.default.data/getUnitWeaponRange gameplayCtx unit weapon))))
     []))

(defmacro getHitRate []
  '(when (= cursor1 weaponIdx)
     (let [weapon (-> (module.default.data/getUnitWeaponsM gameplayCtx unit)
                      second
                      (nth cursor2))
           unitsNearby (->> (app.gameplay.model/getUnitsByRegion gameplayCtx (:position unit) nil)
                            (filter (comp not (partial module.default.data/isFriendlyUnit gameplayCtx unit))))
           checkHitRate (map (fn [targetUnit]
                               {:unit unit
                                :targetUnit targetUnit
                                :weapon weapon
                                :hitRate (module.default.data/getUnitHitRate gameplayCtx unit weapon targetUnit)})
                             unitsNearby)]
       checkHitRate)))