(ns app.gameplay.module)

(defmulti loadData (fn [type] type))

(defmulti unitCreate (fn [type unit] type))
(defmulti unitGetMovePathTree (fn [type unit gameplayCtx] type))
(defmulti unitGetMenuData (fn [type unit gameplayCtx] type))
(defmulti unitOnMove (fn [type unit pos gameplayCtx] type))
(defmulti unitOnDone (fn [type unit gameplayCtx] type))
(defmulti unitOnTurnStart (fn [type unit gameplayCtx] type))

(def *module nil)