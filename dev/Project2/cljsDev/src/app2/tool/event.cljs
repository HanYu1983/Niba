(ns app2.tool.event
  (:require [clojure.spec.alpha :as s]
            ["rxjs" :as rxjs]
            ["rxjs/operators" :as rxop]))

(def on-entity (rxjs/ReplaySubject.))
(def on-component (rxjs/Subject.))

(defn create [obj]
  (let [[conform _] (s/conform any? obj)
        _ (if (= conform :s/invalid)
            (.error on-entity "")
            (.next on-entity [conform obj]))]))

(defn update [obj]
  (.next on-entity [:update obj]))


(def entity-manager (.pipe on-entity
                           (rxop/scan (fn [acc [type args]]
                                        (condp = type
                                          :on-create
                                          :on-update
                                          (assoc acc (:id args) args)
                                          :on-delete
                                          (dissoc acc (:id args))))
                                      {})))

(def entity-group (.pipe entity-manager
                         (rxop/sample on-component)
                         (rxop/map #(group-by :app/entity %))))