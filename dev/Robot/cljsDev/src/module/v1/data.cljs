(ns module.v1.data
  (:require ["./data.js" :as dataJson])
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require [module.v1.type :as type])
  (:require [tool.units])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.menuCursor])
  (:require [module.v1.common :as common :refer [explainValid?]])
  (:require [clojure.set]))

(def data (js->clj dataJson :keywordize-keys true))
; =======================
; map
; =======================


(defn getTerrainKey [{playmap :map} from]
  {:pre [(explainValid? (s/tuple ::type/map) [playmap])]
   :post []}
  (let [t1 (get-in data [:terrainMapping
                         (str (get-in playmap (reverse from)))
                         :terrain])]
    t1))

(defn getTerrain [{playmap :map} from]
  {:pre [(explainValid? (s/tuple ::type/map) [playmap])]
   :post []}
  (-> (getTerrainKey {:map playmap} from)
      ((fn [key]
         (get-in data [:terrain key])))))


(defn moveCost [{playmap :map} unit from to]
  {:pre [(explainValid? (s/tuple ::type/map ::type/unit) [playmap unit])]
   :post [(number? %)]}
  (let [isSky (-> (get-in unit [:robotState :tags])
                  (contains? :sky))]
    (if isSky
      1
      (let [t1 (get-in data [:terrainMapping
                             ((comp keyword str) (get-in playmap (reverse from)))
                             :terrain])
            t2 (get-in data [:terrainMapping
                             ((comp keyword str) (get-in playmap (reverse to)))
                             :terrain])]
        (+ (get-in data [:terrain (keyword t1) :cost])
           (get-in data [:terrain (keyword t2) :cost]))))))


(defn nextCell [{units :units players :players} unit [mw mh] [x y]]
  {:pre [(explainValid? (s/tuple ::type/units ::type/players ::type/unit) [units players unit])]}
  (let [possiblePosition [[x (min mh (inc y))]
                          [x (max 0 (dec y))]
                          [(min mw (inc x)) y]
                          [(max 0 (dec x)) y]]
        unitsInPosition (map #(tool.units/getByPosition units %) possiblePosition)]
    (->> (zipmap possiblePosition unitsInPosition)
         (filter (fn [[_ occupyUnit]]
                   (or (nil? occupyUnit)
                       (= (get-in players [(-> unit :player) :faction])
                          (get-in players [(-> occupyUnit :player) :faction])))))
         (map first))))

(defn estimateCost [from to]
  (->> (map - from to)
       (repeat 2)
       (apply map *)
       (apply +)))

; =======================
; pilot
; =======================
(defn getPilotInfo [_ unit pilot]
  {:pre [(explainValid? (s/tuple ::type/unit keyword?) [unit pilot])]}
  (let [data (get-in data [:pilot pilot])]
    (if (nil? data)
      (throw (js/Error. (str "getPilotInfo[" pilot "] not found")))
      data)))

; =======================
; weapon
; =======================
(defn getWeaponRange [_ unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]
   :post [(explainValid? (s/tuple number? number?) %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponRange[" weaponKey "] not found")))
      (let [{[min max] :range _ :type} weaponData]
        [min max]))))

(defn getWeaponType [_ unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]
   :post [(explainValid? string? %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (let [{type :type} weaponData]
        type))))

(defn getWeaponSuitability [_ unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]
   :post [(explainValid? (s/tuple number? number? number? number?) %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (get-in weaponData [:suitability]))))

(defn getWeaponInfo [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])]
   :post [(explainValid? ::type/weapon %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (do
        (print "=============")
        (print weapon)
        (throw (js/Error. (str "getWeaponInfo[" weaponKey "] not found"))))
      (merge weaponData
             {:range (getWeaponRange gameplayCtx unit weapon)
              :type (getWeaponType gameplayCtx unit weapon)
              :suitability (getWeaponSuitability gameplayCtx unit weapon)}
             weapon))))

; =======================
; unit
; =======================

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
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit ::type/weapon) [gameplayCtx unit weapon])]
   :post []}
  (let [[min max] (getWeaponRange gameplayCtx unit weapon)]
    (->> (tool.map/simpleFindPath [0 0] (dec min))
         (into #{})
         (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                      (into #{})))
         (map (partial map + (:position unit))))))

;power
(defn getUnitPower [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(number? %)]}
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (let [power (->> (concat (map (fn [k]
                                      (get-in data [:component k :powerCost]))
                                    (get robot :components))
                               (map (fn [k]
                                      (get-in data [:weapon k :powerCost]))
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
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/map ::type/unit ::type/weapon ::type/unit) [gameplayCtx playmap unit weapon targetUnit])]
   :post [(explainValid? number? %)]}
  (let [weaponInfo (getWeaponInfo gameplayCtx unit weapon)
        pilot (getPilotInfo gameplayCtx unit (get-in unit [:robotState :pilotKey]))
        targetPilot (getPilotInfo gameplayCtx targetUnit (get-in targetUnit [:robotState :pilotKey]))
        terrain (-> playmap
                    (get-in (reverse (:position targetUnit)))
                    ((fn [cellId]
                       (get-in data [:terrainMapping ((comp keyword str) cellId) :terrain])))
                    ((fn [terrainKey]
                       (get-in data [:terrain (keyword terrainKey)]))))
        weaponSuitability (get weaponInfo :suitability)

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
        factor1 (let [isMelee (some #(= (keyword %) :melee) (get weaponInfo :ability))]
                  (if isMelee
                    (/ (get pilot :melee) (get targetPilot :melee))
                    (/ (get pilot :range) (get targetPilot :range))))

        ; 命中回避係數
        factor2 (/ (get pilot :dex) (get targetPilot :agi))

        ; 地型適性係數
        factor3 (get weaponSuitability 0)

        ; 武器命中補正係數
        factor4 (get weaponInfo :accuracy)

        ; 地型補正係數
        factor5 (get terrain :hitRate)

        ; 對方速度
        factor6 (let [vel (or 0 (get-in targetUnit [:robotState :tags :velocity]))]
                  (if (= vel 0)
                    1
                    (-> 0.5
                        (* vel)
                        (/ 20)
                        ((fn [v]
                           (- 1 v))))))]
    (* basic factor1 factor2 factor3 factor4 factor5 factor6)))

(defn getUnitMakeDamage [{playmap :map :as gameplayCtx} unit weapon targetUnit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/map ::type/unit ::type/weapon ::type/unit) [gameplayCtx playmap unit weapon targetUnit])]
   :post [(explainValid? number? %)]}
  (let [weaponInfo (getWeaponInfo gameplayCtx unit weapon)
        terrain (-> playmap
                    (get-in (reverse (:position targetUnit)))
                    ((fn [cellId]
                       (get-in data [:terrainMapping (str cellId) :terrain])))
                    ((fn [terrainKey]
                       (get-in data [:terrain terrainKey]))))
        weaponSuitability (getWeaponSuitability gameplayCtx unit weapon)
        targetArmor (getUnitArmor gameplayCtx targetUnit)
        damage (get weaponInfo :damage)]
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

(defn useUnitWeapon [gameplayCtx weapon unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/weapon ::type/unit) [gameplayCtx weapon unit])]
   :post [(explainValid? ::type/unit %)]}
  (let [weaponInfo (getWeaponInfo gameplayCtx unit weapon)
        energyType (-> weaponInfo :energyType keyword)]
    (cond
      (= energyType :energy)
      (let [energyCost (get weaponInfo :energyCost)
            unitAfter (-> (:en unit)
                          (- energyCost)
                          (max 0)
                          ((fn [en]
                             (assoc unit :en en))))]
        unitAfter)

      (= energyType :bullet)
      (let [weapons (getUnitWeapons gameplayCtx unit)
            _ (explainValid? ::type/weaponEntry weapons)
            weaponAfter (update-in weapon [:bulletCount] (comp (partial max 0) dec))
            weaponsAfter (update-in weapons [1] (fn [vs]
                                                  (replace {weapon weaponAfter} vs)))
            unitAfter (setUnitWeapons unit weaponsAfter)]
        unitAfter)

      :else
      (throw (js/Error. (str "unknown energyType " weaponInfo))))))


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

(defn getMenuData [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]
   :post [(explainValid? ::menuData %)]}
  (if (not (isBelongToPlayer gameplayCtx unit))
    [[["cancel"]] {}]
    (let [isBattleMenu (-> (module.default.data/getFsm gameplayCtx)
                           (tool.fsm/currState)
                           (= :unitBattleMenu))
          weapons (->> (getUnitWeapons gameplayCtx unit)
                       second)
          weaponKeys (->> (range (count weapons))
                          (into []))
          [menu data] (if isBattleMenu
                        [[weaponKeys ["cancel"]]
                         {:weaponIdx 0
                          :weapons weapons
                          :unit unit}]
                        (cond
                          (-> (get-in unit [:robotState :tags])
                              (contains? :done))
                          [[["cancel"]] {}]

                          (-> (get-in unit [:robotState :tags])
                              (contains? :move))
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
      [menu data])))

(defn thinkReaction [gameplayCtx unit fromUnit weapon]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit ::type/unit ::type/weapon) [gameplayCtx unit fromUnit weapon])]
   :post [(vector? %)]}
  (let [hitRate (getUnitHitRate gameplayCtx fromUnit weapon unit)
        weapon (->> (getUnitWeapons gameplayCtx unit)
                    second
                    reverse
                    (drop-while (fn [weapon]
                                  (->> (getUnitWeaponRange gameplayCtx unit weapon)
                                       ; 注意: (0 0) != [0 0]
                                       (some #(= (into [] %) (:position fromUnit)))
                                       not)))
                    first)]
    (if weapon
      [:attack weapon]
      [:evade])))


(defn getReactionResult [gameplayCtx left [leftActionType leftWeapon :as leftAction] right [rightActionType rightWeapon :as rightAction]]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit ::type/unit) [gameplayCtx left right])]}
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

               (<= (- (:hp right) leftMakeDamage) 0)
               (conj :dead))
     :damage leftMakeDamage}))

(defn calcActionResult [gameplayCtx left leftAction right rightAction]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit ::type/unit) [gameplayCtx left right])]}
  (-> [{:events #{} :damage 0} (getReactionResult gameplayCtx left leftAction right rightAction)]
      ((fn [[_ firstResult :as ctx]]
         (if (contains? (:events firstResult) :dead)
           ctx
           (if (not= (first rightAction) :attack)
             ctx
             (update ctx 0 (constantly (getReactionResult gameplayCtx right rightAction left leftAction)))))))))

(defn applyActionResult [gameplayCtx left leftAction right rightAction result]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit ::type/unit) [gameplayCtx left right])]}
  (let [[{leftDamage :damage} {rightDamage :damage}] result
        [leftAfter rightAfter] (map (fn [unit damage]
                                      (-> (:hp unit)
                                          (- damage)
                                          (max 0)
                                          ((fn [hp]
                                             (assoc unit :hp hp)))))
                                    [left right]
                                    [leftDamage rightDamage])

        [leftAfter rightAfter] (map (fn [unit [actionType weapon]]
                                      (if (= actionType :attack)
                                        (useUnitWeapon gameplayCtx weapon unit)
                                        unit))
                                    [leftAfter rightAfter]
                                    [leftAction rightAction])
        gameplayCtx (-> gameplayCtx
                        (module.default.data/updateUnit left (constantly leftAfter))
                        (module.default.data/updateUnit right (constantly rightAfter)))]
    gameplayCtx))

(defn formatPathTree [gameplayCtx unit power paths]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit int?) [gameplayCtx unit power])]}
  (let [shouldRemove (filter (fn [[pos info]]
                               (> (:cost info) power))
                             paths)]
    (reduce (fn [paths [curr info]]
              (let [parent (:prev info)]
                (cond-> paths
                  parent
                  (update parent (fn [n]
                                   (merge n (select-keys info [:tail :priority]))))

                  true
                  (dissoc curr))))
            paths
            shouldRemove)))

(defn getUnitMovePathTreeTo [{playmap :map :as gameplayCtx} unit pos]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/map ::type/unit) [gameplayCtx playmap unit])]}
  (let [power (/ (getUnitPower gameplayCtx unit) 5)
        [mw mh] (tool.map/getMapSize playmap)]
    (->> (tool.map/findPath (:position unit)
                            (fn [{:keys [cost]} curr]
                              [(or (= curr pos) (>= cost power)) false])
                            (partial nextCell gameplayCtx unit [mw mh])
                            (partial moveCost gameplayCtx unit)
                            (fn [from]
                              (if pos
                                (estimateCost from pos)
                                0)))
         ((fn [paths]
            (formatPathTree gameplayCtx unit power paths))))))

(defn getUnitMovePathTree [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit) [gameplayCtx unit])]}
  (getUnitMovePathTreeTo gameplayCtx unit nil))



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


(defn getUnitsByRegion [{camera :camera viewsize :viewsize units :units} targetCamera searchSize]
  {:pre [(explainValid? (s/tuple ::type/camera ::type/viewsize ::type/units) [camera viewsize units])]
   :post [(explainValid? (s/* ::type/unit) %)]}
  (let [camera (or targetCamera camera)
        [p1 p2] (or searchSize [(map - camera viewsize)
                                (map + camera viewsize)])
        units (tool.units/getByRegion units p1 p2)]
    units))

(defn gameplayOnUnitDone [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/robot) [gameplayCtx unit])]
   :post [(explainValid? ::type/unit %)]}
  (-> unit
      (update-in [:robotState :tags] #(conj % [:done true]))))

(defn world2local [camera position]
  (mapv - position camera))


(defn mapUnitToLocal [{camera :camera viewsize :viewsize units :units :as gameplayCtx} targetCamera unit]
  {:pre [(explainValid? (s/tuple ::type/camera ::type/viewsize ::type/units) [camera viewsize units])]
   :post [(explainValid? (constantly true) %)]}
  (let [camera (or targetCamera camera)]
    (-> unit
        (update :position (partial world2local camera))
        ((fn [unit]
           (getUnitInfo gameplayCtx unit))))))


(defn handleMapView [gameplayCtx [cmd args]]
  (common/assertSpec ::type/mapView gameplayCtx)
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:rup :rdown :rleft :rright])
        (update-in gameplayCtx [:camera] #(mapv + % (action {:rup [0 -1]
                                                             :rdown [0 1]
                                                             :rleft [-1 0]
                                                             :rright [1 0]})))
        :else
        gameplayCtx))

    :else
    gameplayCtx))

(defn handleCursorView [gameplayCtx [cmd args]]
  (common/assertSpec ::type/cursorView gameplayCtx)
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down :left :right])
        (update-in gameplayCtx [:cursor] #(mapv + % (action {:up [0 -1]
                                                             :down [0 1]
                                                             :left [-1 0]
                                                             :right [1 0]})))
        :else
        gameplayCtx))

    :else
    gameplayCtx))


(defn handleMoveRangeView [gameplayCtx [cmd args]]
  (common/assertSpec ::type/moveRangeView gameplayCtx)
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down :left :right])
        (let [{:keys [cursor units]} gameplayCtx
              unitAtCursor (tool.units/getByPosition units cursor)
              moveRange (if unitAtCursor
                          (let [shortestPathTree (getUnitMovePathTree gameplayCtx unitAtCursor)
                                moveRange (map first shortestPathTree)]
                            moveRange)
                          [])]
          (update-in gameplayCtx [:moveRange] (constantly moveRange)))

        :else
        gameplayCtx))

    :else
    gameplayCtx))


(defn handleMenuCursor [gameplayCtx [cmd args]]
  (common/assertSpec (s/keys :req-un [::type/fsm]) gameplayCtx)
  (common/assertSpec (s/keys :req-un [::menuCursor]) (-> gameplayCtx :fsm (tool.fsm/load)))
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down])
        (let [{:keys [fsm]} gameplayCtx
              state (tool.fsm/load fsm)
              state (update state :menuCursor (fn [ctx]
                                                (tool.menuCursor/mapCursor1 ctx (action {:up dec :down inc}))))
              fsm (tool.fsm/save fsm state)
              gameplayCtx (assoc gameplayCtx :fsm fsm)]
          gameplayCtx)

        (some #(= % action) [:left :right])
        (let [{:keys [fsm]} gameplayCtx
              state (tool.fsm/load fsm)
              state (update state :menuCursor (fn [ctx]
                                                (tool.menuCursor/mapCursor2 ctx nil (action {:left dec :right inc}))))
              fsm (tool.fsm/save fsm state)
              gameplayCtx (assoc gameplayCtx :fsm fsm)]
          gameplayCtx)

        :else
        gameplayCtx))
    :else
    gameplayCtx))


(defn render [gameplayCtx]
  {:map (when (s/valid? ::type/mapView gameplayCtx)
          (let [{:keys [camera map viewsize]} gameplayCtx]
            (tool.map/subMap camera viewsize map)))
   :cursor (when (s/valid? ::type/cursorView gameplayCtx)
             (let [{:keys [camera cursor]} gameplayCtx]
               (world2local camera cursor)))
   :moveRange (when (s/valid? ::type/moveRangeView gameplayCtx)
                (let [{:keys [camera moveRange]} gameplayCtx]
                  (map #(world2local camera %) moveRange)))
   :units (when (s/valid? ::type/unitsView gameplayCtx)
            (let [{:keys [camera]} gameplayCtx]
              (->> (getUnitsByRegion gameplayCtx nil nil)
                   (map (fn [unit]
                          (mapUnitToLocal gameplayCtx camera unit))))))
   :systemMenu (when (s/valid? (s/keys :req-un [::type/fsm]) gameplayCtx)
                 (let [state (-> gameplayCtx :fsm tool.fsm/currState)
                       stateDetail (-> gameplayCtx :fsm tool.fsm/load)]
                   (when (some #(= % state) [:menu])
                     (select-keys stateDetail [:menuCursor :data]))))
   :attackRange (when (s/valid? ::type/attackRangeView gameplayCtx)
                  (let [{:keys [camera attackRange]} gameplayCtx]
                    (map #(world2local camera %) attackRange)))
   :unitMenu (when (s/valid? (s/keys :req-un [::type/fsm]) gameplayCtx)
               (let [state (-> gameplayCtx :fsm tool.fsm/currState)
                     stateDetail (-> gameplayCtx :fsm tool.fsm/load)]
                 (when (some #(= % state) [:unitMenu :unitBattleMenu])
                   (let [{:keys [unit data menuCursor]} stateDetail]
                     {:menuCursor menuCursor
                      :data (update data :weapons (fn [weapons]
                                                    (map (partial getWeaponInfo gameplayCtx unit) weapons)))}))))})