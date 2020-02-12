(ns module.debug.core
  (:require [clojure.core.async :as a]))

(defmethod app.module/loadData :debug [_]
  (a/go {}))

(defmethod app.module/gameplayOnInit :debug [_ gameplayCtx]
  gameplayCtx)

(defmethod app.module/unitOnCreate :debug [_ gameplayCtx unit args]
  gameplayCtx)

(defmethod app.module/unitOnMove :debug [_ gameplayCtx unit pos]
  unit)

(defmethod app.module/unitOnDone :debug [_ gameplayCtx unit]
  unit)

(defmethod app.module/unitOnTurnStart :debug [_ gameplayCtx unit]
  unit)

(defmethod app.module/onUnitDead :debug [_ gameplayCtx unit]
  (a/go gameplayCtx))

(defmethod app.module/onUnitMenu :debug [_ gameplayCtx args inputCh outputCh]
  (a/go [gameplayCtx false]))

(defmethod app.module/onEnemyTurn :debug [_ gameplayCtx enemy inputCh outputCh]
  (a/go gameplayCtx))


(defmethod app.module/unitGetMovePathTree :debug [_ gameplayCtx unit]
  [])

(defmethod app.module/unitGetWeapons :debug [_ gameplayCtx unit]
  [])

(defmethod app.module/unitIsDead :debug [_ gameplayCtx unit]
  false)

(defmethod app.module/unitGetInfo :debug [_ gameplayCtx unit]
  unit)