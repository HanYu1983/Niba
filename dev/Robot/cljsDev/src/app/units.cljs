(ns app.units
  (:require [clojure.set]))

(def model {:key {}
            :position (sorted-map)})

(defn add [ctx {key :key [x y] :position :as unit}]
  (-> ctx
      ; sorted-map的key最好不要使用字串, 因為從js來的字串和cljs的字串在sorted-map中沒有相等性
      (update :key (fn [o] (assoc o (keyword key) unit)))
      (update-in [:position x] (fn [o]
                                 (if o
                                   (assoc o y unit)
                                   (sorted-map y unit))))))

(defn delete [ctx {key :key [x y] :position :as unit}]
  (-> ctx
      (update :key (fn [o] (dissoc o (keyword key) unit)))
      (update-in [:position x] (fn [o]
                                 (if o
                                   (dissoc o y)
                                   o)))))

(defn getByRegion [ctx [x1 y1] [x2 y2]]
  (let [units (->> (subseq (:position ctx) >= x1 < x2)
                   (map second)
                   (mapcat #(subseq % >= y1 < y2))
                   (map second))]
    units))

(defn getByKey [ctx key]
  (get-in ctx [:key (keyword key)]))

(defn getByPosition [ctx [x y]]
  (get-in ctx [:position x y]))