(ns module.default.view
  (:require [clojure.set])
  (:require [clojure.core.async :as a])
  (:require [module.default.data])
  (:require [app.module])
  (:require-macros [module.default.macros :as m])
  (:require [tool.map])
  (:require [module.default.session.battleMenu])
  (:require-macros [module.default.core :as mm]))

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
                                                   (map (partial module.default.data/getWeaponInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit) weapons))))
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


