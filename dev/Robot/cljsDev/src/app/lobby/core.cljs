(ns app.lobby.core
  (:require [clojure.core.async :as a])
  (:require [app.lobby.model]))


(defn startLobby [ctx inputCh outputCh]
  (a/go
    (loop [lobbyCtx (or (:lobbyCtx ctx) app.lobby.model/defaultLobbyModel)]
      (let [[cmd args] (a/<! inputCh)]
        (cond
          (= cmd "getRobotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id nil]])
            (recur lobbyCtx))

          (= cmd "getPilotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id nil]])
            (recur lobbyCtx))

          (= cmd "getRobotStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id (get-in lobbyCtx app.lobby.model/robots)]])
            (recur lobbyCtx))

          (= cmd "getPilotStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id (get-in lobbyCtx app.lobby.model/pilots)]])
            (recur lobbyCtx))

          (= cmd "buyRobotById")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id nil]])
            (recur lobbyCtx))

          (= cmd "buyPilotById")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id nil]])
            (recur lobbyCtx))

          (= cmd "setRobotPilot")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id nil]])
            (recur lobbyCtx))

          (= cmd "exit")
          (update ctx :lobbyCtx (constantly lobbyCtx))

          :else
          (recur lobbyCtx))))))