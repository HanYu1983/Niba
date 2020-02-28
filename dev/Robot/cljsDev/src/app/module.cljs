(ns app.module)

(defmulti loadData (fn [type] type))

(defmulti gameplayOnInit (fn [type gameplayCtx] type))

(defmulti gameplayOnUnitCreate (fn [type gameplayCtx unit args] type))
(defmulti gameplayOnUnitMove (fn [type gameplayCtx unit pos] type))
(defmulti gameplayOnUnitDone (fn [type gameplayCtx unit] type))
(defmulti gameplayOnUnitTurnStart (fn [type gameplayCtx unit] type))

(defmulti gameplayOnEnemyTurn (fn [type gameplayCtx enemy inputCh outputCh] type))
(defmulti gameplayOnUnitDead (fn [type gameplayCtx unit] type))
(defmulti gameplayOnUnitMenu (fn [type gameplayCtx args inputCh outputCh] type))

(defmulti gameplayGetUnitMovePathTree (fn [type gameplayCtx unit] type))
(defmulti gameplayGetUnitWeapons (fn [type gameplayCtx unit] type))
(defmulti gameplayGetUnitInfo (fn [type gameplayCtx unit] type))
(defmulti gameplayGetUnitIsDead (fn [type gameplayCtx unit] type))

(defmulti gameplayFormatToDraw (fn [type gameplayCtx] type))


(defmulti lobbyGetUnits (fn [type lobbyCtx] type))
(defmulti lobbyGetPilots (fn [type lobbyCtx] type))

(def *module nil)