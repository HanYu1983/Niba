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
            (a/>! outputCh ["ok" [id (->> (get-in ctx [:data "robot"])
                                          (vals))]])
            (recur lobbyCtx))

          (= cmd "getPilotStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id (->> (get-in ctx [:data "pilot"])
                                          (vals))]])
            (recur lobbyCtx))

          (= cmd "getRobotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id (get-in lobbyCtx app.lobby.model/robots)]])
            (recur lobbyCtx))

          (= cmd "getPilotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id (get-in lobbyCtx app.lobby.model/pilots)]])
            (recur lobbyCtx))

          (= cmd "buyRobotById")
          (let [[id {robotKey "robotKey"}] args
                robot (get-in ctx [:data "robot" robotKey])]
            (if robot
              (let [money (get-in lobbyCtx app.lobby.model/money)
                    cost (get-in robot ["cost"])
                    isEnoughMoney (>= money cost)]
                (if isEnoughMoney
                  (let [lobbyCtx (-> lobbyCtx
                                     (update-in app.lobby.model/money (constantly (- money cost)))
                                     (update-in app.lobby.model/robots (partial cons {:key (gensym)
                                                                                      :robotKey robotKey})))]
                    (a/>! outputCh ["ok" [id [nil lobbyCtx]]])
                    (recur lobbyCtx))
                  (do
                    (a/>! outputCh ["ok" [id ["money is not enougth"]]])
                    (recur lobbyCtx))))
              (do
                (a/>! outputCh ["ok" [id ["key is not found"]]])
                (recur lobbyCtx))))

          (= cmd "buyPilotById")
          (let [[id {pilotKey "pilotKey"}] args
                pilot (get-in ctx [:data "pilot" pilotKey])]
            (if pilot
              (let [money (get-in lobbyCtx app.lobby.model/money)
                    cost (get-in pilot ["cost"])
                    isEnoughMoney (>= money cost)]
                (if isEnoughMoney
                  (let [lobbyCtx (-> lobbyCtx
                                     (update-in app.lobby.model/money (constantly (- money cost)))
                                     (update-in app.lobby.model/robots (partial cons {:key (gensym)
                                                                                      :pilotKey pilotKey})))]
                    (a/>! outputCh ["ok" [id [nil lobbyCtx]]])
                    (recur lobbyCtx))
                  (do
                    (a/>! outputCh ["ok" [id ["money is not enougth"]]])
                    (recur lobbyCtx))))
              (do
                (a/>! outputCh ["ok" [id ["key is not found"]]])
                (recur lobbyCtx))))

          (= cmd "setRobotPilot")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id nil]])
            (recur lobbyCtx))

          (= cmd "exit")
          (update ctx :lobbyCtx (constantly lobbyCtx))

          :else
          (recur lobbyCtx))))))