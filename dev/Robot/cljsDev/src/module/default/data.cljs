(ns module.default.data
  (:require [clojure.spec.alpha :as s])
  (:require ["./data.js" :as dataJson])
  (:require [app.gameplay.model])
  (:require-macros [module.default.core :as mm]))

(defn explainValid? [sp args]
  (if (clojure.spec.alpha/valid? sp args)
    true
    (do (println (clojure.spec.alpha/explain-str sp args))
        (println args)
        false)))

(s/def ::state (s/keys :req-un [::robot ::pilot ::weapons ::components ::tags]))
(s/def ::unit (s/keys :req-un [::player ::type ::position ::state]))
(s/def ::weapon (s/keys :req-un [::key ::weaponKey ::level ::tags ::bulletCount]))
(s/def ::weaponSlot (s/tuple keyword? (s/* ::weapon)))

(def data (js->clj dataJson :keywordize-keys true))
(defn getWeaponData [weaponKey]
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponData[" weaponKey "] not found")))
      weaponData)))

; =======================
; map
; =======================


(defn getTerrainKey [gameplayCtx from]
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        t1 (get-in data [:terrainMapping
                         (str (get-in playmap (reverse from)))
                         :terrain])]
    t1))

(defn getTerrain [gameplayCtx from]
  (-> (getTerrainKey gameplayCtx from)
      ((fn [key]
         (get-in data [:terrain key])))))


(defn moveCost [gameplayCtx unit from to]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]
   :post []}
  (let [isSky (-> (get-in unit [:state :tags])
                  (contains? :sky))]
    (if isSky
      1
      (let [playmap (app.gameplay.model/getMap gameplayCtx)
            t1 (get-in data [:terrainMapping
                             (str (get-in playmap (reverse from)))
                             :terrain])
            t2 (get-in data [:terrainMapping
                             (str (get-in playmap (reverse to)))
                             :terrain])]
        (+ (get-in data [:terrain t1 "cost"])
           (get-in data [:terrain t2 "cost"]))))))

(def moveCostM (memoize moveCost))


(defn nextCell [[mw mh] [x y]]
  [[x (min mh (inc y))]
   [x (max 0 (dec y))]
   [(min mw (inc x)) y]
   [(max 0 (dec x)) y]])

(def nextCellM (memoize nextCell))


(defn estimateCost [from to]
  (->> (map - from to)
       (repeat 2)
       (apply map *)
       (apply +)))

; =======================
; pilot
; =======================
(defn getPilotInfo [gameplayCtx unit pilot]
  {:pre [(explainValid? (s/tuple ::unit keyword?) [unit pilot])]}
  (let [data (get-in data [:pilot pilot])]
    (if (nil? data)
      (throw (js/Error. (str "getPilotInfo[" pilot "] not found")))
      data)))

; =======================
; weapon
; =======================
(defn getWeaponRange [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::unit ::weapon) [unit weapon])]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponRange[" weaponKey "] not found")))
      (let [{[min max] :range type :type} weaponData]
        [min max]))))

(defn getWeaponType [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::unit ::weapon) [unit weapon])]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (let [{type :type} weaponData]
        type))))

(defn getWeaponSuitability [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::unit ::weapon) [unit weapon])]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (get-in weaponData [:suitability]))))

(defn getWeaponInfo [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::unit ::weapon) [unit weapon])]}
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
(mm/defUnitSetter hp)
(mm/defUnitGetter hp)
(defn getUnitMaxHp [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  10000)
(def getUnitMaxHpM (memoize getUnitMaxHp))

; en
(mm/defUnitSetter en)
(mm/defUnitGetter en)
(defn getUnitMaxEn [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitMaxEn[" robotKey "] not found")))
      (let [en (->> (get robot :components)
                    (filter (fn [k]
                              (some #(= % k) ["energy1" "energy2" "energy3"])))
                    (map (fn [k] (get-in data [:component k :value 0])))
                    (map int)
                    (apply +))]
        en))))

(def getUnitMaxEnM (memoize getUnitMaxEn))


(defn getUnitArmor [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  (let [robotKey (get-in unit [:state :robot])
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
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  (let [transform (get-in unit [:state :robot])
        coms (get-in unit [:state :components transform])]
    (if coms
      [transform coms]
      [transform
       (let [robotKey (get-in unit [:state :robot])
             robot (get-in data [:robot robotKey])]
         (if (nil? robot)
           (throw (js/Error. (str "getUnitComponents[" robotKey "] not found")))
           (mapv (fn [key]
                   (let [com (get-in data [:component (keyword key)])]
                     (if (nil? com)
                       (throw (js/Error. (str "getUnitComponents[" key "] not found")))
                       {:key (keyword key)
                        :componentKey (keyword key)})))
                 (get robot :components))))])))

(def getUnitComponentsM (memoize getUnitComponents))

; weapons
(defn getUnitWeapons [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]
   :post [(explainValid? ::weaponSlot %)]}
  (let [transform (get-in unit [:state :robot])
        weapons (get-in unit [:state :weapons transform])]
    (if weapons
      [transform weapons]
      [transform
       (let [robotKey (get-in unit [:state :robot])
             robot (get-in data [:robot robotKey])]
         (if (nil? robot)
           (throw (js/Error. (str "getUnitWeapons[" robotKey "]not found")))
           (mapv (fn [weaponKey]
                   (let [weapon (get-in data [:weapon (keyword weaponKey)])]
                     (if (nil? weapon)
                       (throw (js/Error. (str "getUnitWeapons[" weaponKey "] not found")))
                       {:key (keyword weaponKey) ; 在這個不能使用gensym, 因為這個方法是getter
                        :weaponKey (keyword weaponKey)
                        :level 0
                        :tags #{}
                        :bulletCount (get weapon :maxBulletCount)})))
                 (get robot :weapons))))])))

(def getUnitWeaponsM (memoize getUnitWeapons))

(defn setUnitWeapons [unit weapons]
  {:pre [(explainValid? (s/tuple ::unit ::weaponSlot) [unit weapons])]
   :post [(explainValid? ::unit %)]}
  (update-in unit [:state :weapons] (fn [origin]
                                      (conj origin weapons))))


(defn getUnitWeaponRange [gameplayCtx unit weapon]
  {:pre [(explainValid? (s/tuple ::unit ::weapon) [unit weapon])]}
  (let [[min max] (getWeaponRange gameplayCtx unit weapon)]
    (->> (tool.map/simpleFindPath [0 0] (dec min))
         (into #{})
         (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                      (into #{})))
         (map (partial map + (:position unit))))))

;power
(defn getUnitPower [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]
   :post [(explainValid? number? %)]}
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (let [power (->> (concat (map (fn [k]
                                      (get-in data [:component k "powerCost"]))
                                    (get robot :components))
                               (map (fn [k]
                                      (get-in data [:weapon k "powerCost"]))
                                    (get robot :weapons)))
                       (apply - (get robot "power")))]
        power))))

(def getUnitPowerM (memoize getUnitPower))

(defn getUnitSuitability [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (get robot :suitability))))

(defn getUnitHitRate [gameplayCtx unit weapon targetUnit]
  {:pre [(explainValid? (s/tuple ::unit ::weapon ::unit) [unit weapon targetUnit])]
   :post [(explainValid? number? %)]}
  (let [weaponInfo (getWeaponInfo gameplayCtx unit weapon)
        pilot (getPilotInfo gameplayCtx unit (get-in unit [:state :pilot]))
        targetPilot (getPilotInfo gameplayCtx targetUnit (get-in targetUnit [:state :pilot]))
        terrain (-> (app.gameplay.model/getMap gameplayCtx)
                    (get-in (reverse (:position targetUnit)))
                    ((fn [cellId]
                       (get-in data [:terrainMapping (str cellId) :terrain])))
                    ((fn [terrainKey]
                       (get-in data [:terrain terrainKey]))))
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
        factor6 (let [vel (or 0 (get-in targetUnit [:state :tags :velocity]))]
                  (if (= vel 0)
                    1
                    (-> 0.5
                        (* vel)
                        (/ 20)
                        ((fn [v]
                           (- 1 v))))))]
    (* basic factor1 factor2 factor3 factor4 factor5 factor6)))

(defn getUnitMakeDamage [gameplayCtx unit weapon targetUnit]
  {:pre [(explainValid? (s/tuple ::unit ::weapon ::unit) [unit weapon targetUnit])]
   :post [(explainValid? number? %)]}
  (let [weaponInfo (getWeaponInfo gameplayCtx unit weapon)
        terrain (-> (app.gameplay.model/getMap gameplayCtx)
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
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitTransforms[" robotKey "] not found")))
      (conj (get-in robot [:transform])
            robotKey))))

(defn getUnitInfo [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data [:robot robotKey])]
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

(defn useUnitWeapon [gameplayCtx weapon unit]
  {:pre [(explainValid? (s/tuple ::weapon ::unit) [weapon unit])]
   :post [(explainValid? ::unit %)]}
  (let [weaponInfo (getWeaponInfo gameplayCtx unit weapon)]
    (cond
      (= (get weaponInfo :energyType) :energy)
      (let [energyCost (get weaponInfo :energyCost)
            unitAfter (-> (getUnitEn unit)
                          (- energyCost)
                          (max 0)
                          ((fn [en]
                             (setUnitEn unit en))))]
        unitAfter)
      
      (= (get weaponInfo :energyType) :bullet)
      (let [weapons (getUnitWeaponsM gameplayCtx unit)
            weaponAfter (update-in weapon [:bulletCount] (comp (partial max 0) dec))
            weaponsAfter (update-in weapons [1] (fn [vs]
                                                  (replace {weapon weaponAfter} vs)))
            unitAfter (setUnitWeapons unit weaponsAfter)]
        unitAfter)
      
      :else
      unit)))


(defn isBelongToPlayer [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]
   :post [(explainValid? boolean? %)]}
  (= (:player unit) :player))

(defn isFriendlyUnit [gameplayCtx unit targetUnit]
  {:pre [(explainValid? (s/tuple ::unit ::unit) [unit targetUnit])]
   :post [(explainValid? boolean? %)]}
  (if (= unit targetUnit)
    true
    (->> [unit targetUnit]
         (map :player)
         (map (fn [player]
                (get-in gameplayCtx [:players player :faction])))
         (apply =))))

(defn getMenuData [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  (if (not (isBelongToPlayer gameplayCtx unit))
    [[["cancel"]] {}]
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
      [menu data])))

(defn thinkReaction [gameplayCtx unit fromUnit weapon]
  {:pre [(explainValid? (s/tuple ::unit ::unit ::weapon) [unit fromUnit weapon])]}
  (let [hitRate (getUnitHitRate gameplayCtx fromUnit weapon unit)
        weapon (->> (getUnitWeaponsM gameplayCtx unit)
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
  {:pre [(explainValid? (s/tuple ::unit ::unit) [left right])]}
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

               (<= (- (getUnitHp right) leftMakeDamage) 0)
               (conj :dead))
     :damage leftMakeDamage}))

(defn calcActionResult [gameplayCtx left leftAction right rightAction]
  {:pre [(explainValid? (s/tuple ::unit ::unit) [left right])]}
  (-> [{:events #{} :damage 0} (getReactionResult gameplayCtx left leftAction right rightAction)]
      ((fn [[_ firstResult :as ctx]]
         (if (contains? (:events firstResult) :dead)
           ctx
           (if (not= (first rightAction) :attack)
             ctx
             (update ctx 0 (constantly (getReactionResult gameplayCtx right rightAction left leftAction)))))))))

(defn applyActionResult [gameplayCtx left leftAction right rightAction result]
  {:pre [(explainValid? (s/tuple ::unit ::unit) [left right])]}
  (let [[{leftDamage :damage} {rightDamage :damage}] result
        [leftAfter rightAfter] (map (fn [unit damage]
                                      (-> (getUnitHp unit)
                                          (- damage)
                                          (max 0)
                                          ((fn [hp]
                                             (setUnitHp unit hp)))))
                                    [left right]
                                    [leftDamage rightDamage])

        [leftAfter rightAfter] (map (fn [unit [actionType weapon]]
                                      (if (= actionType :attack)
                                        (useUnitWeapon gameplayCtx weapon unit)
                                        unit))
                                    [leftAfter rightAfter]
                                    [leftAction rightAction])
        gameplayCtx (-> gameplayCtx
                        (app.gameplay.model/updateUnit left (constantly leftAfter))
                        (app.gameplay.model/updateUnit right (constantly rightAfter)))]
    gameplayCtx))

(defn formatPathTree [power paths]
  (let [shouldRemove (filter (fn [[k v]]
                               (> (:cost v) power))
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

(defn getUnitMovePathTreeTo [gameplayCtx unit pos]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        power (/ (getUnitPowerM gameplayCtx unit) 5)
        [mw mh] (tool.map/getMapSize playmap)]
    (->> (tool.map/findPath (:position unit)
                            (fn [{:keys [cost]} curr]
                              [(or (= curr pos) (>= cost power)) false])
                            (partial nextCellM [mw mh])
                            (partial moveCostM gameplayCtx unit)
                            (fn [from]
                              (if pos
                                (estimateCost from pos)
                                0)))
         ((fn [paths]
            (formatPathTree power paths))))))

(defn getUnitMovePathTree [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::unit) [unit])]}
  (getUnitMovePathTreeTo gameplayCtx unit nil))
