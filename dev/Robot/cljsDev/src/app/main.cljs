(ns app.main
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [app.map :as map])
  (:require [app.data :as data])
  (:require [app.gameplay :as gameplay])
  (:require [app.quadtree :as aq])
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
(m/defstate createMap [ctx args])
(m/defstate createUnits [ctx args])

(m/defstate unitMenu [gameplayCtx _]
  (= "setCursor" cmd)
  (m/handleCursor gameplayCtx))

(m/defstate selectSingleUnit [ctx args])

(m/defstate battleMenu [ctx args])
(m/defstate systemMenu [ctx args])
(m/defstate unitMove [ctx args])
(m/defstate selectPosition [gameplayCtx args]
  ; 要跳出去的記得回傳格式為[ctx answer]
  (= "cancel" cmd)
  [gameplayCtx nil]

  (= "setCamera" cmd)
  (let [camera args
        gameplayCtx (-> gameplayCtx
                        (gameplay/setCamera camera))
        moveRange (get-in gameplayCtx [:temp :moveRange])]
    (a/<! (createUnits nil
                       {:units (gameplay/getLocalUnits gameplayCtx nil nil)
                        :players (gameplay/getPlayers gameplayCtx)}
                       inputCh outputCh))
    (m/notifySetMap gameplayCtx)
    (m/notifySetCamera gameplayCtx)
    (m/notifySetCursor gameplayCtx)
    (a/>! outputCh ["setMoveRange" (map #(gameplay/world2local (gameplay/getCamera gameplayCtx) %)
                                        moveRange)])
    (recur gameplayCtx))

  (= "setCursor" cmd)
  (m/handleCursor gameplayCtx))


(defn selectUnitFlow-moveRange-move [gameplayCtx unit inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (let [weapons (app.unitState/getWeapons nil (:state unit) (:data gameplayCtx))
            [gameplayCtx select] (a/<! (unitMenu gameplayCtx [[(range (count weapons)) "cancel"]
                                                              {:weaponIdx 0
                                                               :weapons weapons
                                                               :weaponRange (map (fn [{[min max] "range" type "type" :as weapon}]
                                                                                   (->> (map/simpleFindPath (:position unit) min)
                                                                                        (into #{})
                                                                                        (clojure.set/difference (->> (map/simpleFindPath (:position unit) max)
                                                                                                                     (into #{})))
                                                                                        (map (partial gameplay/local2world (gameplay/getCamera gameplayCtx)))))
                                                                                 weapons)}]
                                                 inputCh outputCh))]
        (cond
          (= "end" select)
          [gameplayCtx true]

          (= "cancel" select)
          (let []
            (a/<! (createUnits nil
                               {:units (gameplay/getLocalUnits gameplayCtx nil nil)
                                :players (gameplay/getPlayers gameplayCtx)}
                               inputCh outputCh))
            [gameplayCtx false])
          
          :else
          (recur gameplayCtx))))))

(defn selectUnitFlow-moveRange [gameplayCtx unit inputCh outputCh]
  (a/go
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
                                         (fn [curr] 0))
          moveRange (map first shortestPathTree)
          gameplayCtx (update-in gameplayCtx [:temp :moveRange] (constantly moveRange))]
      (a/>! outputCh ["setMoveRange" (map #(gameplay/world2local (gameplay/getCamera gameplayCtx) %)
                                          moveRange)])
      (loop [gameplayCtx gameplayCtx]
        (let [[gameplayCtx localCursor] (a/<! (selectPosition gameplayCtx nil inputCh outputCh))]
          (if localCursor
            (let [camera (gameplay/getCamera gameplayCtx)
                  cursor (gameplay/local2world camera localCursor)
                  isInRange (some #(= % cursor) moveRange)]
              (if isInRange
                (let [path (->>
                            (map/buildPath shortestPathTree cursor)
                            (map (partial gameplay/world2local camera)))]
                  (a/<! (unitMove nil {:unit (:key unit) :path path} inputCh outputCh))
                  (let [[gameplayCtx isEnd] (a/<! (selectUnitFlow-moveRange-move gameplayCtx unit inputCh outputCh))]
                    (if isEnd
                      (let [gameplayCtx (gameplay/updateUnit gameplayCtx unit (merge unit {:position cursor}))]
                        [gameplayCtx true])
                      (recur gameplayCtx))))
                (recur gameplayCtx)))
            (do
              (a/>! outputCh ["setMoveRange" []])
              (let [gameplayCtx (update-in gameplayCtx [:temp :moveRange] (constantly []))]
                [gameplayCtx false]))))))))

(defn selectUnitFlow [gameplayCtx unit inputCh outputCh]
  (a/go-loop [gameplayCtx gameplayCtx]
    (println "[model][selectUnitFlow]")
    (let [weapons (app.unitState/getWeapons nil (:state unit) (:data gameplayCtx))
          [gameplayCtx selectUnitMenu] (a/<! (unitMenu gameplayCtx [["move" (range (count weapons)) "cancel"]
                                                                    {:weaponIdx 1
                                                                     :weapons weapons
                                                                     :weaponRange (map (fn [{[min max] "range" type "type" :as weapon}]
                                                                                         (->> (map/simpleFindPath (:position unit) min)
                                                                                              (into #{})
                                                                                              (clojure.set/difference (->> (map/simpleFindPath (:position unit) max)
                                                                                                                           (into #{})))
                                                                                              (map (partial gameplay/local2world (gameplay/getCamera gameplayCtx)))))
                                                                                       weapons)}]
                                                       inputCh outputCh))]
      (println "[model][selectUnitFlow]" selectUnitMenu)
      (cond
        (= "move" selectUnitMenu)
        (let [[gameplayCtx isEnd] (a/<! (selectUnitFlow-moveRange gameplayCtx unit inputCh outputCh))]
          (if isEnd
            [gameplayCtx true]
            (recur gameplayCtx)))

        (= "cancel" selectUnitMenu)
        (let []
          [gameplayCtx false])

        (int? (js/parseInt selectUnitMenu))
        (let [[gameplayCtx isEnd] (loop [gameplayCtx gameplayCtx]
                                    (let [idx (js/parseInt selectUnitMenu)
                                          {[min max] "range" type "type" :as selectWeapon} (nth weapons idx)
                                          attackRange (->> (map/simpleFindPath (:position unit) min)
                                                           (into #{})
                                                           (clojure.set/difference (->> (map/simpleFindPath (:position unit) max)
                                                                                        (into #{}))))
                                          units (gameplay/getUnits gameplayCtx nil  (aq/makeRectFromPoint (:position unit) gameplay/mapViewSize))
                                          unitsInRange (filter #(contains? attackRange (:position %)) units)
                                          [gameplayCtx selectUnit] (a/<! (selectSingleUnit gameplayCtx unitsInRange inputCh outputCh))
                                          [gameplayCtx localCursor] (a/<! (selectPosition gameplayCtx nil inputCh outputCh))
                                          cursor (gameplay/local2world (gameplay/getCamera gameplayCtx) localCursor)
                                          units (gameplay/getUnits gameplayCtx nil nil)]
                                      (condp = (get selectWeapon "type")
                                        "single"
                                        (let [unitAtCursor (first (filter #(= cursor (:position %))
                                                                          units))]
                                          (if unitAtCursor
                                            (let [[gameplayCtx select] (a/<! (battleMenu gameplayCtx nil inputCh outputCh))]
                                              (cond
                                                (= "ok" select)
                                                [gameplayCtx false]

                                                (= "cancel" select)
                                                [gameplayCtx false]

                                                :else
                                                (recur gameplayCtx)))
                                            [gameplayCtx false]))

                                        [gameplayCtx false])))]
          (recur gameplayCtx))

        :else
        (recur gameplayCtx)))))

(defn selectNoUnitFlow [gameplayCtx inputCh outputCh]
  (a/go-loop [gameplayCtx gameplayCtx]
    (println "[model][selectNoUnitFlow]")
    (let [[gameplayCtx select] (a/<! (systemMenu gameplayCtx ["endTurn" "cancel"] inputCh outputCh))]
      (println "[model][selectNoUnitFlow]" "unitMenu " select)
      (cond
        (= "endTurn" select)
        (let []
          [gameplayCtx true])

        (= "cancel" select)
        (let []
          [gameplayCtx false])

        :else
        (recur gameplayCtx)))))

(defn playerTurn [gameplayCtx inputCh outputCh]
  (a/go
    (a/<! (playerTurnStart nil nil inputCh outputCh))
    (loop [gameplayCtx gameplayCtx]
      (println "[model][playerTurn]")
      (a/>! outputCh ["playerTurn"])
      (let [[gameplayCtx localCursor] (a/<! (selectPosition gameplayCtx nil inputCh outputCh))
            cursor (gameplay/local2world (gameplay/getCamera gameplayCtx) localCursor)
            units (gameplay/getUnits gameplayCtx nil (aq/makeRectFromPoint cursor [1 1]))
            unitAtCursor (first (filter #(= cursor (:position %))
                                        units))]
        (if unitAtCursor
          (let [[gameplayCtx isEnd] (a/<! (selectUnitFlow gameplayCtx unitAtCursor inputCh outputCh))]
            (if isEnd
              (recur gameplayCtx)
              (recur gameplayCtx)))
          (let [[gameplayCtx endTurn] (a/<! (selectNoUnitFlow gameplayCtx inputCh outputCh))]
            (if endTurn
              gameplayCtx
              (recur gameplayCtx))))))))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (println "[model][enemyTurn]" enemy)
    (loop []
      (a/<! (enemyTurnStart gameplayCtx enemy inputCh outputCh))
      gameplayCtx)))

(defn gameplayLoop [gameplayCtx inputCh outputCh]
  (a/go-loop [gameplayCtx gameplayCtx]
    (println "[model][gameplayLoop]")
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

(m/defstate mainLoop [ctx args]
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
    (a/<! (createMap nil
                     (gameplay/getLocalMap gameplayCtx nil)
                     inputCh outputCh))
    (a/<! (createUnits nil
                       {:units (gameplay/getLocalUnits gameplayCtx nil nil)
                        :players (gameplay/getPlayers gameplayCtx)}
                       inputCh outputCh))
    (m/notifySetCamera gameplayCtx)
    (m/notifySetCursor gameplayCtx)
    (merge ctx {:gameplay (a/<! (gameplayLoop gameplayCtx inputCh outputCh))})))


(defn main []
  (let [outputToView (a/chan)
        inputFromView (a/chan)]

    (installViewRxjs inputFromView outputToView)
    (mainLoop defaultModel nil inputFromView outputToView)
    
    (comment "")))

(set! (.-startApp js/window)
      main)