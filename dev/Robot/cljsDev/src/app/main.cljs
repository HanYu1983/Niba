(ns app.main
  (:require [clojure.core.async :as a])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.core])
  (:require [app.gameplay.module])
  (:require [module.default.core])
  (:require [module.debug.core]))

; debug
; (set! app.gameplay.module/*module :debug)

(m/defwait setData [ctx args])

(def defaultModel {})

(defn mainLoop [ctx inputCh outputCh]
  (a/go
    (loop [ctx ctx]
      (let [[cmd args] (a/<! inputCh)]
        (cond
          (= "loadConfig" cmd)
          (let [[id subargs] args
                data (a/<! (app.gameplay.module/loadData app.gameplay.module/*module))]
            (a/>! outputCh ["ok", [id data]])
            (recur ctx))

          (= "startGameplay" cmd)
          (a/<! (app.gameplay.core/startGameplay ctx inputCh outputCh))

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

(defn testIt [inputCh outputCh]
  (let [right 68
        down 83
        left 65
        up 87
        enter 13
        cancel 27
        rup 38
        rdown 40
        rleft 37
        rright 39]
    (a/go
      (loop []
        (let [[cmd [id subargs :as args] :as evt] (a/<! inputCh)]
          (println args)
          (a/>! outputCh ["ok", [id]])
          (recur))))
    (a/go
      (a/>! outputCh ["startGameplay"])
      (a/<! (a/timeout 1000))
      (print "=======move cursor=======")
      (let [keys [right down left up]]
        (loop [keys keys]
          (when-let [key (first keys)]
            (a/<! (a/timeout 200))
            (a/>! outputCh ["KEY_DOWN" key])
            (recur (rest keys)))))
      (print "=======move camera=======")
      (let [keys [rright rdown rleft rup]]
        (loop [keys keys]
          (when-let [key (first keys)]
            (a/<! (a/timeout 200))
            (a/>! outputCh ["KEY_DOWN" key])
            (recur (rest keys)))))
      (println "=======menu=======")
      (let [keys [left left up up enter
                  down up down left left right right
                  down down up up cancel]]
        (loop [keys keys]
          (when-let [key (first keys)]
            (a/<! (a/timeout 200))
            (println "press" key)
            (a/>! outputCh ["KEY_DOWN" key])
            (recur (rest keys)))))
      (println "=======move stack=======")
      (let [keys [enter enter right enter enter right enter cancel cancel cancel cancel cancel]]
        (loop [keys keys]
          (when-let [key (first keys)]
            (a/<! (a/timeout 200))
            (println "press" key)
            (a/>! outputCh ["KEY_DOWN" key])
            (recur (rest keys)))))
      (println "=======attack=======")
      (let [keys [enter down right left enter]]
        (loop [keys keys]
          (when-let [key (first keys)]
            (a/<! (a/timeout 200))
            (println "press" key)
            (a/>! outputCh ["KEY_DOWN" key])
            (recur (rest keys)))))
      (print "ok"))))

(defn main []
  (let [outputToView (a/chan)
        inputFromView (a/chan)]

    (installViewRxjs inputFromView outputToView)
    (mainLoop defaultModel inputFromView outputToView)
    ;(testIt outputToView inputFromView)

    (comment "")))

(set! (.-startApp js/window)
      main)