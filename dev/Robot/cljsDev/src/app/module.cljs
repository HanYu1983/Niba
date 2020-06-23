(ns app.module)

(defmulti lobbyGetUnits (fn [type lobbyCtx] type))
(defmulti lobbyGetPilots (fn [type lobbyCtx] type))
(defmulti lobbyGetWeapons (fn [type lobbyCtx] type))
(defmulti lobbyGetComponents (fn [type lobbyCtx] type))
(defmulti lobbyGetUnitInfo (fn [type lobbyCtx] type))
(defmulti lobbyGetWeaponInfo (fn [type lobbyCtx] type))

(defmulti lobbyAsk (fn [type] type))

(defmulti loadData (fn [type] type))
(defmulti gameplayStart (fn [type ctx] type))
(defmulti testIt (fn [type] type))

(def *module nil)