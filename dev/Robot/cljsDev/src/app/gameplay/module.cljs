(ns app.gameplay.module)

(defmulti loadData (fn [type] type))

(defmulti unitCreate (fn [type gameplayCtx unit args] type))
(defmulti unitGetMovePathTree (fn [type gameplayCtx unit] type))
(defmulti unitGetMenuData (fn [type gameplayCtx unit] type))
(defmulti unitGetWeaponRange (fn [type gameplayCtx unit weapon] type))
(defmulti unitGetWeaponType (fn [type gameplayCtx unit weapon] type))
(defmulti unitGetWeapons (fn [type gameplayCtx unit] type))
(defmulti unitSetWeapons (fn [type gameplayCtx unit] type))
(defmulti unitThinkReaction (fn [type gameplayCtx unit fromUnit weapon] type))
(defmulti unitOnMove (fn [type gameplayCtx unit pos] type))
(defmulti unitOnDone (fn [type gameplayCtx unit] type))
(defmulti unitOnTurnStart (fn [type gameplayCtx unit] type))

(defmulti getHitRate (fn [type gameplayCtx unit weapon targetUnit]))

(def *module nil)