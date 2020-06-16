(ns app.core
  (:require [clojure.core.async :as a])
  (:require [app.module]
            [module.v1.core]
            [app.main]))

; debug
(set! app.module/*module :v1)

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

(defn main []
  (let [phase :debug2
        outputToView (a/chan)
        inputFromView (a/chan)]
    (cond
      (= phase :debug)
      (do
        (installViewRxjs inputFromView outputToView)
        (app.main/mainLoop app.main/defaultModel inputFromView outputToView)
        (a/go
          (print "===== start debugView after 10s =====")
          (a/<! (a/timeout 10000))
          (a/<! (app.module/testIt app.module/*module nil inputFromView))))

      :else
      (do
        (installViewRxjs inputFromView outputToView)
        (app.main/mainLoop app.main/defaultModel inputFromView outputToView)))

    (comment "end main")))

(set! (.-startApp js/window)
      main)