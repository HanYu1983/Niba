(ns app.main
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.playerTurn :refer [playerTurn]])
  (:require [app.gameplay.phase.enemyTurn :refer [enemyTurn]])
  (:require [app.gameplay.phase.common :refer [updateMap
                                               updateUnits]]))


(def defaultModel {})

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


(defn mainLoop [ctx inputCh outputCh]
  (a/go
    (loop [ctx ctx]
      (let [[cmd args] (a/<! inputCh)]
        (cond
          (= "load" cmd)
          (recur ctx)

          (= "startGameplay" cmd)
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

            (merge ctx {:gameplay (a/<! (gameplayLoop gameplayCtx inputCh outputCh))}))

          :else
          (recur ctx))))))


(defn installViewRxjs [inputFromView outputToView]
  (let [viewOb (js/rxjs.Subject.)
        viewNotifyOb (js/rxjs.Subject.)]
    (set! (.-viewOb js/window)
          viewOb)
    (set! (.-viewNotifyOb js/window)
          viewNotifyOb))

  (let []
    (.subscribe (.-viewNotifyOb js/window)
                (fn [e]
                  ;(js/console.log "[view][receive]" e)
                  (a/go
                    (a/>! inputFromView (js->clj e))
                    ;(js/console.log "[view][receive] consume" e)
                    )))
    (a/go-loop []
      (let [evt (a/<! outputToView)
            evtJs (clj->js evt)]
        ;(js/console.log "[model][send]" evtJs)
        (.next (.-viewOb js/window) evtJs)
        (recur)))))

(defn main []
  (let [outputToView (a/chan)
        inputFromView (a/chan)]

    (installViewRxjs inputFromView outputToView)
    (mainLoop defaultModel inputFromView outputToView)

    (comment "")))

(set! (.-startApp js/window)
      main)