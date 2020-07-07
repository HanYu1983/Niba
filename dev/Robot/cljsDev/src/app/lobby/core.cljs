(ns app.lobby.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a])
  (:require [app.lobby.model :as model]
            [app.module]
            [tool.core])
  (:require-macros [app.lobby.core]))

(defn startLobby [ctx inputCh outputCh]
  (a/go
    (loop [lobbyCtx (-> (:lobbyCtx ctx)
                        (update-in [:money] (constantly (:money ctx))))]
      
      (s/assert ::model/model lobbyCtx)

      (let [[cmd args] (a/<! inputCh)]
        (println "lobby:" cmd args)
        (cond
          (= cmd :test)
          (let [f args
                lobbyCtx (f lobbyCtx)]
            (a/>! outputCh lobbyCtx)
            (recur lobbyCtx))

          (= cmd "getRobotStoreList")
          (let [[id subargs] args
                {offset "offset" limit "limit"} (s/assert
                                                 (s/and map?
                                                        #(% "offset")
                                                        #(% "limit"))
                                                 subargs)]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getRobotStoreList true})
                                               (into [])
                                               (drop offset)
                                               (take limit))]]])
            (recur lobbyCtx))

          (= cmd "getPilotStoreList")
          (let [[id subargs] args
                {offset "offset" limit "limit"} (s/assert
                                                 (s/and map?
                                                        #(% "offset")
                                                        #(% "limit"))
                                                 subargs)]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getPilotStoreList true})
                                               (into [])
                                               (drop offset)
                                               (take limit))]]])
            (recur lobbyCtx))

          (= cmd "getWeaponStoreList")
          (let [[id subargs] args
                {offset "offset" limit "limit"} (s/assert
                                                 (s/and map?
                                                        #(% "offset")
                                                        #(% "limit"))
                                                 subargs)]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getWeaponStoreList true})
                                               (into [])
                                               (drop offset)
                                               (take limit))]]])
            (recur lobbyCtx))

          (= cmd "getComponentStoreList")
          (let [[id subargs] args
                {offset "offset" limit "limit"} (s/assert
                                                 (s/and map?
                                                        #(% "offset")
                                                        #(% "limit"))
                                                 subargs)]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getComponentStoreList true})
                                               (into [])
                                               (drop offset)
                                               (take limit))]]])
            (recur lobbyCtx))

          (= cmd "getRobotList")
          (let [[id subargs] args
                {offset "offset" limit "limit"} (s/assert
                                                 (s/and map?
                                                        #(% "offset")
                                                        #(% "limit"))
                                                 subargs)]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getRobotList true})
                                               (into [])
                                               (drop offset)
                                               (take limit))]]])
            (recur lobbyCtx))

          (= cmd "getPilotList")
          (let [[id subargs] args
                {offset "offset" limit "limit"} (s/assert
                                                 (s/and map?
                                                        #(% "offset")
                                                        #(% "limit"))
                                                 subargs)]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getPilotList true})
                                               (into [])
                                               (drop offset)
                                               (take limit))]]])
            (recur lobbyCtx))

          (= cmd "getWeaponList")
          (let [[id subargs] args
                {offset "offset" limit "limit"} (s/assert
                                                 (s/and map?
                                                        #(% "offset")
                                                        #(% "limit"))
                                                 subargs)]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getWeaponList true})
                                               (into [])
                                               (drop offset)
                                               (take limit))]]])
            (recur lobbyCtx))

          (= cmd "getComponentList")
          (let [[id subargs] args
                {offset "offset" limit "limit"} (s/assert
                                                 (s/and map?
                                                        #(% "offset")
                                                        #(% "limit"))
                                                 subargs)]
            (a/>! outputCh ["ok" [id [nil (->> (app.module/lobbyAsk app.module/*module lobbyCtx {:getComponentList true})
                                               (into [])
                                               (drop offset)
                                               (take limit))]]])
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
          (app.lobby.core/setKey1ByKey2Impl robot pilot)

          (= cmd "addRobotWeapon")
          (app.lobby.core/setKey1ByKey2Impl robot weapon)

          (= cmd "addRobotComponent")
          (app.lobby.core/setKey1ByKey2Impl robot component)

          (= cmd "removeRobotPilot")
          (app.lobby.core/removeKey2Impl robot pilot)

          (= cmd "removeRobotWeapon")
          (app.lobby.core/removeKey2Impl robot weapon)

          (= cmd "removeRobotComponent")
          (app.lobby.core/removeKey2Impl robot component)

          (= cmd "exit")
          (update ctx :lobbyCtx (constantly lobbyCtx))

          :else
          (recur lobbyCtx))))))