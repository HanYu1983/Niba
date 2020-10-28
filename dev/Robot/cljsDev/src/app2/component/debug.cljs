(ns app2.component.debug
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go]]))

(defn handle-debug [ctx evt]
  (go
    (cond
      (fn? evt)
      [(evt ctx) nil]

      (nil? evt)
      [ctx (js/Error. "chan closed")]

      (= :return evt)
      [ctx (js/Error. "return")]

      :else
      [ctx nil])))