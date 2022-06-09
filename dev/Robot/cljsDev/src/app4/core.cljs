(ns app4.core
  (:require [clojure.spec.alpha :as s]))

(s/check-asserts true)

(s/fdef adder
  :args (s/cat :x number?)
  :ret (s/fspec :args (s/cat :y number?)
                :ret number?)
  :fn #(= (-> % :args :x) ((:ret %) 0)))

(defn adder [x] x)

(println (adder "55"))