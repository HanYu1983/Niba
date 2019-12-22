(ns app.main
  (:require [clojure.core.async :as a])
  (:require [app.map :as map])
  (:require-macros [app.macros :as m]))

(comment (let [shortestPathTree (map/findPath 0
                                              (fn [info curr]
                                                [(= curr 5) true])
                                              (fn [i] [(inc i)])
                                              (constantly 1)
                                              (constantly 1))
               path (map/buildPath shortestPathTree 5)]
           (println shortestPathTree)
           (println path))

         (let [shortestPathTree (map/findPath [5 5]
                                              (fn [{:keys [totalCost]} curr]
                                                [(>= totalCost 3) false])
                                              (fn [[x y]]
                                                [[x (inc y)] [x (max 0 (dec y))] [(inc x) y] [(max 0 (dec x)) y]])
                                              (constantly 1)
                                              (fn [curr] 0))
               path (map/buildPath shortestPathTree [2 5])]
           (println shortestPathTree)
           (println path))

         (let [shortestPathTree (map/findPath [0 0]
                                              (fn [{:keys [totalCost]} curr i]
                                                [(= [100 100] curr) true])
                                              (fn [[x y]]
                                                [[x (inc y)] [x (max 0 (dec y))] [(inc x) y] [(max 0 (dec x)) y]])
                                              (constantly 1)
                                              (fn [curr]
                                                (->> (map - curr [100 100])
                                                     (repeat 2)
                                                     (apply map *)
                                                     (apply +))))
               path (map/buildPath shortestPathTree [100 100])]
           (println path)))

(def defaultModel {})
(def defaultGameplayModel {:map nil
                           :players {:player {:faction 0}
                                     :ai1 {:faction 1}
                                     :ai2 {:faction 1}}
                           :units [{:key (gensym)
                                    :player :player
                                    :type :robot
                                    :state {:key 0}
                                    :position [0 0]}
                                   {:key (gensym)
                                    :player :a1
                                    :type :robot
                                    :state {:key 0}
                                    :position [5 5]}]
                           :focusUnitKey nil})

(defn ask [mult outputCh name args]
  ; gensym 要轉成字串才能和字串有相等性
  (let [tapCh (a/tap mult (a/chan))
        key (str (gensym name))
        worker (a/chan)]
    (a/go
      (println "[model][ask][question]" name args)
      (a/>! outputCh [name [key args]])
      (loop []
        (println "[model][ask][waitForAnswer]" key)
        (when-let [[cmd [resKey args] :as evt] (a/<! tapCh)]
          (if (= "ok" cmd)
            (println "[model][ask][answer]" evt)
            (println "[model][ask][ignore]" cmd))
          (if (= ["ok" key] [cmd resKey])
            (do
              (a/>! worker args)
              (a/close! tapCh)
              (a/close! worker))
            (recur)))))
    worker))

(defn main []
  (println "[model]" "rxjs")
  (let [viewOb (js/rxjs.Subject.)
        viewNotifyOb (js/rxjs.Subject.)]
    (set! (.-viewOb js/window)
          viewOb)
    (set! (.-viewNotifyOb js/window)
          viewNotifyOb))
  
  (let [viewCh (a/chan)
        viewNotifyCh (a/chan)
        ; 所有從viewNotifyMult中tap的channel一定要消費掉它的內容, 不然viewNotifyCh推不進新的內容
        viewNotifyMult (a/mult viewNotifyCh)]

    (comment (a/go-loop []
               (when-let [[cmd args :as evt] (a/<! viewCh)]
                 (println "view command:" evt)
                 (cond
                   (contains? #{"attackMenu"} cmd)
                   (let [[key _] args]
                     (a/>! viewNotifyCh ["ok" [key "cancel"]])
                     (recur))

                   (contains? #{"unitMenu"} cmd)
                   (let [[key _] args]
                     (a/>! viewNotifyCh ["ok" [key "cancel"]])
                     (recur))

                   (contains? #{"createMap"} cmd)
                   (let [[key _] args]
                     (a/>! viewNotifyCh ["ok" [key 0]])
                     (recur))

                   (contains? #{"moveTo"} cmd)
                   (let [[key pos] args]
                     (a/go []
                           (a/<! (a/timeout 1000))
                           (a/<! (a/timeout 1000))
                           (a/>! viewNotifyCh ["ok" [key 0]]))
                     (recur))

                   :else
                   (recur)))))

    (println "[model]" "view")
    (let []
      (.subscribe (.-viewNotifyOb js/window)
                  (fn [e]
                    (js/console.log "[view]" e)
                    (a/go
                      (a/>! viewNotifyCh (js->clj e)))))
      (a/go-loop []
        (let [evt (a/<! viewCh)
              evtJs (clj->js evt)]
          (js/console.log "[model]" evtJs)
          (.next (.-viewOb js/window) evtJs)
          (recur))))

    (println "[model]" "v3")
    (let [; 預設的緩衝大小是0, 要先有人準備好消化(<!)才能推進去(>!)
          ; 而因為這個chan會放在merge裡, 所以要預留緩衝
          systemInputCh (a/chan 999)


          simpleAsk (fn [name args]
                      (ask viewNotifyMult
                           viewCh
                           name
                           args))



          selectUnitFlow (fn [gameplayCtx inputCh outputCh]
                           (a/go-loop [gameplayCtx gameplayCtx]
                             (println "[model][selectUnitFlow]")
                             (let [selectUnitMenu (a/<! (simpleAsk "unitMenu" ["move" ["attack1" "attack2"] "cancel"]))]
                               (println "[model][selectUnitFlow]" selectUnitMenu)
                               (cond
                                 (= "cancel" selectUnitMenu)
                                 (do
                                   (a/<! (simpleAsk "unitMenuClose" 0))
                                   gameplayCtx)

                                 (= "attack1" selectUnitMenu)
                                 gameplayCtx

                                 (= "attack" selectUnitMenu)
                                 (recur (loop [gameplayCtx gameplayCtx]
                                          (let [selectAttackMenu (a/<! (simpleAsk "attackMenu" [["weapon1" "weapon2"] "cancel"]))]
                                            (cond
                                              (= "cancel" selectAttackMenu)
                                              (do
                                                (a/<! (simpleAsk "closeMenu" "attackMenu"))
                                                gameplayCtx)

                                              :else
                                              (recur gameplayCtx)))))

                                 :else
                                 (recur gameplayCtx)))))



          selectNoUnitFlow (fn [gameplayCtx inputCh outputCh]
                             (a/go-loop [gameplayCtx gameplayCtx]
                               (println "[model][selectNoUnitFlow]")
                               (let [select (a/<! (simpleAsk "unitMenu" ["endTurn" "cancel"]))]
                                 (println "[model][selectNoUnitFlow]" "unitMenu " select)
                                 (cond
                                   (= "endTurn" select)
                                   (let []
                                     (a/<! (simpleAsk "unitMenuClose" 0))
                                     (a/>! systemInputCh ["endPlayerTurn"])
                                     gameplayCtx)

                                   (= "cancel" select)
                                   (do
                                     (a/go
                                       (a/<! (simpleAsk "unitMenuClose" 0)))
                                     gameplayCtx)

                                   :else
                                   (recur gameplayCtx)))))



          playerTurn (fn [gameplayCtx inputCh outputCh]
                       (a/go-loop [gameplayCtx gameplayCtx]
                         (println "[model][playerTurn]")
                         (when-let [[cmd args :as evt] (a/<! inputCh)]
                           (println "[model][playerTurn][evt]" evt)
                           (cond
                             (= "endPlayerTurn" cmd)
                             (let []
                               gameplayCtx)

                             (= "setCursor" cmd)
                             (let [cursor args
                                   units (:units gameplayCtx)
                                   unitAtCursor (first (filter #(= cursor (:position %))
                                                               units))]
                               (if unitAtCursor
                                 (let []
                                   (a/<! (simpleAsk "unitStateMenu" 0))
                                   (a/<! (simpleAsk "setCursor" cursor))
                                   gameplayCtx)
                                 (let []
                                   (a/<! (simpleAsk "setCursor" cursor))
                                   gameplayCtx)))

                             (= "selectMap" cmd)
                             (recur (let [cursor args
                                          units (:units gameplayCtx)
                                          unitAtCursor (first (filter #(= cursor (:position %))
                                                                      units))]
                                      (if unitAtCursor
                                        (let []
                                          (a/<! (selectUnitFlow gameplayCtx inputCh outputCh)))
                                        (let []
                                          (a/<! (selectNoUnitFlow gameplayCtx inputCh outputCh))))))

                             :else
                             (recur gameplayCtx)))))



          enemyTurn (fn [gameplayCtx enemy inputCh outputCh]
                      (a/go
                        (println "[model][enemyTurn]" enemy)
                        gameplayCtx))



          gameplayLoop (fn [gameplayCtx inputCh outputCh]
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



          modelLoop (fn [inputCh outputCh]
                      (a/go-loop [ctx defaultModel]
                        (println "[model][modelLoop]")
                        (when-let [[cmd args :as evt] (a/<! inputCh)]
                          (println "[model][modelLoop][evt]" evt)
                          (condp = cmd
                            "load"
                            (recur ctx)

                            "startGameplay"
                            (let [map (map/generateMap 20 20
                                                       {:deepsea 0.3
                                                        :sea 0.3
                                                        :sand 0.3
                                                        :grass 0.3
                                                        :city 0.3
                                                        :tree 0.3
                                                        :award 0.1})
                                  gameplayCtx (merge defaultGameplayModel
                                                     {:map map})]
                              (a/<! (simpleAsk "createMap" map))
                              (a/<! (simpleAsk "createUnits" {:units (:units gameplayCtx)
                                                              :players (:players gameplayCtx)}))
                              (merge ctx {:gameplay (a/<! (gameplayLoop gameplayCtx inputCh outputCh))}))

                            (recur ctx)))))


          inputCh (a/merge [(a/tap viewNotifyMult (a/chan))
                            systemInputCh])]
      
      
      (modelLoop inputCh viewCh))

    

    (js/window.addEventListener "keydown" (fn [e]
                                            (println (.-code e))
                                            (condp = (.-code e)
                                              "KeyP"
                                              (a/put! viewNotifyCh ["startGameplay"])

                                              "KeyO"
                                              (a/put! viewNotifyCh ["selectMap" [0 0]])

                                              nil)))))

(set! (.-startApp js/window) 
      main)

; (main)