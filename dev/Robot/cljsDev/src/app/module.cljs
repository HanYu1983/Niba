(ns app.module)

(defmulti loadData (fn [type] type))
(defmulti lobbyGetUnits (fn [type lobbyCtx] type))
(defmulti lobbyGetPilots (fn [type lobbyCtx] type))
(def *module nil)