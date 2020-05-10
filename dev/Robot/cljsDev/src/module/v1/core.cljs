(ns module.v1.core
  (:require [clojure.core.async :as a])
  (:require [app.module])
  (:require [tool.map])
  (:require [tool.units])
  (:require [tool.fsm])
  (:require [module.v1.type])
  (:require [module.v1.data :as data])
  (:require-macros [module.v1.core :as core])
  (:require [module.v1.common :as common])
  (:require [module.v1.phase.playerTurn :refer [playerTurn]])
  (:require [module.v1.phase.enemyTurn :refer [enemyTurn]]))


(def mapViewSize [20 20])
(def gameplayCtx {:map [[]]
                  :camera [0 0]
                  :cursor [0 0]
                  :viewsize mapViewSize
                  :mapsize [20 20]
                  :units tool.units/model
                  :moveRange []
                  :players {:player {:faction 0}
                            :ai1 {:faction 1}
                            :ai2 {:faction 1}}
                  :fsm tool.fsm/model})

(defn gameplayLoop [gameplayCtx inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (let [gameplayCtx (a/<! (playerTurn gameplayCtx nil inputCh outputCh))
            ; 回傳空值代表有例外
            _ (when (nil? gameplayCtx)
                (throw (js/Error. "stop in playerTurn")))
            enemies (->> (:players gameplayCtx)
                         keys
                         (filter #(not= :player %)))
            enemyTurns (a/go-loop [gameplayCtx gameplayCtx
                                   enemies enemies]
                         (if (= (count enemies) 0)
                           gameplayCtx
                           (let [enemy (first enemies)
                                 gameplayCtx (a/<! (enemyTurn gameplayCtx enemy inputCh outputCh))
                                 _ (when (nil? gameplayCtx)
                                     (throw (js/Error. "stop in enemyTurn")))]
                             (recur gameplayCtx (rest enemies)))))
            _ (when (nil? enemyTurns)
                (throw (js/Error. "stop in enemyTurns")))]
        (recur (a/<! enemyTurns))))))


(defmethod app.module/loadData :v1 [_]
  (a/go
    nil))

(defmethod app.module/lobbyGetUnits :v1 [_ lobbyCtx])

(defmethod app.module/lobbyGetPilots :v1 [_ lobbyCtx])

(defmethod app.module/gameplayStart :v1 [_ ctx inputCh outputCh]
  (a/go
    (let [playmap (tool.map/generateMap 100 100
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
          gameplayCtx (-> gameplayCtx
                          (update-in [:map] (constantly playmap))
                          (data/createUnit {:playerKey :player} {:robotKey :gundam}))]
      (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
      (a/<! (gameplayLoop gameplayCtx inputCh outputCh)))))