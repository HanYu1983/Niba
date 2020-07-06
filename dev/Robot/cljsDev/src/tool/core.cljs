(ns tool.core
  (:require [clojure.spec.alpha :as s]))

(def invalid ::s/invalid)

(def assert? true)

(defn explainValid? [sp args]
  (if (clojure.spec.alpha/valid? sp args)
    assert?
    (do (println (clojure.spec.alpha/explain-str sp args))
        false)))

(defn assertSpec
  ([sp args msg]
   (if assert?
     (if (not (clojure.spec.alpha/valid? sp args))
       (throw (js/Error. msg))
       args)
     args))
  ([sp args]
   (if assert?
     (if (not (clojure.spec.alpha/valid? sp args))
       (throw (js/Error. (clojure.spec.alpha/explain-str sp args)))
       args)
     args)))