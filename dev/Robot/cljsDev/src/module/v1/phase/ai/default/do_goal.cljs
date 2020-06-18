(ns module.v1.phase.ai.default.do-goal
  (:require [clojure.core.async :as a]
            [clojure.set])
  (:require [tool.map]
            [tool.fsm]
            [tool.units]
            [tool.goal]
            [tool.knn]
            [module.v1.data :as data]
            [module.v1.common :as common]
            [module.v1.session.battleMenu :as battleMenu]
            [module.v1.phase.unitBattleMenu :refer [unitBattleMenu]]
            [module.v1.phase.ai.default.goalType :as goalType]))


(defn myUnits [gameplayCtx enemy])
(defn stillNotMove? [gameplayCtx unit])
(defn stillNotAttack? [gameplayCtx unit])
(defn positionToMove [gameplayCtx unit aiCtx])
(defn unitToAttack [gameplayCtx unit aiCtx])
(defn weaponsCanUseToUnit [gameplayCtx unit targetUnit aiCtx])
(defn weaponToUse [gameplayCtx unit targetUnit aiCtx])

(defmulti do-goal (fn [[goalType]] goalType))



(def knn (let [trainSet [[[1 1] "attack"]
                         [[0.5 0.5] "attack"]
                         [[0 0] "findSupply"]
                         [[1 0] "findSupply"]
                         [[0 1] "findSupply"]]]
           (tool.knn/train (mapv first trainSet)
                           (mapv second trainSet)
                           {:k 1})))

(defn getKnnState [gameplayCtx unit]
  (let [maxHp (data/getUnitMaxHp gameplayCtx unit)
        maxEn (data/getUnitMaxEn gameplayCtx unit)
        hp (-> unit :robotState :hp)
        en (-> unit :robotState :en)]
    [(/ hp maxHp) (/ en maxEn)]))



(defmethod do-goal :think [_ gameplayCtx unit inputCh outputCh]
  (a/go
    (let [[action] (tool.knn/predict knn [(getKnnState gameplayCtx unit)])
          gameplayCtx (cond
                        (= "attack" action)
                        (let [[_ weapons] (data/getUnitWeapons gameplayCtx unit)
                              weapons (filter #(not (data/invalidWeapon? gameplayCtx unit %)) weapons)
                              targetUnits (->> (tool.units/getByRegion (:units gameplayCtx)
                                                                       (map - (:position unit) [10 10])
                                                                       (map + (:position unit) [10 10]))
                                               (filter (fn [unit]
                                                         (= (get unit :playerKey) :player))))
                              bestWeaponUnit (data/getBestWeapon gameplayCtx unit weapons targetUnits)
                              gameplayCtx (if bestWeaponUnit
                                            (let [[weapon targetUnit] bestWeaponUnit
                                                  [_ targetUnitWeapons] (data/getUnitWeapons gameplayCtx targetUnit)
                                                  targetUnitWeapons (filter #(not (data/invalidWeapon? gameplayCtx targetUnit %)) targetUnitWeapons)
                                                  targetUnitBestWeaponUnit (data/getBestWeapon gameplayCtx targetUnit targetUnitWeapons [unit])
                                                  targetUnitBestWeapon (or (first targetUnitBestWeaponUnit) (first targetUnitWeapons))
                                                  targetUnitBestAction (if targetUnitBestWeaponUnit
                                                                         [:attack targetUnitBestWeapon]
                                                                         [:guard])
                                                  battleMenu [{:unit targetUnit
                                                               :action targetUnitBestAction
                                                               :hitRate (data/getUnitHitRate gameplayCtx targetUnit targetUnitBestWeapon unit)}
                                                              {:unit unit
                                                               :action [:attack weapon]
                                                               :hitRate (data/getUnitHitRate gameplayCtx unit weapon targetUnit)}]
                                                  _ (common/assertSpec ::battleMenu/defaultModel battleMenu)
                                                  _ (a/<! (common/unitTargetingAnim nil {:units (map #(data/mapUnitToLocal gameplayCtx nil %) [unit targetUnit])} inputCh outputCh))
                                                  [gameplayCtx _] (a/<! (unitBattleMenu gameplayCtx {:battleMenu battleMenu :playerTurn? false} inputCh outputCh))
                                                  gameplayCtx (assoc gameplayCtx 
                                                                     :attackRange []
                                                                     :checkHitRate [])]
                                              gameplayCtx)
                                            (let [orderGoal (-> unit :robotState :orderGoal)
                                                  _ (common/assertSpec ::goalType/goal orderGoal)
                                                  gameplayCtx (if orderGoal
                                                                (a/<! (do-goal orderGoal gameplayCtx unit inputCh outputCh))
                                                                gameplayCtx)]
                                              gameplayCtx))]
                          gameplayCtx)

                        (= "findSupply" action)
                        (let [orderGoal (-> unit :robotState :orderGoal)
                              _ (common/assertSpec ::goalType/goal orderGoal)
                              gameplayCtx (if orderGoal
                                            (a/<! (do-goal orderGoal gameplayCtx unit inputCh outputCh))
                                            gameplayCtx)]
                          gameplayCtx)
                        
                        :else
                        (throw (js/Error. (str "action " action " not found"))))]
      gameplayCtx)))

(defmethod do-goal :findAndAttack [_ gameplayCtx unit inputCh outputCh]
  (a/go
    (let [[_ weapons] (data/getUnitWeapons gameplayCtx unit)
          weapon (first weapons)
          targetUnit (->> (:units gameplayCtx)
                          (tool.units/getAll)
                          (filter #(-> % :playerKey (= :player)))
                          first)
          battleMenu [{:unit targetUnit :action [:pending]}
                      {:unit unit
                       :action [:attack weapon]
                       :hitRate (data/getUnitHitRate gameplayCtx unit weapon targetUnit)}]
          _ (common/explainValid? ::battleMenu/defaultModel battleMenu)
          [gameplayCtx _] (a/<! (unitBattleMenu gameplayCtx {:battleMenu battleMenu :playerTurn? false} inputCh outputCh))]
      gameplayCtx)))

(defmethod do-goal :moveTo [[_ targetPosition] gameplayCtx unit inputCh outputCh]
  (a/go
    (let [camera (:camera gameplayCtx)
          paths (data/getUnitMovePathTreeTo gameplayCtx unit targetPosition)
          nearest (if (paths targetPosition)
                    targetPosition
                    (->> paths
                         (sort-by (fn [[pos _]]
                                    (data/estimateCost pos targetPosition)))
                         ffirst))
          nearest (loop [pos nearest]
                    (let [occupyUnit (tool.units/getByPosition (:units gameplayCtx) pos)]
                      (if (nil? occupyUnit)
                        pos
                        (recur (get-in paths [pos :prev])))))
          nearest (or nearest (:position unit))
          path (tool.map/buildPath paths nearest)
          _ (a/<! (common/unitMoveAnim gameplayCtx {:unit (data/mapUnitToLocal gameplayCtx nil unit)
                                                    :path (map (partial data/world2local camera) path)}
                                       inputCh outputCh))
          nextUnit (-> unit
                       (assoc :position nearest)
                       ;(update-in [:robotState :goals] tool.goal/next-goal)
                       ;(update-in [:robotState :tags] #(conj % [:done true]))
                       )
          gameplayCtx (data/updateUnit gameplayCtx unit (constantly nextUnit))]
      gameplayCtx)))