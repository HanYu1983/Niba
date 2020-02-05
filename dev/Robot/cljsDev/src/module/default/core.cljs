(ns module.default.core
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.model])
  (:require [app.gameplay.module])
  (:require-macros [app.gameplay.macros :as m])
  (:require [tool.map])
  (:require [module.default.dataalg.data])
  (:require-macros [module.default.core :as mm])
  (:require [module.default.phase.unitMenu])
  (:require [app.gameplay.phase.unitMenu :refer [unitMenu]])
  (:require [module.default.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.phase.unitSelectMovePosition :refer [unitSelectMovePosition]])
  (:require [module.default.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]]))






; =======================
; binding
; =======================

(defmethod app.gameplay.module/loadData :default [_]
  (a/go
    module.default.dataalg.data/data))

(defmethod app.gameplay.module/gameplayOnInit :default [_ gameplayCtx]
  (let [[gameplayCtx _] (->> (get module.default.dataalg.data/data "robot")
                             (reduce (fn [[gameplayCtx i] [robotKey _]]
                                       [(app.gameplay.model/createUnit gameplayCtx
                                                                       {:player (if (< (rand) 0.5)
                                                                                  :player
                                                                                  :ai1)
                                                                        :type :robot
                                                                        :position [0 i]}
                                                                       {:robotKey robotKey})
                                        (inc i)])
                                     [gameplayCtx 1]))]
    gameplayCtx))

(defmethod app.gameplay.module/unitOnCreate :default [_ gameplayCtx unit {:keys [robotKey] :as args}]
  (let [unit (merge unit {:state {:robot robotKey
                                  :pilot "amuro"
                                  :weapons {}
                                  :components {}
                                  :tags #{}}})]
    (-> unit
        ((fn [unit]
           (module.default.dataalg.data/setUnitHp unit (module.default.dataalg.data/getUnitMaxHp gameplayCtx unit))))
        ((fn [unit]
           (module.default.dataalg.data/setUnitEn unit (module.default.dataalg.data/getUnitMaxEn gameplayCtx unit)))))))

(defmethod app.gameplay.module/unitOnMove :default [_ gameplayCtx unit pos]
  (-> unit
      (merge {:position pos})
      (update-in [:state :tags] #(conj % :move))))

(defmethod app.gameplay.module/unitOnDone :default [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tags] #(conj % :done))))

(defmethod app.gameplay.module/unitOnTurnStart :default [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tags] (constantly #{}))))

(defmethod app.gameplay.module/waitUnitOnDead :default [_ gameplayCtx unit]
  (a/go gameplayCtx))

(defmethod app.gameplay.module/waitUnitOnMenu :default [_ gameplayCtx args inputCh outputCh]
  (module.default.phase.unitMenu/unitMenu gameplayCtx args inputCh outputCh))

(defmethod app.gameplay.module/waitEnemyTurn :default [_ gameplayCtx enemy inputCh outputCh]
  (a/go
    (let [units (->> (app.gameplay.model/getUnits gameplayCtx)
                     (tool.units/getAll)
                     (filter (fn [unit]
                               (= (get unit :player) enemy))))]
      (loop [gameplayCtx gameplayCtx
             units units]
        (if (> (count units) 0)
          (let [unit (first units)
                gameplayCtx (-> (app.gameplay.model/updateUnit gameplayCtx unit (fn [unit]
                                                                                  unit)))]
            (recur gameplayCtx (rest units)))
          gameplayCtx)))))


(defmethod app.gameplay.module/unitGetMovePathTree :default [_ gameplayCtx unit]
  (let [playmap (app.gameplay.model/getMap gameplayCtx)
        power (/ (module.default.dataalg.data/getUnitPowerM gameplayCtx unit) 5)
        [mw mh] (tool.map/getMapSize playmap)]
    (->> (tool.map/findPath (:position unit)
                            (fn [{:keys [totalCost]} curr]
                              [(>= totalCost power) false])
                            (partial module.default.dataalg.data/nextCellM [mw mh])
                            (partial module.default.dataalg.data/moveCostM gameplayCtx)
                            (constantly 0))
         (filter (fn [[k v]]
                   (<= (:totalCost v) power)))
         (into {}))))

(defmethod app.gameplay.module/unitGetWeapons :default [_ gameplayCtx unit]
  (module.default.dataalg.data/getUnitWeaponsM gameplayCtx unit))

(defmethod app.gameplay.module/unitSetWeapons :default [_ gameplayCtx unit weapons]
  (module.default.dataalg.data/setUnitWeapons gameplayCtx unit weapons))

(defmethod app.gameplay.module/unitGetWeaponRange :default [type gameplayCtx unit weapon]
  (let [[min max] (module.default.dataalg.data/getWeaponRange gameplayCtx unit weapon)]
    (->> (tool.map/simpleFindPath [0 0] (dec min))
         (into #{})
         (clojure.set/difference (->> (tool.map/simpleFindPath [0 0] max)
                                      (into #{})))
         (map (partial map + (:position unit))))))

(defmethod app.gameplay.module/unitGetWeaponType :default [type gameplayCtx unit weapon]
  (module.default.dataalg.data/getWeaponType gameplayCtx unit weapon))

(defmethod app.gameplay.module/unitGetHitRate :default [_ gameplayCtx unit weapon targetUnit]
  (module.default.dataalg.data/getUnitHitRate gameplayCtx unit weapon targetUnit))

(defmethod app.gameplay.module/unitIsDead :default [_ gameplayCtx unit]
  (<= (get-in unit [:state :hp]) 0))

(defmethod app.gameplay.module/unitGetInfo :default [_ gameplayCtx unit]
  (module.default.dataalg.data/getUnitInfo gameplayCtx unit))

(defmethod app.gameplay.module/formatToDraw :default [_ gameplayCtx]
  (let [state (-> (app.gameplay.model/getFsm gameplayCtx)
                  (tool.fsm/currState))
        stateDetail (-> (app.gameplay.model/getFsm gameplayCtx)
                        (tool.fsm/load))]
    {:units (app.gameplay.model/getLocalUnits gameplayCtx nil nil)
     :map (app.gameplay.model/getLocalMap gameplayCtx nil)
     :cursor (app.gameplay.model/getLocalCursor gameplayCtx nil)
     :moveRange (app.gameplay.model/getLocalMoveRange gameplayCtx nil)
     :attackRange (app.gameplay.model/getLocalAttackRange gameplayCtx nil)
     :checkHitRate (->> (get-in gameplayCtx [:temp :checkHitRate])
                        (map (fn [info]
                               (-> info
                                   (update :unit (partial app.gameplay.model/mapUnitToLocal gameplayCtx nil))
                                   (update :targetUnit (partial app.gameplay.model/mapUnitToLocal gameplayCtx nil))))))
     :cellState (->> (get-in gameplayCtx [:temp :cellState]))
     :unitMenu (when (some #(= % state) [:unitMenu :unitBattleMenu])
                 (let [unit (get stateDetail :unit)
                       data (-> (get stateDetail :data)
                                (update :weapons (fn [weapons]
                                                   (map (partial module.default.dataalg.data/getWeaponInfo gameplayCtx unit) weapons))))
                       menuCursor (get stateDetail :menuCursor)]
                   {:menuCursor menuCursor
                    :data data}))
     :systemMenu (when (some #(= % state) [:menu])
                   (select-keys stateDetail [:menuCursor :data]))
     :battleMenu (when (some #(= % state) [:unitBattleMenu])
                   (let [{battleMenuSession :battleMenuSession} stateDetail]
                     {:preview (module.default.session.battleMenu/mapUnits battleMenuSession (partial app.gameplay.model/mapUnitToLocal gameplayCtx nil))}))
     :state state
     :stateDetail stateDetail}))