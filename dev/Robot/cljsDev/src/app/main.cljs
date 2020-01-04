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

(m/defwait playerTurnStart [ctx args])
(m/defwait enemyTurnStart [ctx args])
(m/defwait updateMap [ctx args])
(m/defwait updateUnits [ctx args])
(m/defwait updateCursor [ctx args])

(m/defwait updatePlayTurn [ctx args])
(m/defwait updateUnitMenu [ctx args])
(m/defwait updateSystemMenu [ctx args])
(m/defwait updateUnitSelectMovePosition [ctx args])
(m/defwait unitMoveAnim [ctx args])

(m/defwait updateMoveRange [ctx args])
(m/defwait updateAttackRange [ctx args])

(def actions {87 :up
              83 :down
              65 :left
              68 :right
              13 :enter
              27 :cancel
              38 :rup
              40 :rdown
              37 :rleft
              39 :rright})

(declare unitMenu)

(m/defstate unitSelectMovePosition [gameplayCtx {unit :unit paths :paths camera :camera}]
  nil
  (let [fsm (gameplay/getFsm gameplayCtx)
        state (or (app.fsm/load fsm) {:cursor (:position unit)
                                      :camera camera})]
    (a/<! (updateMap nil (gameplay/getLocalMap gameplayCtx (:camera state)) inputCh outputCh))
    (a/<! (updateCursor nil (gameplay/world2local (:camera state) (:cursor state)) inputCh outputCh))
    (a/<! (updateUnits nil (gameplay/getLocalUnits gameplayCtx (:camera state) nil) inputCh outputCh))
    (a/<! (updateUnitSelectMovePosition nil state inputCh outputCh))
    (gameplay/setFsm gameplayCtx (app.fsm/save fsm state)))

  (= "KEY_DOWN" cmd)
  (let [keycode args
        action (get actions keycode)
        fsm (gameplay/getFsm gameplayCtx)
        state (app.fsm/load fsm)]
    (cond
      (some #(= % action) [:up :down :left :right])
      (let [dir {:up [0 -1]
                 :down [0 1]
                 :left [-1 0]
                 :right [1 0]}
            state (update state :cursor (partial map + (action dir)))
            fsm (app.fsm/save fsm state)]
        (println fsm)
        (recur (gameplay/setFsm gameplayCtx fsm)))

      (= :enter action)
      (let [cursor (:cursor state)
            path (map/buildPath paths cursor)]
        (a/<! (unitMoveAnim gameplayCtx {:unit unit :path path} inputCh outputCh))
        (let [gameplayCtx (-> gameplayCtx
                              (gameplay/getUnits)
                              (app.units/delete unit)
                              (app.units/add (merge unit {:position cursor}))
                              ((fn [units]
                                 (gameplay/setUnits gameplayCtx units))))
              [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx unit inputCh outputCh))]
          (if isEnd
            [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]
            (recur gameplayCtx))))

      (= :cancel action)
      [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]

      (some #(= % action) [:rup :rdown :rleft :rright])
      (let [dir {:rup [0 -1]
                 :rdown [0 1]
                 :rleft [-1 0]
                 :rright [1 0]}
            state (update state :camera (partial map + (action dir)))
            fsm (app.fsm/save fsm state)]
        (println fsm)
        (recur (gameplay/setFsm gameplayCtx fsm)))

      :else
      (recur gameplayCtx))))

(m/defstate unitMenu [gameplayCtx {unit :unit camera :camera}]
  nil
  (let [fsm (gameplay/getFsm gameplayCtx)
        state (or (app.fsm/load fsm) 
                  (let [weapons (app.unitState/getWeapons nil (:state unit) (gameplay/getData gameplayCtx))
                        menu [["move"] (range (count weapons)) ["cancel"]]]
                    {:camera camera
                     :cursor 0
                     :subcursor (into [] (repeat (count menu) 0))
                     :menu [menu
                            {:weaponIdx 1
                             :weapons weapons
                             :weaponRange (map (fn [{[min max] "range" type "type" :as weapon}]
                                                 (->> (map/simpleFindPath (:position unit) (dec min))
                                                      (into #{})
                                                      (clojure.set/difference (->> (map/simpleFindPath (:position unit) max)
                                                                                   (into #{})))
                                                      (map (partial gameplay/local2world (gameplay/getCamera gameplayCtx)))))
                                               weapons)}]}))]
    (a/<! (updateMap nil (gameplay/getLocalMap gameplayCtx (:camera state)) inputCh outputCh))
    (a/<! (updateUnits nil (gameplay/getLocalUnits gameplayCtx (:camera state) nil) inputCh outputCh))
    (a/<! (updateUnitMenu nil state inputCh outputCh))
    (gameplay/setFsm gameplayCtx (app.fsm/save fsm state)))

  (= "KEY_DOWN" cmd)
  (let [keycode args
        action (get actions keycode)
        fsm (gameplay/getFsm gameplayCtx)
        state (app.fsm/load fsm)]
    (cond
      (some #(= % action) [:up :down])
      (let [dir {:up dec
                 :down inc}
            state (update state :cursor (action dir))
            fsm (app.fsm/save fsm state)]
        (println fsm)
        (recur (gameplay/setFsm gameplayCtx fsm)))

      (some #(= % action) [:left :right])
      (let [dir {:left dec
                 :right inc}
            state (update-in state [:subcursor (:cursor state)] (action dir))
            fsm (app.fsm/save fsm state)]
        (println fsm)
        (recur (gameplay/setFsm gameplayCtx fsm)))

      (= :enter action)
      (let [[select] [:move]]
        (cond
          (= :move select)
          (let [[mw mh] gameplay/mapViewSize
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
                [gameplayCtx isEnd] (a/<! (unitSelectMovePosition gameplayCtx {:unit unit :paths shortestPathTree :camera (:camera state)} inputCh outputCh))]
            (if isEnd
              [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) true]
              (recur gameplayCtx)))

          :else
          (recur gameplayCtx)))

      (some #(= % action) [:rup :rdown :rleft :rright])
      (let [dir {:rup [0 -1]
                 :rdown [0 1]
                 :rleft [-1 0]
                 :rright [1 0]}
            state (update state :camera (partial map + (action dir)))
            fsm (app.fsm/save fsm state)]
        (recur (gameplay/setFsm gameplayCtx fsm)))

      (= :cancel action)
      [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]

      :else
      (recur gameplayCtx))))

(m/defstate systemMenu [gameplayCtx _]
  nil
  (let [fsm (gameplay/getFsm gameplayCtx)
        state (or (app.fsm/load fsm) (let [menu [["endTurn"] ["cancel"]]]
                                       {:cursor 0
                                        :subcursor (into [] (repeat (count menu) 0))
                                        :menu [menu {}]}))]
    (a/<! (updateSystemMenu gameplayCtx state inputCh outputCh))
    (gameplay/setFsm gameplayCtx (app.fsm/save fsm state)))

  (= "KEY_DOWN" cmd)
  (let [keycode args
        action (get actions keycode)
        fsm (gameplay/getFsm gameplayCtx)
        state (app.fsm/load fsm)]
    (cond
      (some #(= % action) [:up :down :left :right])
      (let [dir {:up dec
                 :down inc
                 :left dec
                 :right inc}
            state (update state :cursor (action dir))
            fsm (app.fsm/save fsm state)]
        (println fsm)
        (recur (gameplay/setFsm gameplayCtx fsm)))
      
      (= :cancel action)
      [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]
      
      :else
      (recur gameplayCtx))))

(m/defstate playerTurn [gameplayCtx _]
  (let []
    (a/<! (playerTurnStart gameplayCtx nil inputCh outputCh))
    gameplayCtx)
  
  (let [fsm (gameplay/getFsm gameplayCtx)
        state (or (app.fsm/load fsm) {:cursor [0 0]
                                      :camera [0 0]})]
    (a/<! (updateMap nil (gameplay/getLocalMap gameplayCtx (:camera state)) inputCh outputCh))
    (a/<! (updateCursor nil (gameplay/world2local (:camera state) (:cursor state)) inputCh outputCh))
    (a/<! (updateUnits nil (gameplay/getLocalUnits gameplayCtx (:camera state) nil) inputCh outputCh))
    (a/<! (updatePlayTurn gameplayCtx state inputCh outputCh))
    (gameplay/setFsm gameplayCtx (app.fsm/save fsm state)))

  (= "KEY_DOWN" cmd)
  (let [keycode args
        action (get actions keycode)
        fsm (gameplay/getFsm gameplayCtx)
        state (app.fsm/load fsm)]
    (cond
      (some #(= % action) [:up :down :left :right])
      (let [dir {:up [0 -1]
                 :down [0 1]
                 :left [-1 0]
                 :right [1 0]}
            state (update state :cursor (partial map + (action dir)))
            fsm (app.fsm/save fsm state)]
        (println fsm)
        (a/<! (updateCursor nil (gameplay/world2local (:camera state) (:cursor state)) inputCh outputCh))
        (recur (gameplay/setFsm gameplayCtx fsm)))

      (some #(= % action) [:rup :rdown :rleft :rright])
      (let [dir {:rup [0 -1]
                 :rdown [0 1]
                 :rleft [-1 0]
                 :rright [1 0]}
            state (update state :camera (partial map + (action dir)))
            fsm (app.fsm/save fsm state)]
        (recur (gameplay/setFsm gameplayCtx fsm)))

      (= :enter action)
      (let [cursor (:cursor state)
            unitAtCursor (-> (gameplay/getUnits gameplayCtx)
                             (app.units/getByPosition cursor))]
        (if unitAtCursor
          (let [[gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit unitAtCursor :camera (:camera state)} inputCh outputCh))]
            (if isEnd
              (recur gameplayCtx)
              (recur gameplayCtx)))
          (let [[gameplayCtx endTurn] (a/<! (systemMenu gameplayCtx {:camera (:camera state)} inputCh outputCh))]
            (if endTurn
              gameplayCtx
              (recur gameplayCtx)))))

      :else
      (recur gameplayCtx))))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (loop []
      (a/<! (enemyTurnStart gameplayCtx enemy inputCh outputCh))
      gameplayCtx)))

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

            (a/<! (updateMap gameplayCtx (gameplay/getLocalMap gameplayCtx nil) inputCh outputCh))
            (a/<! (updateUnits gameplayCtx (gameplay/getLocalUnits gameplayCtx nil nil) inputCh outputCh))

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