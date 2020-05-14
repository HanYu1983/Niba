(ns app.module)

(defmulti loadData (fn [type] type))
(defmulti lobbyGetUnits (fn [type lobbyCtx] type))
(defmulti lobbyGetPilots (fn [type lobbyCtx] type))
(defmulti gameplayStart (fn [type ctx] type))
(defmulti testIt (fn [type] type))

(def *module nil)