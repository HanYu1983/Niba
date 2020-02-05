(ns module.debug.core
  (:require [clojure.core.async :as a]))

(defmethod app.gameplay.module/loadData :debug [_]
  (a/go {}))

(defmethod app.gameplay.module/gameplayOnInit :debug [_ gameplayCtx]
  gameplayCtx)

(defmethod app.gameplay.module/unitOnCreate :debug [_ gameplayCtx unit args]
  gameplayCtx)

(defmethod app.gameplay.module/unitOnMove :debug [_ gameplayCtx unit pos]
  unit)

(defmethod app.gameplay.module/unitOnDone :debug [_ gameplayCtx unit]
  unit)

(defmethod app.gameplay.module/unitOnTurnStart :debug [_ gameplayCtx unit]
  unit)

(defmethod app.gameplay.module/waitUnitOnDead :debug [_ gameplayCtx unit]
  (a/go gameplayCtx))

(defmethod app.gameplay.module/waitUnitOnMenu :debug [_ gameplayCtx args inputCh outputCh]
  (a/go [gameplayCtx false]))

(defmethod app.gameplay.module/waitEnemyTurn :debug [_ gameplayCtx enemy inputCh outputCh]
  (a/go gameplayCtx))


(defmethod app.gameplay.module/unitGetMovePathTree :debug [_ gameplayCtx unit]
  [])

(defmethod app.gameplay.module/unitGetWeapons :debug [_ gameplayCtx unit]
  [])

(defmethod app.gameplay.module/unitIsDead :debug [_ gameplayCtx unit]
  false)

(defmethod app.gameplay.module/unitGetInfo :debug [_ gameplayCtx unit]
  unit)