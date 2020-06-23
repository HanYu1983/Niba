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
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getRobotStoreList true})
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getPilotStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getPilotStoreList true})
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getWeaponStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getWeaponStoreList true})
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getComponentStoreList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getComponentStoreList true})
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getRobotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getRobotList true})
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getPilotList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getPilotList true})
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getWeaponList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getWeaponList true})
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "getComponentList")
          (let [[id subargs] args]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getComponentList true})
                                               (into []))]]])
            (recur lobbyCtx))

          (= cmd "buyRobotById")
          (app.lobby.core/buyImpl (app.module/lobbyAsk app.module/*module lobbyCtx {:getRobotStoreList true}) [:robots])

          (= cmd "buyPilotById")
          (app.lobby.core/buyImpl (app.module/lobbyAsk app.module/*module lobbyCtx {:getPilotStoreList true}) [:pilots])

          (= cmd "buyWeaponById")
          (app.lobby.core/buyImpl (app.module/lobbyAsk app.module/*module lobbyCtx {:getWeaponStoreList true}) [:weapons])

          (= cmd "buyComponentById")
          (app.lobby.core/buyImpl (app.module/lobbyAsk app.module/*module lobbyCtx {:getComponentStoreList true}) [:components])

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