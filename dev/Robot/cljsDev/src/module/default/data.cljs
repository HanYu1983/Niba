(ns module.default.data
  (:require ["./data.js" :as dataJson])
  (:require [app.gameplay.model])
  (:require-macros [module.default.core :as mm]))

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

