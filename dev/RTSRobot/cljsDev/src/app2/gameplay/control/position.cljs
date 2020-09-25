(ns app2.gameplay.control.position
  (:require [clojure.core.matrix :as m]))

(defn velocity-control [entity gameplay [cmd args]]
  (cond
    (and (every? #(% entity) [:position :velocity])
         (= :tick cmd))
    (update entity :position #(m/add (:velocity entity) %))

    :else
    entity))

(defn last-position-control [entity gameplay [cmd args]]
  (cond
    (and (:last-position entity)
         (= :tick cmd))
    (update entity :last-position (constantly (:position entity)))

    :else
    entity))