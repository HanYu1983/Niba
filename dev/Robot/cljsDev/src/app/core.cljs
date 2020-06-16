(ns app.core
  (:require [clojure.core.async :as a]
            [cljs.test :refer-macros [run-tests]])
  (:require [app.module]
            [module.v1.core]
            [module.v1.data-test]
            [module.v1.phase.enemyTurn]
            [app.main]))

(defn- test-v1 []
  (enable-console-print!)
  (run-tests 'module.v1.data-test)

  (set! app.module/*module :v1)
  (set! module.v1.phase.enemyTurn/*ai false)
  (let [outputToView (a/chan)
        inputFromView (a/chan)]
    (app.main/mainLoop app.main/defaultModel inputFromView outputToView)
    (a/go
      (a/>! inputFromView ["startGameplay"])
      (a/<! (a/timeout 1000))
      (a/<! (app.module/testIt :v1 outputToView inputFromView)))))

(defn- main-v1 []
  (set! app.module/*module :v1)
  (set! module.v1.phase.enemyTurn/*ai false)
  (let [outputToView (a/chan)
        inputFromView (a/chan)]
    (app.main/installViewRxjs inputFromView outputToView)
    (app.main/mainLoop app.main/defaultModel inputFromView outputToView)
    (a/go (a/<! (app.module/testIt app.module/*module nil inputFromView)))))

(defn- main []
  (set! app.module/*module :v1)
  (let [outputToView (a/chan)
        inputFromView (a/chan)]
    (app.main/installViewRxjs inputFromView outputToView)
    (app.main/mainLoop app.main/defaultModel inputFromView outputToView)))

(set! (.-testV1 js/window) test-v1)
(set! (.-startV1 js/window) main-v1)
(set! (.-startApp js/window) main)