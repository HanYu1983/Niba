(ns game.define.battle-point
  (:require [clojure.spec.alpha :as s]))

(s/def ::battle-point-value (s/or :empty #{"*"} :int int?))
(s/def ::spec (s/tuple ::battle-point-value ::battle-point-value ::battle-point-value))

(defn add-value [& vs]
  (doseq [v vs] (s/assert ::battle-point-value v))
  (reduce (fn [acc-a a]
            (if (or (= "*" a) (= "*" acc-a))
              "*"
              (+ a acc-a)))
          0
          vs))

(defn add [& vs]
  (doseq [v vs] (s/assert ::spec v))
  (->> vs (apply map vector) (mapv #(apply add-value %))))

(defn tests []
  (-> (add [1 1 1] [1 1 1] [1 1 1]) (= [3 3 3]) (or (throw (ex-info "must [3 3 3]" {}))))
  (-> (add [1 1 1] [2 "*" 1] ["*" 1 -1]) (= ["*" "*" 1]) (or (throw (ex-info "must [* * 1]" {})))))