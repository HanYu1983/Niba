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


(println
 (let [bodys ['((= cmd 20) 20)
              '((= cmd 40) 30)]]
   `(cond
      ~@(first bodys)
      
      ~@(mapcat (fn [line]
                  `(~@line))
                bodys)
      
      :else
      (println "abc"))))


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

(m/defwait playerTurnStart [ctx args])
(m/defwait enemyTurnStart [ctx args])
(m/defwait updateMap [ctx args])
(m/defwait updateUnits [ctx args])
(m/defwait updateCursor [ctx args])
(m/defwait updateMoveRange [ctx args])
(m/defwait updateAttackRange [ctx args])

(m/defwait updatePlayTurn [ctx args])
(m/defwait updateUnitMenu [ctx args])
(m/defwait updateSystemMenu [ctx args])
(m/defwait updateUnitSelectMovePosition [ctx args])
(m/defwait updateUnitSelectSingleTarget [ctx args])
(m/defwait updateUnitBattleMenu [ctx args])
(m/defwait unitMoveAnim [ctx args])


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

(m/defstate unitSelectMovePosition [gameplayCtx {unit :unit paths :paths}]
  nil
  (m/basicNotify
   (or (app.fsm/load fsm) {:tempUnit unit})
   (a/<! (updateUnitSelectMovePosition nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor _ (recur gameplayCtx))

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]

   (= :enter action)
   (let [cursor (gameplay/getCursor gameplayCtx)
         camera (gameplay/getCamera gameplayCtx)
         path (map/buildPath paths cursor)]
     (a/<! (unitMoveAnim gameplayCtx {:unit unit :path (map (partial gameplay/world2local camera) path)} inputCh outputCh))
     (let [tempUnit (merge unit {:position cursor})
           state (merge state {:tempUnit tempUnit})
           units (-> gameplayCtx
                     (gameplay/getUnits)
                     (app.units/delete unit)
                     (app.units/add tempUnit))
           gameplayCtx (-> gameplayCtx
                           (gameplay/setUnits units)
                           (gameplay/setFsm (app.fsm/save fsm state)))

           [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit tempUnit} inputCh outputCh))]
       (if isEnd
         [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]
         (let [tempUnit (:tempUnit state)
               units (-> gameplayCtx
                         (gameplay/getUnits)
                         (app.units/delete tempUnit)
                         (app.units/add unit))
               gameplayCtx (-> gameplayCtx
                               (gameplay/setUnits units))]
           (recur gameplayCtx)))))))

(m/defstate unitBattleMenu [gameplayCtx {:keys [unit targetUnit]}]
  nil
  (m/basicNotify
   (or (app.fsm/load fsm) {:tempUnit unit})
   (a/<! (updateUnitBattleMenu nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor _ (recur gameplayCtx))

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]

   (= :enter action)
   (let [cursor (gameplay/getCursor gameplayCtx)
         units (gameplay/getUnits gameplayCtx)
         unitAtCursor (app.units/getByPosition units cursor)]
     (if unitAtCursor)
     (recur gameplayCtx))))

(m/defstate unitSelectSingleTarget [gameplayCtx {:keys [unit attackRange]}]
  nil
  (m/basicNotify
   (or (app.fsm/load fsm) {:tempUnit unit})
   (a/<! (updateUnitSelectSingleTarget nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor _ (recur gameplayCtx))

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]

   (= :enter action)
   (let [cursor (gameplay/getCursor gameplayCtx)
         units (gameplay/getUnits gameplayCtx)
         unitAtCursor (app.units/getByPosition units cursor)]
     (if unitAtCursor
       (let [[gameplayCtx isEnd] (a/<! (unitBattleMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh))]
         (if isEnd
           [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) true]
           (recur gameplayCtx)))
       (recur gameplayCtx)))))

(m/defstate unitMenu [gameplayCtx {unit :unit}]
  nil
  (m/basicNotify
   (or (app.fsm/load fsm)
       (let [weapons (into [] (app.unitState/getWeapons nil (:state unit) (gameplay/getData gameplayCtx)))
             menu [["move"] (into [] (range (count weapons))) ["cancel"]]]
         {:cursor 0
          :subcursor (into [] (repeat (count menu) 0))
          :menu [menu
                 {:weaponIdx 1
                  :weapons weapons
                  :weaponRange (into []
                                     (map (fn [{[min max] "range" type "type" :as weapon}]
                                            (->> (map/simpleFindPath (:position unit) (dec min))
                                                 (into #{})
                                                 (clojure.set/difference (->> (map/simpleFindPath (:position unit) max)
                                                                              (into #{})))))
                                          weapons))}]}))
   (a/<! (updateUnitMenu nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down])
   (let [menu (get-in state [:menu 0])
         cursor (:cursor state)
         dir {:up dec
              :down inc}
         cursor (-> cursor
                    ((action dir))
                    (max 0)
                    (min (dec (count menu))))
         state (update state :cursor (constantly cursor))


         cursor1 cursor
         cursor2 (get-in state [:subcursor cursor1])
         menu (get-in state [:menu 0])
         weaponIdx (get-in state [:menu 1 :weaponIdx])
         attackRange (if (= cursor1 weaponIdx)
                       (get-in state [:menu 1 :weaponRange cursor2])
                       [])


         gameplayCtx (-> gameplayCtx
                         (gameplay/setFsm (app.fsm/save fsm state))
                         (gameplay/setAttackRange attackRange))]
     (recur gameplayCtx))

   (some #(= % action) [:left :right])
   (let [cursor1 (:cursor state)
         cursor2 (get-in state [:subcursor cursor1])
         menu (get-in state [:menu 0])
         dir {:left dec
              :right inc}
         cursor2 (-> cursor2
                     ((action dir))
                     (max 0)
                     (min (dec (count (get menu cursor1)))))
         state (update-in state [:subcursor (:cursor state)] (constantly cursor2))


         menu (get-in state [:menu 0])
         weaponIdx (get-in state [:menu 1 :weaponIdx])
         attackRange (if (= cursor1 weaponIdx)
                       (get-in state [:menu 1 :weaponRange cursor2])
                       [])


         gameplayCtx (-> gameplayCtx
                         (gameplay/setFsm (app.fsm/save fsm state))
                         (gameplay/setAttackRange attackRange))]
     (recur gameplayCtx))

   (= :enter action)
   (let [cursor1 (:cursor state)
         cursor2 (get-in state [:subcursor cursor1])
         weaponIdx (get-in state [:menu 1 :weaponIdx])
         select (get-in state [:menu 0 cursor1 cursor2])]
     (cond
       (= cursor1 weaponIdx)
       (let [menu (get-in state [:menu 0])
             weaponIdx (get-in state [:menu 1 :weaponIdx])
             weapons (get-in state [:menu 1 :weapons])
             weapon (get weapons cursor2)
             weaponType (get weapon "type")]
         (println "XXX" weaponType)
         (cond
           (= "single" weaponType)
           (let [[gameplay isEnd] (a/<! (unitSelectSingleTarget gameplayCtx {:unit unit :attackRange []} inputCh outputCh))]
             (recur gameplayCtx))

           (= "line" weaponType)
           (recur gameplayCtx)

           :else
           (recur gameplayCtx)))

       (= "move" select)
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
             [gameplayCtx isEnd] (a/<! (unitSelectMovePosition gameplayCtx {:unit unit :paths shortestPathTree} inputCh outputCh))]
         (if isEnd
           [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) true]
           (recur gameplayCtx)))

       (= "cancel" select)
       (let []
         [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false])

       :else
       (recur gameplayCtx)))

   (= :cancel action)
   [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]))

(m/defstate systemMenu [gameplayCtx _]
  nil
  (m/basicNotify
   (let [menu [["endTurn"] ["cancel"]]]
     {:cursor 0
      :subcursor (into [] (repeat (count menu) 0))
      :menu [menu {}]})
   (a/<! (updateSystemMenu gameplayCtx state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down])
   (let [cursor (:cursor state)
         menu (get-in state [:menu 0])
         dir {:up dec
              :down inc}
         cursor (-> cursor
                    ((action dir))
                    (max 0)
                    (min (dec (count menu))))
         state (update state :cursor (constantly cursor))
         fsm (app.fsm/save fsm state)]
     (recur (gameplay/setFsm gameplayCtx fsm)))

   (= :enter action)
   (let [cursor1 (:cursor state)
         cursor2 (get-in state [:subcursor cursor1])
         select (get-in state [:menu 0 cursor1 cursor2])]
     (cond
       (= "endTurn" select)
       [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) true]

       (= "cancel" select)
       [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]

       :else
       (recur gameplayCtx)))

   (= :cancel action)
   [(gameplay/setFsm gameplayCtx (app.fsm/popState fsm)) false]))

(m/defstate playerTurn [gameplayCtx _]
  (let []
    (a/<! (playerTurnStart gameplayCtx nil inputCh outputCh))
    gameplayCtx)

  (m/basicNotify
   {}
   (a/<! (updatePlayTurn nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor
    cursor
    (let [unitAtCursor (-> (gameplay/getUnits gameplayCtx)
                           (app.units/getByPosition cursor))
          moveRange (if unitAtCursor
                      (let [[mw mh] gameplay/mapViewSize
                            shortestPathTree (map/findPath (:position unitAtCursor)
                                                           (fn [{:keys [totalCost]} curr]
                                                             [(>= totalCost 5) false])
                                                           (fn [[x y]]
                                                             [[x (min mh (inc y))]
                                                              [x (max 0 (dec y))]
                                                              [(min mw (inc x)) y]
                                                              [(max 0 (dec x)) y]])
                                                           (constantly 1)
                                                           (constantly 0))
                            moveRange (map first shortestPathTree)]
                        moveRange)
                      (let []
                        []))]
      (recur (-> gameplayCtx
                 (gameplay/setMoveRange moveRange)))))

   (= :enter action)
   (let [cursor (gameplay/getCursor gameplayCtx)
         unitAtCursor (-> (gameplay/getUnits gameplayCtx)
                          (app.units/getByPosition cursor))]
     (if unitAtCursor
       (let [[gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit unitAtCursor} inputCh outputCh))]
         (if isEnd
           (recur gameplayCtx)
           (recur gameplayCtx)))
       (let [[gameplayCtx endTurn] (a/<! (systemMenu gameplayCtx {} inputCh outputCh))]
         (if endTurn
           gameplayCtx
           (recur gameplayCtx)))))))

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