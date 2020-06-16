(ns app.main
  (:require [clojure.core.async :as a])
  (:require [app.lobby.core]
            [app.module]))

(def defaultModel {:money 100000})

(defn mainLoop [ctx inputCh outputCh]
  (a/go
    (loop [ctx ctx]
      (let [[cmd args] (a/<! inputCh)]
        (cond
          (= "loadConfig" cmd)
          (let [[id _] args
                data (a/<! (app.module/loadData app.module/*module))]
            (a/>! outputCh ["ok", [id data]])
            (recur (merge ctx {:data data})))

          (= "startGameplay" cmd)
          (a/<! (app.module/gameplayStart app.module/*module ctx inputCh outputCh))

          (= "startLobby" cmd)
          (recur (a/<! (app.lobby.core/startLobby ctx inputCh outputCh)))
          
          (= "exit" cmd)
          ctx

          :else
          (recur ctx))))))

(defn installViewRxjs [inputFromView outputToView]
  (let [viewOb (js/rxjs.Subject.)
        viewNotifyOb (js/rxjs.Subject.)]
    (set! (.-viewOb js/window)
          viewOb)
    (set! (.-viewNotifyOb js/window)
          viewNotifyOb))
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
      (recur))))