(ns module.v1.phase.ai.default.do-goal
  (:require [clojure.core.async :as a]
            [clojure.spec.alpha :as s]
            [clojure.set])
  (:require [tool.map]
            [tool.fsm]
            [tool.units]
            [tool.goal]
            [tool.knn]
            [module.v1.type :as type]
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
  (let [maxHp (data/getUnitMaxHp {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
        maxEn (data/getUnitMaxEn {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
        hp (-> unit :robotState :hp)
        en (-> unit :robotState :en)]
    [(/ hp maxHp) (/ en maxEn)]))


(defn handleAttack [gameplayCtx unit otherAsyncFn inputCh outputCh]
  (a/go
    (let [[_ weapons] (data/getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
          weapons (filter #(not (data/invalidWeapon? gameplayCtx unit % nil)) weapons)
          targetUnits (->> (tool.units/getByRegion (:units gameplayCtx)
                                                   (map - (:position unit) [10 10])
                                                   (map + (:position unit) [10 10]))
                           (filter (fn [unit]
                                     (= (get unit :playerKey) :player))))
          bestWeaponUnit (data/getBestWeapon gameplayCtx unit weapons targetUnits)
          gameplayCtx (if bestWeaponUnit
                        (let [[weapon targetUnit] bestWeaponUnit
                              [_ targetUnitWeapons] (data/getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} targetUnit)
                              targetUnitValidWeapons (filter #(not (data/invalidWeapon? gameplayCtx targetUnit % nil)) targetUnitWeapons)
                              targetUnitBestWeaponUnit (data/getBestWeapon gameplayCtx targetUnit targetUnitValidWeapons [unit])
                              targetUnitBestWeapon (or (first targetUnitBestWeaponUnit) (first targetUnitWeapons))
                              _ (when (not (s/valid? ::type/weaponState targetUnitBestWeapon))
                                  (throw (js/Error. (str "[do_goal.cljs] targetUnitBestWeapon must not nil"))))
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
                              _ (a/<! (common/unitTargetingAnim nil {:units (map #(->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} %)
                                                                                       (data/mapUnitToLocal gameplayCtx nil)) [unit targetUnit])} inputCh outputCh))
                              [gameplayCtx _] (a/<! (unitBattleMenu gameplayCtx {:battleMenu battleMenu :playerTurn? false} inputCh outputCh))
                              gameplayCtx (assoc gameplayCtx
                                                 :attackRange []
                                                 :checkHitRate [])]
                          gameplayCtx)
                        (a/<! (otherAsyncFn gameplayCtx)))]
      gameplayCtx)))

(defmethod do-goal :think [_ gameplayCtx unit inputCh outputCh]
  (a/go
    (let [[action] (tool.knn/predict knn [(getKnnState gameplayCtx unit)])
          gameplayCtx (common/assertSpec
                       ::type/gameplayCtx
                       (cond
                         (= "attack" action)
                         (let [gameplayCtx (a/<! (handleAttack gameplayCtx unit
                                                               (fn [gameplayCtx]
                                                                 (a/go
                                                                   (let [orderGoal (common/assertSpec
                                                                                    ::goalType/goal
                                                                                    (-> unit :robotState :orderGoal))
                                                                         gameplayCtx (if orderGoal
                                                                                       (a/<! (do-goal orderGoal gameplayCtx unit inputCh outputCh))
                                                                                       gameplayCtx)]
                                                                     gameplayCtx)))
                                                               inputCh outputCh))
                               ; 重新取得單位
                               unit (common/assertSpec
                                    ; 單位可能在攻擊中死亡
                                     (s/nilable ::type/unit)
                                     (-> gameplayCtx :units (tool.units/getByKey (:key unit))))
                               gameplayCtx (if unit
                                             (let [nextUnit (data/gameplayOnUnitDone gameplayCtx unit)]
                                               (data/updateUnit gameplayCtx unit (constantly nextUnit)))
                                             gameplayCtx)]
                           gameplayCtx)

                         (= "findSupply" action)
                         (let [isAward? (common/assertSpec
                                         boolean?
                                         (-> (data/getTerrainKey gameplayCtx (:position unit))
                                             (= :award)))
                               gameplayCtx (common/assertSpec
                                            ::type/gameplayCtx
                                            (if isAward?
                                              gameplayCtx
                                              (let [awardPosition (data/findNearestTerrainPosition gameplayCtx :award (:position unit))
                                                    gameplayCtx (if awardPosition
                                                                  (a/<! (do-goal [:moveTo awardPosition] gameplayCtx unit inputCh outputCh))
                                                                  gameplayCtx)]
                                                gameplayCtx)))]
                           gameplayCtx)

                         :else
                         (throw (js/Error. (str "action " action " not found")))))]
      gameplayCtx)))

(defmethod do-goal :findAndAttack [_ gameplayCtx unit inputCh outputCh]
  (a/go
    (let [[_ weapons] (data/getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
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
    (let [; 處理移動
          camera (:camera gameplayCtx)
          paths (data/getUnitMovePathTree gameplayCtx unit targetPosition)
          ; 離目標最新的格子
          nearest (if (and (paths targetPosition)
                           (not (tool.units/getByPosition (:units gameplayCtx) targetPosition)))
                    targetPosition
                    (->> paths
                         (filter (fn [[pos _]]
                                   (let [occupyUnit (tool.units/getByPosition (:units gameplayCtx) pos)]
                                     (not occupyUnit))))
                         (sort-by (fn [[pos _]]
                                    (data/estimateCost pos targetPosition)))
                         ffirst))
          ; 
          ;nearest (loop [pos nearest]
          ;          (let [occupyUnit (tool.units/getByPosition (:units gameplayCtx) pos)]
          ;            (if (nil? occupyUnit)
          ;              pos
          ;              (recur (get-in paths [pos :prev])))))
          nearest (or nearest (:position unit))

          ; 建立路徑, 播放動畫
          path (tool.map/buildPath paths nearest)
          _ (a/<! (common/unitMoveAnim gameplayCtx {:unit (->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                                                               (data/mapUnitToLocal gameplayCtx nil))
                                                    :path (map (partial data/world2local camera) path)}
                                       inputCh outputCh))
          ; 套用
          nextUnit (data/gameplayOnUnitMove gameplayCtx unit nearest)
          gameplayCtx (data/updateUnit gameplayCtx unit (constantly nextUnit))

          ; 重新取得單位
          unit (common/assertSpec
                ::type/unit
                (-> gameplayCtx :units (tool.units/getByKey (:key nextUnit))))

          ; 攻擊
          gameplayCtx (a/<! (handleAttack gameplayCtx unit
                                          #(a/go %)
                                          inputCh outputCh))
          ; 重新取得單位
          unit (common/assertSpec
                ; 單位可能在攻擊中死亡
                (s/nilable ::type/unit)
                (-> gameplayCtx :units (tool.units/getByKey (:key unit))))

          gameplayCtx (common/assertSpec
                       ::type/gameplayCtx
                       (if unit
                         (let [; 單位行動結束
                               nextUnit (data/gameplayOnUnitDone gameplayCtx unit)
                               ; 套用
                               gameplayCtx (data/updateUnit gameplayCtx unit (constantly nextUnit))]
                           gameplayCtx)
                         gameplayCtx))]
      gameplayCtx)))