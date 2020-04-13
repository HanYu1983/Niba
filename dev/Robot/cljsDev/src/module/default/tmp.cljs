(ns module.default.tmp
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

(defn gameplayOnInit [_ gameplayCtx]
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

(defn gameplayOnUnitMenu [_ gameplayCtx args inputCh outputCh]
  (module.default.phase.unitMenu/unitMenu gameplayCtx args inputCh outputCh))

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


