(ns app.main
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [app.map :as map])
  (:require [app.data :as data])
  (:require [app.gameplay :as gameplay])
  (:require [app.quadtree :as aq])
  (:require [app.fsm])
  (:require [app.unitState])
  (:require-macros [app.macros :as m]))

(def defaultModel {})

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
                  (js/console.log "[view][receive]" e)
                  (a/go
                    (a/>! inputFromView (js->clj e))
                    (js/console.log "[view][receive] consume" e))))
    (a/go-loop []
      (let [evt (a/<! outputToView)
            evtJs (clj->js evt)]
        (js/console.log "[model][send]" evtJs)
        (.next (.-viewOb js/window) evtJs)
        (recur)))))

(m/defstate playerTurnStart [ctx args])
(m/defstate enemyTurnStart [ctx args])

(defn playerTurn [gameplayCtx inputCh outputCh]
  (a/go
    (a/<! (playerTurnStart nil nil inputCh outputCh))
    (loop [gameplayCtx gameplayCtx]
      (let [[cmd [id args]] (a/<! inputCh)]
        (cond
          (= "setState" cmd)
          (let [state args
                gameplayCtx  (-> (gameplay/getFsm gameplayCtx)
                                 (app.fsm/setState state)
                                 ((fn [fsm]
                                    (gameplay/setFsm gameplayCtx fsm))))]
            (a/>! outputCh ["onStateChange" [(app.fsm/currState (gameplay/getFsm gameplayCtx)) nil]])
            (a/>! outputCh ["ok" [id]])
            (recur gameplayCtx))

          (= "pushState" cmd)
          (let [[state data] args
                gameplayCtx (-> (gameplay/getFsm gameplayCtx)
                                (app.fsm/save data)
                                (app.fsm/pushState state)
                                ((fn [fsm]
                                   (gameplay/setFsm gameplayCtx fsm))))]
            (a/>! outputCh ["onStateChange" [(app.fsm/currState (gameplay/getFsm gameplayCtx)) nil]])
            (a/>! outputCh ["ok" [id]])
            (recur gameplayCtx))

          (= "popState" cmd)
          (let [gameplayCtx (-> (gameplay/getFsm gameplayCtx)
                                (app.fsm/popState)
                                ((fn [fsm]
                                   (gameplay/setFsm gameplayCtx fsm))))]
            (a/>! outputCh ["onStateChange" [(app.fsm/currState (gameplay/getFsm gameplayCtx))
                                             (app.fsm/load (gameplay/getFsm gameplayCtx))]])
            (a/>! outputCh ["ok" [id]])
            (recur gameplayCtx))

          (= "endTurn" cmd)
          (let []
            (a/>! outputCh ["ok" [id]])
            gameplayCtx)

          :else
          (recur gameplayCtx))))))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (loop []
      (a/<! (enemyTurnStart gameplayCtx enemy inputCh outputCh))
      gameplayCtx)))

(defn gameplayLoop [gameplayCtx inputCh outputCh]
  (a/go-loop [gameplayCtx gameplayCtx]
    (let [gameplayCtx (a/<! (playerTurn gameplayCtx inputCh outputCh))
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
          (let []
            (merge ctx {:gameplay (a/<! (gameplayLoop gameplay/defaultGameplayModel inputCh outputCh))}))
          
          :else
          (recur ctx))))))

(defn main []
  (let [outputToView (a/chan)
        inputFromView (a/chan)]

    (installViewRxjs inputFromView outputToView)
    (mainLoop defaultModel inputFromView outputToView)
    
    (comment "")))

(set! (.-startApp js/window)
      main)