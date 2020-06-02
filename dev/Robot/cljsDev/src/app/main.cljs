(ns app.main
  (:require [clojure.core.async :as a])
  (:require-macros [app.main])
  (:require [app.lobby.core])
  (:require [app.module])
  (:require [module.default.core])
  (:require [module.v1.core]))

; debug
(set! app.module/*module :v1)

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


(defn debug []
  (let [outputToView (a/chan)
        inputFromView (a/chan)]
    (mainLoop defaultModel inputFromView outputToView)
    (a/go
      (a/>! inputFromView ["startGameplay"])
      (a/<! (a/timeout 1000))
      (a/<! (app.module/testIt app.module/*module outputToView inputFromView)))))

(defn main []
  (let [phase :debugx
        outputToView (a/chan)
        inputFromView (a/chan)] 
    (cond
      (= phase :debug)
      (do
        (installViewRxjs inputFromView outputToView)
        (mainLoop defaultModel inputFromView outputToView)
        (a/go
          (print "===== start debugView after 10s =====")
          (a/<! (a/timeout 10000))
          (a/<! (app.module/testIt app.module/*module nil inputFromView))))

      :else
      (do
        (installViewRxjs inputFromView outputToView)
        (mainLoop defaultModel inputFromView outputToView)))

    (comment "end main")))

(set! (.-startApp js/window)
      main)

(set! (.-startDebug js/window)
      debug)