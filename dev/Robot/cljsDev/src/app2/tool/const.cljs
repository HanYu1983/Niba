(ns app2.tool.const
  (:require [clojure.spec.alpha :as s]
            [tool.indexed :refer [sync-indexed make-indexed]]
            [tool.keycode :refer [keycode]]))

; "跑test時要設為真"
(def *test true)

; https://clojure.org/reference/transducers
(def xf-filter-evt (comp (map (fn [[cmd args :as evt]]
                                (cond
                                  (= "KEY_DOWN" cmd)
                                  [:on-click (keycode args)]

                                  :else
                                  evt)))))

; get unit by position
(def atom-indexed-position-unit (atom {}))
(def sync-indexed-position (partial sync-indexed
                                    (fn [[_ v]]
                                      (:position v))
                                    second
                                    (fn [ctx id]
                                      (dissoc ctx id))
                                    (fn [ctx id entity]
                                      (assoc ctx id entity))
                                    (fn [ctx id entity]
                                      (assoc ctx id entity))))

(defn search-position [units [x y]]
  (let [indexed-position-units (sync-indexed-position units
                                                      (fn [[_ v]]
                                                        (:position v))
                                                      @atom-indexed-position-unit)
        _ (reset! atom-indexed-position-unit indexed-position-units)
        unit (indexed-position-units [x y])]
    unit))

(def atom-indexed-position-x-unit (atom (make-indexed #(get-in % [:position 0]) :key)))
(def atom-indexed-position-y-unit (atom (make-indexed #(get-in % [:position 1]) :key)))
(def sync-indexed-position-key (partial sync-indexed
                                        (fn [[_ v]]
                                          (:key v))
                                        second
                                        (fn [ctx id]
                                          (let [entity (->> ctx
                                                            (filter (fn [o]
                                                                      (= id (:key o))))
                                                            first)]
                                            (disj ctx entity)))
                                        (fn [ctx _ entity]
                                          (conj ctx entity))
                                        (fn [ctx id entity]
                                          (let [old-entity (->> ctx
                                                                (filter (fn [o]
                                                                          (= id (:key o))))
                                                                first)]
                                            (-> ctx
                                                (disj old-entity)
                                                (conj entity))))))

(defn search-region [units [x y] [x2 y2]]
  (s/assert map? units)
  (let [indexed-x (sync-indexed-position-key units
                                             :key
                                             @atom-indexed-position-x-unit)
        _ (reset! atom-indexed-position-x-unit indexed-x)
        indexed-y (sync-indexed-position-key units 
                                             :key
                                             @atom-indexed-position-y-unit)
        _ (reset! atom-indexed-position-y-unit indexed-y)
        units-x (subseq indexed-x > {:position [x 0]} <= {:position [x2 0]})
        units-y (subseq indexed-x > {:position [0 y]} <= {:position [0 y2]})
        units (->> (concat units-x units-y)
                   (into #{})
                   (into []))]
    units))

