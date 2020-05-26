(ns app.lobby.model
  (:require [cljs.reader])
  (:require [clojure.spec.alpha :as s]))

(s/def ::robots (s/map-of keyword? keyword?))
(s/def ::pilots (s/map-of keyword? keyword?))
(s/def ::robotByPilot (s/map-of keyword? keyword?))
(s/def ::money int?)
(s/def ::model (s/keys :req-un [::robots ::pilots ::robotByPilot ::money]))

(def defaultLobbyModel {:robots {}
                        :pilots {}
                        :robotByPilot {}
                        :money 0})


(defn load []
  {:post [(s/valid? ::model %)]}
  (or (-> (aget js/localStorage "lobby")
          (cljs.reader/read-string))
      defaultLobbyModel))

(defn save [lobbyCtx]
  {:pre [(s/valid? ::model lobbyCtx)]}
  (.setItem js/localStorage "lobby" (str lobbyCtx))
  lobbyCtx)
