(ns module.default.tmp
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [module.default.data])
  (:require [app.module])
  (:require-macros [app.gameplay.macros :as m])
  (:require [tool.map])
  (:require [module.default.data])
  (:require [module.default.session.battleMenu])
  (:require-macros [module.default.core :as mm])
  (:require [module.default.phase.enemyTurn]))

(defn gameplayOnInit [_ gameplayCtx]
  (let [[gameplayCtx _] (->> (get module.default.data/data :robot)
                             (reduce (fn [[gameplayCtx i] [robotKey _]]
                                       [(module.default.data/createUnit gameplayCtx
                                                                       {:player (if (< (rand) 0.5)
                                                                                  :player
                                                                                  :ai1)
                                                                        :type :robot
                                                                        :position [0 i]}
                                                                       {:robotKey robotKey})
                                        (inc i)])
                                     [gameplayCtx 1]))]
    gameplayCtx))

(defn gameplayOnUnitMove [_ gameplayCtx unit pos]
  (let [vel (->> (map - (:position unit) pos)
                 (repeat 2)
                 (apply map *)
                 (apply +))]
    (-> unit
        (merge {:position pos})
        (update-in [:state :tags] #(conj % [:move true]))
        (update-in [:state :tags] #(conj % [:velocity vel])))))

(defn gameplayOnUnitDone [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tags] #(conj % [:done true]))))

(defn gameplayOnUnitTurnStart [_ gameplayCtx unit]
  (-> unit
      (update-in [:state :tags] (constantly {}))))

(defn gameplayOnUnitDead [_ gameplayCtx unit]
  (a/go gameplayCtx))

(defn gameplayOnEnemyTurn [_ gameplayCtx enemy inputCh outputCh]
  (module.default.phase.enemyTurn/enemyTurn gameplayCtx enemy inputCh outputCh))

(defn gameplayGetUnitMovePathTree [_ gameplayCtx unit]
  (module.default.data/getUnitMovePathTree gameplayCtx unit))

(defn gameplayGetUnitWeapons [_ gameplayCtx unit]
  (module.default.data/getUnitWeapons gameplayCtx unit))

(defn gameplayGetUnitIsDead [_ gameplayCtx unit]
  (<= (get-in unit [:state :hp]) 0))

(defn gameplayGetUnitInfo [_ gameplayCtx unit]
  (module.default.data/getUnitInfo gameplayCtx unit))

(defn gameplayFormatToDraw [_ gameplayCtx]
  (let [state (-> (module.default.data/getFsm gameplayCtx)
                  (tool.fsm/currState))
        stateDetail (-> (module.default.data/getFsm gameplayCtx)
                        (tool.fsm/load))]
    {:units (module.default.data/getLocalUnits gameplayCtx nil nil)
     :map (module.default.data/getLocalMap gameplayCtx nil)
     :cursor (module.default.data/getLocalCursor gameplayCtx nil)
     :moveRange (module.default.data/getLocalMoveRange gameplayCtx nil)
     :attackRange (module.default.data/getLocalAttackRange gameplayCtx nil)
     :checkHitRate (when (not= state nil)
                     (->> (get-in gameplayCtx [:temp :checkHitRate])
                          (map (fn [info]
                                 (-> info
                                     (update :unit (partial module.default.data/mapUnitToLocal gameplayCtx nil))
                                     (update :targetUnit (partial module.default.data/mapUnitToLocal gameplayCtx nil)))))))
     :cellState (let [cursor (module.default.data/getCursor gameplayCtx)
                      unitAtCursor (-> (module.default.data/getUnits gameplayCtx)
                                       (tool.units/getByPosition cursor))
                      terrain (module.default.data/getTerrain gameplayCtx cursor)]
                  {:unit (when unitAtCursor
                           (module.default.data/mapUnitToLocal gameplayCtx nil unitAtCursor))
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
                     {:preview (module.default.session.battleMenu/mapUnits battleMenuSession (partial module.default.data/mapUnitToLocal gameplayCtx nil))}))
     :state state
     :stateDetail stateDetail}))


