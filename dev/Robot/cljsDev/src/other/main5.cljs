(ns app.main5
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map :as map])
  (:require [app.data :as data])
  (:require [app.gameplay])
  (:require [app.fsm])
  (:require [app.gameplay.unit])
  (:require [tool.units])
  (:require-macros [app.macros :as m]))

(comment (let [ua {:key (gensym) :position [2 0]}
               a (-> tool.units/model
                     (tool.units/add ua)
                     (tool.units/add {:key (gensym) :position [2 1]})
                     (tool.units/add {:key (gensym) :position [3 3]})
            ;(tool.units/delete ua)
                     )]
           (println a)
           (println (tool.units/getByKey a (:key ua)))
           (println (tool.units/getByPosition a [2 0]))
           (println (tool.units/getByRegion a [0 0] [4 4]))))


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
                    ;(js/console.log "[view][receive] consume" e)
                    )))
    (a/go-loop []
      (let [evt (a/<! outputToView)
            evtJs (clj->js evt)]
        (js/console.log "[model][send]" evtJs)
        (.next (.-viewOb js/window) evtJs)
        (recur)))))

(m/defstate prepareForStart [gameplayCtx args]
  (= "getUnitsByRegion" cmd)
  (let [[id] args
        units (app.gameplay/getUnitsByRegion gameplayCtx nil nil)]
    (a/>! outputCh ["ok", [id units]])
    (recur gameplayCtx))

  (= "getLocalMap" cmd)
  (let [[id] args
        localMap (app.gameplay/getLocalMap gameplayCtx nil)]
    (a/>! outputCh ["ok", [id localMap]])
    (recur gameplayCtx))

  (= "getUnitNormalState" cmd)
  (let [[id unitKey] args
        unit (-> (app.gameplay/getUnits gameplayCtx)
                 (tool.units/getByKey unitKey))]
    (if unit
      (let [[mw mh] app.gameplay/mapViewSize
            shortestPathTree (map/findPath (:position unit)
                                           (fn [{:keys [totalCost]} curr]
                                             [(>= totalCost 5) false])
                                           (fn [[x y]]
                                             [[x (min mh (inc y))]
                                              [x (max 0 (dec y))]
                                              [(min mw (inc x)) y]
                                              [(max 0 (dec x)) y]])
                                           (constantly 1)
                                           (constantly 0))
            moveRange (map first shortestPathTree)
            gameplayCtx (update-in gameplayCtx [:temp :moveRange] (constantly moveRange))]
        (a/>! outputCh ["ok", [id {:unit unit :moveRange moveRange}]])
        (recur gameplayCtx))
      (throw (js/Error. (str unitKey " not found")))))

  (= "getLocalUnits" cmd)
  (let [[id] args
        units (app.gameplay/getLocalUnits gameplayCtx nil nil)]
    (a/>! outputCh ["ok", [id units]])
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
                gameplayCtx  (-> (app.gameplay/getFsm gameplayCtx)
                                 (app.fsm/setState state)
                                 ((fn [fsm]
                                    (app.gameplay/setFsm gameplayCtx fsm))))]
            (a/>! outputCh ["onStateChange" [(app.fsm/currState (app.gameplay/getFsm gameplayCtx)) nil]])
            (a/>! outputCh ["ok" [id]])
            (recur gameplayCtx))

          (= "pushState" cmd)
          (let [[id [state data]] args
                gameplayCtx (-> (app.gameplay/getFsm gameplayCtx)
                                (app.fsm/save data)
                                (app.fsm/pushState state)
                                ((fn [fsm]
                                   (app.gameplay/setFsm gameplayCtx fsm))))]
            (a/>! outputCh ["onStateChange" [(app.fsm/currState (app.gameplay/getFsm gameplayCtx)) nil]])
            (a/>! outputCh ["ok" [id]])
            (recur gameplayCtx))

          (= "popState" cmd)
          (let [[id] args
                gameplayCtx (-> (app.gameplay/getFsm gameplayCtx)
                                (app.fsm/popState)
                                ((fn [fsm]
                                   (app.gameplay/setFsm gameplayCtx fsm))))]
            (a/>! outputCh ["onStateChange" [(app.fsm/currState (app.gameplay/getFsm gameplayCtx))
                                             (app.fsm/load (app.gameplay/getFsm gameplayCtx))]])
            (a/>! outputCh ["ok" [id]])
            (recur gameplayCtx))

          (= "endTurn" cmd)
          (let [[id] args
                gameplayCtx (app.gameplay/setFsm gameplayCtx app.fsm/model)]
            (a/>! outputCh ["ok" [id]])
            gameplayCtx)

          (= "setCursor" cmd)
          (let [[id cursor] args
                gameplayCtx (app.gameplay/setCursor gameplayCtx cursor)]
            (a/>! outputCh ["ok", [id (app.gameplay/getCursor gameplayCtx)]])
            (recur gameplayCtx))

          (= "setCamera" cmd)
          (let [[id camera] args
                gameplayCtx (app.gameplay/setCamera gameplayCtx camera)]
            (a/>! outputCh ["ok", [id (app.gameplay/getCamera gameplayCtx)]])
            (recur gameplayCtx))

          (= "getLocalMap" cmd)
          (let [[id] args
                localMap (app.gameplay/getLocalMap gameplayCtx nil)]
            (a/>! outputCh ["ok", [id localMap]])
            (recur gameplayCtx))

          (= "getUnitsByRegion" cmd)
          (let [[id] args
                units (app.gameplay/getUnitsByRegion gameplayCtx nil nil)]
            (a/>! outputCh ["ok", [id units]])
            (recur gameplayCtx))

          (= "getUnitNormalState" cmd)
          (let [[id unitKey] args
                unit (-> (app.gameplay/getUnits gameplayCtx)
                         (tool.units/getByKey unitKey))]
            (if unit
              (let [[mw mh] app.gameplay/mapViewSize
                    shortestPathTree (map/findPath (:position unit)
                                                   (fn [{:keys [totalCost]} curr]
                                                     [(>= totalCost 5) false])
                                                   (fn [[x y]]
                                                     [[x (min mh (inc y))]
                                                      [x (max 0 (dec y))]
                                                      [(min mw (inc x)) y]
                                                      [(max 0 (dec x)) y]])
                                                   (constantly 1)
                                                   (constantly 0))
                    moveRange (map first shortestPathTree)
                    gameplayCtx (update-in gameplayCtx [:temp :shortestPathTree] (constantly shortestPathTree))]
                (a/>! outputCh ["ok", [id {:unit unit :moveRange moveRange}]])
                (recur gameplayCtx))
              (throw (js/Error. (str unitKey " not found")))))

          (= "buildPath" cmd)
          (let [[id pos] args
                shortestPathTree (get-in gameplayCtx [:temp :shortestPathTree])
                path (map/buildPath shortestPathTree pos)]
            (a/>! outputCh ["ok", [id path]])
            (recur gameplayCtx))

          (= "getUnitMenu" cmd)
          (let [[id unitKey] args
                unit (-> (app.gameplay/getUnits gameplayCtx)
                         (tool.units/getByKey unitKey))]
            (if unit
              (let [weapons (app.gameplay.model/getWeapons unit (app.gameplay/getData gameplayCtx))
                    menu [["move" (range (count weapons)) "cancel"]
                          {:weaponIdx 1
                           :weapons weapons
                           :weaponRange (map (fn [{[min max] "range" type "type" :as weapon}]
                                               (->> (map/simpleFindPath (:position unit) (dec min))
                                                    (into #{})
                                                    (clojure.set/difference (->> (map/simpleFindPath (:position unit) max)
                                                                                 (into #{})))
                                                    (map (partial app.gameplay/local2world (app.gameplay/getCamera gameplayCtx)))))
                                             weapons)}]]
                (a/>! outputCh ["ok" [id menu]])
                (recur gameplayCtx))
              (throw (js/Error. (str unitKey " not found")))))

          (= "getLocalUnits" cmd)
          (let [[id] args
                units (app.gameplay/getLocalUnits gameplayCtx nil nil)]
            (a/>! outputCh ["ok", [id units]])
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
                gameplayCtx (-> app.gameplay/defaultGameplayModel
                                (app.gameplay/setData data)
                                (app.gameplay/setMap playmap))
                [gameplayCtx] (a/<! (prepareForStart gameplayCtx nil inputCh outputCh))]
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