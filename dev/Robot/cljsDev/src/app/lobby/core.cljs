(ns app.lobby.core
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require [app.lobby.model :as model])
  (:require [app.module])
  (:require-macros [app.lobby.core]))

(defn startLobby [ctx inputCh outputCh]
  (a/go
    (loop [lobbyCtx (-> (:lobbyCtx ctx)
                        (update-in [:money] (constantly (:money ctx))))]
      
      (s/assert ::model/model lobbyCtx)

      (let [[cmd args] (a/<! inputCh)]
        (println "lobby:" cmd args)
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

          (= cmd "getWeaponStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyGetWeapons app.module/*module lobbyCtx)
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getComponentStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyGetComponents app.module/*module lobbyCtx)
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getRobotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (get-in lobbyCtx [:robots])
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getPilotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (get-in lobbyCtx [:pilots])
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getWeaponList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (get-in lobbyCtx [:weapons])
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getComponentList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (get-in lobbyCtx [:components])
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "buyRobotById")
          (app.lobby.core/buyImpl app.module/lobbyGetUnits [:robots])

          (= cmd "buyPilotById")
          (app.lobby.core/buyImpl app.module/lobbyGetPilots [:pilots])

          (= cmd "buyWeaponById")
          (app.lobby.core/buyImpl app.module/lobbyGetWeapons [:weapons])

          (= cmd "buyComponentById")
          (app.lobby.core/buyImpl app.module/lobbyGetComponents [:components])

          (= cmd "setRobotPilot")
          (let [[id {robotKey "robotKey" pilotKey "pilotKey"}] args
                robotKey (keyword robotKey)
                pilotKey (keyword pilotKey)
                lobbyCtx (-> lobbyCtx
                             (update-in [:robotByPilot] #(conj % [pilotKey robotKey])))]
            (a/>! outputCh ["ok" [id [nil lobbyCtx]]])
            (recur (app.lobby.model/save lobbyCtx)))

          (= cmd "exit")
          (update ctx :lobbyCtx (constantly lobbyCtx))

          :else
          (recur lobbyCtx))))))