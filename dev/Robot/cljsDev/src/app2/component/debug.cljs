(ns app2.component.debug
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go]]))

(defn handle-debug [ctx [cmd args :as evt]]
  ;(println "handle-debug")
  (go
    (cond
      (fn? cmd)
      [(cmd ctx) nil]

      (nil? evt)
      [ctx (js/Error. "chan closed")]

      (= :return cmd)
      [ctx (js/Error. "return")]

      :else
      [ctx nil])))