(ns app.controller.env
  (:require [clojure.spec.alpha :as s]
            ["rxjs" :as rxjs]
            ["rxjs/operators" :as rxop]
            [app.tool.event :as event]))

(def atom-ctx (atom {}))
(defn on-update [ctx e]
  (.next event/on-update-env ctx)
  ctx)
(defn find-nearby-tank [ctx tank])

(.subscribe (rxjs/merge event/on-create-tank
                        event/on-update-tank)
            (fn [e]
              (swap! atom-ctx #(on-update % e))
              (println e))
            (fn [err]
              (println err)))