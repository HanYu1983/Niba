(ns app.gameplay.core
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.phase.playerTurn :refer [playerTurn]])
  (:require [app.gameplay.phase.enemyTurn :refer [enemyTurn]])
  (:require [app.gameplay.phase.common :refer [updateMap
                                               updateUnits]]))

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
    (let [data (a/<! (app.gameplay.data/loadData))
          playmap (app.gameplay.map/generateMap 100 100
                                                {:deepsea 0.3
                                                 :sea 0.3
                                                 :sand 0.3
                                                 :grass 0.3
                                                 :city 0.3
                                                 :tree 0.3
                                                 :award 0.1})
          gameplayCtx (-> app.gameplay.gameplay/defaultGameplayModel
                          (app.gameplay.gameplay/setData data)
                          (app.gameplay.gameplay/setMap playmap))]
      (a/<! (updateMap gameplayCtx (app.gameplay.gameplay/getLocalMap gameplayCtx nil) inputCh outputCh))
      (a/<! (updateUnits gameplayCtx (app.gameplay.gameplay/getLocalUnits gameplayCtx nil nil) inputCh outputCh))
      (merge ctx {:gameplay (a/<! (gameplayLoop gameplayCtx inputCh outputCh))}))))