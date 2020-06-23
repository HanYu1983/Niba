(ns module.default.data
  (:require [module.default.type.gameplayCtx])
  (:require [module.default.type.unit])
  (:require [module.default.type.weapon])
  (:require [tool.units])
  (:require [tool.fsm])
  (:require [clojure.spec.alpha :as s])
  (:require ["./data.js" :as dataJson])
  (:require-macros [module.default.core :as mm])
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.module])
  (:require-macros [module.default.macros :as m])
  (:require [tool.map])
  (:require-macros [module.default.core :as mm]))

(defn explainValid? [sp args]
  (if (clojure.spec.alpha/valid? sp args)
    true
    (do (println (clojure.spec.alpha/explain-str sp args))
        (println args)
        false)))

(defn assertSpec [sp args]
  (when true
     (when (not (clojure.spec.alpha/valid? sp args))
       (println (clojure.spec.alpha/explain-str sp args))
       (println args)
       (throw (js/Error. (str "error"))))))


(s/def ::data (s/keys :opt-un [::weaponIdx ::weapons ::unit]))
(s/def ::menuData (s/tuple (constantly true) ::data))

(s/def ::weapon module.default.type.weapon/instance)
(s/def ::weaponSlot (s/tuple keyword? (s/+ ::weapon)))
(s/def ::unit module.default.type.unit/instance)
(s/def ::gameplayCtx module.default.type.gameplayCtx/instance)



(def data (js->clj dataJson :keywordize-keys true))


(declare getUnitMaxHp setUnitHp getUnitMaxEn setUnitEn getUnitInfo)

; ==============
; === helper ===
; ==============

(defn rectByUnit [{[x y] :position}]
  [x y (+ 0.5 x) (+ 0.5 y)])

(defn world2local [camera position]
  (map - position camera))

(defn local2world [camera position]
  (map + position camera))

; ==============
; === config ===
; ==============

(def mapViewSize [20 20])

(def defaultGameplayModel {:map nil
                           :temp {:cursor [0 0]
                                  :camera [0 0]
                                  :moveRange []
                                  :attackRange []
                                  :mapAttackRange []}
                           :players {:player {:faction 0}
                                     :ai1 {:faction 1}
                                     :ai2 {:faction 1}}
                           :units tool.units/model
                           :fsm tool.fsm/model})

(defn getPlayers [ctx]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]}
  (:players ctx))

; ===================
; === Phase State ===
; ===================

(defn getFsm [ctx]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (:fsm ctx))

(defn setFsm [ctx fsm]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? ::gameplayCtx %)]}
  (merge ctx {:fsm fsm}))

; ===========
; === Map ===
; ===========

; map
(declare getCamera)

(defn setMap [ctx map]
  (update ctx :map (constantly map)))

(defn getMap [ctx]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (:map ctx))

(defn getLocalMap [ctx camera]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (let [camera (or camera (getCamera ctx))
        playmap (:map ctx)]
    (tool.map/subMap camera mapViewSize playmap)))

; camera
(defn setCamera [ctx camera]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? ::gameplayCtx %)]}
  (update-in ctx [:temp :camera] (constantly camera)))

(defn getCamera [ctx]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (get-in ctx [:temp :camera]))

(defn boundCamera [ctx camera]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (->> camera
       (map min (map - (tool.map/getMapSize (getMap ctx)) mapViewSize))
       (map max [0 0])))

; cursor
(defn setCursor [ctx cursor]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? ::gameplayCtx %)]}
  (update-in ctx [:temp :cursor] (constantly cursor)))

(defn getCursor [ctx]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (get-in ctx [:temp :cursor]))

(defn boundCursor [ctx cursor]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (->> cursor
       (map max [0 0])
       (map min (map dec (tool.map/getMapSize (getMap ctx))))))

(defn getLocalCursor [ctx camera]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (let [camera (or camera (getCamera ctx))
        cursor (getCursor ctx)]
    (world2local camera cursor)))

; ============
; === unit ===
; ============

(defn updateUnit [ctx unit f]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [ctx unit])]
   :post [(explainValid? ::gameplayCtx %)]}
  (update ctx :units (fn [origin]
                       (-> origin
                           (tool.units/delete unit)
                           (tool.units/add (f unit))))))

(defn setUnits [ctx units]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? ::gameplayCtx %)]}
  (update ctx :units (constantly units)))

(defn getUnits [ctx]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (:units ctx))

(defn getUnitsInRange [ctx range]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? (s/* ::unit) %)]}
  (->> (map (fn [pos]
              (tool.units/getByPosition (getUnits ctx) pos))
            range)
       (filter identity)))

(defn getUnitsByRegion [ctx camera searchSize]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? (s/* ::unit) %)]}
  (let [camera (or camera (getCamera ctx))
        [p1 p2] (or searchSize [(map - camera mapViewSize)
                                (map + camera mapViewSize)])
        units (tool.units/getByRegion (getUnits ctx) p1 p2)]
    units))

(defn mapUnitToLocal [ctx camera unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [ctx unit])]
   :post [(explainValid? (constantly true) %)]}
  (let [camera (or camera (getCamera ctx))]
    (-> unit
        (update :position (partial world2local camera))
        ((fn [unit]
           ; getUnitInfo之後就不符合::unit的格式, 所以不在post中做檢查
           (getUnitInfo ctx unit))))))

(defn getLocalUnits [ctx camera searchSize]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? (constantly true) %)]}
  (let [camera (or camera (getCamera ctx))]
    (->> (getUnitsByRegion ctx camera searchSize)
         (map (fn [unit]
                ; mapUnitToLocal之後就不符合::unit的格式, 所以不在post中做檢查
                (mapUnitToLocal ctx camera unit))))))

; ============
; === view ===
; ============

(defn updateTemp [ctx f]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? ::gameplayCtx %)]}
  (update-in ctx [:temp] f))

(defn setMoveRange [ctx v]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? ::gameplayCtx %)]}
  (update-in ctx [:temp :moveRange] (constantly v)))

(defn getMoveRange [ctx]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (get-in ctx [:temp :moveRange]))


(defn setAttackRange [ctx v]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post [(explainValid? ::gameplayCtx %)]}
  (update-in ctx [:temp :attackRange] (constantly v)))

(defn getAttackRange [ctx]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (get-in ctx [:temp :attackRange]))


(defn getLocalMoveRange [ctx camera]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (let [camera (or camera (getCamera ctx))
        moveRange (getMoveRange ctx)]
    (map (partial world2local camera) moveRange)))

(defn getLocalAttackRange [ctx camera]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [ctx])]
   :post []}
  (let [camera (or camera (getCamera ctx))
        range (getAttackRange ctx)]
    (map (partial world2local camera) range)))




(defn getWeaponData [weaponKey]
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponData[" weaponKey "] not found")))
      weaponData)))

; =======================
; map
; =======================


(defn getTerrainKey [gameplayCtx from]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [gameplayCtx])]
   :post []}
  (let [playmap (module.default.data/getMap gameplayCtx)
        t1 (get-in data [:terrainMapping
                         (str (get-in playmap (reverse from)))
                         :terrain])]
    t1))

(defn getTerrain [gameplayCtx from]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [gameplayCtx])]
   :post []}
  (-> (getTerrainKey gameplayCtx from)
      ((fn [key]
         (get-in data [:terrain key])))))


(defn moveCost [gameplayCtx unit from to]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(number? %)]}
  (let [isSky (-> (get-in unit [:state :tags])
                  (contains? :sky))]
    (if isSky
      1
      (let [playmap (module.default.data/getMap gameplayCtx)
            t1 (get-in data [:terrainMapping
                             ((comp keyword str) (get-in playmap (reverse from)))
                             :terrain])
            t2 (get-in data [:terrainMapping
                             ((comp keyword str) (get-in playmap (reverse to)))
                             :terrain])]
        (+ (get-in data [:terrain (keyword t1) :cost])
           (get-in data [:terrain (keyword t2) :cost]))))))


(defn nextCell [gameplayCtx unit [mw mh] [x y]]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]}
  (let [possiblePosition [[x (min mh (inc y))]
                          [x (max 0 (dec y))]
                          [(min mw (inc x)) y]
                          [(max 0 (dec x)) y]]
        unitsInPosition (map #(tool.units/getByPosition (getUnits gameplayCtx) %) possiblePosition)]
    (->> (zipmap possiblePosition unitsInPosition)
         (filter (fn [[pos occupyUnit]]
                   (or (nil? occupyUnit)
                       (= (get-in gameplayCtx [:players (-> unit :player) :faction])
                          (get-in gameplayCtx [:players (-> occupyUnit :player) :faction])))))
         (map first))))

(defn estimateCost [from to]
  (->> (map - from to)
       (repeat 2)
       (apply map *)
       (apply +)))

; =======================
; pilot
; =======================
(defn getPilotInfo [gameplayCtx unit pilot]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit keyword?) [gameplayCtx unit pilot])]}
  (let [data (get-in data [:pilot pilot])]
    (if (nil? data)
      (throw (js/Error. (str "getPilotInfo[" pilot "] not found")))
      data)))

; =======================
; weapon
; =======================
(defn getWeaponRange [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::weapon) [gameplayCtx unit weapon])]
   :post [(explainValid? (s/tuple number? number?) %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponRange[" weaponKey "] not found")))
      (let [{[min max] :range type :type} weaponData]
        [min max]))))

(defn getWeaponType [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::weapon) [gameplayCtx unit weapon])]
   :post [(explainValid? string? %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (let [{type :type} weaponData]
        type))))

(defn getWeaponSuitability [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::weapon) [gameplayCtx unit weapon])]
   :post [(explainValid? (s/tuple number? number? number? number?) %)]}
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (get-in weaponData [:suitability]))))

(defn getWeaponInfo [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::weapon) [gameplayCtx unit weapon])]
   :post [(explainValid? ::weapon %)]}
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(number? %)]}
  10000)

; en
(mm/defUnitSetter en)
(mm/defUnitGetter en)
(defn getUnitMaxEn [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(number? %)]}
  (let [robotKey (get-in unit [:state :robot])
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(number? %)]}
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post []}
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

; weapons
(defn getUnitWeapons [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
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

(defn setUnitWeapons [unit weapons]
  {:pre [(explainValid? (s/tuple ::unit ::weaponSlot) [unit weapons])]
   :post [(explainValid? ::unit %)]}
  (update-in unit [:state :weapons] (fn [origin]
                                      (conj origin weapons))))


(defn getUnitWeaponRange [gameplayCtx unit weapon]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::weapon) [gameplayCtx unit weapon])]
   :post []}
  (let [[min max] (getWeaponRange gameplayCtx unit weapon)]
    (->> (tool.map/simpleFindPath [0 0] (dec min))
         (into #{})
         (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                      (into #{})))
         (map (partial map + (:position unit))))))

;power
(defn getUnitPower [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(number? %)]}
  (let [robotKey (get-in unit [:state :robot])
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post []}
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (get robot :suitability))))

(defn getUnitHitRate [gameplayCtx unit weapon targetUnit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::weapon ::unit) [gameplayCtx unit weapon targetUnit])]
   :post [(explainValid? number? %)]}
  (let [weaponInfo (getWeaponInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)
        pilot (getPilotInfo gameplayCtx unit (get-in unit [:state :pilot]))
        targetPilot (getPilotInfo gameplayCtx targetUnit (get-in targetUnit [:state :pilot]))
        terrain (-> (module.default.data/getMap gameplayCtx)
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::weapon ::unit) [gameplayCtx unit weapon targetUnit])]
   :post [(explainValid? number? %)]}
  (let [weaponInfo (getWeaponInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)
        terrain (-> (module.default.data/getMap gameplayCtx)
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(explainValid? (s/+ keyword?) %)]}
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitTransforms[" robotKey "] not found")))
      (conj (mapv keyword (get-in robot [:transform]))
            robotKey))))

(defn getUnitInfo [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post []}
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitInfo[" robotKey "] not found")))
      (update-in unit [:state] (fn [state]
                                 (merge state
                                        {:weapons (->> (getUnitWeapons gameplayCtx unit)
                                                       second
                                                       (map (partial getWeaponInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)))
                                         :components (->> (getUnitComponents gameplayCtx unit)
                                                          second)
                                         :maxHp (getUnitMaxHp gameplayCtx unit)
                                         :maxEn (getUnitMaxEn gameplayCtx unit)
                                         :power (getUnitPower gameplayCtx unit)}))))))

(defn useUnitWeapon [gameplayCtx weapon unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::weapon ::unit) [gameplayCtx weapon unit])]
   :post [(explainValid? ::unit %)]}
  (let [weaponInfo (getWeaponInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)
        energyType (-> weaponInfo :energyType keyword)]
    (cond
      (= energyType :energy)
      (let [energyCost (get weaponInfo :energyCost)
            unitAfter (-> (getUnitEn unit)
                          (- energyCost)
                          (max 0)
                          ((fn [en]
                             (setUnitEn unit en))))]
        unitAfter)

      (= energyType :bullet)
      (let [weapons (getUnitWeapons gameplayCtx unit)
            weaponAfter (update-in weapon [:bulletCount] (comp (partial max 0) dec))
            weaponsAfter (update-in weapons [1] (fn [vs]
                                                  (replace {weapon weaponAfter} vs)))
            unitAfter (setUnitWeapons unit weaponsAfter)]
        unitAfter)

      :else
      (throw (js/Error. (str "unknown energyType " weaponInfo))))))


(defn isBelongToPlayer [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(explainValid? boolean? %)]}
  (= (:player unit) :player))

(defn isFriendlyUnit [gameplayCtx unit targetUnit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::unit) [gameplayCtx unit targetUnit])]
   :post [(explainValid? boolean? %)]}
  (if (= unit targetUnit)
    true
    (->> [unit targetUnit]
         (map :player)
         (map (fn [player]
                (get-in gameplayCtx [:players player :faction])))
         (apply =))))

(defn getMenuData [gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::unit ::weapon) [gameplayCtx unit fromUnit weapon])]
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::unit) [gameplayCtx left right])]}
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::unit) [gameplayCtx left right])]}
  (-> [{:events #{} :damage 0} (getReactionResult gameplayCtx left leftAction right rightAction)]
      ((fn [[_ firstResult :as ctx]]
         (if (contains? (:events firstResult) :dead)
           ctx
           (if (not= (first rightAction) :attack)
             ctx
             (update ctx 0 (constantly (getReactionResult gameplayCtx right rightAction left leftAction)))))))))

(defn applyActionResult [gameplayCtx left leftAction right rightAction result]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit ::unit) [gameplayCtx left right])]}
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
                        (module.default.data/updateUnit left (constantly leftAfter))
                        (module.default.data/updateUnit right (constantly rightAfter)))]
    gameplayCtx))

(defn formatPathTree [gameplayCtx unit power paths]
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

(defn getUnitMovePathTreeTo [gameplayCtx unit pos]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]}
  (let [playmap (module.default.data/getMap gameplayCtx)
        power (/ (getUnitPower gameplayCtx unit) 5)
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
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]}
  (getUnitMovePathTreeTo gameplayCtx unit nil))



(defn unitOnTransform [gameplayCtx unit fromKey toKey]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit keyword? keyword?) [gameplayCtx unit fromKey toKey])]
   :post [(explainValid? ::unit %)]}
  (let [[_ weaponsNow] (getUnitWeapons gameplayCtx unit)
        [_ weaponsNext] (getUnitWeapons gameplayCtx (update-in unit [:state :robot] (constantly toKey)))
        weapons (-> (zipmap (map :weaponKey weaponsNext) weaponsNext)
                    (merge (select-keys (zipmap (map :weaponKey weaponsNow) weaponsNow)
                                        (map :weaponKey weaponsNext)))
                    vals
                    ((fn [vs]
                       (into [] vs))))]
    (-> unit
        (update-in [:state :robot] (constantly toKey))
        (update-in [:state :weapons toKey] (constantly weapons)))))


(defn gameplayOnUnitCreate [_ gameplayCtx unit {:keys [robotKey] :as args}]
  (let [unit (merge unit {:state {:robot robotKey
                                  :pilot :amuro
                                  :weapons {}
                                  :components {}
                                  :tags {}}})]
    (-> unit
        ((fn [unit]
           (setUnitHp unit (getUnitMaxHp gameplayCtx unit))))
        ((fn [unit]
           (setUnitEn unit (getUnitMaxEn gameplayCtx unit)))))))

(defn createUnit [ctx {:keys [key position] :as unit} args]
  (-> (getUnits ctx)
      (tool.units/add (merge (gameplayOnUnitCreate nil ctx unit args)
                             {:key (or key (gensym))
                              :position (or position [0 0])}))
      ((fn [units]
         (setUnits ctx units)))))


(defn gameplayOnInit [appCtx gameplayCtx]
  {:pre [(explainValid? (s/tuple ::gameplayCtx) [gameplayCtx])]
   :post [(explainValid? ::gameplayCtx %)]}
  (let [[gameplayCtx _] (->> (get module.default.data/data :robot)
                             (reduce (fn [[gameplayCtx i] [robotKey _]]
                                       [(createUnit gameplayCtx
                                                    {:player (if (< (rand) 0.5)
                                                               :player
                                                               :ai1)
                                                     :type :robot
                                                     :position [0 i]}
                                                    {:robotKey robotKey})
                                        (inc i)])
                                     [gameplayCtx 1]))]
    gameplayCtx))

(defn gameplayOnUnitMove [_ gameplayCtx unit pos]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(explainValid? ::unit %)]}
  (let [vel (->> (map - (:position unit) pos)
                 (repeat 2)
                 (apply map *)
                 (apply +))]
    (-> unit
        (merge {:position pos})
        (update-in [:state :tags] #(conj % [:move true]))
        (update-in [:state :tags] #(conj % [:velocity vel])))))

(defn gameplayOnUnitDone [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(explainValid? ::unit %)]}
  (-> unit
      (update-in [:state :tags] #(conj % [:done true]))))

(defn gameplayOnUnitTurnStart [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(explainValid? ::unit %)]}
  (-> unit
      (update-in [:state :tags] (constantly {}))))

(defn gameplayOnUnitDead [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post []}
  (a/go gameplayCtx))

(defn gameplayGetUnitMovePathTree [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post []}
  (module.default.data/getUnitMovePathTree gameplayCtx unit))

(defn gameplayGetUnitIsDead [_ gameplayCtx unit]
  {:pre [(explainValid? (s/tuple ::gameplayCtx ::unit) [gameplayCtx unit])]
   :post [(boolean? %)]}
  (<= (get-in unit [:state :hp]) 0))