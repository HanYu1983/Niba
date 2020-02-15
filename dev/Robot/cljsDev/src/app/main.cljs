(ns app.main
  (:require [clojure.core.async :as a])
  (:require-macros [app.gameplay.macros :as m])
  (:require-macros [app.main])
  (:require [app.gameplay.core])
  (:require [app.module])
  (:require [module.default.core])
  (:require [module.debug.core]))

; debug
; (set! app.module/*module :debug)

(m/defwait setData [ctx args])

(def defaultModel {})

(defn mainLoop [ctx inputCh outputCh]
  (a/go
    (loop [ctx ctx]
      (let [[cmd args] (a/<! inputCh)]
        (cond
          (= "loadConfig" cmd)
          (let [[id subargs] args
                data (a/<! (app.module/loadData app.module/*module))]
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
  (when inputCh
    (a/go
      (loop []
        (let [[cmd [id subargs :as args] :as evt] (a/<! inputCh)]
          ; 使用print強制所有欄位求值. 不然有些程式碼不會運行到
          (js/console.log (clj->js args))
          (a/>! outputCh ["ok", [id]])
          (recur)))))
  (let [testAll false
        right 68
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
      (app.main/defclick (or testAll false) "bullet count"
        [right right right right enter
         down right enter
         left left enter enter]
        ; wait battle animation
        (a/<! (a/timeout 5000))
        (app.main/defclick true "back"
          [left left]))

      (app.main/defclick (or testAll false) "move cursor"
        [right down left up])

      (app.main/defclick (or testAll false) "move camera"
        [rright rdown rleft rup])

      (app.main/defclick (or testAll false) "menu"
        [left left up up enter
         down up down left left right right
         down down up up cancel])

      (app.main/defclick (or testAll false) "move"
        [enter enter right enter cancel cancel cancel left])

      (app.main/defclick (or testAll false) "attack"
        [enter down right left enter
         right right enter
         right left right down up enter]
        ; wait battle animation
        (a/<! (a/timeout 5000))
        (app.main/defclick true "back"
          [left left]))

      (app.main/defclick (or testAll false) "enemy unit only cancel menu"
        [right right enter enter left left])

      (print "ok"))))


(defn debug []
  (let [outputToView (a/chan)
        inputFromView (a/chan)]
    (mainLoop defaultModel inputFromView outputToView)
    (a/go
      (a/>! inputFromView ["startGameplay"])
      (a/<! (a/timeout 1000))
      (testIt outputToView inputFromView))))

(defn main []
  (let [phase :debug
        outputToView (a/chan)
        inputFromView (a/chan)]
    (cond
      (= phase :debug)
      (do
        (installViewRxjs inputFromView outputToView)
        (mainLoop defaultModel inputFromView outputToView)
        (a/go
          (print "===== start debugView after 5s =====")
          (a/<! (a/timeout 5000))
          (testIt nil inputFromView)))

      :else
      (do
        (installViewRxjs inputFromView outputToView)
        (mainLoop defaultModel inputFromView outputToView)))

    (comment "end main")))

(set! (.-startApp js/window)
      main)

(set! (.-startDebug js/window)
      debug)