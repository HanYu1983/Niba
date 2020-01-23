(ns module.default.core
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.module])
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
       :weapon (map (fn [weaponKey]
                      (let [weapon (get-in data ["weapon" weaponKey])]
                        (if (nil? weapon)
                          (throw (js/Error. (str weaponKey "not found")))
                          {:key (gensym)
                           :weaponKey weaponKey
                           :bulletCount (get weapon "maxBulletCount")})))
                    (get robot "weapons"))
       :tag #{}})))

(defmethod app.gameplay.module/loadData :default [_]
  (a/go
    data))

(defmethod app.gameplay.module/unitCreate :default [_ unit]
  (merge unit 
         {:state (createUnitStateForKey "jimu")}))

(defmethod app.gameplay.module/unitGetWeapons :default [_ unit gameplayCtx]
  (->> (get-in unit [:state :weapon])
       (map (fn [{:keys [weaponKey] :as weapon}]
              (merge (get-in data ["weapon" weaponKey])
                     {:state weapon})))))

(defmethod app.gameplay.module/unitGetMovePathTree :default [_ unit gameplayCtx]
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        [mw mh] (tool.map/getMapSize playmap)]
    (tool.map/findPath (:position unit)
                       (fn [{:keys [totalCost]} curr]
                         [(>= totalCost 5) false])
                       (fn [[x y]]
                         [[x (min mh (inc y))]
                          [x (max 0 (dec y))]
                          [(min mw (inc x)) y]
                          [(max 0 (dec x)) y]])
                       (fn [curr next]
                         (-> playmap
                             (get-in next)
                             (/ 3)))
                       (constantly 0))))

(defmethod app.gameplay.module/unitGetAttackRange :default [_ unit {[min max] "range" type "type" :as weapon} gameplayCtx]
  (->> (tool.map/simpleFindPath [0 0] (dec min))
       (into #{})
       (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                    (into #{})))
       (map (partial map + (:position unit)))))

(defmethod app.gameplay.module/unitGetMenuData :default [type unit gameplayCtx]
  (let [isBattleMenu (-> (app.gameplay.model/getFsm gameplayCtx)
                         (tool.fsm/currState)
                         (= :unitBattleMenu))
        weapons (into [] (app.gameplay.module/unitGetWeapons type unit gameplayCtx))
        weaponKeys (-> (range (count weapons))
                       (into []))
        weaponRange (into []
                          (map (fn [weapon]
                                 (app.gameplay.module/unitGetAttackRange type unit weapon gameplayCtx))
                               weapons))
        [menu data] (if isBattleMenu
                      [[weaponKeys ["ok"] ["cancel"]]
                       {:weaponIdx 0
                        :weapons weapons
                        :weaponRange weaponRange}]
                      (cond
                        (-> (get-in unit [:state :tag])
                            (contains? :done))
                        [[["cancel"]] {}]

                        (-> (get-in unit [:state :tag])
                            (contains? :firstMove))
                        [[weaponKeys ["ok"] ["cancel"]]
                         {:weaponIdx 0
                          :weapons weapons
                          :weaponRange weaponRange}]

                        :else
                        [[["move"] weaponKeys ["ok"] ["cancel"]]
                         {:weaponIdx 1
                          :weapons weapons
                          :weaponRange weaponRange}]))]
    [menu data]))

(defmethod app.gameplay.module/unitOnMove :default [_ unit pos gameplayCtx]
  (-> unit
      (merge {:position pos})
      (update-in [:state :tag] #(conj % :firstMove2))))

(defmethod app.gameplay.module/unitOnDone :default [_ unit gameplayCtx]
  (-> unit
      (update-in [:state :tag] #(conj % :done))))

(defmethod app.gameplay.module/unitOnTurnStart :default [_ unit gameplayCtx]
  (-> unit
      (update-in [:state :tag] (constantly #{}))))