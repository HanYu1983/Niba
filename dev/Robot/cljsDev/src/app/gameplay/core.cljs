(ns app.gameplay.core
  (:require [clojure.core.async :as a])
  (:require [module.default.phase.playerTurn :refer [playerTurn]])
  (:require [app.gameplay.phase.enemyTurn :refer [enemyTurn]])
  (:require [module.default.phase.common :refer [paint]])
  (:require [app.module])
  (:require [module.default.tmp]))

(defn gameplayLoop [gameplayCtx inputCh outputCh]
  (a/go-loop [gameplayCtx gameplayCtx]
    (let [gameplayCtx (a/<! (playerTurn gameplayCtx nil inputCh outputCh))
          enemies (->> (:players gameplayCtx)
                       keys
                       (filter #(not= :player %)))
          enemyTurns (a/go-loop [gameplayCtx gameplayCtx
                                 enemies enemies]
                       (if (= (count enemies) 0)
                         gameplayCtx
                         (let [enemy (first enemies)
                               gameplayCtx (a/<! (enemyTurn gameplayCtx enemy inputCh outputCh))]
                           (recur gameplayCtx (rest enemies)))))]
      (recur (a/<! enemyTurns)))))


(defn startGameplay [ctx inputCh outputCh]
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
          gameplayCtx (-> (module.default.tmp/gameplayOnInit app.module/*module module.default.data/defaultGameplayModel)
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
                                                         {:robotKey :gundam})
                          (module.default.data/setMap playmap)
                          (merge {:lobbyCtx lobbyCtx}))]
      (a/<! (paint nil (module.default.tmp/gameplayFormatToDraw app.module/*module gameplayCtx) inputCh outputCh))
      (merge ctx {:gameplay (a/<! (gameplayLoop gameplayCtx inputCh outputCh))}))))