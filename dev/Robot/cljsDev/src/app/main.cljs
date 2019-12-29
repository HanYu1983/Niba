(ns app.main
  (:require [clojure.core.async :as a])
  (:require [app.map :as map])
  (:require [app.gameplay :as gameplay])
  (:require [app.quadtree :as aq])
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

(m/defstate systemMenu [ctx args])
(m/defstate unitMove [ctx args])
(m/defstate selectPosition [gameplayCtx args]
  ; 要跳出去的記得回傳格式為[ctx answer]
  (= "cancel" cmd)
  [gameplayCtx nil]

  (= "setCamera" cmd)
  (let [camera args
        gameplayCtx (-> gameplayCtx
                        (gameplay/setCamera camera))]
    (a/<! (createUnits nil
                       {:units (gameplay/getLocalUnits gameplayCtx nil nil)
                        :players (gameplay/getPlayers gameplayCtx)}
                       inputCh outputCh))
    (a/>! outputCh ["setMap" (gameplay/getLocalMap gameplayCtx nil)])
    (a/>! outputCh ["setCamera" (gameplay/getCamera gameplayCtx)])
    (a/>! outputCh ["setCursor" (gameplay/getLocalCursor gameplayCtx nil)])
    (recur gameplayCtx))

  (= "setCursor" cmd)
  (m/handleCursor gameplayCtx))


(defn selectUnitFlow-move [gameplayCtx unit inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (let [[gameplayCtx select] (a/<! (unitMenu gameplayCtx [[["attack1" "attack2"] "cancel"]
                                                              {:weaponIdx 0
                                                               :weapons {:attack1 {:range-min 2
                                                                                   :range-max 4
                                                                                   :type :beam
                                                                                   :name "attack1"}
                                                                         :attack2 {:range-min 2
                                                                                   :range-max 4
                                                                                   :type :beam
                                                                                   :name "gan"}}}]
                                                 inputCh outputCh))]
        (cond
          (= "cancel" select)
          (let []
            (a/<! (createUnits nil
                               {:units (gameplay/getLocalUnits gameplayCtx nil nil)
                                :players (gameplay/getPlayers gameplayCtx)}
                               inputCh outputCh))
            gameplayCtx)

          :else
          (recur gameplayCtx))))))


(defn selectUnitFlow [gameplayCtx unit inputCh outputCh]
  (a/go-loop [gameplayCtx gameplayCtx]
    (println "[model][selectUnitFlow]")
    (let [[gameplayCtx selectUnitMenu] (a/<! (unitMenu gameplayCtx [["move" ["attack1" "attack2"] "cancel"] 
                                                                    {:weaponIdx 1 
                                                                     :weapons {:attack1 {:range-min 2 
                                                                                         :range-max 4
                                                                                         :type :beam
                                                                                         :name "attack1"}
                                                                               :attack2 {:range-min 2
                                                                                         :range-max 4
                                                                                         :type :beam
                                                                                         :name "gan"}}}]
                                                       inputCh outputCh))]
      (println "[model][selectUnitFlow]" selectUnitMenu)
      (cond
        (= "move" selectUnitMenu)
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
          (a/>! outputCh ["setMoveRange" moveRange])
          (recur (loop [gameplayCtx gameplayCtx]
                   (let [[gameplayCtx cursor] (a/<! (selectPosition gameplayCtx nil inputCh outputCh))]
                     (if cursor
                       (recur (let [camera (gameplay/getCamera gameplayCtx)
                                    cursor (gameplay/local2world camera cursor)
                                    isInRange (some #(= % cursor) moveRange)]
                                 (if isInRange
                                   (let [_ (update gameplayCtx :units (fn [origin]
                                                                        (replace {unit (merge unit {:position cursor})} origin)))
                                         path (map/buildPath shortestPathTree cursor)]
                                     (a/<! (unitMove nil {:unit (:key unit) :path path} inputCh outputCh))
                                     (a/<! (selectUnitFlow-move gameplayCtx unit inputCh outputCh)))
                                   gameplayCtx)))
                       (do 
                         (a/>! outputCh ["setMoveRange" []])
                         gameplayCtx))))))

        (= "cancel" selectUnitMenu)
        (let []
          gameplayCtx)

        (= "attack1" selectUnitMenu)
        (let []
          gameplayCtx)

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
      (let [[gameplayCtx cursor] (a/<! (selectPosition gameplayCtx nil inputCh outputCh))
            cursor (gameplay/getLocalCursor gameplayCtx nil)
            units (gameplay/getLocalUnits gameplayCtx nil (aq/makeRectFromPoint cursor [1 1]))
            unitAtCursor (first (filter #(= cursor (:position %))
                                        units))]
        (if unitAtCursor
          (let [gameplayCtx (a/<! (selectUnitFlow gameplayCtx unitAtCursor inputCh outputCh))]
            (recur gameplayCtx))
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
  (let [playmap (map/generateMap 100 100
                                 {:deepsea 0.3
                                  :sea 0.3
                                  :sand 0.3
                                  :grass 0.3
                                  :city 0.3
                                  :tree 0.3
                                  :award 0.1})

        gameplayCtx (-> gameplay/defaultGameplayModel
                        (gameplay/setMap playmap))]
    (a/<! (createMap nil
                     (gameplay/getLocalMap gameplayCtx nil)
                     inputCh outputCh))
    (a/<! (createUnits nil
                       {:units (gameplay/getLocalUnits gameplayCtx nil nil)
                        :players (gameplay/getPlayers gameplayCtx)}
                       inputCh outputCh))
    (a/>! outputCh ["setCamera" (gameplay/getCamera gameplayCtx)])
    (a/>! outputCh ["setCursor" (gameplay/getLocalCursor gameplayCtx nil)])
    (merge ctx {:gameplay (a/<! (gameplayLoop gameplayCtx inputCh outputCh))})))


(defn main []
  (let [outputToView (a/chan)
        inputFromView (a/chan)]

    (installViewRxjs inputFromView outputToView)
    (mainLoop defaultModel nil inputFromView outputToView)
    
    (comment "")))

(set! (.-startApp js/window)
      main)