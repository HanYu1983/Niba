(ns app.gameplay.module)

(defmulti loadData (fn [type] type))

(defmulti unitCreate (fn [type unit] type))
(defmulti unitGetWeapons (fn [type unit gameplayCtx] type))
(defmulti unitGetMovePathTree (fn [type unit gameplayCtx] type))
(defmulti unitGetAttackRange (fn [type unit weapon gameplayCtx] type))
(defmulti unitGetMenuData (fn [type unit gameplayCtx] type))

(def *module nil)