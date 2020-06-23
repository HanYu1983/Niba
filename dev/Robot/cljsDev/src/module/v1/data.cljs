(ns module.v1.data
  (:require ["./data.js" :as dataJson])
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require [module.v1.type :as type])
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.viewModel.spec :as viewModelSpec])
  (:require [tool.units])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.menuCursor])
  (:require [module.v1.session.battleMenu :as battleMenu])
  (:require [module.v1.common :as common :refer [explainValid?]])
  (:require [clojure.set]))

(def data (js->clj dataJson :keywordize-keys true))


(s/def ::terrianItem (s/keys :req-un [::title ::cost ::hitRate ::damage]))
(s/def ::terrain (s/map-of keyword? ::terrianItem))
(s/def ::data (s/keys :req-un [::terrain]))

; =======================
; map
; =======================


(defn getTerrainKey [{playmap :map} from]
  {:pre [(explainValid? (s/tuple ::spec/map) [playmap])]
   :post [(explainValid? keyword? %)]}
  (let [t1 (get-in data [:terrainMapping
                         ((comp keyword str) (get-in playmap (reverse from)))
                         :terrain])]
    (keyword t1)))

(defn getTerrain [{playmap :map} from]
  {:pre [(explainValid? (s/tuple ::spec/map) [playmap])]
   :post [(explainValid? ::terrianItem %)]}
  (-> (getTerrainKey {:map playmap} from)
      ((fn [key]
         (get-in data [:terrain key])))))


(defn estimateCost [from to]
  (->> (map - from to)
       (repeat 2)
       (apply map *)
       (apply +)))

; =======================
; pilot
; =======================
(defn getPilotInfo [gameplayCtx unit pilot]
  {:pre [(explainValid? (s/tuple ::type/unit keyword?) [unit pilot])]}
  (let [data (get-in data [:pilot pilot])]
    (if (nil? data)
      (throw (js/Error. (str "getPilotInfo[" pilot "] not found")))
      data)))

; =======================
; weapon
; =======================
(defn getWeaponRange [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]
   :post [(explainValid? (s/tuple number? number?) %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponRange[" weaponKey "] not found")))
      (let [{[min max] :range _ :type} weaponData
            max (if (-> unit :robotState :tags :weaponRangePlus)
                  (inc max)
                  max)]
        [min max]))))

(defn getWeaponType [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]
   :post [(explainValid? string? %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (let [{type :type} weaponData]
        type))))

(defn getWeaponSuitability [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]
   :post [(explainValid? (s/tuple number? number? number? number?) %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (get-in weaponData [:suitability]))))

(defn getWeaponAbility [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (get-in weaponData [:ability]))))

(defn invalidWeapon? [gameplayCtx unit weapon]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]
   :post [(explainValid? (s/nilable string?) %)]}
  (let [{:keys [energyType energyCost]} (common/assertSpec
                                         (s/keys :req-un [::energyType ::energyCost])
                                         (get-in data [:weapon (:weaponKey weapon)]))
        bulletCount (:bulletCount weapon)
        msg (cond
              (= energyType "energy")
              (let [en (-> unit :robotState :en)
                    enoughEn? (>= en energyCost)]
                (when (not enoughEn?)
                  "en is not enough"))

              (= energyType "bullet")
              (when (zero? bulletCount)
                "bullet is empty")

              :else
              (str "energyType not found"))]
    msg))

; =======================
; unit
; =======================
(defn updateUnit [{:keys [units] :as gameplayCtx} unit f]
  (common/assertSpec ::type/units units)
  (common/assertSpec ::type/unit unit)
  (common/assertSpec
   ::type/units
   :units
   (update gameplayCtx :units (fn [origin]
                                (-> origin
                                    (tool.units/delete unit)
                                    (tool.units/add (f unit)))))))
; hp
(defn getUnitMaxHp [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(number? %)]}
  10000)

; en
(defn getUnitMaxEn [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(number? %)]}
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitMaxEn[" robotKey "] not found")))
      (let [en (->> (get robot :components)
                    (filter (fn [k]
                              (some #(= % k) ["energy1" "energy2" "energy3"])))
                    (map (fn [k] (get-in data [:component (keyword k) :value 0])))
                    (map int)
                    (apply +))]
        en))))


(defn getUnitArmor [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(number? %)]}
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitArmor[" robotKey "] not found")))
      (let [value (->> (get robot :components)
                       (filter (fn [k]
                                 (some #(= % k) ["armor1" "armor2" "armor3"])))
                       (map (fn [k] (get-in data [:component (keyword k) :value 0])))
                       (map int)
                       (apply +))]
        value))))

; components
(defn getUnitComponents [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(explainValid? ::type/componentEntry %)]}
  (let [transform (get-in unit [:robotState :robotKey])
        coms (get-in unit [:robotState :components transform])]
    (if coms
      [transform coms]
      [transform
       (let [robotKey (get-in unit [:robotState :robotKey])
             robot (get-in data [:robot robotKey])]
         (if (nil? robot)
           (throw (js/Error. (str "getUnitComponents[" robotKey "] not found")))
           (mapv (fn [key]
                   (let [com (get-in data [:component (keyword key)])]
                     (if (nil? com)
                       (throw (js/Error. (str "getUnitComponents[" key "] not found")))
                       {:key (keyword key)
                        :componentKey (keyword key)
                        :tags {}})))
                 (get robot :components))))])))

; weapons
(defn getUnitWeapons [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(explainValid? ::type/weaponEntry %)]}
  (let [transform (get-in unit [:robotState :robotKey])
        weapons (get-in unit [:robotState :weapons transform])]
    (if weapons
      [transform weapons]
      [transform
       (let [robotKey (get-in unit [:robotState :robotKey])
             robot (get-in data [:robot robotKey])]
         (if (nil? robot)
           (throw (js/Error. (str "getUnitWeapons robotKey[" robotKey "]not found")))
           (mapv (fn [weaponKey]
                   (let [weapon (get-in data [:weapon (keyword weaponKey)])]
                     (if (nil? weapon)
                       (throw (js/Error. (str "getUnitWeapons weaponKey[" weaponKey "] not found")))
                       {:key (keyword weaponKey) ; 在這個不能使用gensym, 因為這個方法是getter
                        :weaponKey (keyword weaponKey)
                        :weaponLevel 0
                        :tags {}
                        :bulletCount (get weapon :maxBulletCount)})))
                 (get robot :weapons))))])))

(defn setUnitWeapons [unit weapons]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weaponEntry) [unit weapons])]
   :post [(explainValid? ::type/unit %)]}
  (update-in unit [:robotState :weapons] (fn [origin]
                                           (conj origin weapons))))


(defn getUnitWeaponRange [gameplayCtx unit weapon]
  (common/assertSpec ::type/unit unit)
  (common/assertSpec ::type/weapon weapon)
  (common/assertSpec
   (s/coll-of vector?)
   (let [[min max] (getWeaponRange gameplayCtx unit weapon)]
     (->> (tool.map/simpleFindPath [0 0] (dec min))
          (into #{})
          (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                       (into #{})))
         ; 使用mapv確保類型, 讓clojure.spec驗過
          (mapv (partial mapv + (:position unit)))))))

;power
(defn getUnitPower [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(number? %)]}
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (let [power (->> (concat (map (fn [k]
                                      (get-in data [:component (keyword k) :powerCost]))
                                    (get robot :components))
                               (map (fn [k]
                                      (get-in data [:weapon (keyword k) :powerCost]))
                                    (get robot :weapons)))
                       (apply - (get robot :power)))]
        power))))

(defn getUnitSuitability [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post []}
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (get robot :suitability))))

(defn getUnitHitRate [{playmap :map :as gameplayCtx} unit weapon targetUnit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::spec/map ::type/unit ::type/weapon ::type/unit) [gameplayCtx playmap unit weapon targetUnit])]
   :post [(explainValid? number? %)]}
  (let [accuracy (common/assertSpec
                  number?
                  (get-in data [:weapon (:weaponKey weapon) :accuracy]))
        pilot (getPilotInfo gameplayCtx unit (get-in unit [:robotState :pilotKey]))
        targetPilot (getPilotInfo gameplayCtx targetUnit (get-in targetUnit [:robotState :pilotKey]))
        weaponSuitability (getWeaponSuitability gameplayCtx unit weapon)
        weaponAbility (getWeaponAbility gameplayCtx unit weapon)
        ; 這邊的"missle"拼字是錯的, 後來資料表修正後要改回來
        missile? (-> (into #{} weaponAbility) (contains? "missle"))
        fire? (-> (into #{} weaponAbility) (contains? "fire"))
        lighting? (-> (into #{} weaponAbility) (contains? "lighting?"))
        targetTerrainKey (getTerrainKey {:map playmap} (:position targetUnit))
        targetTerrain (-> data :terrain targetTerrainKey)
        fireActive? (and fire? (= targetTerrainKey :forest))
        lightingActive? (and lighting? (#{:shallowSea :deepSea} targetTerrainKey))

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
        factor1 (let [isMelee (some #(= (keyword %) :melee) weaponAbility)]
                  (if isMelee
                    (/ (get pilot :melee) (get targetPilot :melee))
                    (/ (get pilot :range) (get targetPilot :range))))

        ; 命中回避係數
        factor2 (/ (get pilot :dex) (get targetPilot :agi))

        ; 地型適性係數
        factor3 (get weaponSuitability 0)

        ; 武器命中補正係數
        factor4 accuracy

        ; 地型補正係數
        factor5 (cond
                  (or lightingActive? fireActive?)
                  1.1

                  :else
                  (:hitRate targetTerrain))

        ; 對方速度
        factor6 (cond
                  missile?
                  1

                  :else
                  (let [vel (or (get-in targetUnit [:robotState :tags :velocity]) 0)]
                    (if (= vel 0)
                      1
                      (-> 0.5
                          (* vel)
                          (/ 20)
                          ((fn [v]
                             (- 1 v)))
                          (max 0)))))]
    (max 0.1 (* basic factor1 factor2 factor3 factor4 factor5 factor6))))

(defn getUnitMakeDamage [{playmap :map :as gameplayCtx} unit weapon targetUnit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::spec/map ::type/unit ::type/weapon ::type/unit) [gameplayCtx playmap unit weapon targetUnit])]
   :post [(explainValid? number? %)]}
  (let [damage (common/assertSpec
                int?
                (get-in data [:weapon (:weaponKey weapon) :damage]))
        terrain (-> playmap
                    (get-in (reverse (:position targetUnit)))
                    ((fn [cellId]
                       (get-in data [:terrainMapping (str cellId) :terrain])))
                    ((fn [terrainKey]
                       (get-in data [:terrain terrainKey]))))
        weaponSuitability (getWeaponSuitability gameplayCtx unit weapon)
        targetArmor (getUnitArmor gameplayCtx targetUnit)]
    (-> (- damage targetArmor)
        (max 100))))

; transform
(defn getUnitTransforms [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(explainValid? (s/+ keyword?) %)]}
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitTransforms[" robotKey "] not found")))
      (conj (mapv keyword (get-in robot [:transform]))
            robotKey))))



(defn useUnitWeapon [gameplayCtx weapon unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/weapon ::type/unit) [gameplayCtx weapon unit])]
   :post [(explainValid? ::type/unit %)]}
  (let [energyType (common/assertSpec
                    #{:energy :bullet}
                    (-> (get-in data [:weapon (:weaponKey weapon) :energyType])
                        keyword))]
    (cond
      (= energyType :energy)
      (let [energyCost (common/assertSpec
                        int?
                        (get-in data [:weapon (:weaponKey weapon) :energyCost]))
            unitAfter (-> (-> unit :robotState :en)
                          (- energyCost)
                          (max 0)
                          ((fn [en]
                             (update-in unit [:robotState :en] (constantly en)))))]
        unitAfter)

      (= energyType :bullet)
      (let [weapons (getUnitWeapons gameplayCtx unit)
            _ (explainValid? ::type/weaponEntry weapons)
            weaponAfter (update-in weapon [:bulletCount] (comp (partial max 0) dec))
            weaponsAfter (update-in weapons [1] (fn [vs]
                                                  (replace {weapon weaponAfter} vs)))
            unitAfter (setUnitWeapons unit weaponsAfter)]
        unitAfter))))

(defn moveCost [{playmap :map :as gameplayCtx} unit from to]
  {:pre [(explainValid? (s/tuple ::spec/map ::type/unit) [playmap unit])]
   :post [(number? %)]}
  (let [isSky (-> (get-in unit [:robotState :tags])
                  (contains? :sky))
        ; 陸海空宇
        [suit1 suit2 suit3 _] (getUnitSuitability gameplayCtx unit)
        costFn (fn [terrainKey]
                 (let [basic (get-in data [:terrain terrainKey :cost])
                       ret (cond
                             isSky
                             (* 0.5 (/ 1 suit3))

                             (#{:shallowSea :deepSea} terrainKey)
                             (* basic (/ 1 suit2))

                             :else
                             (* basic (/ 1 suit1)))]
                   ret))]
    (+ (costFn (getTerrainKey gameplayCtx from))
       (costFn (getTerrainKey gameplayCtx to)))))

(defn isBelongToPlayer [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(explainValid? boolean? %)]}
  (= (:playerKey unit) :player))

(defn isFriendlyUnit [{players :players :as gameplayCtx} unit targetUnit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/players ::type/unit ::type/unit) [gameplayCtx players unit targetUnit])]
   :post [(explainValid? boolean? %)]}
  (if (= unit targetUnit)
    true
    (->> [unit targetUnit]
         (map :playerKey)
         (map (fn [player]
                (get-in players [player :faction])))
         (apply =))))

(defn getMenuData [gameplayCtx unit playerTurn?]
  (common/assertSpec ::type/unit unit)
  (common/assertSpec boolean? playerTurn?)
  (common/assertSpec
   (s/tuple ::spec/menu ::spec/menuCursorData)
   (if (not (isBelongToPlayer gameplayCtx unit))
     [[["cancel"]] {}]
     (let [isBattleMenu (-> (:fsm gameplayCtx)
                            (tool.fsm/currState)
                            (= :unitBattleMenu))
           moved? (-> unit :robotState :tags :moveCount)
           weapons (->> (getUnitWeapons gameplayCtx unit)
                        second
                        (filter (fn [weapon]
                                  (if moved?
                                    (let [weaponAbility (getWeaponAbility gameplayCtx unit weapon)]
                                      (-> (into #{} weaponAbility) (contains? "moveAttack")))
                                    true))))
           _ (when (zero? (count weapons))
               (throw (js/Error. (str "[data.cljs] weapons count must more then 0"))))
           weaponKeys (->> (range (count weapons))
                           (into []))
           [menu data] (if isBattleMenu
                         [(if playerTurn?
                            [weaponKeys ["cancel"]]
                            [weaponKeys ["evade"] ["guard"]])
                          {:weaponIdx 0
                           :weapons weapons
                           :unit unit}]
                         (cond
                           (-> (get-in unit [:robotState :tags])
                               (contains? :done))
                           [[["cancel"]] {}]

                           (-> (get-in unit [:robotState :tags])
                               (contains? :moveCount))
                           [[weaponKeys ["ok"] ["cancel"]]
                            {:weaponIdx 0
                             :weapons weapons
                             :unit unit}]

                           :else
                           [[["move"]
                             weaponKeys
                             (getUnitTransforms gameplayCtx unit)
                             ["sky/ground"]
                             ["ok"]
                             ["cancel"]]
                            {:weaponIdx 1
                             :weapons weapons
                             :transformIdx 2
                             :unit unit}]))]
       [menu data]))))


(defn getSelectWeaponWeight [gameplayCtx unit weapon targetUnit]
  (let [damage (getUnitMakeDamage gameplayCtx unit weapon targetUnit)
        hitRate (getUnitHitRate gameplayCtx unit weapon targetUnit)
        w1 (/ (* damage hitRate) 5000)
        w2 hitRate
        w3 (if (>= damage (-> targetUnit :robotState :hp))
             1
             0)]
    (+ w1 w2 w3)))

(defn getBestWeapon [gameplayCtx unit weapons targetUnits]
  {:pre [(common/explainValid? (s/tuple ::type/unit (s/* ::type/weapon) (s/* ::type/unit)) [unit weapons targetUnits])]
   :post [(common/explainValid? (s/nilable (s/tuple ::type/weapon ::type/unit)) %)]}
  (let [touchUnitLists (map (fn [weapon]
                              (let [weaponRanges (into #{} (getUnitWeaponRange gameplayCtx unit weapon))
                                    units (filter #(weaponRanges (:position %)) targetUnits)]
                                units))
                            weapons)
        weaponWeights (mapcat (fn [weapon touchUnits]
                                (->> (map (partial getSelectWeaponWeight gameplayCtx unit weapon) touchUnits)
                                     (map vector (repeat weapon) touchUnits)))
                              weapons
                              touchUnitLists)
        bestItem (-> (sort (fn [[_ _ w]] w) weaponWeights)
                     reverse
                     first)]
    (when bestItem
      (let [[weapon unit] bestItem]
        [weapon unit]))))

(defn thinkReaction [gameplayCtx unit fromUnit weapon]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit ::type/unit ::type/weapon) [gameplayCtx unit fromUnit weapon])]
   :post [(vector? %)]}
  (let [hitRate (getUnitHitRate gameplayCtx fromUnit weapon unit)
        weapons (->> (getUnitWeapons gameplayCtx unit)
                     second
                     (filter #(not (invalidWeapon? gameplayCtx unit %))))
        bestWeaponUnit (getBestWeapon gameplayCtx unit weapons [fromUnit])
        action (if bestWeaponUnit
                 (let [[bestWeapon _] bestWeaponUnit]
                   [:attack bestWeapon])
                 (if (< hitRate 0.7)
                   [:evade]
                   [:guard]))]
    action))

(s/def ::events (s/and set?
                       (s/coll-of #{:damage :evade :guard :dead})))
(s/def ::damage number?)
(s/def ::attackAction ::battleMenu/action)
(s/def ::deffenceAction ::battleMenu/action)
(s/def ::meta (s/keys :req-opt [::attackAction ::deffenceAction]))
(s/def ::reactionResult (s/keys :req-un [::events ::damage ::meta]))

(defn getReactionResult [gameplayCtx left [leftActionType leftWeapon :as leftAction] right [rightActionType rightWeapon :as rightAction]]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (common/assertSpec ::type/unit left)
  (common/assertSpec ::type/unit right)
  (common/assertSpec ::battleMenu/action leftAction)
  (common/assertSpec ::battleMenu/action rightAction)
  (common/assertSpec
   ::reactionResult
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
                true
                (conj (if leftIsHit
                        :damage
                        :evade))

                (= rightActionType :guard)
                (conj :guard)

                (<= (- (-> right :robotState :hp) leftMakeDamage) 0)
                (conj :dead))
      :damage leftMakeDamage
      :meta {:attackAction leftAction
             :deffenceAction rightAction}})))

(s/def ::actionResult (s/tuple ::reactionResult ::reactionResult))
(defn calcActionResult [gameplayCtx left leftAction right rightAction]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (common/assertSpec ::type/unit left)
  (common/assertSpec ::type/unit right)
  (common/assertSpec ::battleMenu/action leftAction)
  (common/assertSpec ::battleMenu/action rightAction)
  (common/assertSpec
   ::actionResult
   (-> [{:events #{} :damage 0 :meta {}} (getReactionResult gameplayCtx left leftAction right rightAction)]
       ((fn [[_ firstResult :as ctx]]
          (if (contains? (:events firstResult) :dead)
            ctx
            (if (not= (first rightAction) :attack)
              ctx
              (update ctx 0 (constantly (getReactionResult gameplayCtx right rightAction left leftAction))))))))))

(defn applyActionResult [gameplayCtx left leftAction right rightAction result]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (common/assertSpec ::type/unit left)
  (common/assertSpec ::type/unit right)
  (common/assertSpec ::battleMenu/action leftAction)
  (common/assertSpec ::battleMenu/action rightAction)
  (common/assertSpec ::actionResult result)
  (common/assertSpec
   (s/tuple ::type/unit ::type/unit)
   (let [[{leftDamage :damage} {rightDamage :damage}] result
         [leftAfter rightAfter] (map (fn [unit damage]
                                       (-> (-> unit :robotState :hp)
                                           (- damage)
                                           (max 0)
                                           ((fn [hp]
                                              (update-in unit [:robotState :hp] (constantly hp))))))
                                     [left right]
                                     [leftDamage rightDamage])

         [leftAfter rightAfter] (map (fn [unit [actionType weapon]]
                                       (if (= actionType :attack)
                                         (useUnitWeapon gameplayCtx weapon unit)
                                         unit))
                                     [leftAfter rightAfter]
                                     [leftAction rightAction])]
     [leftAfter rightAfter])))


(defn getUnitMovePathTree
  ([gameplayCtx unit]
   (getUnitMovePathTree gameplayCtx unit nil))

  ([{units :units players :players playmap :map :as gameplayCtx} unit pos]
   {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::spec/map ::type/unit) [gameplayCtx playmap unit])]}
   (let [power (/ (getUnitPower gameplayCtx unit) 5)
         power (if (-> unit :robotState :tags :moveRangePlus)
                 (+ power 3)
                 power)
         [mw mh] (tool.map/getMapSize playmap)
         originPos (:position unit)]
     (tool.map/findPath (fn [[x y] info]
                          (let [nowCost (:cost info)
                                possiblePosition [[x (min (dec mh) (inc y))]
                                                  [x (max 0 (dec y))]
                                                  [(min (dec mw) (inc x)) y]
                                                  [(max 0 (dec x)) y]]
                                unitsInPosition (map #(tool.units/getByPosition units %) possiblePosition)
                                costToNext (map #(moveCost gameplayCtx unit [x y] %) possiblePosition)
                                sky? (-> unit :robotState :tags :sky)]
                            (->> (map vector possiblePosition costToNext unitsInPosition)
                                 (filter (fn [[_ cost occupyUnit]]
                                           (and (<= (+ nowCost cost) power)
                                                (or (nil? occupyUnit)
                                                    (= (get-in players [(-> unit :playerKey) :faction])
                                                       (get-in players [(-> occupyUnit :playerKey) :faction]))
                                                    (let [occupyUnitIsSky? (-> occupyUnit :robotState :tags :sky)]
                                                      (not= sky? occupyUnitIsSky?)))))))))
                        (fn [from]
                          (if pos
                            (estimateCost from pos)
                            0))
                        originPos
                        (fn [{:keys [cost]} curr]
                          [(or (= curr pos) (>= cost power)) false])))))

(defn findNearestTerrainPosition [gameplayCtx targetTerrainKey fromPos]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (common/assertSpec
   (s/nilable ::type/position)
   (let [{playmap :map units :units} gameplayCtx
         [mw mh] (tool.map/getMapSize playmap)
         pos (->> (for [x (range mw)
                        y (range mh)]
                    [x y])
                  ; 不能寫成這樣, 不然運行會出錯
                  ; (map #([% (getTerrainKey gameplayCtx %)]))
                  (map (fn [pos]
                         [pos (getTerrainKey gameplayCtx pos)]))
                  (filter (fn [[pos terrainKey]]
                            (and (= terrainKey targetTerrainKey)
                                 (not (tool.units/getByPosition units pos)))))
                  (map first)
                  (sort-by (fn [pos]
                             (estimateCost fromPos pos)))
                  first)]
     pos)))

(defn unitOnTransform [gameplayCtx unit fromKey toKey]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit keyword? keyword?) [gameplayCtx unit fromKey toKey])]
   :post [(explainValid? ::type/unit %)]}
  (let [[_ weaponsNow] (getUnitWeapons gameplayCtx unit)
        [_ weaponsNext] (getUnitWeapons gameplayCtx (update-in unit [:robotState :robotKey] (constantly toKey)))
        weapons (-> (zipmap (map :weaponKey weaponsNext) weaponsNext)
                    (merge (select-keys (zipmap (map :weaponKey weaponsNow) weaponsNow)
                                        (map :weaponKey weaponsNext)))
                    vals
                    ((fn [vs]
                       (into [] vs))))]
    (-> unit
        (update-in [:robotState :robotKey] (constantly toKey))
        (update-in [:robotState :weapons toKey] (constantly weapons)))))


(defn createUnit [{units :units :as gameplayCtx} {:keys [key position playerKey]} {:keys [robotKey]}]
  {:pre [(explainValid? (s/tuple ::type/units keyword? keyword?) [units playerKey robotKey])]}
  (->> (tool.units/add units (let [basic {:key (or key (keyword (gensym "unit")))
                                          :position (or position [0 0])
                                          :playerKey (or playerKey :player)
                                          :robotState {:robotKey robotKey
                                                       :pilotKey :amuro
                                                       :weapons {}
                                                       :components {}
                                                       :tags {}
                                                       :hp 0
                                                       :en 0}}]
                               (update-in basic [:robotState] #(merge % {:hp (getUnitMaxHp gameplayCtx basic)
                                                                         :en (getUnitMaxEn gameplayCtx basic)}))))
       (assoc gameplayCtx :units)))

(defn gameplayOnUnitMove [_ gameplayCtx unit pos]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(explainValid? ::type/unit %)]}
  (let [vel (->> (map - (:position unit) pos)
                 (repeat 2)
                 (apply map *)
                 (apply +))]
    (-> unit
        (merge {:position pos})
        (update-in [:robotState :tags :moveCount] #(if % (inc %) 1))
        (update-in [:robotState :tags] #(conj % [:velocity vel])))))

(defn gameplayOnUnitDone [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/robot) [gameplayCtx unit])]
   :post [(explainValid? ::type/unit %)]}
  (-> unit
      (update-in [:robotState :tags] #(conj % [:done true]))))

(defn gameplayOnUnitTurnStart-xx [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(explainValid? ::type/unit %)]}
  (-> unit
      (update-in [:robotState :tags] identity)))

(defn gameplayOnUnitTurnEnd [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(explainValid? ::type/unit %)]}
  (-> unit
      (update-in [:robotState :tags] #(dissoc % :done :moveCount))))

(defn gameplayOnUnitDead [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post []}
  (a/go gameplayCtx))

(defn gameplayGetUnitMovePathTree [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post []}
  (getUnitMovePathTree gameplayCtx unit))

(defn gameplayGetUnitIsDead [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(boolean? %)]}
  (<= (get-in unit [:robotState :hp]) 0))



(defn getUnitsByRegion [{camera :camera viewsize :viewsize units :units} targetCamera searchSize]
  {:pre [(explainValid? (s/tuple ::spec/camera ::spec/viewsize ::type/units) [camera viewsize units])]
   :post [(explainValid? (s/* ::type/unit) %)]}
  (let [camera (or targetCamera camera)
        [p1 p2] (or searchSize [(map - camera viewsize)
                                (map + camera viewsize)])
        units (tool.units/getByRegion units p1 p2)]
    units))


(defn world2local [camera position]
  (mapv - position camera))

; ===================================================
; 
; 
; 這裡以上的函式不得呼叫getWeaponInfo, getUnitInfo
; 
; 
; ===================================================
; 


; 注意: 這個函式中不能呼叫getUnitInfo, 不然會無限迴圈
(defn getWeaponInfo [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]
   :post [(explainValid? ::type/weapon %)]}
  (common/assertSpec ::type/unit unit)
  (common/assertSpec ::type/weapon weapon)
  (common/assertSpec
   any?
   (let [weaponData (common/assertSpec
                     map?
                     (get-in data [:weapon weaponKey]))]
      ;  原始資料 + 能力修正後的資料 + 武器現在的狀態 = weaponInfo
     (merge weaponData
            {:range (getWeaponRange gameplayCtx unit weapon)
             :type (getWeaponType gameplayCtx unit weapon)
             :suitability (getWeaponSuitability gameplayCtx unit weapon)
             :ability (getWeaponAbility gameplayCtx unit weapon)}
            weapon))))

(defn getUnitInfo [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post []}
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitInfo[" robotKey "] not found")))
      (update-in unit [:robotState] (fn [state]
                                      (merge state
                                             {:weapons (->> (getUnitWeapons gameplayCtx unit)
                                                            second
                                                            (map (partial getWeaponInfo gameplayCtx unit)))
                                              :components (->> (getUnitComponents gameplayCtx unit)
                                                               second)
                                              :maxHp (getUnitMaxHp gameplayCtx unit)
                                              :maxEn (getUnitMaxEn gameplayCtx unit)
                                              :power (getUnitPower gameplayCtx unit)}))))))

(defn mapUnitToLocal [{camera :camera viewsize :viewsize units :units} targetCamera unit]
  {:pre [(explainValid? (s/tuple ::spec/camera ::spec/viewsize ::type/units) [camera viewsize units])]
   :post [(explainValid? (constantly true) %)]}
  (let [camera (or targetCamera camera)]
    (-> unit
        (update :position (partial world2local camera)))))

(defn onEnemyTurnStart [gameplayCtx enemy inputCh outputCh]
  (a/go
    (if (= :player enemy)
      (a/<! (common/playerTurnStart nil nil inputCh outputCh))
      (a/<! (common/enemyTurnStart nil enemy inputCh outputCh)))
    (common/assertSpec
     ::type/gameplayCtx
     (let [unitList (common/assertSpec
                     (s/coll-of ::type/unit)
                     (->> (tool.units/getAll (:units gameplayCtx))
                          (filter #(= enemy (:playerKey %)))))
           nextUnitList (common/assertSpec
                         (s/coll-of ::type/unit)
                         (a/<! (a/go-loop [[unit & rest] unitList
                                           after []]
                                 (if unit
                                   (let [nextUnit unit
                                         ; award
                                         award? (common/assertSpec
                                                 boolean?
                                                 (-> (getTerrainKey gameplayCtx (:position unit))
                                                     (= :award)))
                                         nextUnit (common/assertSpec
                                                   ::type/unit
                                                   (if award?
                                                     (let [maxHp (getUnitMaxHp gameplayCtx unit)
                                                           maxEn (getUnitMaxEn gameplayCtx unit)
                                                           nextUnit (-> nextUnit
                                                                        (update-in [:robotState :hp] #(min (+ % (* maxHp 0.2)) maxHp))
                                                                        (update-in [:robotState :en] #(min (+ % (* maxEn 0.2)) maxEn)))]
                                                       (a/<! (common/unitGetAwardAnim nil (map #(->> (getUnitInfo gameplayCtx %)
                                                                                                     (mapUnitToLocal gameplayCtx nil)) [unit nextUnit]) inputCh outputCh))
                                                       nextUnit)
                                                     nextUnit))
                                         ; remove velocity
                                         nextUnit (update-in nextUnit [:robotState :tags] #(dissoc % :velocity))]
                                     (recur rest (conj after nextUnit)))
                                   after))))
           gameplayCtx (common/assertSpec
                        ::type/gameplayCtx
                        (->> (zipmap unitList nextUnitList)
                             (reduce (fn [gameplayCtx [old next]]
                                       (updateUnit gameplayCtx old (constantly next)))
                                     gameplayCtx)))]
       gameplayCtx))))

(defn onEnemyTurnEnd [gameplayCtx enemy inputCh outputCh]
  (a/go
    (common/assertSpec
     ::type/gameplayCtx
     (let [unitList (common/assertSpec
                     (s/coll-of ::type/unit)
                     (->> (tool.units/getAll (:units gameplayCtx))
                          (filter #(= enemy (:playerKey %)))))
           nextUnitList (common/assertSpec
                         (s/coll-of ::type/unit)
                         (a/<! (a/go-loop [[unit & rest] unitList
                                           after []]
                                 (if unit
                                   (let [nextUnit unit
                                         nextUnit (gameplayOnUnitTurnEnd nil gameplayCtx nextUnit)]
                                     (recur rest (conj after nextUnit)))
                                   after))))
           gameplayCtx (common/assertSpec
                        ::type/gameplayCtx
                        (->> (zipmap unitList nextUnitList)
                             (reduce (fn [gameplayCtx [old next]]
                                       (updateUnit gameplayCtx old (constantly next)))
                                     gameplayCtx)))]
       gameplayCtx))))

(defn onPlayerTurnStart [gameplayCtx inputCh outputCh]
  (onEnemyTurnStart gameplayCtx :player inputCh outputCh))

(defn onPlayerTurnEnd [gameplayCtx inputCh outputCh]
  (onEnemyTurnEnd gameplayCtx :player inputCh outputCh))

(defn handleTest [gameplayCtx [cmd args]]
  (cond
    (= :test cmd)
    (let [f args]
      (f gameplayCtx))

    :else
    gameplayCtx))


(defn render [gameplayCtx]
  {:post [(common/explainValid? ::viewModelSpec/viewModel %)]}
  {:map (when (s/valid? ::spec/mapView gameplayCtx)
          (let [{:keys [camera map viewsize]} gameplayCtx]
            (tool.map/subMap camera viewsize map)))
   :cursor (when (s/valid? ::spec/cursorView gameplayCtx)
             (let [{:keys [camera cursor]} gameplayCtx]
               (world2local camera cursor)))
   :moveRange (when (s/valid? ::spec/moveRangeView gameplayCtx)
                (let [{:keys [camera moveRange]} gameplayCtx]
                  (map #(world2local camera %) moveRange)))
   :units (when (s/valid? ::spec/unitsView gameplayCtx)
            (let [{:keys [camera]} gameplayCtx]
              (->> (getUnitsByRegion gameplayCtx nil nil)
                   (map #(->> (getUnitInfo gameplayCtx %)
                              (mapUnitToLocal gameplayCtx camera))))))
   :attackRange (when (s/valid? ::spec/attackRangeView gameplayCtx)
                  (let [{:keys [camera attackRange]} gameplayCtx]
                    (map #(world2local camera %) attackRange)))
   :checkHitRate (when (s/valid? ::spec/checkHitRateView gameplayCtx)
                   (let [{:keys [camera checkHitRate]} gameplayCtx]
                     (->> checkHitRate
                          (map (fn [info]
                                 (-> info
                                     (update :unit #(->> (getUnitInfo gameplayCtx %)
                                                         (mapUnitToLocal gameplayCtx camera)))
                                     (update :targetUnit #(->> (getUnitInfo gameplayCtx %)
                                                               (mapUnitToLocal gameplayCtx camera)))))))))
   :cellState (when (s/valid? ::spec/cellStateView gameplayCtx)
                (let [{:keys [units cursor]} gameplayCtx
                      unitAtCursor (-> units
                                       (tool.units/getByPosition cursor))
                      terrain (getTerrain gameplayCtx cursor)]
                  {:unit (when unitAtCursor
                           (->> (getUnitInfo gameplayCtx unitAtCursor)
                                (mapUnitToLocal gameplayCtx nil)))
                   :terrain terrain}))
   :systemMenu (when (s/valid? ::spec/systemMenuView gameplayCtx)
                 (let [{:keys [data menuCursor]} (-> gameplayCtx :fsm tool.fsm/load)]
                   {:menuCursor menuCursor
                    :data data}))
   :unitMenu (when (s/valid? ::spec/unitMenuView gameplayCtx)
               (let [{:keys [unit data menuCursor]} (-> gameplayCtx :fsm tool.fsm/load)]
                 {:menuCursor menuCursor
                  :data (update data :weapons (fn [weapons]
                                                (map (partial getWeaponInfo gameplayCtx unit) weapons)))}))
   :battleMenu (when (s/valid? ::spec/battleMenuView gameplayCtx)
                 (let [stateDetail (-> gameplayCtx :fsm tool.fsm/load)
                       {battleMenuSession :battleMenuSession} stateDetail]
                   {:preview (battleMenu/mapUnits battleMenuSession #(->> (getUnitInfo gameplayCtx %)
                                                                          (mapUnitToLocal gameplayCtx nil)))}))
   :startUnitsMenu (when (s/valid? ::spec/startUnitsMenuView gameplayCtx)
                     (let [stateDetail (-> gameplayCtx :fsm tool.fsm/load)
                           {:keys [units selectedUnits cursor]} stateDetail]
                       {:data (map (fn [idx [key robotKey]]
                                     {:key key
                                      :robotState {:robotKey robotKey}
                                      :selected (if (selectedUnits key) true false)
                                      :focus (= cursor idx)})
                                   (range)
                                   units)}))})