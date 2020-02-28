(ns module.debug.core
  (:require [clojure.core.async :as a]))

(defmethod app.module/loadData :debug [_]
  (a/go {}))

(defmethod app.module/gameplayOnInit :debug [_ gameplayCtx]
  gameplayCtx)

(defmethod app.module/gameplayOnUnitCreate :debug [_ gameplayCtx unit args]
  gameplayCtx)

(defmethod app.module/gameplayOnUnitMove :debug [_ gameplayCtx unit pos]
  unit)

(defmethod app.module/gameplayOnUnitDone :debug [_ gameplayCtx unit]
  unit)

(defmethod app.module/gameplayOnUnitTurnStart :debug [_ gameplayCtx unit]
  unit)

(defmethod app.module/gameplayOnUnitDead :debug [_ gameplayCtx unit]
  (a/go gameplayCtx))

(defmethod app.module/gameplayOnUnitMenu :debug [_ gameplayCtx args inputCh outputCh]
  (a/go [gameplayCtx false]))

(defmethod app.module/gameplayOnEnemyTurn :debug [_ gameplayCtx enemy inputCh outputCh]
  (a/go gameplayCtx))


(defmethod app.module/gameplayGetUnitMovePathTree :debug [_ gameplayCtx unit]
  [])

(defmethod app.module/gameplayGetUnitWeapons :debug [_ gameplayCtx unit]
  [])

(defmethod app.module/gameplayGetUnitIsDead :debug [_ gameplayCtx unit]
  false)

(defmethod app.module/gameplayGetUnitInfo :debug [_ gameplayCtx unit]
  unit)