(ns app2.data.core
  (:require [clojure.spec.alpha :as s]
            [clojure.set]
            ["./data.js" :as dataJson]
            [app2.tool.battleMenu :as battleMenu]
            [app2.tool.const :refer [search-region search-position]]
            [app2.tool.lobby-spec :as lobby-spec]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec]
            [tool.map]))

(def data (js->clj dataJson :keywordize-keys true))


(s/def ::terrianItem (s/keys :req-un [::title ::cost ::hitRate ::damage]))
(s/def ::terrain (s/map-of keyword? ::terrianItem))
(s/def ::data (s/keys :req-un [::terrain]))

; =======================
; map
; =======================


(defn getTerrainKey [{playmap :map} from]
  (let [t1 (get-in data [:terrainMapping
                         ((comp keyword str) (get-in playmap (reverse from)))
                         :terrain])]
    (keyword t1)))

(defn getTerrain [{playmap :map} from]
  (-> (getTerrainKey {:map playmap} from)
      ((fn [key]
         (get-in data [:terrain key])))))


(defn estimateCost [from to]
  (->> (map - from to)
       (repeat 2)
       (apply map *)
       (apply +)))

(defn getUnitsByRegion [{camera :camera viewsize :viewsize units :units} targetCamera searchSize]
  (s/assert ::view-spec/camera camera)
  (s/assert ::view-spec/viewsize viewsize)
  (s/assert ::gameplay-spec/units units)
  (s/assert (s/nilable ::gameplay-spec/position) targetCamera)
  (s/assert (s/nilable ::gameplay-spec/position) searchSize)
  (s/assert
   (s/* ::gameplay-spec/unit)
   (let [viewsize (or searchSize viewsize)
         camera (or targetCamera camera)
         [p1 p2] [(map - camera viewsize)
                  (map + camera viewsize)]
         units (search-region units p1 p2)]
     units)))


(defn world2local [camera position]
  (mapv - position camera))


;======================================================
;
; 基礎能力. 作為依賴的底層, 比較難依能力變更
;
;======================================================

(defn getUnitComponents [{:keys [gameplayCtx lobbyCtx]} unit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert ::gameplay-spec/robot unit)
  (s/assert
   ::gameplay-spec/componentEntry
   (let [transform (get-in unit [:robotState :robotKey])
         coms (get-in unit [:robotState :components transform])]
     (if coms
       [transform coms]
       [transform
        (let [robotKey (get-in unit [:robotState :robotKey])
              robot (get-in data [:robot robotKey])
              addedComKeys (s/assert
                            (s/coll-of (s/tuple keyword? keyword?))
                            (->> lobbyCtx :robotByComponent
                                 (filter (fn [[_ robot]]
                                           (= robot (:key unit))))
                                 (map first)
                                 (map (fn [key]
                                        [key (-> lobbyCtx :components key)]))))
              belongComKeys (s/assert
                             (s/coll-of (s/tuple keyword? keyword?))
                             (if (not (nil? robot))
                               (map (fn [componentKey]
                                      [(keyword componentKey) (keyword componentKey)])
                                    (get robot :components))
                               []))]
          (if (nil? robot)
            (throw (js/Error. (str "getUnitComponents[" robotKey "] not found")))
            (mapv (fn [[key componentKey]]
                    (let [com (get-in data [:component componentKey])]
                      (if (nil? com)
                        (throw (js/Error. (str "getUnitComponents[" componentKey "] not found")))
                        {:key key
                         :componentKey componentKey
                         :tags {}})))
                  (concat belongComKeys
                          addedComKeys))))]))))

(defn getPilotInfo [{:keys [gameplayCtx lobbyCtx]} unit pilotState]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert (s/nilable ::gameplay-spec/robot) unit)
  (s/assert ::gameplay-spec/pilotState pilotState)
  (s/assert
   ::gameplay-spec/pilotState
   (when pilotState
     (let [data (get-in data [:pilot (:pilotKey pilotState)])]
       (if (nil? data)
         (throw (js/Error. (str "getPilotInfo[" (:pilotKey pilotState) "] not found")))
         (let [{:keys [melee range guard evade]} data
               basicExp (:exp data)
               basicExpMelee (:expMelee data)
               basicExpRange (:expRange data)
               basicExpEvade (:expEvade data)
               basicExpGuard (:expGuard data)
               {:keys [exp expMelee expRange expEvade expGuard]} pilotState
               exp (+ basicExp exp)
               expMelee (+ basicExpMelee expMelee)
               expRange (+ basicExpRange expRange)
               expEvade (+ basicExpEvade expEvade)
               expGuard (+ basicExpGuard expGuard)]
           (merge data
                  pilotState
                  {:expMelee expMelee
                   :expRange expRange
                   :expEvade expEvade
                   :expGuard expGuard
                   :exp exp
                   :melee (+ 1 (* melee expMelee) (* melee exp (/ 1 2)))
                   :range (+ 1 (* range expRange) (* range exp (/ 1 2)))
                   :guard (+ 1 (* guard expGuard) (* guard exp (/ 1 2)))
                   :evade (+ 1 (* evade expEvade) (* evade exp (/ 1 2)))})))))))


;======================================================
;
; 一階能力. 依賴配件或駕駛能力
;
;======================================================

(defn getUnitWeapons [{:keys [gameplayCtx lobbyCtx]} unit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert ::gameplay-spec/robot unit)
  (s/assert
   ::gameplay-spec/weaponEntry
   (let [transform (get-in unit [:robotState :robotKey])
         weapons (get-in unit [:robotState :weapons transform])]
     (if weapons
       [transform weapons]
       [transform
        (let [robotKey (get-in unit [:robotState :robotKey])
              robot (get-in data [:robot robotKey])
              addedWeaponKeys (s/assert
                               (s/coll-of (s/tuple keyword? keyword?))
                               (->> lobbyCtx :robotByWeapon
                                    (filter (fn [[_ robot]]
                                              (= robot (:key unit))))
                                    (map first)
                                    (map (fn [key]
                                           [key (-> lobbyCtx :weapons key)]))))
              belongWeaponsKeys (s/assert
                                 (s/coll-of (s/tuple keyword? keyword?))
                                 (if (not (nil? robot))
                                   (map (fn [weaponKey]
                                          [(keyword weaponKey) (keyword weaponKey)])
                                        (get robot :weapons))
                                   []))]
          (if (nil? robot)
            (throw (js/Error. (str "getUnitWeapons robotKey[" robotKey "]not found")))
            (mapv (fn [[key weaponKey]]
                    (let [weapon (get-in data [:weapon weaponKey])]
                      (if (nil? weapon)
                        (throw (js/Error. (str "getUnitWeapons weaponKey[" weaponKey "] not found")))
                        {:key key ; 在這個不能使用gensym, 因為這個方法是getter
                         :weaponKey weaponKey
                         :weaponLevel 0
                         :tags {}
                         :bulletCount (get weapon :maxBulletCount)})))
                  (concat belongWeaponsKeys
                          addedWeaponKeys))))]))))

(defn getWeaponAbility [{:keys [gameplayCtx lobbyCtx]} unit {:keys [weaponKey] :as weapon}]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert (s/nilable ::gameplay-spec/robot) unit)
  (s/assert ::gameplay-spec/weaponState weapon)
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (get-in weaponData [:ability]))))

;======================================================
;
; 二階能力. 依賴武器能力
;
;======================================================

(defn getWeaponRange [{:keys [gameplayCtx lobbyCtx]} unit {:keys [weaponKey] :as weapon}]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert (s/nilable ::gameplay-spec/robot) unit)
  (s/assert ::gameplay-spec/weaponState weapon)
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponRange[" weaponKey "] not found")))
      (let [{[min max] :range _ :type} weaponData
            max (if (-> unit :robotState :tags :weaponRangePlus)
                  (inc max)
                  max)
            ; 射擊力量配件
            ; 格鬥力量配件
            max (if true
                  (inc max)
                  max)]
        [min max]))))

(defn getWeaponType [{:keys [gameplayCtx lobbyCtx]} unit {:keys [weaponKey] :as weapon}]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert (s/nilable ::gameplay-spec/robot) unit)
  (s/assert ::gameplay-spec/weaponState weapon)
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (let [{type :type} weaponData]
        type))))

(defn getWeaponSuitability [{:keys [gameplayCtx lobbyCtx]} unit {:keys [weaponKey] :as weapon}]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert (s/nilable ::gameplay-spec/robot) unit)
  (s/assert ::gameplay-spec/weaponState weapon)
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (get-in weaponData [:suitability]))))

(defn getUnitMaxHp [{:keys [gameplayCtx lobbyCtx] :as ctx} unit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert ::gameplay-spec/robot unit)
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitMaxHp[" robotKey "] not found")))
      (let [basic (s/assert
                   number?
                   (->> (getUnitComponents ctx unit)
                        second
                        (filter (fn [{:keys [componentKey]}]
                                  (#{:armor1 :armor2 :armor3} componentKey)))
                        (map (fn [{:keys [componentKey]}] (get-in data [:component componentKey :value 0])))
                        (map int)
                        (apply +)))]
        basic))))

(defn getUnitMaxEn [{:keys [gameplayCtx lobbyCtx]} unit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert ::gameplay-spec/robot unit)
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

(defn getUnitPower [{:keys [gameplayCtx lobbyCtx] :as ctx} unit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert ::gameplay-spec/robot unit)
  (s/assert
   number?
   (let [robotKey (get-in unit [:robotState :robotKey])
         robot (get-in data [:robot robotKey])]
     (if (nil? robot)
       (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
       (let [components (-> (getUnitComponents ctx unit) second)
             weapons (-> (getUnitWeapons ctx unit) second)
             power (->> (concat (map (fn [info]
                                       (get-in data [:component (:componentKey info) :powerCost]))
                                     components)
                                (map (fn [info]
                                       (get-in data [:weapon (:weaponKey info) :powerCost]))
                                     weapons))
                        (apply - (get robot :power)))]
         power)))))

(defn getUnitSuitability [{:keys [gameplayCtx lobbyCtx]} unit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert ::gameplay-spec/robot unit)
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (get robot :suitability))))

(defn getUnitTransforms [{:keys [gameplayCtx lobbyCtx]} unit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert ::gameplay-spec/robot unit)
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitTransforms[" robotKey "] not found")))
      (conj (mapv keyword (get-in robot [:transform]))
            robotKey))))

(defn getUnitWeaponRange [gameplayCtx unit weapon]
  (s/assert ::gameplay-spec/gameplayCtx gameplayCtx)
  (s/assert ::gameplay-spec/robot unit)
  (s/assert ::gameplay-spec/weaponState weapon)
  (s/assert
   (s/coll-of vector?)
   (let [[min max] (getWeaponRange {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)]
     (->> (tool.map/simpleFindPath [0 0] (dec min))
          (into #{})
          (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                       (into #{})))
         ; 使用mapv確保類型, 讓clojure.spec驗過
          (mapv (partial mapv + (:position unit)))))))

(defn getUnitHitRate [{playmap :map :as gameplayCtx} unit weapon targetUnit]
  (s/assert ::gameplay-spec/gameplayCtx gameplayCtx)
  (s/assert ::view-spec/map playmap)
  (s/assert ::gameplay-spec/robot unit)
  (s/assert ::gameplay-spec/weaponState weapon)
  (s/assert ::gameplay-spec/robot targetUnit)
  (let [accuracy (s/assert
                  number?
                  (get-in data [:weapon (:weaponKey weapon) :accuracy]))
        pilot (getPilotInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit (get-in unit [:robotState :pilotState]))
        targetPilot (getPilotInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} targetUnit (get-in targetUnit [:robotState :pilotState]))
        weaponSuitability (getWeaponSuitability {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)
        weaponAbility (getWeaponAbility {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)
        missile? (-> (into #{} weaponAbility) (contains? "missile"))
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
        factor1 (cond
                  (and pilot targetPilot)
                  (let [isMelee (some #(= (keyword %) :melee) weaponAbility)]
                    (if isMelee
                      (/ (get pilot :melee) (get targetPilot :melee))
                      (/ (get pilot :range) (get targetPilot :range))))

                  pilot
                  5

                  targetPilot
                  (/ 1 5)

                  :else
                  1)


        ; 命中回避係數
        factor2 (cond
                  (and pilot targetPilot)
                  (/ (get pilot :dex) (get targetPilot :agi))

                  pilot
                  5

                  targetPilot
                  (/ 1 5)

                  :else
                  1)

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
                          (max 0)))))
        ; 氣力
        factor7 (s/assert
                 number?
                 (if pilot
                   (-> pilot :curage (/ 100))
                   0.5))]
    (max 0.1 (* basic factor1 factor2 factor3 factor4 factor5 factor6 factor7))))

(defn getUnitMakeDamage [{playmap :map :as gameplayCtx} unit weapon targetUnit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::gameplay-spec/robot unit)
  (s/assert ::gameplay-spec/weaponState weapon)
  (s/assert ::gameplay-spec/robot targetUnit)
  (s/assert
   int?
   (let [unitWeaponDamage (s/assert
                           int?
                           (get-in data [:weapon (:weaponKey weapon) :damage]))
         pilot (getPilotInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit (get-in unit [:robotState :pilotState]))
         targetPilot (getPilotInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} targetUnit (get-in targetUnit [:robotState :pilotState]))
         weaponSuitability (getWeaponSuitability {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)
         weaponAbility (getWeaponAbility {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)
         fire? (-> (into #{} weaponAbility) (contains? "fire"))
         lighting? (-> (into #{} weaponAbility) (contains? "lighting?"))
         targetTerrainKey (getTerrainKey {:map playmap} (:position targetUnit))
         targetTerrain (-> data :terrain targetTerrainKey)
         fireActive? (and fire? (= targetTerrainKey :forest))
         lightingActive? (and lighting? (#{:shallowSea :deepSea} targetTerrainKey))

        ; 格鬥或射擊係數
         factor1 (cond
                   (and pilot targetPilot)
                   (let [isMelee (some #(= (keyword %) :melee) weaponAbility)]
                     (if isMelee
                       (/ (get pilot :melee) (get targetPilot :melee))
                       (/ (get pilot :range) (get targetPilot :range))))

                   pilot
                   5

                   targetPilot
                   (/ 1 5)

                   :else
                   1)

        ; 地型適性係數
         factor2 (get weaponSuitability 0)

        ; 地型補正係數
         factor3 (cond
                   (or lightingActive? fireActive?)
                   1.1

                   :else
                   (:damage targetTerrain))
        ; 氣力
         factor4 (s/assert
                  number?
                  (cond
                    (and pilot targetPilot)
                    (/ (-> pilot :curage)
                       (-> targetPilot :curage))

                    pilot
                    5

                    targetPilot
                    (/ 1 5)

                    :else
                    1))

        ; 除1是因為以敵方為主計算, 所以factor要反過來
         targetValue (* 1000 (/ 1 factor1) (/ 1 factor2) (/ 1 factor3) (/ 1 factor4))

         damage (* unitWeaponDamage (- 1 (/ targetValue 4800)))

         ; 對方有固守配件
         ; 如果在敵人回合並且自己回合沒有攻擊過時增加裝甲
         ; 因為是在敵方回合時才計算, 所以targetUnit一定是我方
         damage (if (and true
                         (not= :player (-> gameplayCtx :activePlayer))
                         (not (-> targetUnit :robotState :tags :attackWeapon)))
                  (- damage 3000)
                  damage)

         ; 對方是射擊王
         ; 若對方所有武器都是射擊系，傷害減少
         damage (if (and true
                         (s/assert
                          boolean?
                          (->> (getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} targetUnit)
                               second
                               (map #(getWeaponAbility {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} targetUnit %))
                               (every? (fn [ability]
                                         (not ((into #{} ability) "melee")))))))
                  (- damage 300)
                  damage)

         ; 射擊王
         ; 若所有武器都是射擊系，傷害增加
         damage (if (and true
                         (s/assert
                          boolean?
                          (->> (getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                               second
                               (map #(getWeaponAbility {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit %))
                               (every? (fn [ability]
                                         (not ((into #{} ability) "melee")))))))
                  (* damage 1.2)
                  damage)]
     (js/Math.floor (max 100 damage)))))



(defn setUnitWeapons [unit weapons]
  (s/assert (s/tuple ::gameplay-spec/robot ::gameplay-spec/weaponEntry) [unit weapons])
  (s/assert
   ::gameplay-spec/robot
   (update-in unit [:robotState :weapons] (fn [origin]
                                            (conj origin weapons)))))

(defn updateUnit [{:keys [units] :as gameplayCtx} unit f]
  (s/assert ::gameplay-spec/units units)
  (s/assert ::gameplay-spec/robot unit)
  (s/assert
   ::gameplay-spec/gameplayCtx
   (update-in gameplayCtx [:units (:key unit)] f)))

(defn useUnitWeapon [gameplayCtx weapon unit]
  (s/assert ::gameplay-spec/gameplayCtx gameplayCtx)
  (s/assert ::gameplay-spec/weaponState weapon)
  (s/assert ::gameplay-spec/robot unit)
  (s/assert
   ::gameplay-spec/robot
   (let [energyType (s/assert
                     #{:energy :bullet}
                     (-> (get-in data [:weapon (:weaponKey weapon) :energyType])
                         keyword))]
     (cond
       (= energyType :energy)
       (let [energyCost (s/assert
                         int?
                         (get-in data [:weapon (:weaponKey weapon) :energyCost]))
             unitAfter (-> (-> unit :robotState :en)
                           (- energyCost)
                           (max 0)
                           ((fn [en]
                              (update-in unit [:robotState :en] (constantly en)))))
             unitAfter (update-in unitAfter [:robotState :tags] (fn [tags]
                                                                  (assoc tags :attackWeapon weapon)))]
         unitAfter)

       (= energyType :bullet)
       (let [weaponAfter (update-in weapon [:bulletCount] (comp (partial max 0) dec))
             weaponEntry (getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
             _ (when (->> (second weaponEntry)
                          (into #{})
                          (#(% weapon))
                          not)
                 (throw (js/Error. (str "內部錯誤, 使用的武器必須在武器列表中, 請檢查是否有在weapon多塞了額外的欄位:" weapon))))
             weaponEntryAfter (update-in weaponEntry [1] (fn [vs]
                                                           (replace {weapon weaponAfter} vs)))
             unitAfter (setUnitWeapons unit weaponEntryAfter)
             unitAfter (update-in unitAfter [:robotState :tags] (fn [tags]
                                                                  (assoc tags :attackWeapon weapon)))]
         unitAfter)

       :else
       (throw (js/Error. (str energyType " not found")))))))

(defn invalidWeapon? [gameplayCtx unit weapon targetUnit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::gameplay-spec/robot unit)
  (s/assert ::gameplay-spec/weaponState weapon)
  (s/assert (s/nilable ::gameplay-spec/robot) unit)
  (let [{:keys [energyType energyCost curage]} (s/assert
                                                (s/keys :req-un [::energyType ::energyCost ::curage])
                                                (get-in data [:weapon (:weaponKey weapon)]))
        bulletCount (:bulletCount weapon)
        moved? (-> unit :robotState :tags :moveCount)

        msg (try
              (when targetUnit
                (let [weaponRanges (into #{} (getUnitWeaponRange gameplayCtx unit weapon))
                      canTouchTarget (weaponRanges (:position targetUnit))]
                  (when (not canTouchTarget)
                    (throw (js/Error. "can not touch target")))))

              ; 移動後必須有moveAttack能力的武器才能用
              (when (and moved?
                         (->> (getWeaponAbility {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)
                              (into #{})
                              (#(% "moveAttack"))
                              not))
                (throw (js/Error. "no ability [moveAttack]")))

               ; 氣力要夠
              (when (< (-> unit :robotState :pilotState :curage) curage)
                (throw (js/Error. (str "curage must be " curage "(" (-> unit :robotState :pilotState :curage) ")"))))

              ; 能量要夠
              (when (= energyType "energy")
                (let [en (-> unit :robotState :en)
                      enoughEn? (>= en energyCost)]
                  (when (not enoughEn?)
                    (throw (js/Error. "en is not enough")))))
               ; 彈數要夠
              (when (= energyType "bullet")
                (when (zero? bulletCount)
                  (throw (js/Error. "bullet is empty"))))

              (catch js/Error e
                (.-message e)))]
    msg))


(defn isBelongToPlayer [gameplayCtx unit]
  (s/assert (s/tuple ::gameplay-spec/gameplayCtx ::gameplay-spec/robot) [gameplayCtx unit])
  (s/assert
   boolean?
   (= (:playerKey unit) :player)))

(defn isFriendlyUnit [{players :players :as gameplayCtx} unit targetUnit]
  (s/assert ::gameplay-spec/gameplayCtx gameplayCtx)
  (s/assert ::gameplay-spec/players players)
  (s/assert ::gameplay-spec/unit unit)
  (s/assert ::gameplay-spec/unit targetUnit)
  (s/assert
   boolean?
   (if (= unit targetUnit)
     true
     (let [[unitSpec] (s/conform ::gameplay-spec/unit unit)
           [targetUnitSpec] (s/conform ::gameplay-spec/unit targetUnit)]
       (cond
         (or (= :item unitSpec) (= :item targetUnitSpec))
         true

         (and (= :robot unitSpec) (= :robot targetUnitSpec))
         (->> [unit targetUnit]
              (map :playerKey)
              (map (fn [player]
                     (get-in players [player :faction])))
              (apply =))

         :else
         (throw (js/Error. "can not reach here.")))))))

(defn moveCost [{playmap :map :as gameplayCtx} unit from to]
  (s/assert (s/tuple ::view-spec/map ::gameplay-spec/robot) [playmap unit])
  (s/assert ::gameplay-spec/position from)
  (s/assert ::gameplay-spec/position to)
  (s/assert
   number?
   (let [isSky (-> (get-in unit [:robotState :tags])
                   (contains? :sky))
        ; 陸海空宇
         [suit1 suit2 suit3 _] (getUnitSuitability {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
         costFn (fn [terrainKey]
                  (let [basic (get-in data [:terrain terrainKey :cost])
                        ret (cond
                              isSky
                              (* 0.5 (/ 1 suit3))

                              (#{:shallowSea :deepSea} terrainKey)
                              (* basic (/ 1 suit2))

                              :else
                              (* basic (/ 1 suit1)))]
                    ret))
         nearbyHostile (->> (getUnitsByRegion gameplayCtx to [3 3])
                            (filter #(not (isFriendlyUnit gameplayCtx unit %))))]
     (+ (costFn (getTerrainKey gameplayCtx from))
        (costFn (getTerrainKey gameplayCtx to))
        (* (count nearbyHostile) 1)))))


(defn getMenuData [gameplayCtx unit playerTurn? targetUnit]
  (s/assert ::gameplay-spec/robot unit)
  (s/assert boolean? playerTurn?)
  (s/assert (s/nilable ::gameplay-spec/robot) targetUnit)
  (s/assert
   (s/tuple ::view-spec/menu ::view-spec/menuCursorData)
   (if (not (isBelongToPlayer gameplayCtx unit))
     [[["cancel"]] {}]
     (let [isBattleMenu (:unitBattleMenu gameplayCtx)
           weapons (s/assert
                    (s/* ::gameplay-spec/weaponState)
                    (->> (getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                         second))
           invalidWeapons (map (fn [weapon]
                                 (invalidWeapon? gameplayCtx unit weapon targetUnit))
                               weapons)
           weaponKeys (->> (range (count weapons))
                           (into []))
           noWeapon? (zero? (count weapons))
           [menu data] (if isBattleMenu
                         [(if playerTurn?
                            [weaponKeys ["cancel"]]
                            [weaponKeys ["evade"] ["guard"]])
                          {:weaponIdx (if noWeapon?
                                        -1
                                        0)
                           :weapons weapons
                           :invalidWeapons invalidWeapons
                           :unit unit}]
                         (cond
                           (-> (get-in unit [:robotState :tags])
                               (contains? :done))
                           [[["cancel"]] {}]

                           (-> (get-in unit [:robotState :tags])
                               (contains? :moveCount))
                           [[weaponKeys ["ok"] ["cancel"]]
                            {:weaponIdx (if noWeapon?
                                          -1
                                          0)
                             :weapons weapons
                             :invalidWeapons invalidWeapons
                             :unit unit}]

                           :else
                           [[["move"]
                             weaponKeys
                             (getUnitTransforms {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                             ["sky/ground"]
                             ["ok"]
                             ["cancel"]]
                            {:weaponIdx (if noWeapon?
                                          -1
                                          1)
                             :weapons weapons
                             :invalidWeapons invalidWeapons
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
  (s/assert ::gameplay-spec/robot unit)
  (s/assert (s/* ::gameplay-spec/weaponState) weapons)
  (s/assert (s/* ::gameplay-spec/robot) targetUnits)
  (s/assert
   (s/nilable (s/tuple ::gameplay-spec/weaponState ::gameplay-spec/robot))
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
         [weapon unit])))))

(defn thinkReaction [gameplayCtx unit fromUnit weapon]
  (s/assert (s/tuple ::gameplay-spec/gameplayCtx ::gameplay-spec/robot ::gameplay-spec/robot ::gameplay-spec/weaponState) [gameplayCtx unit fromUnit weapon])
  (s/assert
   vector?
   (let [hitRate (getUnitHitRate gameplayCtx fromUnit weapon unit)
         weapons (->> (getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                      second
                      (filter #(not (invalidWeapon? gameplayCtx  unit % fromUnit))))
         bestWeaponUnit (getBestWeapon gameplayCtx unit weapons [fromUnit])
         action (if bestWeaponUnit
                  (let [[bestWeapon _] bestWeaponUnit]
                    [:attack bestWeapon])
                  (if (< hitRate 0.7)
                    [:evade]
                    [:guard]))]
     action)))


(s/def ::events (s/and set?
                       (s/coll-of #{:damage :evade :guard :dead})))
(s/def ::damage number?)
(s/def ::attackAction ::battleMenu/action)
(s/def ::deffenceAction ::battleMenu/action)
(s/def ::meta (s/keys :req-opt [::attackAction ::deffenceAction]))
(s/def ::reactionResult (s/keys :req-un [::events ::damage ::meta]))

(defn getReactionResult [gameplayCtx left [leftActionType leftWeapon :as leftAction] right [rightActionType rightWeapon :as rightAction]]
  (s/assert ::gameplay-spec/gameplayCtx gameplayCtx)
  (s/assert ::gameplay-spec/robot left)
  (s/assert ::gameplay-spec/robot right)
  (s/assert ::battleMenu/action leftAction)
  (s/assert ::battleMenu/action rightAction)
  (s/assert
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
  (s/assert ::gameplay-spec/gameplayCtx gameplayCtx)
  (s/assert ::gameplay-spec/robot left)
  (s/assert ::gameplay-spec/robot right)
  (s/assert ::battleMenu/action leftAction)
  (s/assert ::battleMenu/action rightAction)
  (s/assert
   ::actionResult
   (-> [{:events #{} :damage 0 :meta {}} (getReactionResult gameplayCtx left leftAction right rightAction)]
       ((fn [[_ firstResult :as ctx]]
          (if (contains? (:events firstResult) :dead)
            ctx
            (if (not= (first rightAction) :attack)
              ctx
              (update ctx 0 (constantly (getReactionResult gameplayCtx right rightAction left leftAction))))))))))

(defn applyActionResult [gameplayCtx left leftAction right rightAction result]
  (s/assert ::gameplay-spec/gameplayCtx gameplayCtx)
  (s/assert ::gameplay-spec/robot left)
  (s/assert ::gameplay-spec/robot right)
  (s/assert ::battleMenu/action leftAction)
  (s/assert ::battleMenu/action rightAction)
  (s/assert ::actionResult result)
  (s/assert
   (s/tuple ::gameplay-spec/robot ::gameplay-spec/robot)
   (let [[{leftDamage :damage
           leftEvents :events}
          {rightDamage :damage
           rightEvents :events}] result
         [leftAfter rightAfter] [left right]
         ; 增加氣力
         [leftAfter rightAfter] (map (fn [unit selfEvents targetEvents]
                                       (if (-> unit :robotState :pilotState)
                                         (if (-> targetEvents :dead)
                                           (update-in unit [:robotState :pilotState :curage] #(+ 5 %))
                                           (update-in unit [:robotState :pilotState :curage] #(+ 1 %)))
                                         unit))
                                     [leftAfter rightAfter]
                                     [leftEvents rightEvents]
                                     [rightEvents leftEvents])
         ; 扣血
         [leftAfter rightAfter] (map (fn [unit damage]
                                       (-> (-> unit :robotState :hp)
                                           (- damage)
                                           (max 0)
                                           ((fn [hp]
                                              (update-in unit [:robotState :hp] (constantly hp))))))
                                     [leftAfter rightAfter]
                                     [leftDamage rightDamage])
         ; 消費武器
         [leftAfter rightAfter] (map (fn [unit [actionType weapon]]
                                       (if (= actionType :attack)
                                         (useUnitWeapon gameplayCtx weapon unit)
                                         unit))
                                     [leftAfter rightAfter]
                                     [leftAction rightAction])

         ; 增加經驗
         [leftAfter rightAfter] (map (fn [unit [actionType weapon] selfEvents targetEvents]
                                       (s/assert
                                        ::gameplay-spec/robot
                                        (cond-> unit
                                          true
                                          (update-in [:robotState :pilotState] (fn [pilot]
                                                                                 (when pilot
                                                                                   (update pilot :exp inc))))

                                          (and (= actionType :attack)
                                               (targetEvents :damage))
                                          ((fn [unit]
                                             (let [ability (into #{} (getWeaponAbility gameplayCtx unit weapon))
                                                   melee? (ability "melee")]
                                               (update-in unit [:robotState :pilotState] (fn [pilot]
                                                                                           (when pilot
                                                                                             (update pilot (if melee? :expMelee :expRange) inc)))))))

                                          (selfEvents :damage)
                                          (update-in [:robotState :pilotState] (fn [pilot]
                                                                                 (when pilot
                                                                                   (update pilot :expGuard inc))))

                                          (selfEvents :evade)
                                          (update-in [:robotState :pilotState] (fn [pilot]
                                                                                 (when pilot
                                                                                   (update pilot :expEvade inc)))))))
                                     [leftAfter rightAfter]
                                     [leftAction rightAction]
                                     [leftEvents rightEvents]
                                     [rightEvents leftEvents])]
     [leftAfter rightAfter])))


(defn getUnitMovePathTree
  ([gameplayCtx unit]
   (getUnitMovePathTree gameplayCtx unit nil))

  ([{units :units players :players playmap :map :as gameplayCtx} unit pos]
   (s/assert (s/tuple ::gameplay-spec/gameplayCtx ::view-spec/map ::gameplay-spec/robot) [gameplayCtx playmap unit])
   (let [power (/ (getUnitPower {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit) 5)
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
                                unitsInPosition (map #(search-position units %) possiblePosition)
                                costToNext (map #(moveCost gameplayCtx unit [x y] %) possiblePosition)
                                sky? (-> unit :robotState :tags :sky)]
                            (->> (map vector possiblePosition costToNext unitsInPosition)
                                 (filter (fn [[_ cost occupyUnit]]
                                           (and
                                            ; 行動力要夠
                                            (<= (+ nowCost cost) power)
                                            ; 空格或是友好佔據或是佔據的對象在空中
                                            (or (nil? occupyUnit)
                                                (isFriendlyUnit gameplayCtx unit occupyUnit)
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
  (s/assert ::gameplay-spec/gameplayCtx gameplayCtx)
  (s/assert
   (s/nilable ::gameplay-spec/position)
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
                                 (not (search-position units pos)))))
                  (map first)
                  (sort-by (fn [pos]
                             (estimateCost fromPos pos)))
                  first)]
     pos)))

(defn unitOnTransform [gameplayCtx unit fromKey toKey]
  (s/assert (s/tuple ::gameplay-spec/gameplayCtx ::gameplay-spec/robot keyword? keyword?) [gameplayCtx unit fromKey toKey])
  (s/assert
   ::gameplay-spec/robot
   (let [[_ weaponsNow] (getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
         [_ weaponsNext] (getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} (update-in unit [:robotState :robotKey] (constantly toKey)))
         weapons (-> (zipmap (map :weaponKey weaponsNext) weaponsNext)
                     (merge (select-keys (zipmap (map :weaponKey weaponsNow) weaponsNow)
                                         (map :weaponKey weaponsNext)))
                     vals
                     ((fn [vs]
                        (into [] vs))))]
     (-> unit
         (update-in [:robotState :robotKey] (constantly toKey))
         (update-in [:robotState :weapons toKey] (constantly weapons))))))

(defn createRobot [gameplayCtx unit]
  (s/assert
   ::gameplay-spec/robot
   (let [basic (merge-with (fn [l r]
                             (cond
                               (map? l)
                               (merge l r)

                               r
                               r

                               :else
                               l))
                           {:key (keyword (gensym "_robot_"))
                            :position [0 0]
                            :playerKey :player
                            :robotState {:pilotState nil
                                         :weapons {}
                                         :components {}
                                         :tags {}
                                         :hp 0
                                         :en 0}}
                           unit)
         basic (update-in basic [:robotState] #(merge % {:hp (getUnitMaxHp {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} basic)
                                                         :en (getUnitMaxEn {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} basic)}))]
     basic)))

(defn createItem [gameplayCtx unit]
  (s/assert
   ::gameplay-spec/item
   (let [basic (merge-with (fn [l r]
                             (cond
                               (map? l)
                               (merge l r)

                               r
                               r

                               :else
                               l))
                           {:key (keyword (gensym "_item_"))
                            :position [0 0]
                            :itemState {:itemKeyTypeList []
                                        :itemRareRate 0}}
                           unit)]
     basic)))


; ===================================================
; 
; 
; 這裡以上的函式不得呼叫getWeaponInfo, getUnitInfo
; 
; 
; ===================================================
; 

; 注意: 這個函式中不能呼叫getUnitInfo, 不然會無限迴圈
(defn getWeaponInfo [{:keys [gameplayCtx lobbyCtx] :as ctx} unit {:keys [weaponKey] :as weapon}]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert (s/nilable ::gameplay-spec/robot) unit)
  (s/assert ::gameplay-spec/weaponState weapon)
  (s/assert
   map?
   (let [weaponData (s/assert
                     map?
                     (get-in data [:weapon weaponKey]))]
      ;  原始資料 + 武器現在的狀態 + 能力修正後的資料  = weaponInfo
     (merge weaponData
            weapon
            {:range (getWeaponRange ctx unit weapon)
             :type (getWeaponType ctx unit weapon)
             :suitability (getWeaponSuitability ctx unit weapon)
             :ability (getWeaponAbility ctx unit weapon)}))))

(defn getComponentInfo [{:keys [gameplayCtx lobbyCtx] :as ctx} unit {:keys [componentKey] :as component}]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert (s/nilable ::gameplay-spec/robot) unit)
  (s/assert
   map?
   (let [componentData (s/assert
                        map?
                        (get-in data [:component componentKey]))]
     (merge componentData
            component))))

(defn getUnitInfo [{:keys [gameplayCtx lobbyCtx] :as ctx} unit]
  (s/assert (s/nilable ::gameplay-spec/gameplayCtx) gameplayCtx)
  (s/assert ::lobby-spec/lobby lobbyCtx)
  (s/assert ::gameplay-spec/unit unit)
  (s/assert
   map?
   (let [[unitSpec] (s/conform ::gameplay-spec/unit unit)]
     (cond
       (= :robot unitSpec)
       (let [robotKey (get-in unit [:robotState :robotKey])
             robotData (->> data :robot robotKey)]
         (update-in unit [:robotState] (fn [state]
                                         (merge robotData
                                                state
                                                {:pilotState (getPilotInfo ctx unit (-> unit :robotState :pilotState))
                                                 :weapons (->> (getUnitWeapons ctx unit)
                                                               second
                                                               (map (partial getWeaponInfo ctx unit)))
                                                 :components (->> (getUnitComponents ctx unit)
                                                                  second
                                                                  (map (partial getComponentInfo ctx unit)))
                                                 :maxHp (getUnitMaxHp ctx unit)
                                                 :maxEn (getUnitMaxEn ctx unit)
                                                 :power (getUnitPower ctx unit)}))))
       (= :item unitSpec)
       unit

       :else
       (throw (js/Error. "can not reach here."))))))

(defn mapUnitToLocal [{camera :camera viewsize :viewsize units :units} targetCamera unit]
  (s/assert (s/tuple ::view-spec/camera ::view-spec/viewsize ::gameplay-spec/units) [camera viewsize units])
  (s/assert
   any?
   (let [camera (or targetCamera camera)]
     (-> unit
         (update :position (partial world2local camera))))))