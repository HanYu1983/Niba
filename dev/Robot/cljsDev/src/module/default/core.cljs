(ns module.default.core
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.model])
  (:require [app.module])
  (:require-macros [app.gameplay.macros :as m])
  (:require [tool.map])
  (:require [module.default.data])
  (:require-macros [module.default.core :as mm])
  (:require [module.default.phase.unitMenu])
  (:require [module.default.phase.enemyTurn])
  (:require [module.default.tmp]))

(defmethod app.module/loadData :default [_]
  (a/go
    module.default.data/data))

(defmethod module.default.tmp/gameplayOnInit :default [_ gameplayCtx]
  (let [[gameplayCtx _] (->> (get module.default.data/data :robot)
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

(defmethod module.default.tmp/gameplayOnUnitCreate :default [_ gameplayCtx unit {:keys [robotKey] :as args}]
  (let [unit (merge unit {:state {:robot robotKey
                                  :pilot :amuro
                                  :weapons {}
                                  :components {}
                                  :tags {}}})]
    (-> unit
        ((fn [unit]
           (module.default.data/setUnitHp unit (module.default.data/getUnitMaxHp gameplayCtx unit))))
        ((fn [unit]
           (module.default.data/setUnitEn unit (module.default.data/getUnitMaxEn gameplayCtx unit)))))))

(defmethod module.default.tmp/gameplayOnUnitMove :default [_ gameplayCtx unit pos]
  (let [vel (->> (map - (:position unit) pos)
                 (repeat 2)
                 (apply map *)
                 (apply +))]
    (-> unit
        (merge {:position pos})
        (update-in [:state :tags] #(conj % [:move true]))
        (update-in [:state :tags] #(conj % [:velocity vel])))))

(defmethod module.default.tmp/gameplayOnUnitDone :default [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tags] #(conj % [:done true]))))

(defmethod module.default.tmp/gameplayOnUnitTurnStart :default [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tags] (constantly {}))))

(defmethod module.default.tmp/gameplayOnUnitDead :default [_ gameplayCtx unit]
  (a/go gameplayCtx))

(defmethod module.default.tmp/gameplayOnUnitMenu :default [_ gameplayCtx args inputCh outputCh]
  (module.default.phase.unitMenu/unitMenu gameplayCtx args inputCh outputCh))

(defmethod module.default.tmp/gameplayOnEnemyTurn :default [_ gameplayCtx enemy inputCh outputCh]
  (module.default.phase.enemyTurn/enemyTurn gameplayCtx enemy inputCh outputCh))


(defmethod module.default.tmp/gameplayGetUnitMovePathTree :default [_ gameplayCtx unit]
  (module.default.data/getUnitMovePathTree gameplayCtx unit))

(defmethod module.default.tmp/gameplayGetUnitWeapons :default [_ gameplayCtx unit]
  (module.default.data/getUnitWeapons gameplayCtx unit))

(defmethod module.default.tmp/gameplayGetUnitIsDead :default [_ gameplayCtx unit]
  (<= (get-in unit [:state :hp]) 0))

(defmethod module.default.tmp/gameplayGetUnitInfo :default [_ gameplayCtx unit]
  (module.default.data/getUnitInfo gameplayCtx unit))

(defmethod module.default.tmp/gameplayFormatToDraw :default [_ gameplayCtx]
  (let [state (-> (app.gameplay.model/getFsm gameplayCtx)
                  (tool.fsm/currState))
        stateDetail (-> (app.gameplay.model/getFsm gameplayCtx)
                        (tool.fsm/load))]
    {:units (app.gameplay.model/getLocalUnits gameplayCtx nil nil)
     :map (app.gameplay.model/getLocalMap gameplayCtx nil)
     :cursor (app.gameplay.model/getLocalCursor gameplayCtx nil)
     :moveRange (app.gameplay.model/getLocalMoveRange gameplayCtx nil)
     :attackRange (app.gameplay.model/getLocalAttackRange gameplayCtx nil)
     :checkHitRate (when (not= state nil)
                     (->> (get-in gameplayCtx [:temp :checkHitRate])
                          (map (fn [info]
                                 (-> info
                                     (update :unit (partial app.gameplay.model/mapUnitToLocal gameplayCtx nil))
                                     (update :targetUnit (partial app.gameplay.model/mapUnitToLocal gameplayCtx nil)))))))
     :cellState (let [cursor (app.gameplay.model/getCursor gameplayCtx)
                      unitAtCursor (-> (app.gameplay.model/getUnits gameplayCtx)
                                       (tool.units/getByPosition cursor))
                      terrain (module.default.data/getTerrain gameplayCtx cursor)]
                  {:unit (when unitAtCursor
                           (app.gameplay.model/mapUnitToLocal gameplayCtx nil unitAtCursor))
                   :terrain terrain})
     :unitMenu (when (some #(= % state) [:unitMenu :unitBattleMenu])
                 (let [unit (get stateDetail :unit)
                       data (-> (get stateDetail :data)
                                (update :weapons (fn [weapons]
                                                   (map (partial module.default.data/getWeaponInfo gameplayCtx unit) weapons))))
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


(defmethod app.module/lobbyGetUnits :default [_ lobbyCtx]
  (->> (get-in module.default.data/data [:robot])
       (map (fn [[k v]] [k {:cost (get v :cost)}]))
       (into {})))

(defmethod app.module/lobbyGetPilots :default [_ lobbyCtx]
  (->> (get-in module.default.data/data [:pilot])
       (map (fn [[k v]] [k {:cost (get v :cost)}]))
       (into {})))