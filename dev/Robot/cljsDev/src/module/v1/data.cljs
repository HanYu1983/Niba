(ns module.v1.data
  (:require [cljs.reader])
  (:require ["./data.js" :as dataJson])
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require [app.lobby.model])
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

;======================================================
;
; 基礎能力. 作為依賴的底層, 比較難依能力變更
;
;======================================================

(defn getUnitComponents [{:keys [gameplayCtx lobbyCtx]} unit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::type/unit unit)
  (let [transform (get-in unit [:robotState :robotKey])
        coms (get-in unit [:robotState :components transform])]
    (if coms
      [transform coms]
      [transform
       (let [robotKey (get-in unit [:robotState :robotKey])
             robot (get-in data [:robot robotKey])
             addedComKeys (common/assertSpec
                           (s/coll-of (s/tuple keyword? keyword?))
                           (->> lobbyCtx :robotByComponent
                                (filter (fn [[_ robot]]
                                          (= robot (:key unit))))
                                (map first)
                                (map (fn [key]
                                       [key (-> lobbyCtx :components key)]))))
             belongComKeys (common/assertSpec
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
                         addedComKeys))))])))

(defn getPilotInfo [{:keys [gameplayCtx lobbyCtx]} unit pilotState]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec (s/nilable ::type/unit) unit)
  (common/assertSpec ::type/pilotState pilotState)
  (common/assertSpec
   ::type/pilotState
   (when pilotState
     (let [data (get-in data [:pilot (:pilotKey pilotState)])]
       (if (nil? data)
         (throw (js/Error. (str "getPilotInfo[" (:pilotKey pilotState) "] not found")))
         (merge data
                pilotState
                #_(common/assertSpec
                   ::type/pilotState
                   (-> lobbyCtx :pilotStateByPilot (:key pilotState)))))))))

;======================================================
;
; 一階能力. 依賴配件或駕駛能力
;
;======================================================

(defn getUnitWeapons [{:keys [gameplayCtx lobbyCtx]} unit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::type/unit unit)
  (let [transform (get-in unit [:robotState :robotKey])
        weapons (get-in unit [:robotState :weapons transform])]
    (if weapons
      [transform weapons]
      [transform
       (let [robotKey (get-in unit [:robotState :robotKey])
             robot (get-in data [:robot robotKey])
             addedWeaponKeys (common/assertSpec
                              (s/coll-of (s/tuple keyword? keyword?))
                              (->> lobbyCtx :robotByWeapon
                                   (filter (fn [[_ robot]]
                                             (= robot (:key unit))))
                                   (map first)
                                   (map (fn [key]
                                          [key (-> lobbyCtx :weapons key)]))))
             belongWeaponsKeys (common/assertSpec
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
                         addedWeaponKeys))))])))

(defn getWeaponAbility [{:keys [gameplayCtx lobbyCtx]} unit {:keys [weaponKey] :as weapon}]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec (s/nilable ::type/unit) unit)
  (common/assertSpec ::type/weaponState weapon)
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
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec (s/nilable ::type/unit) unit)
  (common/assertSpec ::type/weaponState weapon)
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
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec (s/nilable ::type/unit) unit)
  (common/assertSpec ::type/weaponState weapon)
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (let [{type :type} weaponData]
        type))))

(defn getWeaponSuitability [{:keys [gameplayCtx lobbyCtx]} unit {:keys [weaponKey] :as weapon}]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec (s/nilable ::type/unit) unit)
  (common/assertSpec ::type/weaponState weapon)
  (let [weaponData (get-in data [:weapon weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str "getWeaponType[" weaponKey "] not found")))
      (get-in weaponData [:suitability]))))

(defn getUnitMaxHp [{:keys [gameplayCtx lobbyCtx]} unit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::type/unit unit)
  10000)

(defn getUnitMaxEn [{:keys [gameplayCtx lobbyCtx]} unit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::type/unit unit)
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

(defn getUnitArmor [{:keys [gameplayCtx lobbyCtx]} unit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::type/unit unit)
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitArmor[" robotKey "] not found")))
      (let [basic (->> (get robot :components)
                       (filter (fn [k]
                                 (some #(= % k) ["armor1" "armor2" "armor3"])))
                       (map (fn [k] (get-in data [:component (keyword k) :value 0])))
                       (map int)
                       (apply +))
            ; 固守配件
            ; 如果在敵人回合並且自己回合沒有攻擊過時增加裝甲
            basic (if (and true
                           (not= :player (-> gameplayCtx :activePlayer))
                           (not (-> unit :robotState :tags :attackWeapon)))
                    (+ basic 3000)
                    basic)

            ; 射擊王
            ; 若所有武器都是射擊系，裝甲增加
            basic (if (and true
                           (common/assertSpec
                            boolean?
                            (->> (getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                                 second
                                 (map #(getWeaponAbility {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit %))
                                 (every? (fn [ability]
                                           (not ((into #{} ability) "melee")))))))
                    (+ basic 300)
                    basic)]
        basic))))

(defn getUnitPower [{:keys [gameplayCtx lobbyCtx]} unit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::type/unit unit)
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

(defn getUnitSuitability [{:keys [gameplayCtx lobbyCtx]} unit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::type/unit unit)
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitPower[" robotKey "] not found")))
      (get robot :suitability))))

(defn getUnitTransforms [{:keys [gameplayCtx lobbyCtx]} unit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::type/unit unit)
  (let [robotKey (get-in unit [:robotState :robotKey])
        robot (get-in data [:robot robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str "getUnitTransforms[" robotKey "] not found")))
      (conj (mapv keyword (get-in robot [:transform]))
            robotKey))))

(defn getUnitWeaponRange [gameplayCtx unit weapon]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (common/assertSpec ::type/unit unit)
  (common/assertSpec ::type/weaponState weapon)
  (common/assertSpec
   (s/coll-of vector?)
   (let [[min max] (getWeaponRange {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit weapon)]
     (->> (tool.map/simpleFindPath [0 0] (dec min))
          (into #{})
          (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                       (into #{})))
         ; 使用mapv確保類型, 讓clojure.spec驗過
          (mapv (partial mapv + (:position unit)))))))

(defn getUnitHitRate [{playmap :map :as gameplayCtx} unit weapon targetUnit]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (common/assertSpec ::spec/map playmap)
  (common/assertSpec ::type/unit unit)
  (common/assertSpec ::type/weaponState weapon)
  (common/assertSpec ::type/unit targetUnit)
  (let [accuracy (common/assertSpec
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
        factor7 (common/assertSpec
                 number?
                 (if pilot
                   (-> pilot :curage (/ 100))
                   0.5))]
    (max 0.1 (* basic factor1 factor2 factor3 factor4 factor5 factor6 factor7))))

(defn getUnitMakeDamage [{playmap :map :as gameplayCtx} unit weapon targetUnit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::type/unit unit)
  (common/assertSpec ::type/weaponState weapon)
  (common/assertSpec ::type/unit targetUnit)
  (common/assertSpec
   int?
   (let [unitWeaponDamage (common/assertSpec
                           int?
                           (get-in data [:weapon (:weaponKey weapon) :damage]))
         targetArmor (getUnitArmor {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} targetUnit)

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
         factor4 (common/assertSpec
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
         targetValue (* targetArmor (/ 1 factor1) (/ 1 factor2) (/ 1 factor3) (/ 1 factor4))

         damage1 (* unitWeaponDamage (- 1 (/ targetValue 4800)))
         damage2 (- unitWeaponDamage targetArmor)
         final (+ (* damage1 1 (/ 2 3)) (* damage2 (/ 1 3)))


         ; 射擊王
         ; 若所有武器都是射擊系，裝甲增加
         final (if (and true
                        (common/assertSpec
                         boolean?
                         (->> (getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                              second
                              (map #(getWeaponAbility {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit %))
                              (every? (fn [ability]
                                        (not ((into #{} ability) "melee")))))))
                 (* final 1.2)
                 final)]
     (js/Math.floor (max 100 final)))))



(defn setUnitWeapons [unit weapons]
  {:pre [(explainValid? (s/tuple ::type/unit ::type/weaponEntry) [unit weapons])]
   :post [(explainValid? ::type/unit %)]}
  (update-in unit [:robotState :weapons] (fn [origin]
                                           (conj origin weapons))))

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

(defn useUnitWeapon [gameplayCtx weapon unit]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (common/assertSpec ::type/weaponState weapon)
  (common/assertSpec ::type/unit unit)
  (common/assertSpec
   ::type/unit
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
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::type/unit unit)
  (common/assertSpec ::type/weaponState weapon)
  (common/assertSpec (s/nilable ::type/unit) unit)
  (let [{:keys [energyType energyCost curage]} (common/assertSpec
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


(defn moveCost [{playmap :map :as gameplayCtx} unit from to]
  {:pre [(explainValid? (s/tuple ::spec/map ::type/unit) [playmap unit])]
   :post [(number? %)]}
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

(defn getMenuData [gameplayCtx unit playerTurn? targetUnit]
  (common/assertSpec ::type/unit unit)
  (common/assertSpec boolean? playerTurn?)
  (common/assertSpec (s/nilable ::type/unit) targetUnit)
  (common/assertSpec
   (s/tuple ::spec/menu ::spec/menuCursorData)
   (if (not (isBelongToPlayer gameplayCtx unit))
     [[["cancel"]] {}]
     (let [isBattleMenu (-> (:fsm gameplayCtx)
                            (tool.fsm/currState)
                            (= :unitBattleMenu))
           weapons (common/assertSpec
                    (s/* ::type/weaponState)
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
  (common/assertSpec ::type/unit unit)
  (common/assertSpec (s/* ::type/weaponState) weapons)
  (common/assertSpec (s/* ::type/unit) targetUnits)
  (common/assertSpec
   (s/nilable (s/tuple ::type/weaponState ::type/unit))
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
  {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::type/unit ::type/unit ::type/weaponState) [gameplayCtx unit fromUnit weapon])]
   :post [(vector? %)]}
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
                                       (common/assertSpec
                                        ::type/unit
                                        (cond-> unit
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
   {:pre [(explainValid? (s/tuple ::type/gameplayCtx ::spec/map ::type/unit) [gameplayCtx playmap unit])]}
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
        (update-in [:robotState :weapons toKey] (constantly weapons)))))

(defn createUnit [gameplayCtx unit]
  (common/assertSpec
   ::type/robot
   (let [basic (merge-with (fn [l r]
                             (cond
                               (map? l)
                               (merge l r)

                               r
                               r

                               :else
                               l))
                           {:key (keyword (gensym "_unit_"))
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
(defn getWeaponInfo [{:keys [gameplayCtx lobbyCtx] :as ctx} unit {:keys [weaponKey] :as weapon}]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec (s/nilable ::type/unit) unit)
  (common/assertSpec ::type/weaponState weapon)
  (common/assertSpec
   map?
   (let [weaponData (common/assertSpec
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
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec (s/nilable ::type/unit) unit)
  (common/assertSpec
   map?
   (let [componentData (common/assertSpec
                        map?
                        (get-in data [:component componentKey]))]
     (merge componentData
            component))))


(defn getUnitInfo [{:keys [gameplayCtx lobbyCtx] :as ctx} unit]
  (common/assertSpec (s/nilable ::type/gameplayCtx) gameplayCtx)
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::type/unit unit)
  (common/assertSpec
   map?
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
                                             :power (getUnitPower ctx unit)}))))))

(defn mapUnitToLocal [{camera :camera viewsize :viewsize units :units} targetCamera unit]
  {:pre [(explainValid? (s/tuple ::spec/camera ::spec/viewsize ::type/units) [camera viewsize units])]
   :post [(explainValid? (constantly true) %)]}
  (let [camera (or targetCamera camera)]
    (-> unit
        (update :position (partial world2local camera)))))



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
                   (map #(->> (getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} %)
                              (mapUnitToLocal gameplayCtx camera))))))
   :attackRange (when (s/valid? ::spec/attackRangeView gameplayCtx)
                  (let [{:keys [camera attackRange]} gameplayCtx]
                    (map #(world2local camera %) attackRange)))
   :checkHitRate (when (s/valid? ::spec/checkHitRateView gameplayCtx)
                   (let [{:keys [camera checkHitRate]} gameplayCtx]
                     (->> checkHitRate
                          (map (fn [info]
                                 (-> info
                                     (update :unit #(->> (getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} %)
                                                         (mapUnitToLocal gameplayCtx camera)))
                                     (update :targetUnit #(->> (getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} %)
                                                               (mapUnitToLocal gameplayCtx camera)))))))))
   :cellState (when (s/valid? ::spec/cellStateView gameplayCtx)
                (let [{:keys [units cursor]} gameplayCtx
                      unitAtCursor (-> units
                                       (tool.units/getByPosition cursor))
                      terrain (getTerrain gameplayCtx cursor)]
                  {:unit (when unitAtCursor
                           (->> (getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unitAtCursor)
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
                                                (map (partial getWeaponInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit) weapons)))}))
   :battleMenu (when (s/valid? ::spec/battleMenuView gameplayCtx)
                 (let [stateDetail (-> gameplayCtx :fsm tool.fsm/load)
                       {battleMenuSession :battleMenuSession} stateDetail]
                   {:preview (battleMenu/mapUnits battleMenuSession #(->> (getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} %)
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

(defn fixUnitSkyGround [gameplayCtx unit inputCh outputCh]
  (common/assertSpec ::type/unit unit)
  (a/go
    (common/assertSpec
     ::type/unit
     (let [[ground naval air _] (getUnitSuitability {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
           _ naval
           sky? (-> unit :robotState :tags :sky)
           unit (cond
                  ; 如果在空中卻不能飛, 降到地面
                  (and sky? (zero? air))
                  (do
                    (a/<! (common/unitGroundAnim nil {:unit (->> (getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                                                                 (mapUnitToLocal gameplayCtx nil))} inputCh outputCh))
                    (update-in unit [:robotState :tags] #(dissoc % :sky)))

                  ; 如果在地面卻沒有地面能力又有空中能力的話, 飛到空中
                  (and (not sky?) (zero? ground) (> air 0))
                  (do
                    (a/<! (common/unitSkyAnim nil {:unit (->> (getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                                                              (mapUnitToLocal gameplayCtx nil))} inputCh outputCh))
                    (update-in unit [:robotState :tags] #(conj % [:sky true])))

                  :else
                  unit)]
       unit))))


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
                                                     (let [; move cursor
                                                           {:keys [viewsize mapsize]} gameplayCtx
                                                           [vw vh] viewsize
                                                           [mw mh] mapsize
                                                           gameplayCtx (assoc gameplayCtx :cursor (:position unit))
                                                           gameplayCtx (assoc gameplayCtx :camera (->> (:position unit)
                                                                                                       (map + [(- (js/Math.floor (/ vw 2))) (- (js/Math.floor (/ vh 2)))])
                                                                                                       ((fn [[x y]]
                                                                                                          [(max 0 (min x (- mw vw)))
                                                                                                           (max 0 (min y (- mh vh)))]))))
                                                           _ (a/<! (common/paint nil (render gameplayCtx) inputCh outputCh))

                                                           ; award animation
                                                           maxHp (getUnitMaxHp {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                                                           maxEn (getUnitMaxEn {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                                                           nextUnit (-> nextUnit
                                                                        (update-in [:robotState :hp] #(min (+ % (* maxHp 0.2)) maxHp))
                                                                        (update-in [:robotState :en] #(min (+ % (* maxEn 0.2)) maxEn)))
                                                           _ (a/<! (common/unitGetAwardAnim nil (map #(->> (getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} %)
                                                                                                           (mapUnitToLocal gameplayCtx nil)) [unit nextUnit]) inputCh outputCh))]
                                                       nextUnit)
                                                     nextUnit))
                                         ; remove velocity
                                         nextUnit (update-in nextUnit [:robotState :tags] #(dissoc % :velocity))
                                         nextUnit (update-in nextUnit [:robotState :tags] #(dissoc % :attackWeapon))]
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



(def gameplayCtx {:map [[]]
                  :camera [0 0]
                  :cursor [0 0]
                  :viewsize [20 20]
                  :mapsize [20 20]
                  :units tool.units/model
                  :moveRange []
                  :players {:player {:faction 0 :playerState nil}
                            :ai1 {:faction 1 :playerState nil}}
                  :fsm tool.fsm/model
                  :numberOfTurn 0})

(defn save! [gameplayCtx]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (let [units (-> (:units gameplayCtx)
                  (tool.units/getAll))
        memonto (merge {:unitList units}
                       (select-keys gameplayCtx [:lobbyCtx
                                                 :map
                                                 :camera
                                                 :viewsize
                                                 :mapsize
                                                 :cursor
                                                 :players]))
        _ (.setItem js/localStorage "gameplay" (str memonto))]))

(defn load! [gameplayCtx]
  (common/assertSpec
   ::type/gameplayCtx
   (let [gameplayMemonto (cljs.reader/read-string (.-gameplay js/localStorage))
         gameplayCtx (common/assertSpec
                      ::type/gameplayCtx
                      (if gameplayMemonto
                        (let [unitsList (:unitList gameplayMemonto)
                              gameplayCtx (merge gameplayCtx
                                                 (dissoc gameplayMemonto :unitList))
                              gameplayCtx (reduce (fn [gameplayCtx unit]
                                                    (update gameplayCtx :units (fn [units]
                                                                                 (tool.units/add units unit))))
                                                  gameplayCtx
                                                  unitsList)]
                          gameplayCtx)
                        gameplayCtx))]
     gameplayCtx)))