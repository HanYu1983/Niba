(ns app.gameplay.core
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.phase.playerTurn :refer [playerTurn]])
  (:require [app.gameplay.phase.enemyTurn :refer [enemyTurn]])
  (:require [app.gameplay.phase.common :refer [paint]])
  (:require [app.gameplay.module]))

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
    (let [playmap (tool.map/generateMap 100 100
                                        {:deepsea 0.3
                                         :sea 0.3
                                         :sand 0.3
                                         :grass 0.3
                                         :city 0.3
                                         :tree 0.3
                                         :award 0.1})
          gameplayCtx (-> app.gameplay.model/defaultGameplayModel
                          (app.gameplay.model/createUnit {:player :player
                                                          :type :robot
                                                          :position [0 0]}
                                                         {:robotKey "gaite"})
                          (app.gameplay.model/createUnit {:player :player
                                                          :type :robot
                                                          :position [3 3]}
                                                         {:robotKey "jimu"})
                          (app.gameplay.model/createUnit {:player :player
                                                          :type :robot
                                                          :position [6 6]}
                                                         {:robotKey "zGundam"})
                          (app.gameplay.model/setMap playmap))]
      (a/<! (paint nil (app.gameplay.model/formatToDraw gameplayCtx) inputCh outputCh))
      (merge ctx {:gameplay (a/<! (gameplayLoop gameplayCtx inputCh outputCh))}))))