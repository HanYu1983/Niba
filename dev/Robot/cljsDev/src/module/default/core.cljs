(ns module.default.core
  (:require [clojure.core.async :as a])
  (:require [app.module])
  (:require [module.default.phase.common])
  (:require [module.default.data])
  (:require [module.default.view])
  (:require [module.default.phase.enemyTurn])
  (:require [module.default.phase.playerTurn]))

(defmethod app.module/loadData :default [_]
  (a/go
    module.default.data/data))

(defmethod app.module/lobbyGetUnits :default [_ lobbyCtx]
  (->> (get-in module.default.data/data [:robot])
       (map (fn [[k v]] [k {:cost (get v :cost)}]))
       (into {})))

(defmethod app.module/lobbyGetPilots :default [_ lobbyCtx]
  (->> (get-in module.default.data/data [:pilot])
       (map (fn [[k v]] [k {:cost (get v :cost)}]))
       (into {})))


(defn gameplayLoop [gameplayCtx inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (let [gameplayCtx (a/<! (module.default.phase.playerTurn/playerTurn gameplayCtx nil inputCh outputCh))
            ; 回傳空值代表有例外
            _ (when (nil? gameplayCtx)
                (throw (js/Error. "stop in module.default.phase.playerTurn/playerTurn")))
            enemies (->> (:players gameplayCtx)
                         keys
                         (filter #(not= :player %)))
            enemyTurns (a/go-loop [gameplayCtx gameplayCtx
                                   enemies enemies]
                         (if (= (count enemies) 0)
                           gameplayCtx
                           (let [enemy (first enemies)
                                 gameplayCtx (a/<! (module.default.phase.enemyTurn/enemyTurn gameplayCtx enemy inputCh outputCh))
                                 _ (when (nil? gameplayCtx)
                                     (throw (js/Error. "stop in module.default.phase.enemyTurn/enemyTurn")))]
                             (recur gameplayCtx (rest enemies)))))
            _ (when (nil? enemyTurns)
                (throw (js/Error. "stop in enemyTurns")))]
        (recur (a/<! enemyTurns))))))


(defmethod app.module/gameplayStart :default [_ ctx inputCh outputCh]
  (a/go
    (let [lobbyCtx (:lobbyCtx ctx)
          playmap (tool.map/generateMap 100 100
                                        {:deepsea 0.6
                                         :sea 0.6
                                         :sand 0.1
                                         :grass 1
                                         :hill 1
                                         :city 0.3
                                         :tree 0.4
                                         :award 0.01
                                         :power 1
                                         :offset 0})
          gameplayCtx (-> module.default.data/defaultGameplayModel
                          (module.default.data/setMap playmap)
                          ((partial module.default.data/gameplayOnInit ctx))
                          (module.default.data/createUnit {:player :player
                                                           :type :robot
                                                           :position [0 0]}
                                                          {:robotKey :gundam})
                          (module.default.data/createUnit {:player :player
                                                           :type :robot
                                                           :position [4 0]}
                                                          {:robotKey :gaite_land})
                          (module.default.data/createUnit {:player :ai1
                                                           :type :robot
                                                           :position [2 0]}
                                                          {:robotKey :gundam}))]
      (a/<! (module.default.phase.common/paint nil (module.default.view/gameplayFormatToDraw nil gameplayCtx) inputCh outputCh))
      (merge ctx {:gameplay (a/<! (gameplayLoop gameplayCtx inputCh outputCh))}))))