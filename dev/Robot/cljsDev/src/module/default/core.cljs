(ns module.default.core
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.model])
  (:require [app.gameplay.module])
  (:require [tool.map])
  (:require-macros [module.default.core :as mm])
  (:require ["./data.js" :as dataJson]))

(def data (js->clj dataJson))
(defn getWeaponData [weaponKey]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str weaponKey " not found")))
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
; weapon
; =======================
(defn getWeaponRange [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str weaponKey " not found")))
      (let [{[min max] "range" type "type"} weaponData]
        [min max]))))

(defn getWeaponType [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str weaponKey " not found")))
      (let [{type "type"} weaponData]
        type))))

(defn getWeaponInfo [gameplayCtx unit {:keys [weaponKey] :as weapon}]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str weaponKey " not found")))
      (merge weaponData
             {"range" (getWeaponRange gameplayCtx unit weapon)
              "type" (getWeaponType gameplayCtx unit weapon)}
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
      (throw (js/Error. (str robotKey "not found")))
      (let [en (->> (get robot "components")
                    (filter (fn [k]
                              (some #(= % k) ["energy1" "energy2" "energy3"])))
                    (map (fn [k] (get-in data ["component" k "value" 0])))
                    (map int)
                    (apply +))]
        en))))

(def getUnitMaxEnM (memoize getUnitMaxEn))

; components
(defn getUnitComponents [gameplayCtx unit]
  (let [coms (get-in unit [:state :components :default])]
    (if coms
      coms
      [:default
       (let [robotKey (get-in unit [:state :robot])
             robot (get-in data ["robot" robotKey])]
         (if (nil? robot)
           (throw (js/Error. (str robotKey "not found")))
           (mapv (fn [key]
                   (let [com (get-in data ["component" key])]
                     (if (nil? com)
                       (throw (js/Error. (str key " not found")))
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
           (throw (js/Error. (str robotKey "not found")))
           (mapv (fn [weaponKey]
                   (let [weapon (get-in data ["weapon" weaponKey])]
                     (if (nil? weapon)
                       (throw (js/Error. (str weaponKey " not found")))
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
      (throw (js/Error. (str robotKey "not found")))
      (let [power (->> (concat (map (fn [k]
                                      (get-in data ["component" k "powerCost"]))
                                    (get robot "components"))
                               (map (fn [k]
                                      (get-in data ["weapon" k "powerCost"]))
                                    (get robot "weapons")))
                       (apply - (get robot "power")))]
        power))))

(def getUnitPowerM (memoize getUnitPower))


(defn getUnitInfo [gameplayCtx unit]
  (let [robotKey (get-in unit [:state :robot])
        robot (get-in data ["robot" robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str robotKey " not found")))
      (update-in unit [:state] (fn [state]
                                 (merge state
                                        {:weapons (->> (getUnitWeaponsM gameplayCtx unit)
                                                       second
                                                       (map (partial getWeaponInfo gameplayCtx unit)))
                                         :components (->> (getUnitComponentsM gameplayCtx unit)
                                                          second)
                                         :maxHp (getUnitMaxHpM gameplayCtx unit)
                                         :maxEn (getUnitMaxEnM gameplayCtx unit)}))))))


(defn unitOnTransform [gameplayCtx unit fromKey toKey]
  (-> unit
      (update-in unit [:state :robot] (constantly toKey))
      (update-in unit [:state :weapons (keyword toKey)] (constantly (let [weapons (get-in unit [:state :weapons (keyword fromKey)])]
                                                                      weapons)))))

; =======================
; binding
; =======================

(defmethod app.gameplay.module/loadData :default [_]
  (a/go
    data))

(defmethod app.gameplay.module/unitOnCreate :default [_ gameplayCtx unit {:keys [robotKey] :as args}]
  (let [unit (merge unit {:state {:robot robotKey
                                  :pilot "amuro"
                                  :weapons {}
                                  :components {}
                                  :tags #{}}})]
    (-> unit
        ((fn [unit]
           (setUnitHp gameplayCtx unit (getUnitMaxHp gameplayCtx unit))))
        ((fn [unit]
           (setUnitEn gameplayCtx unit (getUnitMaxEn gameplayCtx unit)))))))

(defmethod app.gameplay.module/unitOnMove :default [_ gameplayCtx unit pos]
  (-> unit
      (merge {:position pos})
      (update-in [:state :tag] #(conj % :firstMove2))))

(defmethod app.gameplay.module/unitOnDone :default [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tag] #(conj % :done))))

(defmethod app.gameplay.module/unitOnTurnStart :default [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tag] (constantly #{}))))

(defmethod app.gameplay.module/unitGetMovePathTree :default [_ gameplayCtx unit]
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        power (getUnitPowerM gameplayCtx unit)
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
                     second
                     (map (partial getWeaponInfo gameplayCtx unit)))
        weaponKeys (->> (range (count weapons))
                        (into []))
        [menu data] (if isBattleMenu
                      [[weaponKeys ["ok"] ["cancel"]]
                       {:weaponIdx 0
                        :weapons weapons}]
                      (cond
                        (-> (get-in unit [:state :tag])
                            (contains? :done))
                        [[["cancel"]] {}]

                        (-> (get-in unit [:state :tag])
                            (contains? :firstMove))
                        [[weaponKeys ["ok"] ["cancel"]]
                         {:weaponIdx 0
                          :weapons weapons}]

                        :else
                        [[["move"] weaponKeys ["ok"] ["cancel"]]
                         {:weaponIdx 1
                          :weapons weapons}]))]
    [menu data]))

(defmethod app.gameplay.module/unitGetHitRate :default [_ gameplayCtx unit weapon targetUnit]
  (let [isMelee true]
    (if isMelee
      (let [pilot 0]))))

(defmethod app.gameplay.module/unitGetReaction :default [type gameplayCtx unit fromUnit weapon]
  (let [hitRate (app.gameplay.module/unitGetHitRate type gameplayCtx fromUnit weapon unit)
        weapons (-> (app.gameplay.module/unitGetWeapons type gameplayCtx unit)
                    second)]
    [:attack (first weapons)]))

(defmethod app.gameplay.module/unitGetInfo :default [_ gameplayCtx unit]
  (getUnitInfo gameplayCtx unit))
