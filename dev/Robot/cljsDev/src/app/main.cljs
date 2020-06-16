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