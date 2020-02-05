(ns module.default.core
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.model])
  (:require [app.gameplay.module])
  (:require-macros [app.gameplay.macros :as m])
  (:require [tool.map])
  (:require [module.default.data])
  (:require-macros [module.default.core :as mm])
  (:require [app.gameplay.phase.unitMenu :refer [unitMenu]])
  (:require [app.gameplay.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.phase.unitSelectMovePosition :refer [unitSelectMovePosition]])
  (:require [app.gameplay.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]]))

(m/defwait unitSkyAnim [ctx args])
(m/defwait unitGroundAnim [ctx args])


(defn unitOnTransform [gameplayCtx unit fromKey toKey]
  (-> unit
      (update-in [:state :robot] (constantly toKey))
      (update-in [:state :weapons (keyword toKey)] (constantly (let [weapons (get-in unit [:state :weapons (keyword fromKey)])]
                                                                 weapons)))))

; =======================
; binding
; =======================

(defmethod app.gameplay.module/loadData :default [_]
  (a/go
    module.default.data/data))

(defmethod app.gameplay.module/gameplayOnInit :default [_ gameplayCtx]
  (let [[gameplayCtx _] (->> (get module.default.data/data "robot")
                             (reduce (fn [[gameplayCtx i] [robotKey _]]
                                       [(app.gameplay.model/createUnit gameplayCtx
                                                                       {:player (if (< (rand) 0.5)
                                                                                  :player
                                                                                  :ai1)
                                                                        :type :robot
                                                                        :position [0 i]}
                                                                       {:robotKey robotKey})
                                        (inc i)])
                                     [gameplayCtx 1]))]
    gameplayCtx))

(defmethod app.gameplay.module/unitOnCreate :default [_ gameplayCtx unit {:keys [robotKey] :as args}]
  (let [unit (merge unit {:state {:robot robotKey
                                  :pilot "amuro"
                                  :weapons {}
                                  :components {}
                                  :tags #{}}})]
    (-> unit
        ((fn [unit]
           (module.default.data/setUnitHp unit (module.default.data/getUnitMaxHp gameplayCtx unit))))
        ((fn [unit]
           (module.default.data/setUnitEn unit (module.default.data/getUnitMaxEn gameplayCtx unit)))))))

(defmethod app.gameplay.module/unitOnMove :default [_ gameplayCtx unit pos]
  (-> unit
      (merge {:position pos})
      (update-in [:state :tags] #(conj % :move))))

(defmethod app.gameplay.module/unitOnDone :default [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tags] #(conj % :done))))

(defmethod app.gameplay.module/unitOnTurnStart :default [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tags] (constantly #{}))))

(defmethod app.gameplay.module/unitOnTransform :default [_ gameplayCtx unit robotKey]
  (unitOnTransform gameplayCtx unit (get-in unit [:state :robot]) robotKey))

(defmethod app.gameplay.module/waitUnitOnDead :default [_ gameplayCtx unit]
  (a/go gameplayCtx))

(defmethod app.gameplay.module/waitUnitOnMenu :default [_ gameplayCtx {unit  :unit
                                                                       menuCursor :menuCursor
                                                                       [menu data] :menuData}
                                                        inputCh outputCh]
  (a/go
    (let [cursor1 (tool.menuCursor/getCursor1 menuCursor)
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
                                                                 (disj tags :sky)
                                                                 (conj tags :sky))))
              gameplayCtx (-> gameplayCtx
                              (app.gameplay.model/updateUnit unit (constantly transformedUnit)))
              _ (if (contains? (get-in transformedUnit [:state :tags]) :sky)
                  (a/<! (unitSkyAnim _ {:unit (app.gameplay.model/mapUnitToLocal gameplayCtx nil transformedUnit)} inputCh outputCh))
                  (a/<! (unitGroundAnim _ {:unit (app.gameplay.model/mapUnitToLocal gameplayCtx nil transformedUnit)} inputCh outputCh)))
              [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
          [gameplayCtx isEnd true])

        (= cursor1 transformIdx)
        (let [transformedUnit (unitOnTransform gameplayCtx unit (get-in unit [:state :robot]) select)
              ; transformedUnit (app.gameplay.model/onTransform gameplayCtx unit select)
              gameplayCtx (-> gameplayCtx
                              (app.gameplay.model/updateUnit unit (constantly transformedUnit)))
              [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
          [gameplayCtx isEnd true])

        (= cursor1 weaponIdx)
        (let [menu (tool.menuCursor/getMenu menuCursor)
              weapon  (-> (app.gameplay.model/getWeapons gameplayCtx unit)
                          second
                          (nth cursor2))
              weaponType (app.gameplay.model/getWeaponType gameplayCtx unit weapon)]
          (cond
            (= "single" weaponType)
            (let [; 注意gameplayCtx的名稱不要打錯, 若打成gameplay, 不會報錯結果造成狀態沒有連續
                  [gameplayCtx isEnd] (a/<! (unitSelectSingleTarget gameplayCtx {:unit unit :attackRange attackRange :weapon weapon} inputCh outputCh))]
              (if isEnd
                [gameplayCtx isEnd false]
                [gameplayCtx false false]))

            (= "line" weaponType)
            (let [[gameplayCtx isEnd] (a/<! (unitSelectAttackPosition gameplayCtx {:unit unit :weapon weapon} inputCh outputCh))]
              (if isEnd
                [gameplayCtx isEnd false]
                [gameplayCtx false false]))

            :else
            [gameplayCtx false false]))

        :else
        [gameplayCtx false false]))))

(defmethod app.gameplay.module/waitEnemyTurn :default [_ gameplayCtx enemy inputCh outputCh]
  (a/go
    (let [units (->> (app.gameplay.model/getUnits gameplayCtx)
                     (tool.units/getAll)
                     (filter (fn [unit]
                               (= (get unit :player) enemy))))]
      (loop [gameplayCtx gameplayCtx
             units units]
        (if (> (count units) 0)
          (let [unit (first units)
                gameplayCtx (-> (app.gameplay.model/updateUnit gameplayCtx unit (fn [unit]
                                                                                  unit)))]
            (recur gameplayCtx (rest units)))
          gameplayCtx)))))


(defmethod app.gameplay.module/unitGetMovePathTree :default [_ gameplayCtx unit]
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        power (/ (module.default.data/getUnitPowerM gameplayCtx unit) 5)
        [mw mh] (tool.map/getMapSize playmap)]
    (->> (tool.map/findPath (:position unit)
                            (fn [{:keys [totalCost]} curr]
                              [(>= totalCost power) false])
                            (partial module.default.data/nextCellM [mw mh])
                            (partial module.default.data/moveCostM gameplayCtx)
                            (constantly 0))
         (filter (fn [[k v]]
                   (<= (:totalCost v) power)))
         (into {}))))

(defmethod app.gameplay.module/unitGetWeapons :default [_ gameplayCtx unit]
  (module.default.data/getUnitWeaponsM gameplayCtx unit))

(defmethod app.gameplay.module/unitSetWeapons :default [_ gameplayCtx unit weapons]
  (module.default.data/setUnitWeapons gameplayCtx unit weapons))

(defmethod app.gameplay.module/unitGetWeaponRange :default [type gameplayCtx unit weapon]
  (let [[min max] (module.default.data/getWeaponRange gameplayCtx unit weapon)]
    (->> (tool.map/simpleFindPath [0 0] (dec min))
         (into #{})
         (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                      (into #{})))
         (map (partial map + (:position unit))))))

(defmethod app.gameplay.module/unitGetWeaponType :default [type gameplayCtx unit weapon]
  (module.default.data/getWeaponType gameplayCtx unit weapon))

(defmethod app.gameplay.module/unitGetMenuData :default [type gameplayCtx unit]
  (let [isBattleMenu (-> (app.gameplay.model/getFsm gameplayCtx)
                         (tool.fsm/currState)
                         (= :unitBattleMenu))
        weapons (->> (module.default.data/getUnitWeaponsM gameplayCtx unit)
                     second)
        weaponKeys (->> (range (count weapons))
                        (into []))
        [menu data] (if isBattleMenu
                      [[weaponKeys ["cancel"]]
                       {:weaponIdx 0
                        :weapons weapons
                        :unit unit}]
                      (cond
                        (-> (get-in unit [:state :tags])
                            (contains? :done))
                        [[["cancel"]] {}]

                        (-> (get-in unit [:state :tags])
                            (contains? :move))
                        [[weaponKeys ["ok"] ["cancel"]]
                         {:weaponIdx 0
                          :weapons weapons
                          :unit unit}]

                        :else
                        [[["move"] weaponKeys (module.default.data/getUnitTransforms gameplayCtx unit) ["sky/ground"] ["ok"] ["cancel"]]
                         {:weaponIdx 1
                          :weapons weapons
                          :transformIdx 2
                          :unit unit}]))]
    [menu data]))

(defmethod app.gameplay.module/unitGetHitRate :default [_ gameplayCtx unit weapon targetUnit]
  (module.default.data/getUnitHitRate gameplayCtx unit weapon targetUnit))

(defmethod app.gameplay.module/unitGetReaction :default [type gameplayCtx unit fromUnit weapon]
  (let [hitRate (module.default.data/getUnitHitRate gameplayCtx fromUnit weapon unit)
        weapons (-> (module.default.data/getUnitWeaponsM gameplayCtx unit)
                    second)]
    [:attack (first weapons)]))

(defmethod app.gameplay.module/unitIsDead :default [_ gameplayCtx unit]
  (<= (get-in unit [:state :hp]) 0))

(defmethod app.gameplay.module/unitGetInfo :default [_ gameplayCtx unit]
  (module.default.data/getUnitInfo gameplayCtx unit))


(defn getReactionResult [gameplayCtx left [leftActionType leftWeapon :as leftAction] right [rightActionType rightWeapon :as rightAction]]
  (let [leftHitRate (cond-> 0
                      (= leftActionType :attack)
                      ((fn [_]
                         (module.default.data/getUnitHitRate gameplayCtx left leftWeapon right)))

                      (= rightActionType :evade)
                      (/ 2))
        leftIsHit (< (rand) leftHitRate)
        leftMakeDamage (cond-> 0
                         (= leftActionType :attack)
                         ((fn [_]
                            (module.default.data/getUnitMakeDamage gameplayCtx left leftWeapon right)))
                         
                         (false? leftIsHit)
                         ((fn [_] 0))

                         (= rightActionType :guard)
                         (/ 2))]
    {:events (cond-> #{}
               (false? leftIsHit)
               (conj :evade)

               (= rightActionType :guard)
               (conj :guard)
               
               (<= (- (module.default.data/getUnitHp right) leftMakeDamage) 0)
               (conj :dead))
     :damage leftMakeDamage}))


(defmethod app.gameplay.module/ReactionGetResult :default [_ gameplayCtx left leftAction right rightAction]
  (-> [{:events #{} :damage 0} (getReactionResult gameplayCtx left leftAction right rightAction)]
      ((fn [[_ firstResult :as ctx]]
         (if (contains? (:events firstResult) :dead)
           ctx
           (update ctx 0 (constantly (getReactionResult gameplayCtx right rightAction left leftAction))))))))

(defmethod app.gameplay.module/ReactionApply :default [_ gameplayCtx left leftAction right rightAction result]
  (let [[{leftDamage :damage} {rightDamage :damage}] result
        [leftAfter rightAfter] (map (fn [unit damage]
                                      (-> (module.default.data/getUnitHp unit)
                                          (- damage)
                                          (max 0)
                                          ((fn [hp]
                                             (module.default.data/setUnitHp unit hp)))))
                                    [left right]
                                    [leftDamage rightDamage])
        gameplayCtx (-> gameplayCtx
                        (app.gameplay.model/updateUnit left (constantly leftAfter))
                        (app.gameplay.model/updateUnit right (constantly rightAfter)))]
    gameplayCtx))


(defmethod app.gameplay.module/formatToDraw :default [_ gameplayCtx]
  (let [state (-> (app.gameplay.model/getFsm gameplayCtx)
                  (tool.fsm/currState))
        stateDetail (-> (app.gameplay.model/getFsm gameplayCtx)
                        (tool.fsm/load))]
    {:units (app.gameplay.model/getLocalUnits gameplayCtx nil nil)
     :map (app.gameplay.model/getLocalMap gameplayCtx nil)
     :cursor (app.gameplay.model/getLocalCursor gameplayCtx nil)
     :moveRange (app.gameplay.model/getLocalMoveRange gameplayCtx nil)
     :attackRange (app.gameplay.model/getLocalAttackRange gameplayCtx nil)
     :checkHitRate (->> (get-in gameplayCtx [:temp :checkHitRate])
                        (map (fn [info]
                               (-> info
                                   (update :unit (partial app.gameplay.model/mapUnitToLocal gameplayCtx nil))
                                   (update :targetUnit (partial app.gameplay.model/mapUnitToLocal gameplayCtx nil))))))
     :cellState (->> (get-in gameplayCtx [:temp :cellState]))
     :unitMenu (when (some #(= % state) [:unitMenu :unitBattleMenu])
                 (let [unit (get stateDetail :unit)
                       data (-> (get stateDetail :data)
                                (update :weapons (fn [weapons]
                                                   (map (partial module.default.data/getWeaponInfo gameplayCtx unit) weapons))))
                       menuCursor (get stateDetail :menuCursor)]
                   {:menuCursor menuCursor
                    :data data}))
     :systemMenu (when (some #(= % state) [:menu])
                   (select-keys stateDetail [:menuCursor :data]))
     :battleMenu (when (some #(= % state) [:unitBattleMenu])
                   (let [{battleMenuSession :battleMenuSession} stateDetail]
                     {:preview (app.gameplay.session.battleMenu/mapUnits battleMenuSession (partial app.gameplay.model/mapUnitToLocal gameplayCtx nil))}))
     :state state
     :stateDetail stateDetail}))