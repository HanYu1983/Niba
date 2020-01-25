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
      {:robot robotKey
       :pilot nil
       :hp (get robot "hp")
       :en (get robot "en")
       :component []
       ; 使用vector(mapv)方便索引的存取(nth, get-in)
       :weapon (mapv (fn [weaponKey]
                       (let [weapon (get-in data ["weapon" weaponKey])]
                         (if (nil? weapon)
                           (throw (js/Error. (str weaponKey "not found")))
                           (cond-> {:key (gensym)
                                    :weaponKey weaponKey}
                             (= (get weapon "energyType") "bullet")
                             (merge {:bulletCount (get weapon "maxBulletCount")})))))
                     (get robot "weapons"))
       :tag #{}})))

(defmethod app.gameplay.module/loadData :default [_]
  (a/go
    data))

(defmethod app.gameplay.module/unitCreate :default [_ gameplayCtx unit {:keys [robotKey] :as args}]
  (merge unit 
         {:state (createUnitStateForKey robotKey)}))

(defn moveCost [gameplayCtx from to]
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        t1 (get-in data ["terrainMapping"
                         (str (get-in playmap (reverse from)))])
        t2 (get-in data ["terrainMapping"
                         (str (get-in playmap (reverse to)))])]
    (+ (get-in data ["terrain" t1 "cost"])
       (get-in data ["terrain" t2 "cost"]))))

(def moveCostM (memoize moveCost))


(defn nextCell [[mw mh] [x y]]
  [[x (min mh (inc y))]
   [x (max 0 (dec y))]
   [(min mw (inc x)) y]
   [(max 0 (dec x)) y]])

(def nextCellM (memoize nextCell))

(defmethod app.gameplay.module/unitGetMovePathTree :default [_ gameplayCtx unit]
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        power (get-in data ["robot" (get-in unit [:state :robot]) "power"])
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
  (get-in unit [:state :weapon]))

(defmethod app.gameplay.module/unitGetWeaponInfo :default [_ gameplayCtx unit {:keys [weaponKey]}]
  (let [weapon (get-in data ["weapon" weaponKey])]
    (if (nil? weapon)
      (throw (js/Error. (str weaponKey "not found")))
      weapon)))

(defmethod app.gameplay.module/unitGetWeaponRange :default [_ gameplayCtx unit {:keys [weaponKey]}]
  (let [{[min max] "range" type "type" :as weapon} (get-in data ["weapon" weaponKey])]
    (if (nil? weapon)
      (throw (js/Error. (str weaponKey "not found")))
      (->> (tool.map/simpleFindPath [0 0] (dec min))
           (into #{})
           (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                        (into #{})))
           (map (partial map + (:position unit)))))))


(defmethod app.gameplay.module/unitGetWeaponType :default [_ gameplayCtx unit {:keys [weaponKey]}]
  (let [{[min max] "range" type "type" :as weapon} (get-in data ["weapon" weaponKey])]
    (if (nil? weapon)
      (throw (js/Error. (str weaponKey "not found")))
      (get weapon "type"))))

(defmethod app.gameplay.module/unitGetMenuData :default [type gameplayCtx unit]
  (let [isBattleMenu (-> (app.gameplay.model/getFsm gameplayCtx)
                         (tool.fsm/currState)
                         (= :unitBattleMenu))
        weapons (app.gameplay.module/unitGetWeapons type gameplayCtx unit )
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