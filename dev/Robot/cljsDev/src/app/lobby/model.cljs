(ns app.lobby.model)

(def defaultLobbyModel {:robots {}
                        :pilots {}
                        :robotByPilot {}
                        :money 0})


(defn load []
  (or (-> (aget js/localStorage "lobby")
          (cljs.reader/read-string))
      defaultLobbyModel))

(defn save [lobbyCtx]
  (.setItem js/localStorage "lobby" (str lobbyCtx))
  lobbyCtx)

(def pilots [:pilots])
(def robots [:robots])
(def money [:money])
(def robotByPilot [:robotByPilot])
