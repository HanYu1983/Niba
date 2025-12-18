(ns node.core
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]
            [clojure.spec.gen.alpha :as gen]
            [app.core]))

(s/fdef doA
  :args (s/cat :n1 number? :n2 number?)
  :ret number?)

(defn doA [n1 n2]
  (+ n1 n2))

(s/def ::name string?)
(s/def ::age number?)
(s/def ::robot (s/keys :req-un [::name ::age]))


(s/def ::card any?)
(s/def ::card-stack (s/coll-of ::card))
(s/def ::card-stacks (s/map-of any? ::card-stack))
(s/def ::card-table (s/keys :req-un [::card-stacks]))

(s/fdef create-card-table
  :args (s/cat)
  :ret ::card-table)

(defn create-card-table []
  {:card-stacks {}})

(defn -main [_args]
  (s/check-asserts true)
  (stest/instrument)
  (println (stest/check `create-card-table))

  ; exit app
  (System/exit 0)

  #_(println (gen/sample (s/gen ::robot) 10))
  #_(println (s/exercise-fn `doA)))