(ns app.module)

(defmulti loadData (fn [type] type))

(defmulti gameplayOnInit (fn [type gameplayCtx] type))

(defmulti unitOnCreate (fn [type gameplayCtx unit args] type))
(defmulti unitOnMove (fn [type gameplayCtx unit pos] type))
(defmulti unitOnDone (fn [type gameplayCtx unit] type))
(defmulti unitOnTurnStart (fn [type gameplayCtx unit] type))
(defmulti unitOnTransform (fn [type gameplayCtx unit robotKey] type))

(defmulti waitEnemyTurn (fn [type gameplayCtx enemy inputCh outputCh] type))
(defmulti waitUnitOnDead (fn [type gameplayCtx unit] type))
(defmulti waitUnitOnMenu (fn [type gameplayCtx args inputCh outputCh] type))

(defmulti unitGetMovePathTree (fn [type gameplayCtx unit] type))
(defmulti unitGetWeapons (fn [type gameplayCtx unit] type))
(defmulti unitGetInfo (fn [type gameplayCtx unit] type))
(defmulti unitIsDead (fn [type gameplayCtx unit] type))

(defmulti formatToDraw (fn [type gameplayCtx] type))

(def *module nil)