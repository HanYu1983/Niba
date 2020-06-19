(ns tool.units
  (:require [clojure.set])
  (:require [clojure.spec.alpha :as s]))

(s/def ::y (s/map-of int? (constantly true)))
(s/def ::x (s/map-of int? ::y))
(s/def ::position ::x)
(s/def ::key (s/map-of (constantly true) (constantly true)))
(s/def ::modelType (s/keys :req-un [::key ::position]))
(def modelType ::modelType)

(def model {:key {}
            :position (sorted-map)})

(defn- assertUnitsCount [ctx]
  (let [units1 (->> (vals (:position ctx))
                    (mapcat vals))
        units2 (vals (:key ctx))]
    (when (not= (count units1) (count units2))
      (throw (js/Error. (str "[units.cljs]units not the same.")))))
  ctx)

(defn getByRegion [ctx [x1 y1] [x2 y2]]
  {:pre [(s/valid? (s/tuple ::modelType int? int? int? int?) [ctx x1 y1 x2 y2])]}
  (let [units (->> (subseq (:position ctx) >= x1 < x2)
                   (map second)
                   (mapcat #(subseq % >= y1 < y2))
                   (map second))]
    units))

(defn getByKey [ctx key]
  (get-in ctx [:key (keyword key)]))

(defn getByPosition [ctx [x y]]
  (get-in ctx [:position x y]))

(defn getAll [ctx]
  (vals (:key ctx)))

(defn add [ctx {key :key [x y] :position :as unit}]
  (when (or (getByKey ctx key)
            (getByPosition ctx [x y]))
    (throw (js/Error. (str "[units.cljs]already exists." key [x y]))))
  (-> ctx
      ; sorted-map的key最好不要使用字串, 因為從js來的字串和cljs的字串在sorted-map中沒有相等性
      (update :key (fn [o] (assoc o (keyword key) unit)))
      (update-in [:position x] (fn [o]
                                 (if o
                                   (assoc o y unit)
                                   (sorted-map y unit))))
      assertUnitsCount))

(defn delete [ctx {key :key [x y] :position :as unit}]
  (when (not (and (getByKey ctx key)
                  (getByPosition ctx [x y])))
    (throw (js/Error. (str "[units.cljs]must exist both key and position" key [x y]))))
  (-> ctx
      (update :key (fn [o] (dissoc o (keyword key) unit)))
      (update-in [:position x] (fn [o]
                                 (if o
                                   (dissoc o y)
                                   o)))
      assertUnitsCount))

(defn mapUnits [ctx f]
  (assertUnitsCount (reduce (fn [ctx unit]
                              (-> ctx
                                  (delete unit)
                                  (add (f unit))))
                            ctx
                            (vals (:key ctx)))))