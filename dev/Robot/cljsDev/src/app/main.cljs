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
                           :players {:player {}
                                     :ai1 {:friendly false}
                                     :ai2 {:friendly true}}
                           :units [{:key (gensym)
                                    :player :player
                                    :robot {}
                                    :position [0 0]}
                                   {:key (gensym)
                                    :player :a1
                                    :robot {}
                                    :position [5 5]}]
                           :focusUnitKey nil})

(defn ask [tapCh outputCh name args]
  ; gensym 要轉成字串才能和字串有相等性
  (let [key (str (gensym))
        worker (a/chan)]
    (a/go
      (a/>! outputCh [name [key args]])
      (loop []
        (when-let [[cmd [resKey args] :as evt] (a/<! tapCh)]
          (println "response" evt)
          (if (= ["ok" key] [cmd resKey])
            (do
              (a/>! worker args)
              (a/close! tapCh)
              (a/close! worker))
            (recur))))
      (println "finished !!!!"))
    worker))

(defn main []
  (println "prepare rxjs")
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

    (println "view")
    (let []
      (.subscribe (.-viewNotifyOb js/window)
                  (fn [e]
                    (println "fromView " e)
                    (a/go
                      (a/>! viewNotifyCh (js->clj e)))))
      (a/go-loop []
        (let [evt (a/<! viewCh)]
          (.next (.-viewOb js/window) (clj->js evt))
          (recur))))

    (println "model v2")
    (let [simpleAsk (fn [name args]
                      (ask (a/tap viewNotifyMult (a/chan))
                           viewCh
                           name
                           args))

          
          selectUnitFlow (fn [gameplayCtx inputCh outputCh]
                           (a/go-loop [gameplayCtx gameplayCtx]
                             (println "handle selectUnitMenu")
                             (let [selectUnitMenu (a/<! (simpleAsk "unitMenu" ["move" ["attack1" "attack2"] "cancel"]))]
                               (println "selectUnitMenu " selectUnitMenu)
                               (cond
                                 (= "cancel" selectUnitMenu)
                                 (do
                                   (a/go
                                     (a/<! (simpleAsk "unitMenuClose" 0)))
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

          
          playerTurn (fn [gameplayCtx inputCh outputCh]
                       (a/go-loop [gameplayCtx gameplayCtx]
                         (println "handle gameplay")
                         (when-let [[cmd args :as evt] (a/<! inputCh)]
                           (cond
                             (= "selectMap" cmd)
                             (recur (let [pos args]
                                      (a/<! (selectUnitFlow gameplayCtx inputCh outputCh))))

                             :else
                             (recur gameplayCtx)))))

          
          modelLoop (fn [inputCh outputCh]
                      (a/go-loop [ctx defaultModel]
                        (when-let [[cmd args :as evt] (a/<! inputCh)]
                          (println "control " evt)
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
                              (a/go
                                (a/<! (simpleAsk "createMap" map)))
                              (->>
                               (a/<! (playerTurn gameplayCtx inputCh outputCh))
                               (constantly)
                               (update ctx :gameplay)))

                            (recur ctx)))))
          
          
          inputCh (a/merge
                   [(a/tap viewNotifyMult (a/chan))])]
      
      
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