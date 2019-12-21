(ns app.main
  (:require [clojure.core.async :as a])
  (:require [app.map :as map])
  (:require-macros [app.macros :as m]))

(def defaultModel {})
(def defaultGameplayModel {})

(defn ask [tapCh outputCh name args]
  (let [key (gensym)
        worker (a/chan)]
    (a/go
      (a/>! outputCh [name [key args]])
      (loop []
        (when-let [[cmd [resKey args] :as evt] (a/<! tapCh)]
          (if (= ["ok" key] [cmd resKey])
            (do
              (println "response" evt)
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

    (println "model")
    (let [simpleAsk (fn [name args]
                      (ask (a/tap viewNotifyMult (a/chan))
                           viewCh
                           name
                           args))
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
                               (loop [gameplayCtx gameplayCtx]
                                 (println "handle gameplay")
                                 (when-let [[cmd args :as evt] (a/<! inputCh)]
                                   (cond
                                     (= cmd "selectMap")
                                     (recur (let [pos args]
                                              (loop [gameplayCtx gameplayCtx]
                                                (println "handle selectUnitMenu")
                                                (let [selectUnitMenu (a/<! (simpleAsk "unitMenu" ["move" "attack" "cancel"]))]
                                                  (println "selectUnitMenu " selectUnitMenu)
                                                  (cond
                                                    (= "cancel" selectUnitMenu)
                                                    (do
                                                      (a/<! (simpleAsk "closeMenu" "unitMenu"))
                                                      gameplayCtx)

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
                                                    (recur gameplayCtx))))))

                                     :else
                                     (recur gameplayCtx))))
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