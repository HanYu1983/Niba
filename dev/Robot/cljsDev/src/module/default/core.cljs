(ns module.default.core
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.module])
  (:require ["./data.js" :as dataJson]))

(def data (js->clj dataJson))

(def defaultUnitState {:robot "jimu"
                       :pilot "amuro"
                       :hp 2000
                       :mp 120
                       :component []
                       :weapon [{:weaponKey "beangun"
                                 :bulletCount 12}
                                {:weaponKey "bigsword"}]
                       :tag #{}})


(defmethod app.gameplay.module/loadData :default [_]
  (a/go
    data))

(defmethod app.gameplay.module/unitCreate :default [_ unit]
  (merge unit 
         {:state defaultUnitState}))

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
        weaponRange (into []
                          (map (fn [weapon]
                                 (app.gameplay.module/unitGetAttackRange type unit weapon gameplayCtx))
                               weapons))
        [menu data] (if isBattleMenu
                      [[(into [] (range (count weapons))) ["ok"] ["cancel"]]
                       {:weaponIdx 0
                        :weapons weapons
                        :weaponRange weaponRange}]
                      (cond
                        (-> (get-in unit [:state :tag])
                            (contains? :done))
                        [[["cancel"]] {}]

                        (-> (get-in unit [:state :tag])
                            (contains? :firstMove))
                        [[(into [] (range (count weapons))) ["ok"] ["cancel"]]
                         {:weaponIdx 0
                          :weapons weapons
                          :weaponRange weaponRange}]

                        :else
                        [[["move"] (into [] (range (count weapons))) ["ok"] ["cancel"]]
                         {:weaponIdx 1
                          :weapons weapons
                          :weaponRange weaponRange}]))]
    [menu data]))

(defmethod app.gameplay.module/unitOnMove :default [_ unit pos gameplayCtx]
  (-> unit
      (merge {:position pos})
      (update-in [:state :tag] #(conj % :firstMove))))

(defmethod app.gameplay.module/unitOnDone :default [_ unit gameplayCtx]
  (-> unit
      (update-in [:state :tag] #(conj % :done))))

(defmethod app.gameplay.module/unitOnTurnStart :default [_ unit gameplayCtx]
  (-> unit
      (update-in [:state :tag] (constantly #{}))))