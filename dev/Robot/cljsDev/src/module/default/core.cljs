(ns module.default.core
  (:require [clojure.core.async :as a])
  (:require [module.default.data]))

(defmethod app.module/loadData :default [_]
  (a/go
    module.default.data/data))

(defmethod app.module/lobbyGetUnits :default [_ lobbyCtx]
  (->> (get-in module.default.data/data [:robot])
       (map (fn [[k v]] [k {:cost (get v :cost)}]))
       (into {})))

(defmethod app.module/lobbyGetPilots :default [_ lobbyCtx]
  (->> (get-in module.default.data/data [:pilot])
       (map (fn [[k v]] [k {:cost (get v :cost)}]))
       (into {})))