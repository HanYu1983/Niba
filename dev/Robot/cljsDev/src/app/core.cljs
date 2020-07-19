(ns app.core
  (:require [clojure.core.async :as a]
            [clojure.spec.alpha :as s]
            [cljs.test :refer-macros [run-tests]])
  (:require [tool.core]
            [app.module]
            [app.lobby.model]
            [app.lobby.core-test]
            [module.v1.core]
            [module.v1.data-test]
            [module.v1.phase.enemyTurn]
            [module.v1.common]
            [app.lobby.core]))

(s/check-asserts true)
(set! module.v1.common/assert? true)
(set! tool.core/assert? true)

(def defaultModel {:lobbyCtx (app.lobby.model/load)})

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

          ; 新遊戲, 清空所有記憶
          (= "newGame" cmd)
          (let [_ (.removeItem js/localStorage "lobby")
                _ (.removeItem js/localStorage "gameplay")
                ctx (assoc ctx :lobbyCtx app.lobby.model/defaultLobbyModel)]
            (recur ctx))

          ; 判斷gameplay有沒有記憶可以讀取
          (= "checkLoadGameplay" cmd)
          (let [[id _] args
                _ (a/>! outputCh ["ok" [id (boolean (.-gameplay js/localStorage))]])]
            (recur ctx))

          ; 讀取最後記憶的gameplay
          (= "loadGameplay" cmd)
          (recur (let [ctx (a/<! (app.module/gameplayLoad app.module/*module ctx inputCh outputCh))
                       _ (app.lobby.model/save (:lobbyCtx ctx))]
                   ctx))

          ; 開始gameplay
          (= "startGameplay" cmd)
          (recur (let [ctx (a/<! (app.module/gameplayStart app.module/*module ctx args inputCh outputCh))
                       _ (app.lobby.model/save (:lobbyCtx ctx))]
                   ctx))

          ; 開始整備
          ; lobby是自動記憶, 不像gameplay要手動按
          (= "startLobby" cmd)
          (recur (a/<! (app.lobby.core/startLobby ctx inputCh outputCh)))

          ; 跳出程式
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

(defn- test-v1 []
  (enable-console-print!)
  (run-tests
   'app.lobby.core-test
   'module.v1.data-test)

  (set! app.module/*module :v1)
  (set! module.v1.phase.enemyTurn/*ai false)
  (let [outputToView (a/chan)
        inputFromView (a/chan)]
    (mainLoop defaultModel inputFromView outputToView)
    (a/go
      (a/>! inputFromView ["startGameplay"])
      (a/<! (a/timeout 1000))
      (a/<! (app.module/testIt app.module/*module outputToView inputFromView)))))

(defn- main-v1 []
  (set! app.module/*module :v1)
  (set! module.v1.phase.enemyTurn/*ai false)
  (let [outputToView (a/chan)
        inputFromView (a/chan)]
    (installViewRxjs inputFromView outputToView)
    (mainLoop defaultModel inputFromView outputToView)
    (a/go (a/<! (app.module/testIt app.module/*module nil inputFromView)))))

(defn- main []
  (set! app.module/*module :v1)
  (let [outputToView (a/chan)
        inputFromView (a/chan)]
    (installViewRxjs inputFromView outputToView)
    (mainLoop defaultModel inputFromView outputToView)))

(set! (.-testV1 js/window) test-v1)
(set! (.-startV1 js/window) main-v1)
(set! (.-startApp js/window) main)