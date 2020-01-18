(ns app.gameplay.module)

(defmulti loadData (fn [type] type))

(defmulti unitStateCreate (fn [type unit] type))
(defmulti unitStateGetWeapons (fn [type unit gameplayCtx] type))
(defmulti unitGetMovePathTree (fn [type unit gameplayCtx] type))
(defmulti unitGetAttackRange (fn [type unit weapon gameplayCtx] type))

(def *module nil)