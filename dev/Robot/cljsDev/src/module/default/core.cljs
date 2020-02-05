(ns module.default.core
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.model])
  (:require [app.gameplay.module])
  (:require-macros [app.gameplay.macros :as m])
  (:require [tool.map])
  (:require [module.default.data])
  (:require-macros [module.default.core :as mm])
  (:require [module.default.phase.unitMenu])
  (:require [app.gameplay.phase.unitMenu :refer [unitMenu]])
  (:require [module.default.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.phase.unitSelectMovePosition :refer [unitSelectMovePosition]])
  (:require [module.default.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]]))

(defmethod app.gameplay.module/loadData :default [_]
  (a/go
    module.default.data/data))

(defmethod app.gameplay.module/gameplayOnInit :default [_ gameplayCtx]
  (let [[gameplayCtx _] (->> (get module.default.data/data "robot")
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
           (module.default.data/setUnitHp unit (module.default.data/getUnitMaxHp gameplayCtx unit))))
        ((fn [unit]
           (module.default.data/setUnitEn unit (module.default.data/getUnitMaxEn gameplayCtx unit)))))))

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
  (module.default.data/getUnitMovePathTree gameplayCtx unit))

(defmethod app.gameplay.module/unitGetWeapons :default [_ gameplayCtx unit]
  (module.default.data/getUnitWeaponsM gameplayCtx unit))

(defmethod app.gameplay.module/unitIsDead :default [_ gameplayCtx unit]
  (<= (get-in unit [:state :hp]) 0))

(defmethod app.gameplay.module/unitGetInfo :default [_ gameplayCtx unit]
  (module.default.data/getUnitInfo gameplayCtx unit))

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