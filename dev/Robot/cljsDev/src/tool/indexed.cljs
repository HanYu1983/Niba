(ns tool.indexed
  (:require [clojure.set]))

(defn make-indexed [key-fn]
  (sorted-set-by
   (fn [o1 o2]
     (let [c (compare (key-fn o1)
                      (key-fn o2))]
       (if (not= 0 c)
         c
         (compare o1 o2))))))


(defn sync-indexed [key-fn value-fn remove-fn create-fn update-fn values origin]
  (let [next origin
        now-entities (zipmap (map key-fn values)
                             (map value-fn values))
        
        old-ids (->> (map key-fn origin) (into #{}))
        now-ids (->> (map key-fn values) (into #{}))

        removed-ids (clojure.set/difference old-ids now-ids)
        next (reduce remove-fn next removed-ids)

        new-ids (clojure.set/difference now-ids old-ids)
        next (reduce (fn [ctx id]
                       (let [entity (now-entities id)]
                         (create-fn ctx id entity)))
                     next
                     new-ids)

        hold-ids (clojure.set/intersection old-ids now-ids)
        next (reduce (fn [ctx id]
                       (let [entity (now-entities id)]
                         (update-fn ctx id entity)))
                     next
                     hold-ids)]
    next))