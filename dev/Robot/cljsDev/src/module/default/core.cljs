(ns module.default.core
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.module])
  (:require [tool.map])
  (:require ["./data.js" :as dataJson]))

(def data (js->clj dataJson))

(defn createUnitStateForKey [robotKey]
  (let [robot (get-in data ["robot" robotKey])]
    (if (nil? robot)
      (throw (js/Error. (str robotKey "not found")))
      (let [component (mapv (fn [key]
                              (let [com (get-in data ["component" key])]
                                (if (nil? com)
                                  (throw (js/Error. (str key " not found")))
                                  {:key (gensym)
                                   :componentKey key})))
                            (get robot "components"))
            ; 使用vector(mapv)方便索引的存取(nth, get-in)
            weapon (mapv (fn [weaponKey]
                           (let [weapon (get-in data ["weapon" weaponKey])]
                             (if (nil? weapon)
                               (throw (js/Error. (str weaponKey " not found")))
                               (cond-> {:key (gensym)
                                        :weaponKey weaponKey
                                        :level 0}
                                 (= (get weapon "energyType") "bullet")
                                 (merge {:bulletCount (get weapon "maxBulletCount")})))))
                         (get robot "weapons"))
            power (->> (concat (map (fn [d]
                                      (get-in data ["component" (:componentKey d) "powerCost"]))
                                    component)
                               (map (fn [d]
                                      (get-in data ["weapon" (:weaponKey d) "powerCost"]))
                                    weapon))
                       (apply - (get robot "power")))
            en (->> component
                    (filter (fn [d]
                              (some #(= % (:componentKey d)) ["energy1" "energy2" "energy3"])))
                    (map (fn [d] (get-in data ["component" (:componentKey d) "value" 0])))
                    (map int)
                    (apply +))
            armor (->> component
                       (filter (fn [d]
                                 (some #(= % (:componentKey d)) ["armor1" "armor2" "armor3"])))
                       (map (fn [d] (get-in data ["component" (:componentKey d) "value" 0])))
                       (map int)
                       (apply +))]
        {:robot robotKey
         :pilot "amuro"
         :hp 10000
         :en en
         :power power
         :tag #{}}))))

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

(defn getWeaponData [weaponKey]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str weaponKey " not found")))
      weaponData)))

(defn getUnitWeapons [gameplayCtx unit]
  (let [robotKey (get-in unit [:state :robot])
        weapons (get-in unit [:state :weapons :default])]
    (if weapons
      weapons
      [:default
       (let [robot (get-in data ["robot" robotKey])]
         (if (nil? robot)
           (throw (js/Error. (str robotKey "not found")))
           (mapv (fn [weaponKey]
                   (let [weapon (get-in data ["weapon" weaponKey])]
                     (if (nil? weapon)
                       (throw (js/Error. (str weaponKey " not found")))
                       (cond-> {:key (gensym)
                                :weaponKey weaponKey
                                :level 0}
                         (= (get weapon "energyType") "bullet")
                         (merge {:bulletCount (get weapon "maxBulletCount")})))))
                 (get robot "weapons"))))])))

(def getUnitWeaponsM (memoize getUnitWeapons))

(defn setUnitWeapons [gameplayCtx unit weapons]
  (update-in unit [:state :weapons] (fn [origin]
                                      (conj origin weapons))))



(defmethod app.gameplay.module/loadData :default [_]
  (a/go
    data))

(defmethod app.gameplay.module/unitCreate :default [_ gameplayCtx unit {:keys [robotKey] :as args}]
  (merge unit 
         {:state (createUnitStateForKey robotKey)}))

(defmethod app.gameplay.module/unitGetMovePathTree :default [_ gameplayCtx unit]
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        power (get-in unit [:state :power])
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

(defmethod app.gameplay.module/unitGetWeaponInfoFromState :default [_ gameplayCtx unit {:keys [weaponKey] :as weapon}]
  (let [weaponData (get-in data ["weapon" weaponKey])]
    (if (nil? weaponData)
      (throw (js/Error. (str weaponKey " not found")))
      (merge weaponData
             {:state weapon}))))

(defmethod app.gameplay.module/unitGetWeaponRange :default [type gameplayCtx unit weapon]
  (let [{[min max] "range" type "type"} (app.gameplay.module/unitGetWeaponInfoFromState type gameplayCtx unit weapon)]
    (->> (tool.map/simpleFindPath [0 0] (dec min))
         (into #{})
         (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                      (into #{})))
         (map (partial map + (:position unit))))))


(defmethod app.gameplay.module/unitGetWeaponType :default [type gameplayCtx unit weapon]
  (let [{[min max] "range" type "type"} (app.gameplay.module/unitGetWeaponInfoFromState type gameplayCtx unit weapon)]
    type))

(defmethod app.gameplay.module/unitGetMenuData :default [type gameplayCtx unit]
  (let [isBattleMenu (-> (app.gameplay.model/getFsm gameplayCtx)
                         (tool.fsm/currState)
                         (= :unitBattleMenu))
        weapons (->> (app.gameplay.module/unitGetWeapons type gameplayCtx unit)
                     second
                     (map (partial app.gameplay.module/unitGetWeaponInfoFromState type gameplayCtx unit)))
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

(defmethod app.gameplay.module/getHitRate :default [_ gameplayCtx unit weapon targetUnit]
  (let [isMelee true]
    (if isMelee
      (let [pilot 0]))))

(defmethod app.gameplay.module/unitThinkReaction :default [type gameplayCtx unit fromUnit weapon]
  (let [hitRate (app.gameplay.module/getHitRate type gameplayCtx fromUnit weapon unit)
        weapons (-> (app.gameplay.module/unitGetWeapons type gameplayCtx unit)
                    second)]
    [:attack (first weapons)]))

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