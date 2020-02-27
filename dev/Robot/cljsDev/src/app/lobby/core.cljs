(ns app.lobby.core
  (:require [clojure.core.async :as a])
  (:require [app.lobby.model]))


(defn startLobby [ctx inputCh outputCh]
  (a/go
    (loop [lobbyCtx (-> (or (:lobbyCtx ctx)
                            app.lobby.model/defaultLobbyModel)
                        (update-in app.lobby.model/money (constantly (:money ctx))))]
      (let [[cmd args] (a/<! inputCh)]
        (cond
          (= cmd "getRobotStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (get-in ctx [:data "robot"])
                                               (vals))]]])
            (recur lobbyCtx))

          (= cmd "getPilotStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (get-in ctx [:data "pilot"])
                                               (vals))]]])
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
          (let [[id {key "key"}] args
                robot (get-in ctx [:data "robot" key])]
            (if robot
              (let [money (get-in lobbyCtx app.lobby.model/money)
                    cost (get-in robot ["cost"])
                    isEnoughMoney (>= money cost)]
                (if isEnoughMoney
                  (let [lobbyCtx (-> lobbyCtx
                                     (update-in app.lobby.model/money (constantly (- money cost)))
                                     (update-in app.lobby.model/robots #(conj % [(gensym) key])))]
                    (a/>! outputCh ["ok" [id [nil lobbyCtx]]])
                    (recur lobbyCtx))
                  (do
                    (a/>! outputCh ["ok" [id ["money is not enougth"]]])
                    (recur lobbyCtx))))
              (do
                (a/>! outputCh ["ok" [id ["key is not found"]]])
                (recur lobbyCtx))))

          (= cmd "buyPilotById")
          (let [[id {key "key"}] args
                pilot (get-in ctx [:data "pilot" key])]
            (if pilot
              (let [money (get-in lobbyCtx app.lobby.model/money)
                    cost (get-in pilot ["cost"])
                    isEnoughMoney (>= money cost)]
                (if isEnoughMoney
                  (let [lobbyCtx (-> lobbyCtx
                                     (update-in app.lobby.model/money (constantly (- money cost)))
                                     (update-in app.lobby.model/pilots #(conj % [(gensym) key])))]
                    (a/>! outputCh ["ok" [id [nil lobbyCtx]]])
                    (recur lobbyCtx))
                  (do
                    (a/>! outputCh ["ok" [id ["money is not enougth"]]])
                    (recur lobbyCtx))))
              (do
                (a/>! outputCh ["ok" [id ["key is not found"]]])
                (recur lobbyCtx))))

          (= cmd "setRobotPilot")
          (let [[id {robotKey "robotKey" pilotKey "pilotKey"}] args
                lobbyCtx (-> lobbyCtx
                             (update-in app.lobby.model/robotByPilot #(conj % [pilotKey robotKey])))]
            (a/>! outputCh ["ok" [id [nil lobbyCtx]]])
            (recur lobbyCtx))

          (= cmd "exit")
          (update ctx :lobbyCtx (constantly lobbyCtx))

          :else
          (recur lobbyCtx))))))