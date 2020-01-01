(ns app.units
  (:require [clojure.set]))

(def model {:key {}
            :position (sorted-map)})

(defn add [ctx {key :key [x y] :position :as unit}]
  (-> ctx
      (update :key (fn [o] (assoc o key unit)))
      (update-in [:position x] (fn [o]
                                 (if o
                                   (update o y (fn [o2] (conj o2 unit)))
                                   (sorted-map y #{unit}))))))

(defn delete [ctx {key :key [x y] :position :as unit}]
  (-> ctx
      (update :key (fn [o] (dissoc o key unit)))
      (update-in [:position x] (fn [o]
                                 (if o
                                   (update o y (fn [o2] (disj o2 unit)))
                                   o)))))

(defn getByRegion [ctx [x1 y1] [x2 y2]]
  (let [units (->> (subseq (:position ctx) >= x1 < x2)
                   (map second)
                   (mapcat #(subseq % >= y1 < y2))
                   (map second)
                   (reduce clojure.set/union))]
    units))

(defn getByKey [ctx key]
  (get-in ctx [:key key]))

(defn getByPosition [ctx [x y]]
  (get-in ctx [:position x y]))