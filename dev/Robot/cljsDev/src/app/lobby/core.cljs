(ns app.lobby.core
  (:require [clojure.core.async :as a])
  (:require-macros [app.lobby.core]))

(def actions {87 :up
              83 :down
              65 :left
              68 :right
              13 :enter
              27 :cancel
              38 :rup
              40 :rdown
              37 :rleft
              39 :rright})


(defn lobby [lobbyCtx args inputCh outputCh]
  (a/go
    (loop []
      (let [[cmd args] (a/<! inputCh)]
        [lobbyCtx next]))))

(app.lobby.core/defbuy buyRobot)
(app.lobby.core/defbuy buyPilot)

(defn startLobby [ctx inputCh outputCh]
  (a/go
    (loop [lobbyCtx (or (:lobbyCtx ctx) {})
           doState lobby]
      (let [[lobbyCtx next] (a/<! (doState lobbyCtx nil inputCh outputCh))]
        (cond
          (= next :buyRobot)
          (recur lobbyCtx buyRobot)

          (= next :buyPilot)
          (recur lobbyCtx buyPilot)

          (= next :lobby)
          (recur lobbyCtx lobby)

          :else
          (assoc ctx :lobbyCtx lobbyCtx))))))