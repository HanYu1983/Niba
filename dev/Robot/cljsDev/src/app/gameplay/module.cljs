(ns app.gameplay.module)

(defmulti loadData (fn [type] type))

(defmulti unitOnCreate (fn [type gameplayCtx unit args] type))
(defmulti unitOnMove (fn [type gameplayCtx unit pos] type))
(defmulti unitOnDone (fn [type gameplayCtx unit] type))
(defmulti unitOnTurnStart (fn [type gameplayCtx unit] type))

(defmulti unitGetMovePathTree (fn [type gameplayCtx unit] type))
(defmulti unitGetMenuData (fn [type gameplayCtx unit] type))
(defmulti unitGetWeaponRange (fn [type gameplayCtx unit weapon] type))
(defmulti unitGetWeaponType (fn [type gameplayCtx unit weapon] type))
(defmulti unitGetWeapons (fn [type gameplayCtx unit] type))
(defmulti unitSetWeapons (fn [type gameplayCtx unit] type))
(defmulti unitGetReaction (fn [type gameplayCtx unit fromUnit weapon] type))
(defmulti unitGetHitRate (fn [type gameplayCtx unit weapon targetUnit]))
(defmulti unitGetInfo (fn [type gameplayCtx unit] type))

(def *module nil)