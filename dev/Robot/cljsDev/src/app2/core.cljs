(ns app2.core
  (:require [clojure.spec.alpha :as s]))

(defn main []
  (s/check-asserts false))