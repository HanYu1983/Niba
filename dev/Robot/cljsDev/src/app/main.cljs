(ns app.main
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [app.map :as map])
  (:require [app.data :as data])
  (:require [app.gameplay :as gameplay])
  (:require [app.fsm])
  (:require [app.unitState])
  (:require [app.units])
  (:require-macros [app.macros :as m]))

(comment (let [ua {:key (gensym) :position [2 0]}
               a (-> app.units/model
                     (app.units/add ua)
                     (app.units/add {:key (gensym) :position [2 1]})
                     (app.units/add {:key (gensym) :position [3 3]})
                     (app.units/delete ua))]
           (println a)
           (println (app.units/getByPosition a [2 0]))
           (println (app.units/getByRegion a [0 0] [4 4]))))


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

(m/defstate prepareForStart [gameplayCtx args]
  (= "getLocalUnits" cmd)
  (let [[id] args
        units (gameplay/getLocalUnits gameplayCtx nil nil)]
    (a/>! outputCh ["ok", [id units]])
    (recur gameplayCtx))

  (= "getLocalMap" cmd)
  (let [[id] args
        localMap (gameplay/getLocalMap gameplayCtx nil)]
    (a/>! outputCh ["ok", [id localMap]])
    (recur gameplayCtx)))

(m/defstate playerTurnStart [ctx args])
(m/defstate enemyTurnStart [ctx args])

(defn playerTurn [gameplayCtx inputCh outputCh]
  (a/go
    (a/<! (playerTurnStart nil nil inputCh outputCh))
    (loop [gameplayCtx gameplayCtx]
      (let [[cmd args] (a/<! inputCh)]
        (cond
          (= "setState" cmd)
          (let [[id state] args
                gameplayCtx  (-> (gameplay/getFsm gameplayCtx)
                                 (app.fsm/setState state)
                                 ((fn [fsm]
                                    (gameplay/setFsm gameplayCtx fsm))))]
            (a/>! outputCh ["onStateChange" [(app.fsm/currState (gameplay/getFsm gameplayCtx)) nil]])
            (a/>! outputCh ["ok" [id]])
            (recur gameplayCtx))

          (= "pushState" cmd)
          (let [[id [state data]] args
                gameplayCtx (-> (gameplay/getFsm gameplayCtx)
                                (app.fsm/save data)
                                (app.fsm/pushState state)
                                ((fn [fsm]
                                   (gameplay/setFsm gameplayCtx fsm))))]
            (a/>! outputCh ["onStateChange" [(app.fsm/currState (gameplay/getFsm gameplayCtx)) nil]])
            (a/>! outputCh ["ok" [id]])
            (recur gameplayCtx))

          (= "popState" cmd)
          (let [[id] args
                gameplayCtx (-> (gameplay/getFsm gameplayCtx)
                                (app.fsm/popState)
                                ((fn [fsm]
                                   (gameplay/setFsm gameplayCtx fsm))))]
            (a/>! outputCh ["onStateChange" [(app.fsm/currState (gameplay/getFsm gameplayCtx))
                                             (app.fsm/load (gameplay/getFsm gameplayCtx))]])
            (a/>! outputCh ["ok" [id]])
            (recur gameplayCtx))

          (= "endTurn" cmd)
          (let [[id] args]
            (a/>! outputCh ["ok" [id]])
            gameplayCtx)

          (= "setCursor" cmd)
          (let [[id cursor] args
                gameplayCtx (gameplay/setCursor gameplayCtx cursor)]
            (a/>! outputCh ["ok", [id cursor]])
            (recur gameplayCtx))

          (= "setCamera" cmd)
          (let [[id camera] args
                gameplayCtx (gameplay/setCamera gameplayCtx camera)]
            (a/>! outputCh ["ok", [id camera]])
            (recur gameplayCtx))

          (= "getLocalUnits" cmd)
          (let [[id] args
                units (gameplay/getLocalUnits gameplayCtx nil nil)]
            (a/>! outputCh ["ok", [id units]])
            (recur gameplayCtx))

          (= "getLocalMap" cmd)
          (let [[id] args
                localMap (gameplay/getLocalMap gameplayCtx nil)]
            (a/>! outputCh ["ok", [id localMap]])
            (recur gameplayCtx))

          (= "getNormalState" cmd)
          (let [[id unitKey] args
                units (gameplay/getLocalUnits gameplayCtx nil nil)]
            (a/>! outputCh ["ok", [id]])
            (recur gameplayCtx))

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
          (let [data (a/<! (data/loadData))
                playmap (map/generateMap 100 100
                                         {:deepsea 0.3
                                          :sea 0.3
                                          :sand 0.3
                                          :grass 0.3
                                          :city 0.3
                                          :tree 0.3
                                          :award 0.1})
                gameplayCtx (-> gameplay/defaultGameplayModel
                                (gameplay/setData data)
                                (gameplay/setMap playmap))]
            (a/<! (prepareForStart gameplayCtx nil inputCh outputCh))
            (merge ctx {:gameplay (a/<! (gameplayLoop gameplayCtx inputCh outputCh))}))
          
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