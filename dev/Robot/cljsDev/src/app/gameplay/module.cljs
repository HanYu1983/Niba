(ns app.gameplay.module)

(defmulti loadData (fn [type] type))
(defmulti unitStateCreate (fn [type unit] type))
(defmulti unitStateGetWeapons (fn [type unitState] type))

(def *module nil)