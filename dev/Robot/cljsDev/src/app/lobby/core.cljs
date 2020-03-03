(ns app.lobby.core
  (:require [clojure.core.async :as a])
  (:require [app.lobby.model])
  (:require [app.module])
  (:require-macros [app.lobby.core]))


(defn startLobby [ctx inputCh outputCh]
  (a/go
    (loop [lobbyCtx (-> (or (:lobbyCtx ctx)
                            (app.lobby.model/load))
                        (update-in app.lobby.model/money (constantly (:money ctx))))]
      
      (let [[cmd args] (a/<! inputCh)]
        (cond
          (= cmd "getRobotStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyGetUnits app.module/*module lobbyCtx)
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getPilotStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyGetPilots app.module/*module lobbyCtx)
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getRobotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (get-in lobbyCtx app.lobby.model/robots)
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getPilotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (get-in lobbyCtx app.lobby.model/pilots)
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "buyRobotById")
          (app.lobby.core/buyImpl app.module/lobbyGetUnits app.lobby.model/robots)

          (= cmd "buyPilotById")
          (app.lobby.core/buyImpl app.module/lobbyGetPilots app.lobby.model/pilots)

          (= cmd "setRobotPilot")
          (let [[id {robotKey "robotKey" pilotKey "pilotKey"}] args
                lobbyCtx (-> lobbyCtx
                             (update-in app.lobby.model/robotByPilot #(conj % [pilotKey robotKey])))]
            (a/>! outputCh ["ok" [id [nil lobbyCtx]]])
            (recur (app.lobby.model/save lobbyCtx)))

          (= cmd "exit")
          (update ctx :lobbyCtx (constantly lobbyCtx))

          :else
          (recur lobbyCtx))))))