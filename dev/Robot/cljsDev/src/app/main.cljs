(ns app.main
  (:require [clojure.core.async :as a])
  (:require [app.map :as map])
  (:require-macros [app.macros :as m]))

(def defaultModel {})

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
  (let [viewCh (a/chan)
        viewNotifyCh (a/chan)
        ; 所有從viewNotifyMult中tap的channel一定要消費掉它的內容, 不然viewNotifyCh推不進新的內容
        viewNotifyMult (a/mult viewNotifyCh)]

    (a/go-loop []
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
          (recur))))

    (let [simpleAsk (fn [name args]
                      (ask (a/tap viewNotifyMult (a/chan))
                           viewCh
                           name
                           args))
          modelLoop (fn [inputCh outputCh]
                      (a/go-loop [ctx defaultModel]
                        (when-let [[cmd args :as evt] (a/<! inputCh)]
                          (condp = cmd
                            "load"
                            (recur ctx)

                            "startGameplay"
                            (let []
                              (a/<! (simpleAsk "createMap" nil))

                              (loop [ctx ctx]
                                (println "handle map")
                                (when-let [[cmd args :as evt] (a/<! inputCh)]
                                  (cond
                                    (= cmd "selectMap")
                                    (recur (let [pos args]
                                             (loop [ctx ctx]
                                               (println "handle selectUnitMenu")
                                               (let [selectUnitMenu (a/<! (simpleAsk "unitMenu" ["move" "attack" "cancel"]))]
                                                 (println "selectUnitMenu " selectUnitMenu)
                                                 (cond
                                                   (= "cancel" selectUnitMenu)
                                                   ctx

                                                   (= "attack" selectUnitMenu)
                                                   (recur (loop [ctx ctx]
                                                            (let [selectAttackMenu (a/<! (simpleAsk "attackMenu" ["weapon1" "cancel"]))]
                                                              (cond
                                                                (= "cancel" selectAttackMenu)
                                                                ctx

                                                                :else
                                                                (recur ctx)))))

                                                   :else
                                                   (recur ctx))))))

                                    :else
                                    (recur ctx)))))

                            (recur ctx)))))
          inputCh (a/merge
                   [(a/tap viewNotifyMult (a/chan))])]
      (modelLoop inputCh viewCh))

    (js/window.addEventListener "keydown" (fn [e]
                                            (condp = (.-code e)
                                              "KeyA"
                                              (a/put! viewNotifyCh ["startGameplay"])

                                              "KeyB"
                                              (a/put! viewNotifyCh ["selectMap" [0 0]])

                                              nil)))))

(main)