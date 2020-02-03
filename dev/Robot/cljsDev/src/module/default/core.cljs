(ns module.default.core
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.model])
  (:require [app.gameplay.module])
  (:require [tool.map])
  (:require-macros [module.default.core :as mm])
  (:require ["./data.js" :as dataJson])
  (:require [app.gameplay.phase.unitMenu :refer [unitMenu]])
  (:require [app.gameplay.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.phase.unitSelectMovePosition :refer [unitSelectMovePosition]])
  (:require [app.gameplay.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]]))

(def data (js->clj dataJson))
(defn getWeaponData [weaponKey]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponData[" weaponKey "] not found")))
      weaponData)))


; =======================
; map
; =======================

(defn moveCost [gameplayCtx from to]
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        t1 (get-in data ["terrainMapping"
                         (str (get-in playmap (reverse from)))
                         "terrain"])
        t2 (get-in data ["terrainMapping"
                         (str (get-in playmap (reverse to)))
                         "terrain"])]
    (+ (get-in data ["terrain" t1 "cost"])
       (get-in data ["terrain" t2 "cost"]))))

(def moveCostM (memoize moveCost))


(defn nextCell [[mw mh] [x y]]
  [[x (min mh (inc y))]
   [x (max 0 (dec y))]
   [(min mw (inc x)) y]
   [(max 0 (dec x)) y]])

(def nextCellM (memoize nextCell))

; =======================
; pilot
; =======================
(defn getPilotInfo [gameplayCtx unit pilot]
  (let [data (get-in data ["pilot" pilot])]
    (if (nil? data)
      (throw (js/Error. (str "getPilotInfo[" pilot "] not found")))
      data)))

; =======================
; weapon
; =======================
(defn getWeaponRange [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponRange[" weaponKey "] not found")))
      (let [{[min max] "range" type "type"} weaponData]
        [min max]))))

(defn getWeaponType [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (let [{type "type"} weaponData]
        type))))

(defn getWeaponSuitability [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (get-in weaponData ["suitability"]))))

(defn getWeaponInfo [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponInfo[" weaponKey "] not found")))
      (merge weaponData
             {"range" (getWeaponRange gameplayCtx unit weapon)
              "type" (getWeaponType gameplayCtx unit weapon)
              "suitability" (getWeaponSuitability gameplayCtx unit weapon)}
             weapon))))

; =======================
; unit
; =======================

; hp
(mm/defUnitSetter hp)
(mm/defUnitGetter hp)
(defn getUnitMaxHp [gameplayCtx unit]
  10000)
(def getUnitMaxHpM (memoize getUnitMaxHp))

; en
(mm/defUnitSetter en)
(mm/defUnitGetter en)
(defn getUnitMaxEn [gameplayCtx unit]
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data ["robot" robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitMaxEn[" robotKey "] not found")))
      (let [en (->> (get robot "components")
                    (filter (fn [k]
                              (some #(= % k) ["energy1" "energy2" "energy3"])))
                    (map (fn [k] (get-in data ["component" k "value" 0])))
                    (map int)
                    (apply +))]
        en))))

(def getUnitMaxEnM (memoize getUnitMaxEn))


(defn getUnitArmor [gameplayCtx unit]
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data ["robot" robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitArmor[" robotKey "] not found")))
      (let [value (->> (get robot "components")
                       (filter (fn [k]
                                 (some #(= % k) ["armor1" "armor2" "armor3"])))
                       (map (fn [k] (get-in data ["component" k "value" 0])))
                       (map int)
                       (apply +))]
        value))))

; components
(defn getUnitComponents [gameplayCtx unit]
  (let [transform (get-in unit [:state :robot])
        coms (get-in unit [:state :components transform])]
    (if coms
      coms
      [transform
       (let [robotKey (get-in unit [:state :robot])
             robot (get-in data ["robot" robotKey])]
         (if (nil? robot)
           (throw (js/Error. (str "getUnitComponents[" robotKey "] not found")))
           (mapv (fn [key]
                   (let [com (get-in data ["component" key])]
                     (if (nil? com)
                       (throw (js/Error. (str "getUnitComponents[" key "] not found")))
                       {:key (gensym)
                        :componentKey key})))
                 (get robot "components"))))])))

(def getUnitComponentsM (memoize getUnitComponents))

; weapons
(defn getUnitWeapons [gameplayCtx unit]
  (let [transform (get-in unit [:state :robot])
        weapons (get-in unit [:state :weapons transform])]
    (if weapons
      weapons
      [transform
       (let [robotKey (get-in unit [:state :robot])
             robot (get-in data ["robot" robotKey])]
         (if (nil? robot)
           (throw (js/Error. (str "getUnitWeapons[" robotKey "]not found")))
           (mapv (fn [weaponKey]
                   (let [weapon (get-in data ["weapon" weaponKey])]
                     (if (nil? weapon)
                       (throw (js/Error. (str "getUnitWeapons[" weaponKey "] not found")))
                       (cond-> {:key weaponKey
                                :weaponKey weaponKey
                                :level 0
                                :tags #{}}
                         (= (get weapon "energyType") "bullet")
                         (merge {:bulletCount (get weapon "maxBulletCount")})))))
                 (get robot "weapons"))))])))

(def getUnitWeaponsM (memoize getUnitWeapons))

(defn setUnitWeapons [gameplayCtx unit weapons]
  (update-in unit [:state :weapons] (fn [origin]
                                      (conj origin weapons))))

;power
(defn getUnitPower [gameplayCtx unit]
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data ["robot" robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (let [power (->> (concat (map (fn [k]
                                      (get-in data ["component" k "powerCost"]))
                                    (get robot "components"))
                               (map (fn [k]
                                      (get-in data ["weapon" k "powerCost"]))
                                    (get robot "weapons")))
                       (apply - (get robot "power")))]
        power))))

(def getUnitPowerM (memoize getUnitPower))

(defn getUnitSuitability [gameplayCtx unit]
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data ["robot" robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (get robot "suitability"))))

(defn getUnitHitRate [gameplayCtx unit weapon targetUnit]
  (let [weaponInfo (getWeaponInfo gameplayCtx unit weapon)
        pilot (getPilotInfo gameplayCtx unit (get-in unit [:state :pilot]))
        targetPilot (getPilotInfo gameplayCtx targetUnit (get-in targetUnit [:state :pilot]))
        terrain (-> (app.gameplay.model/getMap gameplayCtx)
                    (get-in (reverse (:position targetUnit)))
                    ((fn [cellId]
                       (get-in data ["terrainMapping" (str cellId) "terrain"])))
                    ((fn [terrainKey]
                       (get-in data ["terrain" terrainKey]))))
        weaponSuitability (get weaponInfo "suitability")

        ; 距離為基本命中率
        basic (let [pos1 (:position unit)
                    pos2 (:position targetUnit)
                    dist (->> (map - pos1 pos2)
                              (repeat 2)
                              (apply map *)
                              (map js/Math.sqrt)
                              (apply +))]
                (max 0.05 (- 0.9 (* dist 0.05))))

        ; 格鬥或射擊係數
        factor1 (let [isMelee (some #(= % "melee") (get weaponInfo "ability"))]
                  (if isMelee
                    (/ (get pilot "melee") (get targetPilot "melee"))
                    (/ (get pilot "range") (get targetPilot "range"))))

        ; 命中回避係數
        factor2 (/ (get pilot "dex") (get targetPilot "agi"))

        ; 地型適性係數
        factor3 (get weaponSuitability 0)

        ; 武器命中補正係數
        factor4 (get weaponInfo "accuracy")

        ; 地型補正係數
        factor5 (get terrain "hitRate")]
    (* basic factor1 factor2 factor3 factor4 factor5)))

(defn getUnitMakeDamage [gameplayCtx unit weapon targetUnit]
  (let [weaponInfo (getWeaponInfo gameplayCtx unit weapon)
        terrain (-> (app.gameplay.model/getMap gameplayCtx)
                    (get-in (reverse (:position targetUnit)))
                    ((fn [cellId]
                       (get-in data ["terrainMapping" (str cellId) "terrain"])))
                    ((fn [terrainKey]
                       (get-in data ["terrain" terrainKey]))))
        weaponSuitability (getWeaponSuitability gameplayCtx unit weapon)
        targetArmor (getUnitArmor gameplayCtx targetUnit)
        damage (get weaponInfo "damage")]
    (-> (- damage targetArmor)
        (max 100))))

; transform
(defn getUnitTransforms [gameplayCtx unit]
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data ["robot" robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitTransforms[" robotKey "] not found")))
      (conj (get-in robot ["transform"])
            robotKey))))

(defn getUnitInfo [gameplayCtx unit]
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data ["robot" robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitInfo[" robotKey "] not found")))
      (update-in unit [:state] (fn [state]
                                 (merge state
                                        {:weapons (->> (getUnitWeaponsM gameplayCtx unit)
                                                       second
                                                       (map (partial getWeaponInfo gameplayCtx unit)))
                                         :components (->> (getUnitComponentsM gameplayCtx unit)
                                                          second)
                                         :maxHp (getUnitMaxHpM gameplayCtx unit)
                                         :maxEn (getUnitMaxEnM gameplayCtx unit)
                                         :power (getUnitPowerM gameplayCtx unit)}))))))


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
    data))

(defmethod app.gameplay.module/gameplayOnInit :default [_ gameplayCtx]
  (let [[gameplayCtx _] (->> (get data "robot")
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
           (setUnitHp unit (getUnitMaxHp gameplayCtx unit))))
        ((fn [unit]
           (setUnitEn unit (getUnitMaxEn gameplayCtx unit)))))))

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
        (= select "sky")
        (let [transformedUnit (update-in unit [:state :tags] (fn [tags]
                                                               (conj tags :sky)))
              gameplayCtx (-> gameplayCtx
                              (app.gameplay.model/updateUnit unit (constantly transformedUnit)))
              [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
          [gameplayCtx isEnd])

        (= cursor1 transformIdx)
        (let [transformedUnit (app.gameplay.model/onTransform gameplayCtx unit select)
              gameplayCtx (-> gameplayCtx
                              (app.gameplay.model/updateUnit unit (constantly transformedUnit)))
              [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit transformedUnit} inputCh outputCh))]
          [gameplayCtx isEnd])

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
                [gameplayCtx isEnd]
                [gameplayCtx false]))

            (= "line" weaponType)
            (let [[gameplay isEnd] (a/<! (unitSelectAttackPosition gameplayCtx {:unit unit :weapon weapon} inputCh outputCh))]
              (if isEnd
                [gameplayCtx isEnd]
                [gameplayCtx false]))

            :else
            [gameplayCtx false]))

        :else
        [gameplayCtx false]))))

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
        power (/ (getUnitPowerM gameplayCtx unit) 5)
        [mw mh] (tool.map/getMapSize playmap)]
    (->> (tool.map/findPath (:position unit)
                            (fn [{:keys [totalCost]} curr]
                              [(>= totalCost power) false])
                            (partial nextCellM [mw mh])
                            (partial moveCostM gameplayCtx)
                            (constantly 0))
         (filter (fn [[k v]]
                   (<= (:totalCost v) power)))
         (into {}))))

(defmethod app.gameplay.module/unitGetWeapons :default [_ gameplayCtx unit]
  (getUnitWeaponsM gameplayCtx unit))

(defmethod app.gameplay.module/unitSetWeapons :default [_ gameplayCtx unit weapons]
  (setUnitWeapons gameplayCtx unit weapons))

(defmethod app.gameplay.module/unitGetWeaponRange :default [type gameplayCtx unit weapon]
  (let [[min max] (getWeaponRange gameplayCtx unit weapon)]
    (->> (tool.map/simpleFindPath [0 0] (dec min))
         (into #{})
         (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                      (into #{})))
         (map (partial map + (:position unit))))))

(defmethod app.gameplay.module/unitGetWeaponType :default [type gameplayCtx unit weapon]
  (getWeaponType gameplayCtx unit weapon))

(defmethod app.gameplay.module/unitGetMenuData :default [type gameplayCtx unit]
  (let [isBattleMenu (-> (app.gameplay.model/getFsm gameplayCtx)
                         (tool.fsm/currState)
                         (= :unitBattleMenu))
        weapons (->> (getUnitWeaponsM gameplayCtx unit)
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
                        [[["move"] weaponKeys (getUnitTransforms gameplayCtx unit) ["sky"] ["ok"] ["cancel"]]
                         {:weaponIdx 1
                          :weapons weapons
                          :transformIdx 2
                          :unit unit}]))]
    [menu data]))

(defmethod app.gameplay.module/unitGetHitRate :default [_ gameplayCtx unit weapon targetUnit]
  (getUnitHitRate gameplayCtx unit weapon targetUnit))

(defmethod app.gameplay.module/unitGetReaction :default [type gameplayCtx unit fromUnit weapon]
  (let [hitRate (getUnitHitRate gameplayCtx fromUnit weapon unit)
        weapons (-> (getUnitWeaponsM gameplayCtx unit)
                    second)]
    [:attack (first weapons)]))

(defmethod app.gameplay.module/unitIsDead :default [_ gameplayCtx unit]
  (<= (get-in unit [:state :hp]) 0))

(defmethod app.gameplay.module/unitGetInfo :default [_ gameplayCtx unit]
  (getUnitInfo gameplayCtx unit))


(defn getReactionResult [gameplayCtx left [leftActionType leftWeapon :as leftAction] right [rightActionType rightWeapon :as rightAction]]
  (let [leftHitRate (cond-> 0
                      (= leftActionType :attack)
                      ((fn [_]
                         (getUnitHitRate gameplayCtx left leftWeapon right)))

                      (= rightActionType :evade)
                      (/ 2))
        leftIsHit (< (rand) leftHitRate)
        leftMakeDamage (cond-> 0
                         (= leftActionType :attack)
                         ((fn [_]
                            (getUnitMakeDamage gameplayCtx left leftWeapon right)))
                         
                         (false? leftIsHit)
                         ((fn [_] 0))

                         (= rightActionType :guard)
                         (/ 2))]
    {:events (cond-> #{}
               (false? leftIsHit)
               (conj :evade)

               (= rightActionType :guard)
               (conj :guard)
               
               (<= (- (getUnitHp right) leftMakeDamage) 0)
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
                                      (-> (getUnitHp unit)
                                          (- damage)
                                          (max 0)
                                          ((fn [hp]
                                             (setUnitHp unit hp)))))
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
                                                   (map (partial getWeaponInfo gameplayCtx unit) weapons))))
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